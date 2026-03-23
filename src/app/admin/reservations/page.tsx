"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Users,
  Calendar,
  Clock,
  DollarSign,
  User,
  CreditCard,
  Check,
  X,
  MapPin,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Mock Data
const floors = ["1st Floor", "2nd Floor", "3rd Floor"];
const hours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const tables = ["Bar", "A1", "A2", "B1", "B2", "B3", "C1", "C2"];

const mockReservations = [
  { table: "Bar", start: "13:00", end: "14:00", name: "John Doe", pax: "01", type: "primary" },
  { table: "Bar", start: "17:00", end: "18:00", name: "John Doe", pax: "01", type: "primary" },
  { table: "A1", start: "18:00", end: "19:30", name: "John Doe", pax: "01", type: "accent" },
  { table: "A2", start: "11:00", end: "12:30", name: "John Doe", pax: "01", type: "primary" },
  { table: "A2", start: "15:00", end: "16:00", name: "John Doe", pax: "01", type: "accent" },
  { table: "B1", start: "11:00", end: "12:00", name: "John Doe", pax: "01", type: "primary" },
  { table: "B2", start: "15:00", end: "17:00", name: "John Doe", pax: "01", type: "accent" },
  { table: "B3", start: "12:00", end: "14:00", name: "John Doe", pax: "01", type: "primary" },
  { table: "C2", start: "17:00", end: "19:00", name: "John Doe", pax: "01", type: "primary" },
  { table: "C1", start: "19:00", end: "20:00", name: "John Doe", pax: "01", type: "accent" },
];

type ViewState = "grid" | "details";

export default function ReservationManagement() {
  const [activeFloor, setActiveFloor] = useState("1st Floor");
  const [view, setViewState] = useState<ViewState>("grid");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<any>(null);
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [dbReservations, setDbReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [tablesRes, resRes] = await Promise.all([
      supabase.from("tables").select("*"),
      supabase.from("reservations").select("*, tables(*)")
    ]);
    if (tablesRes.data) setDbTables(tablesRes.data);
    if (resRes.data) setDbReservations(resRes.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();

    // Set up Realtime Subscription for Reservations & Tables
    const reservationsChannel = supabase
      .channel("admin-reservations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reservationsChannel);
    };
  }, []);


  const handleAddReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const table_id = formData.get("table_id") as string;
    const customer_name = formData.get("guest_name") as string;
    const seats = parseInt(formData.get("guest_count") as string);
    const date = formData.get("reservation_date") as string;
    const time = formData.get("reservation_time") as string;

    const { error } = await supabase.from("reservations").insert([{
      table_id,
      customer_name,
      seats,
      date,
      time,
      status: "pending"
    }]);

    if (error) alert(error.message);
    else {
      setIsDrawerOpen(false);
      fetchData();
    }
  };

  const getTimePos = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const startHour = 10;
    return (h - startHour) * 100 + (m / 60) * 100;
  };

  const getWidth = (start: string, end: string) => {
    const s = getTimePos(start);
    const e = getTimePos(end);
    return e - s;
  };

  const handleBlockClick = (res: any) => {
    setSelectedRes(res);
    setViewState("details");
  };

  return (
    <div className="flex flex-col gap-8 w-full font-body relative min-h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => view === "details" ? setViewState("grid") : {}}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-heading font-bold tracking-widest text-[#FEF7F1]">
            {view === "grid" ? "Reservation" : "Reservation Details"}
          </h1>
        </div>
        <div className="flex items-center gap-6 self-end md:self-auto">
          <button className="relative text-white/70 hover:text-white transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#BF5933] rounded-full border-2 border-[#1E1E1E]"></span>
          </button>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="w-10 h-10 rounded-full bg-[#DAA28B] overflow-hidden border-2 border-[#FEF7F1]/20" style={{ position: "relative" }}>
            <Image src="/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg" alt="User" fill sizes="40px" className="object-cover" />
          </div>
        </div>
      </header>

      {view === "grid" ? (
        <>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-4">
            <div className="flex items-center gap-2 p-1.5 bg-[#2D1B14] rounded-2xl border border-white/5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setActiveFloor(floor)}
                  className={`flex-shrink-0 px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                    activeFloor === floor 
                      ? "bg-[#FEF7F1] text-[#1E1E1E]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <select className="flex-1 lg:flex-none px-6 py-2.5 bg-[#2D1B14] border border-white/5 text-white/60 text-xs font-bold rounded-xl outline-none appearance-none cursor-pointer">
                <option>Today</option>
                <option>Tomorrow</option>
              </select>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="flex-[2] lg:flex-none px-6 py-2.5 bg-[#BF5933] text-[#FEF7F1] text-[10px] md:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#B15E3E] transition-all shadow-lg"
              >
                Add New Reservation
              </button>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="flex-1 w-full mt-6 bg-[#2D1B14]/40 border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="min-w-[1200px] flex flex-col">
                {/* Time Header */}
                <div className="flex border-b border-white/5">
                  <div className="w-32 flex-shrink-0"></div>
                  <div className="flex-1 flex">
                    {hours.map((h) => (
                      <div key={h} className="w-[100px] flex-shrink-0 py-4 text-center text-xs font-bold text-white/30 border-l border-white/5">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid Rows */}
                <div className="flex flex-col">
                  {dbTables.map((table) => (
                    <div key={table.id} className="flex border-b border-white/5 group relative h-24">
                      {/* Side Table Labels */}
                      <div className="w-32 flex-shrink-0 flex items-center justify-center border-r border-white/5 bg-[#2D1B14]/80">
                        <span className="font-heading font-bold text-sm uppercase text-white tracking-widest">{table.table_number}</span>
                      </div>
                      
                      {/* Timeline Area */}
                      <div className="flex-1 flex relative">
                        {/* Grid lines */}
                        {hours.map((h) => (
                          <div key={h} className="w-[100px] flex-shrink-0 border-r border-white/5 h-full opacity-30 group-hover:opacity-100 transition-opacity"></div>
                        ))}

                        {/* Blocks from Supabase */}
                        {dbReservations.filter(r => r.table_id === table.id).map((res, ri) => (
                          <motion.div
                            key={res.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => handleBlockClick(res)}
                            className={`absolute top-2 h-20 rounded-2xl p-4 flex flex-col justify-center cursor-pointer shadow-xl transition-all border border-white/10 bg-[#333333] text-[#FEF7F1]`}
                            style={{ 
                              left: `${getTimePos(res.time)}px`, 
                              width: `150px` // Default width for now
                            }}
                          >
                            <p className="font-heading font-bold uppercase text-xs truncate tracking-widest">{res.customer_name}</p>
                            <div className="flex items-center gap-1.2 mt-2 opacity-60">
                              <Users size={12} strokeWidth={3} className="text-[#DAA28B]" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter">{res.seats}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Details View */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-8 w-full"
        >
          {/* Hero Banner */}
          <div className="relative w-full h-[400px] rounded-[40px] overflow-hidden group" style={{ position: "relative" }}>
            <Image src="/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg" alt="Table" fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
              <h2 className="text-5xl font-heading font-bold text-[#FEF7F1] uppercase tracking-[0.2em]">Table # {selectedRes?.tables?.table_number}</h2>
            </div>
          </div>

          {/* Section: Reservation Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg md:text-xl font-heading font-bold text-[#FEF7F1] uppercase tracking-widest">Reservation Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Table Number", value: selectedRes?.tables?.table_number || "01" },
                { label: "Pax Number", value: `${selectedRes?.seats || 0} persons` },
                { label: "Reservation Date", value: selectedRes?.date || "28. 03. 2024" },
                { label: "Reservation Time", value: selectedRes?.time || "03 : 18 PM" },
                { label: "Deposit Fee", value: "60 . 00 $" },
                { label: "Status", value: selectedRes?.status || "Confirmed", highlight: selectedRes?.status === "confirmed" ? "green" : "" },
              ].map((item, i) => (
                <div key={i} className="bg-[#2D1B14] border border-white/5 rounded-2xl p-6 flex flex-col gap-1.5 shadow-lg">
                  <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">{item.label}</span>
                  <span className={`text-sm font-bold uppercase text-[#FEF7F1] tracking-wider ${item.highlight === 'green' ? 'text-green-400' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Customer Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg md:text-xl font-heading font-bold text-[#FEF7F1] uppercase tracking-widest">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Title", value: "Guest" },
                { label: "Full Name", value: selectedRes?.customer_name || "Watson Joyce" },
                { label: "Phone number", value: "+1 (123) 123 4654" },
                { label: "Email Address", value: "guest@example.com" },
              ].map((item, i) => (
                <div key={i} className="bg-[#2D1B14] border border-white/5 rounded-2xl p-6 flex flex-col gap-1.5 shadow-lg">
                  <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold uppercase text-[#FEF7F1] tracking-wider">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Additional Information */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg md:text-xl font-heading font-bold text-[#FEF7F1] uppercase tracking-widest">Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Customer ID", value: "#12354564" },
                { label: "Payment Method", value: "Visa Card" },
                { label: "Name", value: "Watson Joyce" },
                { label: "Card Number", value: "**** 1236 4564 4546 4546" },
              ].map((item, i) => (
                <div key={i} className="bg-[#2D1B14] border border-white/5 rounded-2xl p-6 flex flex-col gap-1.5 shadow-lg">
                  <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold uppercase text-[#FEF7F1] tracking-wider">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-8 mt-4 pt-10 border-t border-white/5">
             <button className="w-full sm:w-auto text-[10px] md:text-sm font-bold text-white/40 hover:text-white uppercase tracking-widest underline underline-offset-8 decoration-red-900 order-2 sm:order-1">Cancel Reservation</button>
             <button className="w-full sm:w-auto px-10 py-4 bg-[#FEF7F1] text-[#1E1E1E] text-xs md:text-sm font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white active:scale-95 transition-all shadow-xl order-1 sm:order-2">Change Table</button>
          </div>
        </motion.div>
      )}

      {/* Add New Reservation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsDrawerOpen(false)}
               className="fixed inset-0 z-40 bg-[#1E1E1E]/80 backdrop-blur-sm"
            />
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 280 }}
               className="fixed top-0 right-0 bottom-0 w-full md:max-w-[500px] bg-[#242424] z-50 shadow-2xl flex flex-col md:border-l border-white/5 md:rounded-l-3xl overflow-hidden"
            >
              <form onSubmit={handleAddReservation} className="flex flex-col flex-1 overflow-y-auto px-6 md:px-10 py-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-white tracking-widest uppercase">Add New Reservation</h2>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50"><ChevronRight size={20} /></button>
                </div>

                {/* Subsections */}
                <div className="flex flex-col gap-10">
                  {/* Part 1: Reservation Details */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-heading font-bold text-[#FEF7F1]/80 uppercase tracking-widest border-l-4 border-[#BF5933] pl-4">Reservation Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Table Number</label>
                        <select name="table_id" required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                          {dbTables.map(t => <option key={t.id} value={t.id}>{t.table_number}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pax Number</label>
                        <input name="guest_count" type="number" required placeholder="05 persons" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Reservate Date</label>
                        <input name="reservation_date" type="date" required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm [color-scheme:dark]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Reservation Time</label>
                        <input name="reservation_time" type="time" required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm [color-scheme:dark]" />
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Customer Details */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-heading font-bold text-[#FEF7F1]/80 uppercase tracking-widest border-l-4 border-[#BF5933] pl-4">Customer Details</h3>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Title</label>
                       <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                         <option>Mr</option>
                         <option>Ms</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <input name="guest_name" type="text" required placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                    </div>
                    <input type="tel" placeholder="Phone Number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                    <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-white/5">
                   <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-full sm:w-auto text-sm font-bold text-white/40 hover:text-white uppercase tracking-[0.2em] order-2 sm:order-1">Cancel</button>
                   <button 
                     type="submit"
                     className="w-full sm:w-auto px-12 py-4 bg-[#FEF7F1] text-[#1E1E1E] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white shadow-xl order-1 sm:order-2"
                   >
                     Save
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
