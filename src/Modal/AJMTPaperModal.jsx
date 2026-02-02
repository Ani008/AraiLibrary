import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, UserPlus, UserMinus } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/abstracts";

const AJMTPaperModal = ({ onClose, editingId, refreshData }) => {
  const [formData, setFormData] = useState({
    paperTitle: "",
    authors: [""],
    email: "",
    status: "Under Review",
    plagiarismPercentage: ""
  });

  // Fetch data if editing
  useEffect(() => {
    if (editingId) {
      const fetchPaper = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_BASE_URL}/${editingId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const paper = res.data.data;
          setFormData({
            paperTitle: paper.paperTitle,
            authors: paper.authors.length > 0 ? paper.authors : [""],
            email: paper.email || "",
            status: paper.status,
            plagiarismPercentage: paper.plagiarismPercentage || ""
          });
        } catch (err) {
          console.error("Error fetching paper details", err);
        }
      };
      fetchPaper();
    }
  }, [editingId]);

  // Handle Dynamic Authors
  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData({ ...formData, authors: newAuthors });
  };

  const addAuthorField = () => setFormData({ ...formData, authors: [...formData.authors, ""] });
  const removeAuthorField = (index) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Clean up empty author strings before sending
      const submissionData = {
        ...formData,
        authors: formData.authors.filter(a => a.trim() !== "")
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, submissionData, config);
      } else {
        await axios.post(API_BASE_URL, submissionData, config);
      }
      
      refreshData();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {editingId ? "Edit Research Paper" : "Submit New Paper"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paper Title</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={formData.paperTitle}
              onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
            />
          </div>

          {/* Authors List */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Authors</label>
            {formData.authors.map((author, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Author ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                />
                {formData.authors.length > 1 && (
                  <button type="button" onClick={() => removeAuthorField(index)} className="text-red-400 hover:text-red-600">
                    <UserMinus size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAuthorField}
              className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
            >
              <UserPlus size={14} /> Add Another Author
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Status</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Published">Published</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Plagiarism */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plagiarism %</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              value={formData.plagiarismPercentage}
              onChange={(e) => setFormData({ ...formData, plagiarismPercentage: e.target.value })}
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Save size={16} /> {editingId ? "Update Paper" : "Save Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AJMTPaperModal;