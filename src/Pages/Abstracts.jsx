import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  BookCopy,
  Globe,
  Download,
  FileText
} from "lucide-react";
import AbstractModal from "../Modal/AbstractModal"; // Pointing to your new modal
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/abstracts";

const Abstracts = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingAbstract, setViewingAbstract] = useState(null);
  const navigate = useNavigate();

  const fetchAbstracts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setAbstracts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching abstracts:", error);
    }
  };

  useEffect(() => {
    fetchAbstracts();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this research abstract?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchAbstracts();
      } catch (error) {
        alert("Failed to delete record.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b bg-white">
          {/* Left Side: Title */}
          <div className="flex items-center text-lg font-bold text-slate-800">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Automotive Abstract Management
          </div>
    
          {/* Right Side: Button Group */}
          <div className="flex items-center gap-3">
            {" "}
            {/* This wrapper keeps buttons together */}
            <button
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Abstract
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition shadow-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" /> Download Reports
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Research Title & Authors</th>
              <th className="px-6 py-4">Journal / Source</th>
              <th className="px-6 py-4 text-center">Pub. Year</th>
              <th className="px-6 py-4 text-center">Subject</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {abstracts.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/50 transition">
                {/* Title & Authors */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-blue-500 mt-1 font-medium">
                    {item.authors && item.authors.length > 0
                      ? item.authors.join(", ")
                      : "No authors listed"}
                  </div>
                </td>

                {/* Journal/Source */}
                <td className="px-6 py-4 text-slate-600 text-sm">
                  <div className="font-medium">{item.journal || "N/A"}</div>
                  <div className="text-[10px] text-slate-400 italic">
                    {item.source}
                  </div>
                </td>

                {/* Publication Year */}
                <td className="px-6 py-4 text-center text-slate-500 text-sm font-mono">
                  {item.publicationYear || item.year || "—"}
                </td>

                {/* Subject */}
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {item.subject || "General"}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] rounded-full font-semibold uppercase tracking-tighter">
                    {item.status || "Published"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-blue-500 hover:text-white transition"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-500 hover:text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-indigo-500 hover:text-white transition"
                        title="View Source"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {abstracts.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <BookCopy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No abstracts found. Click "Add New Abstract" to get started.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AbstractModal
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchAbstracts}
        />
      )}
    </div>
  );
};

export default Abstracts;
