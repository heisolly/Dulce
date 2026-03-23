"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Eye,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  ChevronDown,
  Users,
  RefreshCcw,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Tab = "Staff Management" | "Attendance";
type DrawerState = "closed" | "add" | "edit";

// Custom dropdown component with dark styling
function CustomSelect({
  name,
  label,
  options,
  defaultValue,
  required,
}: {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      {label && (
        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em] block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm font-medium outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1A1A1A] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("Staff Management");
  const [drawerState, setDrawerState] = useState<DrawerState>("closed");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [dbStaff, setDbStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setDbStaff(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchStaff();

    // Set up Realtime Subscription for Staff
    const staffChannel = supabase
      .channel("admin-staff-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff" },
        () => fetchStaff()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(staffChannel);
    };
  }, []);


  const openAdd = () => {
    setSelectedStaff(null);
    setDrawerState("add");
  };

  const openEdit = (staff: any) => {
    setSelectedStaff(staff);
    setDrawerState("edit");
  };

  const closeDrawer = () => setDrawerState("closed");

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, any> = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
    };
    const salary = formData.get("salary");
    if (salary) payload.salary = parseFloat(salary as string);

    const { error } = await supabase.from("staff").insert([payload as any]);
    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchStaff();
    }
  };

  const handleEditStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStaff) return;
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, any> = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
    };
    const salary = formData.get("salary");
    if (salary) payload.salary = parseFloat(salary as string);

    const { error } = await supabase.from("staff").update(payload as any).eq("id", selectedStaff.id);
    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchStaff();
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (!error) fetchStaff();
    else alert(error.message);
  };

  const filteredStaff = dbStaff.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full font-body relative h-full">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#FEF7F1] tracking-wider flex items-center gap-3">
            <Users size={24} className="text-[#BF5933]" />
            Staff Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {dbStaff.length} team members · Manage your restaurant staff
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <RefreshCcw size={16} />
          </button>
          <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BF5933] rounded-full border border-[#111111]" />
          </button>
        </div>
      </header>

      {/* ── Controls Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#BF5933] transition-all placeholder:text-white/20"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-9 text-sm text-white font-medium outline-none focus:border-[#BF5933] hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="newest" className="bg-[#1A1A1A]">Newest First</option>
              <option value="name" className="bg-[#1A1A1A]">Sort by Name</option>
              <option value="role" className="bg-[#1A1A1A]">Sort by Role</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          <button
            onClick={openAdd}
            className="px-5 py-3 bg-[#BF5933] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg shadow-[#BF5933]/25 whitespace-nowrap"
          >
            + Add Staff
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-xl w-fit border border-white/8">
        {(["Staff Management", "Attendance"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab
                ? "bg-[#BF5933] text-white shadow-md shadow-[#BF5933]/30"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 w-full bg-[#1E1E1E] border border-white/8 rounded-[20px] overflow-hidden">
        {activeTab === "Staff Management" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#181818] border-b border-white/8">
                  <th className="py-4 px-5 w-10">
                    <input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded" />
                  </th>
                  {["ID", "Name & Role", "Email", "Phone", "Salary", "Timings", "Actions"].map((h) => (
                    <th key={h} className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-5 py-3">
                        <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-white/30 text-sm">
                      {searchQuery ? "No staff match your search." : "No staff members found. Add your first one!"}
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-white/3 transition-colors group">
                      <td className="py-4 px-5">
                        <input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded opacity-40 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="py-4 px-4 text-white/40 font-mono text-[10px]">
                        {s.id?.slice(0, 8)}…
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                            <Image
                              src={
                                s.photo_url ||
                                "/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg"
                              }
                              alt={s.full_name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#FEF7F1]">{s.full_name}</p>
                            <p className="text-xs text-[#DAA28B] font-medium">{s.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-white/60">{s.email || "—"}</td>
                      <td className="py-4 px-4 text-sm text-white/60">{s.phone || "—"}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-[#FEF7F1]">
                        {s.salary ? `$${parseFloat(s.salary).toFixed(2)}` : "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white/50">9am – 6pm</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1.5">
                          <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#DAA28B] hover:bg-[#DAA28B]/10 transition-all" title="View">
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEdit(s)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(s.id)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Attendance" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#181818] border-b border-white/8">
                  <th className="py-4 px-5 w-10">
                    <input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded" />
                  </th>
                  {["Name", "Date", "Timings", "Attendance Status"].map((h) => (
                    <th key={h} className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-3">
                        <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-white/30 text-sm">
                      No staff found.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s, i) => {
                    const isMarked = i % 3 === 0;
                    const markedStatus = i % 5 === 0 ? "Leave" : "Present";
                    return (
                      <tr key={s.id} className="hover:bg-white/3 transition-colors group">
                        <td className="py-4 px-5">
                          <input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded opacity-40 group-hover:opacity-100 transition-opacity" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                              <Image
                                src={
                                  s.photo_url ||
                                  "/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg"
                                }
                                alt={s.full_name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#FEF7F1]">{s.full_name}</p>
                              <p className="text-xs text-[#DAA28B] font-medium">{s.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-white/60">
                          {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-4 px-4 text-sm text-white/60">9:00am – 6:00pm</td>
                        <td className="py-4 px-4">
                          {isMarked ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider ${
                                markedStatus === "Present"
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              {markedStatus}
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              {[
                                { label: "Present", cls: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white" },
                                { label: "Absent", cls: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white" },
                                { label: "Half", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white" },
                                { label: "Leave", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-[#111]" },
                              ].map((btn) => (
                                <button
                                  key={btn.label}
                                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${btn.cls}`}
                                >
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add/Edit Staff Drawer ── */}
      <AnimatePresence>
        {drawerState !== "closed" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-full md:max-w-[520px] bg-[#181818] z-50 shadow-2xl flex flex-col border-l border-white/8 md:rounded-l-[28px] overflow-hidden"
            >
              <form
                onSubmit={drawerState === "add" ? handleAddStaff : handleEditStaff}
                className="flex flex-col flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-8 py-7 border-b border-white/8 flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white tracking-wider">
                      {drawerState === "add" ? "Add New Staff" : "Edit Staff Member"}
                    </h2>
                    <p className="text-white/40 text-xs mt-1">
                      {drawerState === "add" ? "Fill in the details to add a new team member" : `Editing: ${selectedStaff?.full_name}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 px-8 py-8 flex flex-col gap-7">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4 py-8 bg-white/4 rounded-2xl border border-white/8 border-dashed">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                      {drawerState === "edit" && selectedStaff?.photo_url ? (
                        <Image
                          src={selectedStaff.photo_url}
                          alt="staff"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-white/20" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#DAA28B] hover:text-[#FEF7F1] transition-colors underline underline-offset-4"
                    >
                      Upload Profile Photo
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Full Name *</label>
                      <input
                        name="full_name"
                        type="text"
                        defaultValue={drawerState === "edit" ? selectedStaff?.full_name : ""}
                        placeholder="Enter full name"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={drawerState === "edit" ? selectedStaff?.email : ""}
                        placeholder="staff@dulce.com"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Role *</label>
                      <div className="relative">
                        <select
                          name="role"
                          defaultValue={drawerState === "edit" ? selectedStaff?.role : "Waiter"}
                          required
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm font-medium outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
                        >
                          {["Manager", "Head Chef", "Cook", "Sous Chef", "Waiter", "Cashier", "Host", "Cleaner"].map((r) => (
                            <option key={r} value={r} className="bg-[#1A1A1A] text-white">{r}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        defaultValue={drawerState === "edit" ? selectedStaff?.phone : ""}
                        placeholder="+1 (234) 567 8900"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Monthly Salary ($)</label>
                      <input
                        name="salary"
                        type="number"
                        step="0.01"
                        defaultValue={drawerState === "edit" ? selectedStaff?.salary : ""}
                        placeholder="2200.00"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Date of Birth</label>
                      <input
                        name="dob"
                        type="date"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="px-8 py-6 border-t border-white/8 flex items-center justify-end gap-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="px-6 py-3 text-sm font-bold text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#BF5933] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg shadow-[#BF5933]/25 flex items-center gap-2"
                  >
                    <Check size={16} />
                    {drawerState === "add" ? "Add Staff Member" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
