import React from 'react';
import { downloadReport } from '../services/reportService';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  Users, 
  Download,
  Calendar,
  Tag,
  History,
  AlertCircle,
  MapPin
} from 'lucide-react';

const ReportAction = ({ label, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className="group flex items-center justify-between w-full p-3 text-left transition-all duration-200 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
        <Icon size={16} className="text-slate-500" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <Download size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
  </button>
);

const SectionCard = ({ title, description, icon: Icon, children, accentColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
    <div className={`h-1.5 w-full ${accentColor}`} />
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-opacity-10 ${accentColor.replace('bg-', 'bg-opacity-10 text-')}`}>
           <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  </div>
);

const Reports = () => {
  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Management Reports</h1>
          <p className="text-slate-500 mt-2 text-lg">Generate and download analytical data in Excel format.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          
          {/* Standards */}
          <SectionCard 
            title="Standards" 
            description="Technical guidelines & norms"
            icon={FileText} 
            accentColor="bg-blue-500"
          >
            <ReportAction icon={Layers} label="Department-wise" onClick={() => downloadReport('/api/reports/standards/department-wise', 'Standards_Dept')} />
            <ReportAction icon={Tag} label="Category-wise" onClick={() => downloadReport('/api/reports/standards/category-wise', 'Standards_Category')} />
            <ReportAction icon={History} label="Amendments History" onClick={() => downloadReport('/api/reports/standards/amendments', 'Standards_Amendments')} />
          </SectionCard>

          {/* Periodicals */}
          <SectionCard 
            title="Periodicals" 
            description="Journal & Magazine tracking"
            icon={BookOpen} 
            accentColor="bg-emerald-500"
          >
            <ReportAction icon={Calendar} label="Year-wise Analysis" onClick={() => downloadReport('/api/reports/periodicals/year-wise', 'Periodicals_Year')} />
            <ReportAction icon={History} label="Frequency Report" onClick={() => downloadReport('/api/reports/periodicals/frequency-wise', 'Periodicals_Freq')} />
            <ReportAction icon={AlertCircle} label="Missing Issues" onClick={() => downloadReport('/api/reports/periodicals/missing-issues', 'Missing_Issues')} />
          </SectionCard>

          {/* Abstracts */}
          <SectionCard 
            title="ARAI Abstracts" 
            description="Research & Literature"
            icon={Layers} 
            accentColor="bg-indigo-500"
          >
            <ReportAction icon={Layers} label="Department Summary" onClick={() => downloadReport('/api/reports/abstracts/department-wise', 'Abstracts_Dept')} />
            <ReportAction icon={Calendar} label="Yearly Archives" onClick={() => downloadReport('/api/reports/abstracts/year-wise', 'Abstracts_Year')} />
            <ReportAction icon={Tag} label="Keyword Analysis" onClick={() => downloadReport('/api/reports/abstracts/keyword-analysis', 'Keyword_Analysis')} />
          </SectionCard>

          {/* KC Membership */}
          <SectionCard 
            title="KC Membership" 
            description="Member lifecycle & Billing"
            icon={Users} 
            accentColor="bg-amber-500"
          >
            <ReportAction icon={Users} label="Complete Directory" onClick={() => downloadReport('/api/reports/kcmembers/complete', 'Member_Directory')} />
            <ReportAction icon={AlertCircle} label="Overdue Payments" onClick={() => downloadReport('/api/reports/kcmembers/overdue', 'Overdue_Report')} />
            <ReportAction icon={Calendar} label="Upcoming Renewals" onClick={() => downloadReport('/api/reports/kcmembers/upcoming-renewals', 'Renewals')} />
            <ReportAction icon={MapPin} label="Address Labels" onClick={() => downloadReport('/api/reports/kcmembers/address-labels', 'Address_Labels')} />
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default Reports;