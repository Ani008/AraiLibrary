import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit3, Trash2, Eye, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AJMTPaperModal from "../Modal/AJMTPaperModal"; // You'll create this next

const API_BASE_URL = "http://localhost:5000/api/ajmtpapers"; // Adjust to your backend route

const AJMTPapers = () => {
  const [papers, setPapers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setPapers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this paper?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPapers();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  // Helper to color status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700'; // Under Review
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center text-lg font-bold text-slate-800 tracking-tight">
            <FileText className="w-6 h-6 mr-2 text-indigo-600" />
            AJMT Research Papers
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Submit Paper
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition shadow-sm font-medium text-sm"
            >
              <Download className="w-4 h-4 mr-2" /> Analysis Reports
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Paper Title & Authors</th>
              <th className="px-6 py-4">Contact Email</th>
              <th className="px-6 py-4 text-center">Plagiarism</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {papers.map((paper) => (
              <tr key={paper._id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800 text-sm leading-tight mb-1">
                    {paper.paperTitle}
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {paper.authors?.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                  {paper.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs font-bold ${paper.plagiarismPercentage > 20 ? 'text-red-500' : 'text-slate-600'}`}>
                    {paper.plagiarismPercentage !== null ? `${paper.plagiarismPercentage}%` : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${getStatusStyle(paper.status)}`}>
                    {paper.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(paper._id);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-indigo-500 hover:text-white transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper._id)}
                      className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {papers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm">
                  No research papers found. Click "Submit Paper" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AJMTPaperModal
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchPapers}
        />
      )}
    </div>
  );
};

export default AJMTPapers;