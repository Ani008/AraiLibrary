import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit3, Trash2, Eye, Newspaper } from 'lucide-react'; // Changed icon to Newspaper
import PeriodicalModal from "../Modal/PeriodicalModal";
// Import PeriodicalDetails here once you create it

const API_BASE_URL = "https://quintan-kyson-cycloidal.ngrok-free.dev/api/periodicals"; // CORRECTED ENDPOINT

const PeriodicalsPage = () => {
  const [periodicals, setPeriodicals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingPeriodical, setViewingPeriodical] = useState(null);

  const fetchPeriodicals = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setPeriodicals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching periodicals:", error);
    }
  };

  useEffect(() => {
    fetchPeriodicals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this periodical?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchPeriodicals();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center text-lg font-bold text-slate-800">
            <Newspaper className="w-6 h-6 mr-2 text-emerald-600" /> {/* Changed color/icon */}
            Periodicals Management
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Periodical
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">ISSN</th>
              <th className="px-6 py-4 text-center">Frequency</th>
              <th className="px-6 py-4 text-center">Language</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {periodicals.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{p.title}</div>
                  <div className="text-[10px] text-slate-400">{p.subtitle}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {p.publisher}
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  {p.issn || 'N/A'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold uppercase">
                    {p.frequency}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-xs text-slate-500 font-bold">
                  {p.language}
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => { setEditingId(p._id); setIsModalOpen(true); }}
                      className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-emerald-500 hover:text-white transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                       onClick={() => setViewingPeriodical(p)}
                       className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
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
        <PeriodicalModal
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchPeriodicals}
        />
      )}
      
      {/* If you have a viewing component for periodicals, add it here */}
    </div>
  );
};

export default PeriodicalsPage;