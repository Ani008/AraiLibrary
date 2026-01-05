import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function Surgeries() {
  const [projects, setProjects] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [openProjectId, setOpenProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [projectRes, surgeryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/surgeries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProjects(projectRes.data);
      setSurgeries(surgeryRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProject = (id) => {
    setOpenProjectId(openProjectId === id ? null : id);
  };

  const exportProjectPDF = (project, projectSurgeries) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Project Report: ${project.projectName}`, 14, 15);

    doc.setFontSize(10);
    doc.text(`Target: ${project.balanceSurgery}`, 14, 22);
    doc.text(`Completed: ${projectSurgeries.length}`, 14, 28);

    const tableData = projectSurgeries.map((s, index) => [
      index + 1,
      s.patientName,
      s.operatedEye,
      s.surgeryName,
      new Date(s.dateOfSurgery).toLocaleDateString(),
      s.contactNo || "-",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Id", "Patient Name", "Eye", "Surgery", "Surgery Category","Date", "Contact"]],
      body: tableData,

      styles: {
        fontSize: 9,
        textColor: [33, 33, 33], // dark gray text
        cellPadding: 4,
      },

      headStyles: {
        fillColor: [41, 98, 255], // blue-600
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250], // very light gray-blue
      },
    });

    doc.save(`${project.projectName}-surgeries.pdf`);
  };

  const handleDeleteSurgeries = async (projectId) => {
    const confirmDelete = window.confirm(
      "This will delete ALL surgeries for this project. Continue?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/surgeries/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh surgeries list
      fetchData();
    } catch (error) {
      alert("Failed to delete surgeries");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Surgeries</h1>

        <button
          onClick={() => navigate("/uploadexcel")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Upload Excel
        </button>
      </div>

      {/* PROJECT CARDS */}
      {projects.map((project) => {
        const projectSurgeries = surgeries.filter(
          (s) => s.projectId === project.id
        );

        const completed = projectSurgeries.length;
        const target = project.balanceSurgery;
        const incomplete = Math.max(target - completed, 0);
        const isCompleted = completed >= target;

        return (
          <div key={project.id} className="bg-white rounded-xl shadow border">
            {/* CARD HEADER */}
            <div
              onClick={() => toggleProject(project.id)}
              className="cursor-pointer flex justify-between items-center p-5"
            >
              <div className="grid grid-cols-5 gap-6 w-full">
                <div>
                  <p className="text-gray-500 text-sm">Project</p>
                  <p className="font-semibold">{project.projectName}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Target</p>
                  <p className="font-semibold">{target}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="font-semibold text-orange-600">{completed}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Incomplete</p>
                  <p className="font-semibold text-red-600">{incomplete}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>

                  {openProjectId === project.id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
              </div>
            </div>

            {/* EXPANDED SURGERY TABLE */}
            {openProjectId === project.id && (
              <div className="border-t px-5 pb-5">
                {/* SURGERY TABLE */}
                {projectSurgeries.length === 0 ? (
                  <p className="text-gray-500 py-4">No surgeries found</p>
                ) : (
                  <>
                    <table className="w-full text-sm mt-4 border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2">Patient</th>
                          <th className="border px-3 py-2">Eye</th>
                          <th className="border px-3 py-2">Surgery</th>
                          <th className="border px-3 py-2">Surgery Category</th>
                          <th className="border px-3 py-2">Date</th>
                          <th className="border px-3 py-2">Contact</th>
                        </tr>
                      </thead>

                      <tbody>
                        {projectSurgeries.slice(0, 5).map((s) => (
                          <tr key={s.id}>
                            <td className="border px-3 py-2">
                              {s.patientName}
                            </td>
                            <td className="border px-3 py-2">
                              {s.operatedEye}
                            </td>
                            <td className="border px-3 py-2">
                              {s.surgeryName}
                            </td>
                            <td className="border px-3 py-2">
                              {s.surgeryCategory}
                              </td>
                            <td className="border px-3 py-2">
                              {new Date(s.dateOfSurgery).toLocaleDateString()}
                            </td>
                            <td className="border px-3 py-2">{s.contactNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* FOOTER: INFO + PRINT BUTTON */}
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500">
                        Showing latest 5 surgeries out of{" "}
                        {projectSurgeries.length}
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            exportProjectPDF(project, projectSurgeries)
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Print / Export PDF
                        </button>

                        <button
                          onClick={() => handleDeleteSurgeries(project.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Delete All Surgeries
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
