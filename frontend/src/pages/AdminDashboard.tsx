import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axiosInspector";

interface Booking {
  _id: string;
  user: { name: string; email: string };
  destination: { name: string; location: string; images: string[] };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface Destination {
  _id: string;
  name: string;
  slug: string;
  location: string;
  category: string;
  pricePerNight: number;
  images: string[];
  description: string;
}

const statusColors: Record<string, string> = {
  pending: "text-amber-500 border-amber-400/30 bg-amber-50",
  confirmed: "text-emerald-600 border-emerald-400/30 bg-emerald-50",
  cancelled: "text-red-400 border-red-300/30 bg-red-50",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "destinations">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDestForm, setShowDestForm] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destForm, setDestForm] = useState({ name: "", slug: "", description: "", location: "", category: "", pricePerNight: "" });
  const [destImages, setDestImages] = useState<File[]>([]);
  const [destLoading, setDestLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, dRes] = await Promise.all([
        api.get("/bookings/admin/all"),
        api.get("/destinations"),
      ]);
      setBookings(bRes.data.data || []);
      setDestinations(dRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setStatusUpdating(id);
    try {
      await api.put(`/bookings/admin/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: status as any } : b));
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const openAddDest = () => {
    setEditingDest(null);
    setDestForm({ name: "", slug: "", description: "", location: "", category: "", pricePerNight: "" });
    setDestImages([]);
    setShowDestForm(true);
  };

  const openEditDest = (dest: Destination) => {
    setEditingDest(dest);
    setDestForm({
      name: dest.name, slug: dest.slug, description: dest.description,
      location: dest.location, category: dest.category, pricePerNight: String(dest.pricePerNight),
    });
    setDestImages([]);
    setShowDestForm(true);
  };

  const handleDestSubmit = async () => {
    if (!destForm.name || !destForm.slug || !destForm.location || !destForm.category || !destForm.pricePerNight) {
      alert("Please fill all required fields.");
      return;
    }
    setDestLoading(true);
    try {
      const fd = new FormData();
      Object.entries(destForm).forEach(([k, v]) => fd.append(k, v));
      destImages.forEach((f) => fd.append("images", f));

      if (editingDest) {
        const res = await api.put(`/destinations/${editingDest._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setDestinations((prev) => prev.map((d) => d._id === editingDest._id ? res.data.data : d));
      } else {
        const res = await api.post("/destinations/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setDestinations((prev) => [...prev, res.data.data]);
      }
      setShowDestForm(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Operation failed.");
    } finally {
      setDestLoading(false);
    }
  };

  const handleDeleteDest = async (id: string) => {
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    try {
      await api.delete(`/destinations/${id}`);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const stats = {
    totalBookings: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0),
    destinations: destinations.length,
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');`}</style>
      <Navbar />

      {/* Header */}
      <div className="bg-[#0a1628] pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(201,146,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,146,42,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9922A] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-px bg-[#C9922A]/60" />
                <span className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light">Admin Panel</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontStyle: "italic" }} className="text-white font-light">
                Control Centre
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-[#C9922A]/30">
              <div className="w-2 h-2 rounded-full bg-[#C9922A] animate-pulse" />
              <span className="text-[#C9922A] text-[10px] tracking-widest uppercase font-light">Administrator</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
            {[
              { label: "Total Bookings", value: stats.totalBookings },
              { label: "Confirmed", value: stats.confirmed },
              { label: "Pending", value: stats.pending },
              { label: "Revenue", value: `$${stats.revenue.toLocaleString()}` },
              { label: "Destinations", value: stats.destinations },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-white/10 px-4 py-3"
              >
                <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-light mb-1">{s.label}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem" }} className="text-[#C9922A] font-light">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="border-b border-gray-200 bg-white sticky top-[70px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {(["overview", "bookings", "destinations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-[11px] tracking-[0.2em] uppercase font-light border-b-2 transition-all duration-300 ${
                activeTab === tab ? "border-[#C9922A] text-[#C9922A]" : "border-transparent text-gray-400 hover:text-[#1a3a5c]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="bg-white border border-gray-100 p-6" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }} className="text-[#1a3a5c] text-lg font-light">Recent Bookings</h3>
                      <button onClick={() => setActiveTab("bookings")} className="text-[#C9922A] text-[10px] tracking-widest uppercase font-light hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((b) => (
                        <div key={b._id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                          <img src={b.destination?.images?.[0] || ""} alt="" className="w-10 h-10 object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#1a3a5c] text-xs font-light truncate">{b.destination?.name}</p>
                            <p className="text-gray-300 text-[10px]">{b.user?.name}</p>
                          </div>
                          <span className={`text-[9px] tracking-widest uppercase border px-2 py-0.5 font-light flex-shrink-0 ${statusColors[b.status]}`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destinations Quick */}
                  <div className="bg-white border border-gray-100 p-6" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }} className="text-[#1a3a5c] text-lg font-light">Destinations</h3>
                      <button onClick={openAddDest} className="text-[10px] tracking-widest uppercase font-light px-3 py-1.5 bg-[#C9922A] text-white hover:bg-[#b07d20] transition-colors" style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>+ Add</button>
                    </div>
                    <div className="space-y-3">
                      {destinations.slice(0, 5).map((d) => (
                        <div key={d._id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                          <img src={d.images?.[0] || ""} alt="" className="w-10 h-10 object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#1a3a5c] text-xs font-light truncate">{d.name}</p>
                            <p className="text-gray-300 text-[10px]">{d.location}</p>
                          </div>
                          <span className="text-[#C9922A] text-xs font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>${d.pricePerNight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKINGS ── */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-16 font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.3rem", fontStyle: "italic" }}>No bookings yet.</p>
                ) : bookings.map((b, i) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white border border-gray-100 overflow-hidden"
                    style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img src={b.destination?.images?.[0] || ""} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1">
                          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic" }} className="text-[#1a3a5c] font-light mb-0.5">{b.destination?.name}</p>
                          <p className="text-gray-400 text-xs font-light mb-2">{b.user?.name} · {b.user?.email}</p>
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: "Check-In", value: formatDate(b.checkIn) },
                              { label: "Check-Out", value: formatDate(b.checkOut) },
                              { label: "Guests", value: b.guests },
                              { label: "Total", value: `$${b.totalPrice}` },
                            ].map((d) => (
                              <div key={d.label}>
                                <p className="text-[9px] tracking-widest uppercase text-gray-300">{d.label}</p>
                                <p className="text-[#1a3a5c] text-xs font-light mt-0.5">{d.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`text-[10px] tracking-[0.15em] uppercase border px-2 py-0.5 font-light ${statusColors[b.status]}`}>{b.status}</span>
                          {b.status !== "cancelled" && (
                            <select
                              value={b.status}
                              disabled={statusUpdating === b._id}
                              onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                              className="text-[10px] tracking-widest uppercase border border-gray-200 px-2 py-1.5 text-gray-500 focus:outline-none focus:border-[#C9922A] bg-white"
                              style={{ borderRadius: 0 }}
                            >
                              <option value="pending">Set Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── DESTINATIONS ── */}
            {activeTab === "destinations" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400 text-xs tracking-widest uppercase font-light">{destinations.length} destinations</p>
                  <button
                    onClick={openAddDest}
                    className="px-6 py-3 bg-[#C9922A] text-white text-[11px] tracking-[0.2em] uppercase font-light hover:bg-[#b07d20] transition-colors"
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    + Add Destination
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((dest, i) => (
                    <motion.div
                      key={dest._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-gray-100 overflow-hidden group hover:border-[#C9922A]/20 transition-colors"
                      style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img src={dest.images?.[0] || ""} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-[#0a1628]/80 px-2 py-1">
                          <span className="text-[#C9922A] text-[9px] tracking-widest uppercase font-light">{dest.category}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic" }} className="text-[#1a3a5c] font-light mb-0.5">{dest.name}</h3>
                        <p className="text-gray-400 text-xs font-light mb-3">{dest.location}</p>
                        <div className="flex items-center justify-between">
                          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem" }} className="text-[#C9922A] font-light">${dest.pricePerNight}/night</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditDest(dest)}
                              className="px-3 py-1.5 border border-[#1a3a5c]/20 text-[#1a3a5c] text-[10px] tracking-widest uppercase font-light hover:border-[#C9922A] hover:text-[#C9922A] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDest(dest._id)}
                              className="px-3 py-1.5 border border-red-200 text-red-400 text-[10px] tracking-widest uppercase font-light hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Destination Form Modal */}
      <AnimatePresence>
        {showDestForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowDestForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="bg-[#faf8f4] w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            >
              <div className="bg-[#0a1628] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-px bg-[#C9922A]" />
                      <span className="text-[#C9922A] text-[9px] tracking-[0.3em] uppercase font-light">{editingDest ? "Edit" : "New"} Destination</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.3rem", fontStyle: "italic" }} className="text-white font-light">
                      {editingDest ? editingDest.name : "Add Destination"}
                    </p>
                  </div>
                  <button onClick={() => setShowDestForm(false)} className="text-white/40 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-4">
                {[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Sigiriya Rock" },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. sigiriya-rock" },
                  { key: "location", label: "Location", type: "text", placeholder: "e.g. Matale" },
                  { key: "category", label: "Category", type: "text", placeholder: "e.g. Heritage" },
                  { key: "pricePerNight", label: "Price Per Night ($)", type: "number", placeholder: "e.g. 150" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(destForm as any)[f.key]}
                      onChange={(e) => setDestForm({ ...destForm, [f.key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe this destination..."
                    value={destForm.description}
                    onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 bg-white text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors resize-none"
                    style={{ borderRadius: 0 }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">Images (up to 5)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileRef}
                    onChange={(e) => setDestImages(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full py-3 border border-dashed border-gray-300 text-gray-400 text-[11px] tracking-widest uppercase font-light hover:border-[#C9922A] hover:text-[#C9922A] transition-colors"
                  >
                    {destImages.length > 0 ? `${destImages.length} file(s) selected` : "Click to upload images"}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowDestForm(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-400 text-[11px] tracking-[0.2em] uppercase font-light hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDestSubmit}
                    disabled={destLoading}
                    className="flex-1 py-3 bg-[#C9922A] text-white text-[11px] tracking-[0.2em] uppercase font-light hover:bg-[#b07d20] transition-colors disabled:opacity-50"
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    {destLoading ? "Saving..." : editingDest ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminDashboard;