"use client";

import React from "react";
import Image from "next/image";
import {
  Bell,
  Download,
  DollarSign,
  Briefcase,
  Layers,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const overviewData = [
  { name: "JAN", sales: 2500, revenue: 2000 },
  { name: "FEB", sales: 3000, revenue: 2200 },
  { name: "MAR", sales: 2200, revenue: 1500 },
  { name: "APR", sales: 2800, revenue: 2300 },
  { name: "MAY", sales: 4200, revenue: 1900 },
  { name: "JUN", sales: 3800, revenue: 2400 },
  { name: "JUL", sales: 4500, revenue: 2800 },
  { name: "AUG", sales: 4100, revenue: 2500 },
  { name: "SEP", sales: 3800, revenue: 2200 },
  { name: "OCT", sales: 4800, revenue: 3000 },
  { name: "NOV", sales: 3200, revenue: 1800 },
  { name: "DEC", sales: 5000, revenue: 3200 },
];

const miniBarData = Array.from({ length: 10 }).map(() => ({
  value: Math.floor(Math.random() * 100) + 20,
}));

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  barColor,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ElementType;
  barColor: string;
}) {
  return (
    <div className="bg-[#1E1E1E] border border-white/8 rounded-[20px] p-6 flex flex-col justify-between gap-4 hover:border-white/15 transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#DAA28B] text-xs font-bold uppercase tracking-[0.2em] mb-2">
            {label}
          </p>
          <h2 className="text-[#FEF7F1] text-3xl font-heading font-bold">{value}</h2>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{sub}</p>
        <div className="w-28 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={miniBarData}>
              <Bar dataKey="value" fill={barColor} radius={[3, 3, 0, 0]} maxBarSize={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dailySales, setDailySales] = React.useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = React.useState(0);
  const [popularDishes, setPopularDishes] = React.useState<any[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [chartPeriod, setChartPeriod] = React.useState("Monthly");

  const fetchData = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];

    const [dailyRes, monthlyRes, popularRes, recentRes] = await Promise.all([
      supabase.from("orders").select("total_amount").gte("created_at", today),
      supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", firstDayOfMonth),
      supabase.from("menu_items").select("*").limit(4),
      supabase
        .from("orders")
        .select("*, tables(*)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (dailyRes.data)
      setDailySales(
        dailyRes.data.reduce((acc, curr) => acc + (curr.total_amount || 0), 0)
      );
    if (monthlyRes.data)
      setMonthlyRevenue(
        monthlyRes.data.reduce((acc, curr) => acc + (curr.total_amount || 0), 0)
      );
    if (popularRes.data) setPopularDishes(popularRes.data);
    if (recentRes.data) setRecentOrders(recentRes.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();

    // Set up Realtime Subscription for Dashboard Stats
    const dashboardChannel = supabase
      .channel("admin-dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dashboardChannel);
    };
  }, []);


  return (
    <div className="flex flex-col gap-7 w-full font-body">
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#FEF7F1] tracking-wider">
            Dashboard
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            title="Refresh"
          >
            <RefreshCcw size={16} />
          </button>
          <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BF5933] rounded-full border border-[#111111]" />
          </button>
          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
            <Download size={14} /> Export
          </button>
          <div className="w-9 h-9 rounded-full bg-[#DAA28B] overflow-hidden border-2 border-[#BF5933]/30 relative">
            <Image
              src="/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg"
              alt="User"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Daily Sales"
          value={`$${dailySales.toFixed(2)}`}
          sub={`Today, ${new Date().toLocaleDateString([], { month: "short", day: "numeric" })}`}
          color="#BF5933"
          icon={DollarSign}
          barColor="#BF5933"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${(monthlyRevenue / 1000).toFixed(1)}k`}
          sub={`${new Date().toLocaleString("default", { month: "short" })} 1 - ${new Date().toLocaleString("default", { month: "short" })} ${new Date().getDate()}`}
          color="#FEF7F1"
          icon={Briefcase}
          barColor="#FEF7F1"
        />
        <StatCard
          label="Table Occupancy"
          value="25/40"
          sub="Tables active now"
          color="#4ade80"
          icon={Layers}
          barColor="#4ade80"
        />
      </div>

      {/* ── Popular & Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Popular Dishes */}
        <div className="bg-[#1E1E1E] border border-white/8 rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-heading text-lg font-bold text-[#FEF7F1] tracking-wide">
              Popular Dishes
            </h3>
            <button className="text-[10px] font-bold text-[#DAA28B] uppercase tracking-widest hover:text-[#FEF7F1] border border-[#DAA28B]/30 px-3 py-1.5 rounded-lg hover:border-[#DAA28B] transition-all">
              See All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))
            ) : popularDishes.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No menu items found</p>
            ) : (
              popularDishes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/4 border border-white/5 rounded-xl p-3 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-white/10">
                      <Image
                        src={
                          item.image_url ||
                          "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#FEF7F1] block">
                        {item.name}
                      </span>
                      <span className="text-white/40 text-xs">{item.categories?.name || "Uncategorized"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[#DAA28B] text-sm">${item.price}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${
                        item.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {item.status || "active"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1E1E1E] border border-white/8 rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-heading text-lg font-bold text-[#FEF7F1] tracking-wide">
              Recent Orders
            </h3>
            <button className="text-[10px] font-bold text-[#DAA28B] uppercase tracking-widest hover:text-[#FEF7F1] border border-[#DAA28B]/30 px-3 py-1.5 rounded-lg hover:border-[#DAA28B] transition-all">
              See All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))
            ) : recentOrders.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No recent orders</p>
            ) : (
              recentOrders.map((order) => {
                const statusMap: Record<string, string> = {
                  served: "text-[#BF5933] bg-[#BF5933]/10",
                  completed: "text-blue-400 bg-blue-400/10",
                  cancelled: "text-red-400 bg-red-400/10",
                  in_kitchen: "text-yellow-400 bg-yellow-400/10",
                  in_process: "text-[#DAA28B] bg-[#DAA28B]/10",
                };
                const statusClass = statusMap[order.status] || "text-white/50 bg-white/5";
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between bg-white/4 border border-white/5 rounded-xl p-3 hover:bg-white/8 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/50 text-xs">
                        #{order.id.slice(0, 4).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-[#FEF7F1] block">
                          {order.tables?.table_number
                            ? `Table ${order.tables.table_number}`
                            : "Guest Order"}
                        </span>
                        <span className="text-white/40 text-xs">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-[#FEF7F1] text-sm">
                        ${order.total_amount}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${statusClass}`}
                      >
                        {order.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Chart Section ── */}
      <div className="bg-[#1E1E1E] border border-white/8 rounded-[20px] p-6 md:p-8">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center mb-8 gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#BF5933]/10">
                <TrendingUp size={20} className="text-[#BF5933]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#FEF7F1] tracking-wide">
                Revenue Overview
              </h3>
            </div>
            <div className="flex items-center gap-4 sm:ml-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-1.5 rounded-full bg-[#BF5933] inline-block" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1.5 rounded-full bg-white/30 inline-block" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Revenue</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/8">
              {["Monthly", "Weekly", "Daily"].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                    chartPeriod === period
                      ? "bg-[#BF5933] text-white shadow-lg shadow-[#BF5933]/30"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={overviewData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600 }}
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "12px 16px",
                }}
                itemStyle={{ color: "#FEF7F1", fontSize: "13px", fontWeight: "bold" }}
                labelStyle={{ color: "#DAA28B", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#BF5933"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#BF5933", stroke: "#FEF7F1", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="rgba(254,247,241,0.25)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "rgba(254,247,241,0.5)", stroke: "#FEF7F1", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
