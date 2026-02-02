import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { Plus, Edit3, Trash2, Eye, FileText, Download, UserMinus} from 'lucide-react';
import StandardModal from "../Modal/StandardModal";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/standards";

const StandardsPage = () => {
  const [standards, setStandards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingStandard, setViewingStandard] = useState(null);
  const navigate = useNavigate();

  // 2) Fetch All Standards on Load
  const fetchStandards = async () => {
    try {
      const response = await axios.get(API_BASE_URL);

      if (response.data && Array.isArray(response.data.data)) {
        setStandards(response.data.data);
      } else {
        console.error("Data property is not an array:", response.data);
        setStandards([]);
      }
    } catch (error) {
      console.error("Error fetching standards:", error);
      setStandards([]);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  // 5) Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this standard?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchStandards(); // Refresh list
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id); // Pass ID to modal to trigger 3) Get Single Standard
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center text-lg font-bold text-slate-800">
            <FileText className="w-6 h-6 mr-2 text-indigo-600" />
            Standards Management
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Standard
            </button>

            <button
              onClick={() => {
                navigate('/reports');
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" /> Download Reports
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ICN No.</th>
              <th className="px-6 py-4">Standard Number</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-center">Dept</th>
              <th className="px-6 py-4 text-center">Category</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standards.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-800">
                  {s.icnNumber}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {s.standardNumber}
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                  {s.title}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-blue-500 text-white text-[10px] rounded-full font-bold uppercase">
                    {s.department?.slice(0, 4)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-cyan-400 text-white text-[10px] rounded-full font-bold uppercase">
                    {s.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(s._id)}
                      className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewingStandard(s)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <StandardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchStandards}
        />
      )}
      {viewingStandard && (
        <StandardDetails
          standard={viewingStandard}
          onClose={() => setViewingStandard(null)}
        />
      )}
    </div>
  );
};

export default StandardsPage;
