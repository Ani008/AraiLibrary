import { useState, useEffect } from "react";
import axios from "axios";

export default function AddProjectModal({ onClose, onSave, editData, isEdit }) {
  const [form, setForm] = useState({
    projectName: "",
    projectCode: "",
    receiptNo: "",
    perSurgeryAmount: "",
    balanceSurgery: "",
  });

  useEffect(() => {
    if (isEdit && editData) {
      setForm({
        projectName: editData.projectName,
        projectCode: editData.projectCode,
        receiptNo: editData.receiptNo,
        perSurgeryAmount: editData.perSurgeryAmount,
        balanceSurgery: editData.balanceSurgery,
      });
    }
  }, [isEdit, editData]);

  const totalAmount =
    form.perSurgeryAmount && form.balanceSurgery
      ? Number(form.perSurgeryAmount) * Number(form.balanceSurgery)
      : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/projects/${editData.id}`
        : `${import.meta.env.VITE_API_URL}/api/projects`;

      const method = isEdit ? "put" : "post";

      await axios[method](
        url,
        {
          projectName: form.projectName,
          projectCode: form.projectCode,
          receiptNo: Number(form.receiptNo),
          perSurgeryAmount: Number(form.perSurgeryAmount),
          balanceSurgery: Number(form.balanceSurgery),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave();
      onClose();
    } catch (error) {
      alert("You are not authorized to perform this action.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 space-y-6 animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Update Project" : "Add Project"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="projectName"
            placeholder="Project Name"
            value={form.projectName}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="projectCode"
            placeholder="Project Code"
            value={form.projectCode}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="receiptNo"
            type="number"
            placeholder="Receipt No"
            value={form.receiptNo}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="perSurgeryAmount"
            type="number"
            placeholder="Per Surgery Amount"
            value={form.perSurgeryAmount}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="balanceSurgery"
            type="number"
            placeholder="Balance Surgeries"
            value={form.balanceSurgery}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          {/* Auto-calculated total */}
          <div className="bg-gray-50 border rounded-lg px-4 py-3 text-gray-700">
            Total Amount (auto):{" "}
            <span className="font-semibold">₹ {totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            {isEdit ? "Update Project" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
