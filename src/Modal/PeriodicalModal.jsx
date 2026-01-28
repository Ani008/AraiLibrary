import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, BookOpen, CreditCard, Users, Link as LinkIcon, Settings } from 'lucide-react';

const API_BASE_URL = "http://localhost:5000/api/periodicals";

const PeriodicalModal = ({ onClose, editingId, refreshData }) => {
  const [formData, setFormData] = useState({
    title: '', subtitle: '', authors: [''], publisher: '', issn: '',
    volume: '', issue: '', series: '', notes: '',
    subscriptionDate: '', frequency: 'Monthly', receiptDate: '',
    departmentToIssue: '', departmentIssueDate: '', addOnCopies: 0,
    orderNo: '', poNo: '',
    vendorDetails: { name: '', phone: '', email: '' },
    mode: 'Subscription', url: '', paymentDetails: '',
    currency: 'INR',
    remarksForPayment: '', language: 'English', status: 'Active'
  });

  useEffect(() => {
    if (editingId) {
      const fetchSingle = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/${editingId}`);
          const item = res.data.data;
          const formattedItem = { ...item };
          
          // Format all date fields
          ['subscriptionDate', 'receiptDate', 'departmentIssueDate'].forEach(d => {
            if (item[d]) formattedItem[d] = item[d].split('T')[0];
          });
          
          // Ensure authors is an array for the dynamic inputs
          if (!Array.isArray(item.authors) || item.authors.length === 0) {
            formattedItem.authors = [''];
          }

          setFormData(formattedItem);
        } catch (error) {
          console.error("Error fetching periodical", error);
        }
      };
      fetchSingle();
    }
  }, [editingId]);

  // Dynamic Author Logic
  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData({ ...formData, authors: newAuthors });
  };

  const addAuthorField = () => {
    setFormData({ ...formData, authors: [...formData.authors, ''] });
  };

  const removeAuthorField = (index) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors.length ? newAuthors : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_BASE_URL, formData);
      }
      refreshData();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving periodical.");
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all bg-white";
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Update' : 'New'} Periodical Entry</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Library Management System</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-10">
          
          {/* Section 1: Basic Bibliographic */}
          <section>
            <HeaderSection icon={<BookOpen size={18}/>} title="Bibliographic Details" color="text-emerald-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Title *</label>
                <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input className={inputClass} value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
              </div>
              
              {/* Dynamic Authors */}
              <div className="md:col-span-3">
                <label className={labelClass}>Authors</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.authors.map((author, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        className={inputClass} 
                        placeholder={`Author ${index + 1}`}
                        value={author} 
                        onChange={(e) => handleAuthorChange(index, e.target.value)} 
                      />
                      {index > 0 && (
                        <button type="button" onClick={() => removeAuthorField(index)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addAuthorField} className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-2">
                    <Plus size={14} /> Add Author
                  </button>
                </div>
              </div>

              <div><label className={labelClass}>Publisher *</label><input required className={inputClass} value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} /></div>
              <div><label className={labelClass}>ISSN</label><input className={inputClass} value={formData.issn} onChange={(e) => setFormData({...formData, issn: e.target.value})} /></div>
              <div><label className={labelClass}>Language</label><select className={inputClass} value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})}>{['English', 'Marathi', 'Hindi'].map(l => <option key={l}>{l}</option>)}</select></div>
            </div>
          </section>

          {/* Section 2: Volume & Subscription */}
          <section>
            <HeaderSection icon={<CreditCard size={18}/>} title="Issue & Subscription" color="text-blue-600" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div><label className={labelClass}>Volume (No.)</label><input type="number" className={inputClass} value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} /></div>
              <div><label className={labelClass}>Issue</label><input className={inputClass} value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})} /></div>
              <div><label className={labelClass}>Series</label><input className={inputClass} value={formData.series} onChange={(e) => setFormData({...formData, series: e.target.value})} /></div>
              <div><label className={labelClass}>Frequency *</label><select className={inputClass} value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>{['Daily', 'Monthly', 'Quarterly', 'Bi-Monthly', 'Annual'].map(f => <option key={f}>{f}</option>)}</select></div>
              <div><label className={labelClass}>Subscription Date</label><input type="date" className={inputClass} value={formData.subscriptionDate} onChange={(e) => setFormData({...formData, subscriptionDate: e.target.value})} /></div>
              <div><label className={labelClass}>Receipt Date</label><input type="date" className={inputClass} value={formData.receiptDate} onChange={(e) => setFormData({...formData, receiptDate: e.target.value})} /></div>
              <div><label className={labelClass}>Mode</label><select className={inputClass} value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})}>{['Subscription', 'Exchange', 'Free', 'Membership'].map(m => <option key={m}>{m}</option>)}</select></div>
              <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>{['Active', 'Disposal'].map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
          </section>

          {/* Section 3: Internal Distribution & Payment */}
          <section>
            <HeaderSection icon={<Settings size={18}/>} title="Procurement & Internal Info" color="text-indigo-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className={labelClass}>Order No</label><input type="number" className={inputClass} value={formData.orderNo} onChange={(e) => setFormData({...formData, orderNo: e.target.value})} /></div>
              <div><label className={labelClass}>PO Number</label><input className={inputClass} value={formData.poNo} onChange={(e) => setFormData({...formData, poNo: e.target.value})} /></div>
              <div><label className={labelClass}>Add-on Copies</label><input type="number" className={inputClass} value={formData.addOnCopies} onChange={(e) => setFormData({...formData, addOnCopies: e.target.value})} /></div>
              <div><label className={labelClass}>Issued Department</label><select className={inputClass} value={formData.departmentToIssue} onChange={(e) => setFormData({...formData, departmentToIssue: e.target.value})}>{['', 'Mechanical', 'Civil', 'Computer', 'Electrical', 'Automotive'].map(d => <option key={d}>{d}</option>)}</select></div>
              <div><label className={labelClass}>Dept Issue Date</label><input type="date" className={inputClass} value={formData.departmentIssueDate} onChange={(e) => setFormData({...formData, departmentIssueDate: e.target.value})} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className={labelClass}>Currency</label>
                  <input className={inputClass} placeholder="INR" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Amount</label>
                  <input className={inputClass} placeholder="0.00" value={formData.paymentDetails} onChange={(e) => setFormData({...formData, paymentDetails: e.target.value})} />
                </div>
              </div>
              <div className="md:col-span-3"><label className={labelClass}>Payment Remarks (UTR / Transaction ID)</label><input className={inputClass} value={formData.remarksForPayment} onChange={(e) => setFormData({...formData, remarksForPayment: e.target.value})} /></div>
            </div>
          </section>

          {/* Section 4: Vendor & Digital */}
          <section>
            <HeaderSection icon={<Users size={18}/>} title="Vendor & Digital Access" color="text-orange-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className={labelClass}>Vendor Name</label><input className={inputClass} value={formData.vendorDetails.name} onChange={(e) => setFormData({...formData, vendorDetails: {...formData.vendorDetails, name: e.target.value}})} /></div>
              <div><label className={labelClass}>Vendor Phone</label><input type="number" className={inputClass} value={formData.vendorDetails.phone} onChange={(e) => setFormData({...formData, vendorDetails: {...formData.vendorDetails, phone: e.target.value}})} /></div>
              <div><label className={labelClass}>Vendor Email</label><input type="email" className={inputClass} value={formData.vendorDetails.email} onChange={(e) => setFormData({...formData, vendorDetails: {...formData.vendorDetails, email: e.target.value}})} /></div>
              <div className="md:col-span-3"><label className={labelClass}>Access URL</label><div className="relative"><LinkIcon size={14} className="absolute left-3 top-3 text-slate-400"/><input className={`${inputClass} pl-8`} placeholder="https://..." value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} /></div></div>
              <div className="md:col-span-3"><label className={labelClass}>Notes / General Remarks</label><textarea className={`${inputClass} h-20`} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /></div>
            </div>
          </section>

        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all">Discard</button>
          <button onClick={handleSubmit} className="px-12 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-100 transition-all">
            {editingId ? 'Update Record' : 'Save Periodical'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component for section headers to keep code clean
const HeaderSection = ({ icon, title, color }) => (
  <div className={`flex items-center gap-2 mb-6 ${color} border-b border-slate-100 pb-2`}>
    {icon}
    <h3 className="font-bold text-xs uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

export default PeriodicalModal;