import axios from 'axios';

export const downloadReport = async (endpoint, fileName) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // IMPORTANT for Excel files
    });

    // Create a hidden link and click it to trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
    alert("Failed to download report. Please check if you are logged in.");
  }
};