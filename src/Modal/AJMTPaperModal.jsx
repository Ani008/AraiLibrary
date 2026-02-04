import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Trash2,
  Book,
  Users,
  ClipboardCheck,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/ajmtpapers";

const AJMTPaperModal = ({ onClose, editingId, refreshData }) => {
  const [formData, setFormData] = useState({
    paperTitle: "",
    titleSubject: "",
    paperType: "",
    date: "", // Matches db record "date"
    authors: [
      {
        authorName: "",
        authorAddress: "",
        authorCity: "",
        authorInstitution: "",
        authorEmail: "",
        authorPhone: "",
      },
    ],
    reviewers: [
      {
        reviewerNumber: 1,
        reviewerName: "",
        reviewerEmail: "",
        reviews: [{ plagiarismPercentage: 0, remarks: "", sentDate: "" }], // Nested as per DB
      },
    ],
    totalScore: 0,
    tentativeDateOfPublication: "",
    websiteUpdateDate: "",
    hardcopyDate: "",
    remarks: "",
    status: "Under Review",
  });

  // Calculate total plagiarism from the nested reviews
  useEffect(() => {
    const total = formData.reviewers.reduce((sum, rev) => {
      const reviewScore = rev.reviews?.[0]?.plagiarismPercentage || 0;
      return sum + Number(reviewScore);
    }, 0);
    setFormData((prev) => ({
      ...prev,
      totalScore: parseFloat(total.toFixed(2)),
    }));
  }, [formData.reviewers]);

  useEffect(() => {
    if (editingId) {
      const fetchSingle = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/${editingId}`);
          const item = res.data.data;
          const formatDate = (d) =>
            d ? new Date(d).toISOString().split("T")[0] : "";

          setFormData({
            ...item,
            date: formatDate(item.date),
            tentativeDateOfPublication: formatDate(
              item.tentativeDateOfPublication,
            ),
            websiteUpdateDate: formatDate(item.websiteUpdateDate),
            hardcopyDate: formatDate(item.hardcopyDate),
            reviewers: item.reviewers.map((rev) => ({
              ...rev,
              reviews: rev.reviews.map((r) => ({
                ...r,
                sentDate: formatDate(r.sentDate),
              })),
            })),
          });
        } catch (error) {
          console.error("Error fetching paper:", error);
        }
      };
      fetchSingle();
    }
  }, [editingId]);

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [
        ...formData.authors,
        {
          authorName: "",
          authorAddress: "",
          authorCity: "",
          authorInstitution: "",
          authorEmail: "",
          authorPhone: "",
        },
      ],
    });
  };

  const addReviewer = () => {
    if (formData.reviewers.length < 3) {
      setFormData({
        ...formData,
        reviewers: [
          ...formData.reviewers,
          {
            reviewerNumber: formData.reviewers.length + 1,
            reviewerName: "",
            reviewerEmail: "",
            reviews: [{ plagiarismPercentage: 0, remarks: "", sentDate: "" }],
          },
        ],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure numeric values are sent correctly
      const payload = {
        ...formData,
        totalScore: Number(formData.totalScore),
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }
      refreshData();
      onClose();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Check all required fields (Author Name, Reviewer Email, etc.)",
      );
    }
  };

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="flex justify-between items-center px-8 py-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingId ? "Update" : "New"} AJMT Paper
            </h2>
            <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mt-1">
              Record Management
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-8 space-y-10"
        >
          {/* Section 1: Paper Info */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Paper Title *</label>
              <input
                required
                className={inputClass}
                value={formData.paperTitle}
                onChange={(e) =>
                  setFormData({ ...formData, paperTitle: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Subject</label>
              <input
                className={inputClass}
                value={formData.titleSubject}
                onChange={(e) =>
                  setFormData({ ...formData, titleSubject: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Paper Type *</label>
              <input
                required
                className={inputClass}
                value={formData.paperType}
                onChange={(e) =>
                  setFormData({ ...formData, paperType: e.target.value })
                }
                placeholder="e.g. Review Article"
              />
            </div>
            <div>
              <label className={labelClass}>Submission Date *</label>
              <input
                required
                type="date"
                className={inputClass}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </section>

          {/* Section 2: Authors */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Authors
              </h3>
              <button
                type="button"
                onClick={addAuthor}
                className="text-xs font-bold text-emerald-600"
              >
                + ADD
              </button>
            </div>
            {formData.authors.map((auth, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-lg mb-3"
              >
                <input
                  required
                  placeholder="Author Name *"
                  className={inputClass}
                  value={auth.authorName}
                  onChange={(e) => {
                    const items = [...formData.authors];
                    items[idx].authorName = e.target.value;
                    setFormData({ ...formData, authors: items });
                  }}
                />
                <input
                  placeholder="Email"
                  className={inputClass}
                  value={auth.authorEmail}
                  onChange={(e) => {
                    const items = [...formData.authors];
                    items[idx].authorEmail = e.target.value;
                    setFormData({ ...formData, authors: items });
                  }}
                />
                <input
                  placeholder="Institution"
                  className={inputClass}
                  value={auth.authorInstitution}
                  onChange={(e) => {
                    const items = [...formData.authors];
                    items[idx].authorInstitution = e.target.value;
                    setFormData({ ...formData, authors: items });
                  }}
                />
                <input
                  placeholder="City"
                  className={inputClass}
                  value={auth.authorCity}
                  onChange={(e) => {
                    const items = [...formData.authors];
                    items[idx].authorCity = e.target.value;
                    setFormData({ ...formData, authors: items });
                  }}
                />
                <div className="md:col-span-2">
                  <input
                    placeholder="Address"
                    className={inputClass}
                    value={auth.authorAddress}
                    onChange={(e) => {
                      const items = [...formData.authors];
                      items[idx].authorAddress = e.target.value;
                      setFormData({ ...formData, authors: items });
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Section 3: Reviewers (Nested Structure) */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">
                Reviewers (Max 3)
              </h3>
              <button
                type="button"
                onClick={addReviewer}
                className="text-xs font-bold text-orange-600"
              >
                + ADD
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {formData.reviewers.map((rev, idx) => (
                <div
                  key={idx}
                  className="border border-orange-100 bg-orange-50/30 p-4 rounded-xl space-y-3"
                >
                  <div className="text-[10px] font-black text-orange-400">
                    REVIEWER {rev.reviewerNumber}
                  </div>
                  <input
                    required
                    placeholder="Reviewer Name *"
                    className={inputClass}
                    value={rev.reviewerName}
                    onChange={(e) => {
                      const items = [...formData.reviewers];
                      items[idx].reviewerName = e.target.value;
                      setFormData({ ...formData, reviewers: items });
                    }}
                  />
                  <input
                    required
                    placeholder="Reviewer Email *"
                    className={inputClass}
                    value={rev.reviewerEmail}
                    onChange={(e) => {
                      const items = [...formData.reviewers];
                      items[idx].reviewerEmail = e.target.value;
                      setFormData({ ...formData, reviewers: items });
                    }}
                  />

                  {/* Accessing nested reviews[0] */}
                  <div className="pt-2 border-t border-orange-100">
                    <label className={labelClass}>Plagiarism %</label>
                    <input
                      type="number"
                      step="0.01"
                      className={inputClass}
                      value={rev.reviews[0].plagiarismPercentage}
                      onChange={(e) => {
                        const items = [...formData.reviewers];
                        items[idx].reviews[0].plagiarismPercentage =
                          e.target.value;
                        setFormData({ ...formData, reviewers: items });
                      }}
                    />
                    <label className={labelClass + " mt-2"}>
                      Review Remarks
                    </label>
                    <textarea
                      className={inputClass + " h-16"}
                      value={rev.reviews[0].remarks}
                      onChange={(e) => {
                        const items = [...formData.reviewers];
                        items[idx].reviews[0].remarks = e.target.value;
                        setFormData({ ...formData, reviewers: items });
                      }}
                    />
                    <label className={labelClass + " mt-2"}>Sent Date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={rev.reviews[0].sentDate}
                      onChange={(e) => {
                        const items = [...formData.reviewers];
                        items[idx].reviews[0].sentDate = e.target.value;
                        setFormData({ ...formData, reviewers: items });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Final Dates */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div className="bg-slate-900 p-4 rounded-xl text-white">
              <label className="text-[10px] uppercase opacity-60 font-bold">
                Total Score
              </label>
              <div className="text-2xl font-bold">{formData.totalScore}%</div>
            </div>
            <div>
              <label className={labelClass}>Pub. Date</label>
              <input
                type="date"
                className={inputClass}
                value={formData.tentativeDateOfPublication}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tentativeDateOfPublication: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Web Update</label>
              <input
                type="date"
                className={inputClass}
                value={formData.websiteUpdateDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    websiteUpdateDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Hardcopy</label>
              <input
                type="date"
                className={inputClass}
                value={formData.hardcopyDate}
                onChange={(e) =>
                  setFormData({ ...formData, hardcopyDate: e.target.value })
                }
              />
            </div>
          </section>
        </form>

        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2 font-bold text-slate-500"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200"
          >
            {editingId ? "Update Record" : "Create Record"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AJMTPaperModal;
