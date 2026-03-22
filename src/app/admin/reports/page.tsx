"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Bell, 
  ChevronLeft, 
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type ReportTab = "Reservation Report" | "Revenue Report" | "Staff Report";

// Mock Data
const lineData = [
  { name: "JAN", val1: 2000, val2: 1200 },
  { name: "FEB", val1: 3500, val2: 1800 },
  { name: "MAR", val1: 2800, val2: 1500 },
  { name: "APR", val1: 4200, val2: 2400 },
  { name: "MAY", val1: 3800, val2: 2100 },
  { name: "JUN", val1: 4800, val2: 2800 },
  { name: "JUL", val1: 4100, val2: 2200 },
  { name: "AUG", val1: 4500, val2: 2600 },
  { name: "SEP", val1: 3900, val2: 2300 },
  { name: "OCT", val1: 4600, val2: 2700 },
  { name: "NOV", val1: 3200, val2: 1900 },
  { name: "DEC", val1: 4400, val2: 2500 },
];

const pieData = [
  { name: "Confirmed", value: 110, color: "#BF5933" },
  { name: "Awaited", value: 40, color: "#DAA28B" },
  { name: "Cancelled", value: 30, color: "#FEF7F1" },
  { name: "Failed", value: 12, color: "#E11D48" },
];

export default function ReportsManagement() {
  const [activeTab, setActiveTab] = useState<ReportTab>("Reservation Report");
  const [dbData, setDbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    let res;
    if (activeTab === "Reservation Report") {
      res = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
    } else if (activeTab === "Revenue Report") {
      res = await supabase.from("orders").select("*, tables(*)").order("created_at", { ascending: false });
    } else {
      res = await supabase.from("staff").select("*").order("created_at", { ascending: false });
    }
    if (res.data) setDbData(res.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [activeTab]);

  const totalValue = activeTab === "Revenue Report" 
    ? `${dbData.reduce((acc, curr) => acc + (curr.total_amount || 0), 0)}$`
    : dbData.length;

  return (
    <div className="flex flex-col gap-8 w-full font-body relative min-h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-heading font-bold tracking-widest text-[#FEF7F1]">Reports</h1>
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

      {/* Tabs & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
          {["Reservation Report", "Revenue Report", "Staff Report"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ReportTab)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-[#FEF7F1] text-[#1E1E1E]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
           <div className="flex items-center justify-center gap-3 px-4 md:px-6 py-3 bg-[#2D1B14] border border-white/5 rounded-xl">
             <Calendar size={18} className="text-[#DAA28B]" />
             <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">01/04/2024</span>
             <div className="w-4 h-px bg-white/20"></div>
             <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">08/04/2024</span>
           </div>
           <button className="px-6 py-3 bg-[#BF5933] text-[#FEF7F1] text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#B15E3E] transition-all shadow-xl shadow-[#BF5933]/20">
             Generate Report
           </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[420px]">
        {/* Donut Chart */}
        <div className="lg:col-span-12 xl:col-span-4 bg-[#2D1B14] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col items-center relative shadow-2xl">
           <h3 className="text-lg md:text-xl font-heading font-bold text-[#FEF7F1] tracking-widest uppercase mb-4 self-start">Total {activeTab.split(" ")[0]}</h3>
           <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={90}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                    >
                       {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-white/40 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]">Total</p>
                 <p className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-widest">
                    {totalValue}
                 </p>
              </div>
           </div>

           {/* Legend */}
           <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
              {pieData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-1.5 sm:w-4 sm:h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-[8px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest">{entry.name}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Line Chart */}
        <div className="lg:col-span-12 xl:col-span-8 bg-[#2D1B14] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden h-[400px] lg:h-auto">
           <div className="flex items-center gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
              {["Confirmed", "Awaited", "Cancelled", "Failed"].map((label, i) => (
                <button 
                   key={label}
                   className={`px-4 sm:px-6 py-2 rounded-xl text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                     i === 0 ? "bg-[#BF5933] text-white" : "text-white/40 hover:text-white"
                   }`}
                >
                   {label}
                </button>
              ))}
           </div>
           
           <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={lineData}>
                    <defs>
                       <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#BF5933" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#BF5933" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold' }} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold' }}
                       tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#2D1B14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                       itemStyle={{ color: '#FEF7F1', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '8px' }}
                    />
                    <Area type="monotone" dataKey="val1" stroke="#BF5933" strokeWidth={3} fillOpacity={1} fill="url(#colorVal1)" />
                    <Area type="monotone" dataKey="val2" stroke="rgba(255,255,255,0.4)" strokeWidth={3} fillOpacity={0} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="flex-1 w-full mt-4 bg-[#2D1B14]/40 border border-white/5 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto w-full h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                   {activeTab === "Revenue Report" ? (
                    <tr className="bg-[#2D1B14] border-b border-white/5 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                       <th className="py-6 px-10">Order ID</th>
                       <th className="py-6 px-10 border-l border-white/5">Table</th>
                       <th className="py-6 px-10 border-l border-white/5">Date</th>
                       <th className="py-6 px-10 border-l border-white/5">Status</th>
                       <th className="py-6 px-10 border-l border-white/5">Total Revenue</th>
                    </tr>
                  ) : activeTab === "Staff Report" ? (
                    <tr className="bg-[#2D1B14] border-b border-white/5 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                       <th className="py-6 px-10">Staff ID</th>
                       <th className="py-6 px-10 border-l border-white/5">Name</th>
                       <th className="py-6 px-10 border-l border-white/5">Role</th>
                       <th className="py-6 px-10 border-l border-white/5">Phone</th>
                       <th className="py-6 px-10 border-l border-white/5">Salary/Shift</th>
                       <th className="py-6 px-10 border-l border-white/5">Status</th>
                    </tr>
                  ) : (
                    <tr className="bg-[#2D1B14] border-b border-white/5 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                       <th className="py-6 px-10">Reservation ID</th>
                       <th className="py-6 px-10 border-l border-white/5">Customer Name</th>
                       <th className="py-6 px-10 border-l border-white/5">Reservation Date</th>
                       <th className="py-6 px-10 border-l border-white/5">Time</th>
                       <th className="py-6 px-10 border-l border-white/5">Seats</th>
                       <th className="py-6 px-10 border-l border-white/5">Status</th>
                    </tr>
                  )}
               </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {dbData.map((item, i) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                       {activeTab === "Revenue Report" ? (
                         <>
                            <td className="py-6 px-10 font-mono text-white/50">{item.id.slice(0,8)}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-white uppercase tracking-widest">Table {item.tables?.table_number || "NA"}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{new Date(item.created_at).toLocaleDateString()}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.status}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-[#FEF7F1]">${item.total_amount}</td>
                         </>
                       ) : activeTab === "Staff Report" ? (
                         <>
                            <td className="py-6 px-10 font-mono text-white/50">{item.id.slice(0,8)}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-white uppercase tracking-widest">{item.name}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.role}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.phone}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.shift}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-[#FEF7F1]">{item.status}</td>
                         </>
                       ) : (
                         <>
                            <td className="py-6 px-10 font-mono text-white/50">{item.id.slice(0,8)}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-white uppercase tracking-widest">{item.customer_name}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.date}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.time}</td>
                            <td className="py-6 px-10 border-l border-white/5 text-white/60">{item.seats}</td>
                            <td className="py-6 px-10 border-l border-white/5 font-bold text-[#FEF7F1] uppercase">{item.status}</td>
                         </>
                       )}
                    </tr>
                  ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
