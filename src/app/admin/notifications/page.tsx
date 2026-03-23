"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronLeft, 
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Mock Data
export default function NotificationsManagement() {
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    if (data) setDbNotifications(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchNotifications();

    // Set up Realtime Subscription for Notifications
    const notificationsChannel = supabase
      .channel("admin-notifications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, []);


  const markAllAsRead = async () => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    if (!error) fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (!error) fetchNotifications();
  };

  const filteredNotifications = activeTab === "All" 
    ? dbNotifications 
    : dbNotifications.filter(n => !n.is_read);

  const unreadCount = dbNotifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-8 w-full font-body relative min-h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-heading font-bold tracking-widest text-[#FEF7F1]">Notification</h1>
            <p className="text-xs md:text-sm text-white/40 italic">You've {unreadCount} unread notification</p>
          </div>
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

      {/* Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-4">
        <div className="flex items-center gap-2">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 sm:flex-none px-6 md:px-8 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeTab === tab 
                  ? "bg-[#FEF7F1] text-[#1E1E1E]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button 
          onClick={markAllAsRead}
          className="w-full sm:w-auto px-6 py-3 bg-[#BF5933] text-[#FEF7F1] text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#B15E3E] transition-all shadow-xl shadow-[#BF5933]/20"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-4 mt-4 overflow-y-auto pr-2 max-h-[calc(100vh-250px)] lg:max-h-[calc(100vh-250px)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
              className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 md:p-1 bg-[#2D1B14] border border-white/5 rounded-[24px] md:rounded-[32px] group relative overflow-hidden shadow-xl transition-all hover:bg-[#2D1B14]/80 ${!n.is_read ? 'border-[#DAA28B]/20' : ''}`}
            >
              <div className="flex items-center gap-4 md:contents">
                {/* Alert Icon Area */}
                <div className="p-4 md:p-7 rounded-[20px] md:rounded-[28px] bg-[#FEF7F1]/10 flex items-center justify-center text-[#FEF7F1]/60 group-hover:text-[#FEF7F1] transition-colors relative">
                    {!n.is_read && <div className="absolute top-2 right-2 md:top-4 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#DAA28B] rounded-full shadow-[0_0_10px_#DAA28B]"></div>}
                    <AlertTriangle size={24} className="md:w-8 md:h-8" />
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                   <h3 className="font-heading font-bold text-[#FEF7F1] text-base md:text-lg uppercase tracking-wider">{n.title}</h3>
                   <span className="md:hidden text-[10px] font-bold text-white/20 tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-[500px] md:flex-1">{n.message}</p>

              <div className="flex items-center justify-between md:justify-end gap-6 md:pr-10">
                 <span className="hidden md:inline text-xs font-bold text-white/20 tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
                 <button 
                   onClick={() => deleteNotification(n.id)}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-3.5 bg-white/5 border border-white/5 rounded-2xl text-red-500 font-bold uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" /> Delete
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
