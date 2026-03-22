"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function ReservationForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        const formData = new FormData(e.currentTarget);
        
        const customer_name = formData.get("name") as string;
        const date = formData.get("date") as string;
        const time = formData.get("time") as string;
        const seats = parseInt(formData.get("seats") as string);

        const { error } = await supabase.from("reservations").insert([
            { customer_name, date, time, seats, status: "pending" }
        ]);

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("success");
            e.currentTarget.reset();
        }
    };

    return (
        <section className="py-24 bg-[#2D1B14] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#BF5933] to-transparent opacity-20" />
            
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="font-heading text-xs font-black uppercase tracking-[0.5em] text-[#DAA28B] mb-6"
                >
                    Secure Your Table
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="font-heading text-4xl md:text-6xl font-black uppercase text-[#FEF7F1] mb-12"
                >
                    Book Your <br />
                    <span className="font-script lowercase text-5xl md:text-8xl text-[#BF5933] normal-case italic">experience</span>
                </motion.h2>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/5 p-8 md:p-12 rounded-[40px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                >
                    <div className="flex flex-col items-start gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Your Name</label>
                        <input name="name" required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#DAA28B] transition-all" />
                    </div>
                    
                    <div className="flex flex-col items-start gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Guests count</label>
                        <div className="relative w-full">
                            <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                            <input name="seats" required type="number" min="1" max="10" defaultValue="2" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-[#DAA28B] transition-all" />
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Select Date</label>
                        <div className="relative w-full">
                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                            <input name="date" required type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-[#DAA28B] transition-all" />
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Select Time</label>
                        <div className="relative w-full">
                            <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                            <input name="time" required type="time" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-[#DAA28B] transition-all" />
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full group flex items-center justify-center gap-6 bg-[#BF5933] text-[#FEF7F1] py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs transition-all hover:bg-[#FEF7F1] hover:text-[#BF5933] active:scale-95 disabled:opacity-50"
                        >
                            {status === "loading" ? "Processing..." : status === "success" ? "Reserved!" : "Confirm Reservation"}
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        {status === "success" && <p className="text-[#DAA28B] mt-4 font-bold text-sm tracking-widest uppercase">Thank you! We'll see you then.</p>}
                        {status === "error" && <p className="text-red-500 mt-4 font-bold text-sm tracking-widest uppercase">Something went wrong. Please try again.</p>}
                    </div>
                </motion.form>
            </div>
        </section>
    );
}
