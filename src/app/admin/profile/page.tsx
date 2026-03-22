"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronLeft, 
  User,
  Settings,
  LogOut,
  Edit2,
  Trash2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type ProfileTab = "My Profile" | "Manage Access" | "Logout";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("My Profile");
  const [showPass, setShowPass] = useState(false);
  const [dbStaff, setDbStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("staff").select("*");
    if (data) setDbStaff(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    
    const { error } = await supabase.from("staff").insert([{
      full_name: name,
      email,
      role
    }]);

    if (!error) fetchStaff();
  };

  const adminProfile = dbStaff[0] || { name: "John Doe", email: "johndoe123@gmail.com", role: "Manager" };

  return (
    <div className="flex flex-col gap-8 w-full font-body relative min-h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-heading font-bold tracking-widest text-[#FEF7F1]">Profile</h1>
        </div>
        <div className="flex items-center gap-6 self-end md:self-auto">
          <button className="relative text-white/70 hover:text-white transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#BF5933] rounded-full border-2 border-[#1E1E1E]"></span>
          </button>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="w-10 h-10 rounded-full bg-[#DAA28B] overflow-hidden border-2 border-[#FEF7F1]/20 relative">
            <Image src="/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg" alt="User" fill className="object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 mt-4">
        {/* Left Sidebar Menu */}
        <aside className="w-full xl:w-[340px] flex flex-col gap-6">
          <div className="bg-[#2D1B14] border border-white/5 rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 shadow-2xl flex flex-row xl:flex-col gap-2 sm:gap-3 overflow-x-auto xl:overflow-visible [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-white/10 pb-4 xl:pb-8">
             {[
               { id: "My Profile", icon: User },
               { id: "Manage Access", icon: Settings },
               { id: "Logout", icon: LogOut },
             ].map((m) => (
               <button
                 key={m.id}
                 onClick={() => setActiveTab(m.id as ProfileTab)}
                 className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex-1 xl:flex-none justify-center xl:justify-start ${
                   activeTab === m.id 
                     ? "bg-[#DAA28B] text-[#1E1E1E]"
                     : "text-white/40 hover:text-white group hover:bg-white/5"
                 }`}
               >
                 <m.icon size={18} className={activeTab === m.id ? "text-[#1E1E1E]" : "text-white/40 group-hover:text-white"} /> {m.id}
               </button>
             ))}
          </div>

          {activeTab === "Manage Access" && (
            <div className="bg-[#2D1B14] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 sm:gap-8 h-fit animate-in fade-in duration-500">
               <h3 className="text-lg sm:text-xl font-heading font-bold text-[#FEF7F1] tracking-widest uppercase">Add New User</h3>
               <form onSubmit={handleAddUser} className="flex flex-col sm:grid sm:grid-cols-2 xl:flex xl:flex-col gap-4">
                  {[
                    { label: "Name", name: "name", placeholder: "Full Name" },
                    { label: "Email", name: "email", placeholder: "Email" },
                    { label: "Role", name: "role", placeholder: "Role" },
                    { label: "Password", name: "password", placeholder: "Password", type: "password" },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{f.label}</label>
                       <div className="relative">
                          <input name={f.name} type={f.type === "password" ? (showPass ? "text" : "password") : "text"} placeholder={f.placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none placeholder:text-white/20" />
                          {f.type === "password" && (
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20"><EyeOff size={16}/></button>
                          )}
                       </div>
                    </div>
                  ))}
                  <button type="submit" className="w-full py-4 mt-2 sm:mt-4 bg-[#BF5933] text-[#FEF7F1] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl hover:bg-[#B15E3E] transition-all">
                    Add User
                  </button>
               </form>
            </div>
          )}
        </aside>

        {/* Dynamic Content Main Panel */}
        <main className="flex-1 bg-[#2D1B14] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 shadow-2xl">
           <AnimatePresence mode="wait">
             {activeTab === "My Profile" && (
               <motion.div 
                 key="my-profile"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col gap-8 md:gap-12"
               >
                 <h2 className="text-xl md:text-2xl font-heading font-bold text-[#FEF7F1] tracking-widest uppercase mb-4">Personal Information</h2>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 bg-[#FEF7F1]/5 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 border-dashed">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] overflow-hidden relative border-4 border-[#DAA28B]/20">
                       <Image src="/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg" alt="Profile" fill className="object-cover" />
                       <button className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#DAA28B] text-[#1E1E1E] flex items-center justify-center border-2 border-[#1E1E1E]"><Edit2 size={12} className="md:w-3.5 md:h-3.5"/></button>
                    </div>
                    <div className="flex flex-col items-center sm:items-start gap-1">
                       <h3 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-widest uppercase text-center sm:text-left">{adminProfile.full_name}</h3>
                       <span className="text-xs md:text-sm font-bold text-[#DAA28B] tracking-widest uppercase italic">{adminProfile.role}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="flex flex-col gap-6 md:col-span-2">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">First Name</label>
                          <input type="text" defaultValue={adminProfile.full_name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm md:text-base text-white font-bold outline-none focus:border-[#DAA28B] transition-all" />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Email</label>
                          <input type="email" defaultValue={adminProfile.email} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm md:text-base text-white font-bold outline-none focus:border-[#DAA28B] transition-all" />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Address</label>
                          <input type="text" defaultValue="123 Street USA, Chicago" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm md:text-base text-white font-bold outline-none focus:border-[#DAA28B] transition-all" />
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">New Password</label>
                       <div className="relative">
                          <input type="password" placeholder="********" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm md:text-base text-white font-bold outline-none pr-14" />
                          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20"><EyeOff size={18}/></button>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Confirm Password</label>
                       <div className="relative">
                          <input type="password" placeholder="********" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm md:text-base text-white font-bold outline-none pr-14" />
                          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20"><EyeOff size={18}/></button>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-10 mt-8">
                    <button className="text-xs sm:text-sm font-bold text-white/40 underline underline-offset-8 uppercase tracking-widest hover:text-white transition-all">Discard Changes</button>
                    <button className="w-full sm:w-auto px-8 sm:px-12 py-4 bg-[#DAA28B] text-[#1E1E1E] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#FEF7F1] shadow-xl shadow-[#DAA28B]/10 transition-all">Save Changes</button>
                 </div>
               </motion.div>
             )}

             {activeTab === "Manage Access" && (
               <motion.div 
                 key="manage-access"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col gap-10 md:gap-14 h-full"
               >
                 {dbStaff.map((user: any, idx: number) => (
                   <div key={user.email} className="flex flex-col gap-6 md:gap-8 pb-10 border-b border-white/5 last:border-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                               <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-widest uppercase">{user.full_name}</h3>
                                  <span className={`px-4 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${idx === 0 ? "bg-[#BF5933]/20 text-[#BF5933]" : "bg-[#DAA28B]/20 text-[#DAA28B]"}`}>{user.role}</span>
                               </div>
                               <span className="text-xs md:text-sm text-white/40 italic">{user.email}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-6 self-end sm:self-auto">
                            <button className="text-white/20 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest sm:text-transparent"><Edit2 size={16}/><span className="sm:hidden text-white/40">Edit</span></button>
                            <button className="text-white/20 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest sm:text-transparent"><Trash2 size={16}/><span className="sm:hidden text-white/40">Delete</span></button>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6">
                         {["Dashboard", "Reports", "Inventory", "Orders", "Customers", "Settings"].map(p => {
                           const isAllowed = true; // permissions mock
                           return (
                             <div key={p} className="flex flex-col gap-3 md:gap-4 items-center">
                                <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">{p}</span>
                                <button className={`relative w-10 h-5 md:w-12 md:h-6 rounded-full transition-all flex items-center p-1 ${isAllowed ? "bg-[#DAA28B]" : "bg-white/10"}`}>
                                   <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-all transform ${isAllowed ? "translate-x-5 md:translate-x-6" : "translate-x-0"}`}></div>
                                </button>
                             </div>
                           )
                         })}
                      </div>
                   </div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
