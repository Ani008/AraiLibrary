import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Users,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import KCModal from "../Modal/KCMembersModal"; // Pointing to the modified modal we made
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/kcmembers";

const KCMembers = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      // Adjusting to ensure we handle the data structure correctly
      if (response.data && Array.isArray(response.data.data)) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this membership record?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchMembers();
      } catch (error) {
        alert("Failed to delete record.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b bg-white">
          {/* Left Side: Title */}
          <div className="flex items-center text-lg font-bold text-slate-800">
            <Users className="w-6 h-6 mr-2 text-violet-600" />
            KC Subscriptions & Memberships
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
              className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition shadow-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Member
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center px-4 py-2 border border-violet-600 text-violet-600 rounded-md hover:bg-violet-50 transition shadow-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" /> Download Reports
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Organization & Contact</th>
                <th className="px-6 py-4">Membership Type</th>
                <th className="px-6 py-4">Subscriptions</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4 text-center">Fees & Status</th>
                <th className="px-6 py-4 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((item) => (
                <tr key={item._id} className="hover:bg-violet-50/30 transition">
                  {/* Org & Contact */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 leading-tight">
                      {item.institutionName}
                    </div>
                    <div className="text-[11px] text-violet-600 mt-1 font-medium flex items-center">
                      <span className="bg-violet-100 px-1.5 py-0.5 rounded mr-1">
                        {item.contactPerson}
                      </span>
                      {item.designation}
                    </div>
                  </td>

                  {/* Membership Type */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">
                      {item.membershipType}
                    </span>
                  </td>

                  {/* Subscription Types (Logic to show active ones) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.subscriptionTypes?.automotiveAbstracts && (
                        <Badge text="Abstracts" />
                      )}
                      {item.subscriptionTypes?.araiJournal && (
                        <Badge text="Journal" />
                      )}
                      {!item.subscriptionTypes?.automotiveAbstracts &&
                        !item.subscriptionTypes?.araiJournal && (
                          <span className="text-slate-400 text-xs italic">
                            No active subs
                          </span>
                        )}
                    </div>
                  </td>

                  {/* Validity Period */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.membershipStartDate
                        ? new Date(
                            item.membershipStartDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      to{" "}
                      {item.membershipEndDate
                        ? new Date(item.membershipEndDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>

                  {/* Fees & Payment Status */}
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-bold text-slate-700">
                      ₹{item.fees || 0}
                    </div>
                    <div
                      className={`flex items-center justify-center text-[10px] font-bold uppercase mt-1 ${item.paymentStatus === "Paid" ? "text-violet-500" : "text-violet-500"}`}
                    >
                      {item.paymentStatus === "Paid" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {item.paymentStatus || "Unpaid"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-violet-500 hover:text-white transition"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-500 hover:text-white transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {members.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No membership records found. Start by adding a new member.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <KCModal
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchMembers}
        />
      )}
    </div>
  );
};

// Helper Component for Subscription Badges
const Badge = ({ text }) => (
  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100 font-semibold">
    {text}
  </span>
);

export default KCMembers;
