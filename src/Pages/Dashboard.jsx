import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { FileText, Newspaper, Library, Eye, Bell, Mail, ChevronDown } from 'lucide-react';
import StatCard from '../Components/StatCard';
import ListItem from '../Components/Listitem';
import banerimg from '../assets/banerimg.png';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [standardsCount, setStandardsCount] = useState(0);

  useEffect(() => {
    const fetchStandardsCount = async () => {
      try {
        const response = await axios.get('https://quintan-kyson-cycloidal.ngrok-free.dev/api/standards');
        if (response.data && response.data.success) {
          setStandardsCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching standards count:', error);
      }
    };
    fetchStandardsCount();
  }, []);

  return (
    <div className="p-8 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-[#EBE9FE] rounded-[32px] p-12 flex justify-between items-center mb-12 relative h-48">
        <div className="z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Hi, Admin</h1>
          <p className="text-lg text-gray-600">Ready to start your day with some pitch decks?</p>
        </div>
        <img 
          src={banerimg} 
          alt="Illustration" 
          className="absolute right-10 bottom-0 h-64 object-contain pointer-events-none" 
        />
      </div>

      <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Overview</h3>
      
      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard 
          label="Standards" 
          value={standardsCount} 
          subLabel="STANDARDS"
          color="bg-[#FDD231]" 
          icon={<FileText className="text-white w-6 h-6" />} 
          onClick={()=> navigate("/standards")}
        />
        <StatCard 
          label="Periodicals" 
          value="77%" 
          subLabel="PERIODICALS"
          color="bg-[#4D4183]" 
          icon={<Newspaper className="text-white w-6 h-6" />} 
          onClick={()=> navigate("/periodicals")}
        />
        <StatCard 
          label="Abstracts" 
          value="91%" 
          subLabel="ABSTRACT"
          color="bg-[#F95B7E]" 
          icon={<Library className="text-white w-6 h-6" />} 
        />
        <StatCard 
          label="Total Views" 
          value="126" 
          subLabel="TOTAL MEMBERS"
          color="bg-[#E6E8F4]" 
          icon={<Eye className="text-gray-400 w-6 h-6" />} // Gray icon for light bg
          isLight={true}
        />
      </div>

      
    </div>
  );
};

export default Dashboard;