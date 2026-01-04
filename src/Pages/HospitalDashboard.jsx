import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonorTable from "../Components/SurgeryTable.jsx";
import SurgeryProgressChart from "../Components/SurgeryProgressChart";

import { Users, Target, CheckCircle, AlertCircle } from "lucide-react";




const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [projectsRes, surgeriesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/surgeries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProjects(projectsRes.data);
      setSurgeries(surgeriesRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const totalDonors = projects.length;

  const totalTarget = projects.reduce(
    (sum, p) => sum + Number(p.balanceSurgery || 0),
    0
  );

  const completedTarget = surgeries.length;

  const incompleteTarget = Math.max(totalTarget - completedTarget, 0);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 logout
    navigate("/");               // redirect
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Project Dashboard
          </h1>
          <p className="text-gray-500"></p>
        </div>

        {/* RIGHT SIDE */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Donors */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Users className="text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Donors</p>
            <h2 className="text-3xl font-bold text-indigo-600">
              {totalDonors}
            </h2>
          </div>
        </div>

        {/* Total Target */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Target className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Target</p>
            <h2 className="text-3xl font-bold text-green-600">{totalTarget}</h2>
          </div>
        </div>

        {/* Completed Target */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <CheckCircle className="text-orange-500" />
          </div>
          <div>
            <p className="text-gray-500">Completed Target</p>
            <h2 className="text-3xl font-bold text-orange-500">
              {completedTarget}
            </h2>
          </div>
        </div>

        {/* Incomplete Target */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-500">Incomplete Target</p>
            <h2 className="text-3xl font-bold text-red-500">
              {incompleteTarget}
            </h2>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART PLACEHOLDER */}
        <div className="lg:col-span-3">
          <SurgeryProgressChart surgeries={surgeries} />
        </div>
      </div>

      {/* DONOR TABLE */}
      <div className="bg-white rounded-xl shadow p-6">
        <DonorTable projects={projects} surgeries={surgeries} />
      </div>
    </div>
  );
};

export default Dashboard;
