import { useState } from "react";
import axios from "axios";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/excel/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Excel uploaded successfully.");
      setFile(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Upload failed. Please check file format."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Upload Surgery Excel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INSTRUCTIONS BOX */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-3">
            Instructions
          </h2>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Use only the provided Excel template</li>
            <li>Do not change column names</li>
            <li>Do not leave mandatory fields empty</li>
            <li>Date format should be valid</li>
            <li>Project Name must exist</li>
          </ul>

          <button
            onClick={() =>
              window.open(
                "/templates/Records.xlsx",
                "_blank"
              )
            }
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Download Template
          </button>
        </div>

        {/* UPLOAD BOX */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-3">
            Upload Excel File
          </h2>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm border rounded-md px-3 py-2"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-4 w-full ${
              loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-blue-500"
            } text-white py-2 rounded-md`}
          >
            {loading ? "Uploading..." : "Upload Excel"}
          </button>

          {message && (
            <p className="mt-3 text-sm text-gray-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
