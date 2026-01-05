import { useEffect, useState } from "react";
import axios from "axios";
import AddProjectModal from "../Components/AddProjectModal";

export default function MyProjects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setIsEditMode(true);
    setShowModal(true);
  };

  // 🔹 Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, skipping fetch");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(res.data);
    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  // 🔹 Add project after save
  const handleAddProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  // 🔹 Cards logic (based on real data)
  const totalProjects = projects.length;

  const totalSurgeries = projects.reduce(
    (sum, p) => sum + Number(p.balanceSurgery || 0),
    0
  );

  const totalAmount = projects.reduce(
    (sum, p) => sum + Number(p.totalAmount || 0),
    0
  );

  //NEW CARDS :
  const completedProjects = projects.filter(
    (p) => Number(p.balanceSurgery) === 0
  ).length;

  const incompleteProjects = projects.filter(
    (p) => Number(p.balanceSurgery) > 0
  ).length;



  function StatCard({ title, value }) {
    return (
      <div className="bg-orange-100 rounded-lg p-4 shadow">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }

  //DELETE ROUTE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">My Projects</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
        >
          + Add Record
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        <StatCard title="Total Projects" value={totalProjects} />
        <StatCard title="Total Balance Surgeries" value={totalSurgeries} />
        <StatCard title="Total Amount (₹)" value={totalAmount} />
        <StatCard title="Completed Projects" value={completedProjects} />
        <StatCard title="Incomplete Projects" value={incompleteProjects} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3 text-left">Project Code</th>
              <th className="p-3 text-left">Receipt No</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Per Surgery</th>
              <th className="p-3 text-left">Balance Surgery</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No projects found
                </td>
              </tr>
            )}

            {projects.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.id}</td>
                <td className="p-3 font-medium">{p.projectName}</td>
                <td className="p-3">{p.projectCode}</td>
                <td className="p-3">{p.receiptNo}</td>
                <td className="p-3">₹ {p.totalAmount}</td>
                <td className="p-3">₹ {p.perSurgeryAmount}</td>
                <td className="p-3 font-semibold">{p.balanceSurgery}</td>
                <td className="p-3 flex gap-3 items-center">
                  {/* Edit */}
                  <svg
                    onClick={() => handleEditClick(p)}
                    xmlns="../assets/edit-icon.svg"
                    className="h-5 w-5 text-blue-600 cursor-pointer hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5h2m-1 0v14m7-7H5"
                    />
                  </svg>

                  {/* Delete */}
                  <svg
                    onClick={() => handleDelete(p.id)}
                    xmlns="..assets/trash.svg"
                    className="h-5 w-5 text-red-600 cursor-pointer hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <AddProjectModal
          onClose={() => {
            setShowModal(false);
            setIsEditMode(false);
            setSelectedProject(null);
          }}
          onSave={fetchProjects}
          editData={selectedProject}
          isEdit={isEditMode}
        />
      )}
    </div>
  );
}
