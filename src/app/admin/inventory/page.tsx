"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Search,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Filter,
  X,
  ChevronDown,
  RefreshCcw,
  Package
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type DrawerState = "closed" | "add" | "edit";

export default function InventoryManagement() {
  const [drawer, setDrawer] = useState<DrawerState>("closed");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dbInventory, setDbInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("inventory").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setDbInventory(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const closeDrawer = () => {
    setDrawer("closed");
    setSelectedItem(null);
  };

  const openAdd = () => {
    setSelectedItem(null);
    setDrawer("add");
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setDrawer("edit");
  };

  const handleAddInventory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      item_name: formData.get("item_name") as string,
      category: formData.get("category") as string,
      quantity: parseInt(formData.get("quantity") as string),
      price: parseFloat(formData.get("price") as string),
      stock_status: formData.get("stock_status") as string,
    };

    const { error } = await supabase.from("inventory").insert([payload]);

    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchInventory();
    }
  };

  const handleEditInventory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      item_name: formData.get("item_name") as string,
      category: formData.get("category") as string,
      quantity: parseInt(formData.get("quantity") as string),
      price: parseFloat(formData.get("price") as string),
      stock_status: formData.get("stock_status") as string,
    };

    const { error } = await supabase.from("inventory").update(payload).eq("id", selectedItem.id);

    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchInventory();
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (!error) fetchInventory();
    else alert(error.message);
  };

  const filteredInventory = dbInventory.filter(item => 
    item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full font-body relative min-h-[calc(100vh-theme(spacing.24))] md:min-h-[calc(100vh-theme(spacing.16))]">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#FEF7F1] tracking-wider flex items-center gap-3">
            <Package size={24} className="text-[#BF5933]" />
            Inventory Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {dbInventory.length} total products in stock
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#BF5933] transition-all placeholder:text-white/20"
          />
        </div>
        <button 
           onClick={openAdd}
           className="w-full sm:w-auto px-6 py-3 bg-[#BF5933] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg shadow-[#BF5933]/25 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} /> Add Inventory
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full min-h-0">
        {/* ── Left Sidebar Filters ── */}
        <aside className="w-full lg:w-[280px] xl:w-[320px] flex flex-col gap-6 bg-[#1A1A1A] border border-white/8 rounded-[24px] p-6 flex-shrink-0 h-max">
           <div className="flex items-center gap-2 text-white/80 font-heading font-bold uppercase tracking-widest text-sm mb-2">
             <Filter size={16} className="text-[#BF5933]" /> Filters
           </div>
           
           <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Product Status</span>
              <div className="grid grid-cols-2 gap-2">
                 {[
                   { label: "All Items", active: true },
                   { label: "In Stock" },
                   { label: "Low Stock" },
                   { label: "Out of Stock" },
                 ].map(s => (
                   <button key={s.label} className={`px-3 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${s.active ? "bg-[#BF5933]/10 border-[#BF5933]/30 text-[#BF5933]" : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">{s.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex flex-col gap-4">
              {[
                { label: "Category", options: ["All Categories", "Main Course", "Chicken", "Grill", "Beverages", "Desserts"] },
                { label: "Sort By", options: ["Newest Added", "Alphabetical A-Z", "Price: High to Low", "Price: Low to High", "Quantity: Low to High"] },
              ].map(d => (
                <div key={d.label} className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{d.label}</label>
                   <div className="relative">
                     <select className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-xs text-white font-medium outline-none focus:border-[#BF5933] transition-colors cursor-pointer">
                        {d.options.map(o => <option key={o} value={o} className="bg-[#1A1A1A]">{o}</option>)}
                     </select>
                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full py-3 mt-2 bg-white/5 border border-white/10 text-white/50 text-xs rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
              Reset Filters
           </button>
        </aside>

        {/* ── Right Side Inventory List ── */}
        <div className="flex-1 w-full flex flex-col min-h-0 bg-[#1A1A1A] border border-white/8 rounded-[24px] overflow-hidden">
           <div className="flex-1 overflow-y-auto p-4 sm:p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10">
              <div className="flex flex-col gap-4">
                 {loading ? (
                   Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                   ))
                 ) : filteredInventory.length === 0 ? (
                   <div className="py-20 text-center text-white/30 flex flex-col items-center">
                     <Package size={48} className="mb-4 opacity-20" />
                     <p className="font-medium text-sm">No inventory items found.</p>
                   </div>
                 ) : (
                   filteredInventory.map((item, i) => {
                     const isOutOfStock = parseInt(item.quantity) <= 0 || item.stock_status === "out_of_stock";
                     const isLowStock = !isOutOfStock && parseInt(item.quantity) <= 5;
                     
                     return (
                       <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.05, 0.5) }}
                          className="bg-[#1E1E1E] border border-white/5 p-4 sm:p-5 rounded-[20px] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:border-[#BF5933]/30 transition-all shadow-md"
                       >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 relative bg-white/5">
                             <Image 
                               src={item.image_url || "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg"} 
                               alt={item.item_name} 
                               fill 
                               sizes="(max-width: 640px) 64px, 80px" 
                               className="object-cover group-hover:scale-110 transition-transform duration-500" 
                             />
                          </div>
                          
                          <div className="flex-1 flex flex-col gap-1.5">
                             <h3 className="font-semibold text-[#FEF7F1] text-base truncate">{item.item_name}</h3>
                             <div className="flex items-center gap-2.5">
                                 <span className="text-[10px] uppercase tracking-wider text-white/40">{item.category}</span>
                                 <div className="w-1 h-1 rounded-full bg-white/20" />
                                 <span className="font-bold text-[#BF5933] text-sm">${parseFloat(item.price).toFixed(2)}</span>
                             </div>
                          </div>

                          <div className="flex flex-row items-center justify-between sm:justify-end gap-6 sm:w-auto mt-2 sm:mt-0">
                            <div className="flex flex-col items-start sm:items-end gap-1.5 w-24">
                              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Stock Info</span>
                              <span className={`text-sm font-bold flex items-center gap-1.5 ${isOutOfStock ? "text-red-400" : isLowStock ? "text-yellow-400" : "text-[#FEF7F1]"}`}>
                                {item.quantity} Units
                                {isOutOfStock && <span className="w-2 h-2 rounded-full bg-red-400 inline-block" title="Out of Stock" />}
                                {isLowStock && <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" title="Low Stock" />}
                                {!isOutOfStock && !isLowStock && <span className="w-2 h-2 rounded-full bg-green-400 inline-block" title="In Stock" />}
                              </span>
                            </div>

                            <div className="flex gap-2">
                               <button 
                                 onClick={() => openEdit(item)} 
                                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                 title="Edit Item"
                               >
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteInventory(item.id)} 
                                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                                 title="Delete Item"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          </div>
                       </motion.div>
                     );
                   })
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {drawer !== "closed" && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={closeDrawer}
               className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 280 }}
               className="fixed top-0 right-0 bottom-0 w-full sm:max-w-[480px] bg-[#181818] z-[70] shadow-2xl flex flex-col border-l border-white/8 md:rounded-l-[28px] overflow-hidden"
            >
              <form onSubmit={drawer === "add" ? handleAddInventory : handleEditInventory} className="flex flex-col flex-1 h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-8 py-7 border-b border-white/8 flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white tracking-wider">
                      {drawer === "add" ? "Add Inventory Item" : "Edit Inventory Item"}
                    </h2>
                  </div>
                  <button type="button" onClick={closeDrawer} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 flex flex-col gap-6 px-8 py-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10">
                  {/* Image Upload Area */}
                  <div className="w-full h-32 bg-white/4 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="p-3 bg-white/5 rounded-full text-white/50 group-hover:text-white transition-colors z-10">
                      <ImageIcon size={24} />
                    </div>
                    <span className="text-xs font-bold text-white/50 group-hover:text-white transition-colors z-10">Upload product image</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Item Name *</label>
                        <input name="item_name" type="text" required defaultValue={selectedItem?.item_name} placeholder="e.g. Tomatoes" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all" />
                     </div>
                     
                     <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Category *</label>
                        <div className="relative">
                          <select name="category" required defaultValue={selectedItem?.category || "Main Course"} className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-10 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer">
                             <option value="Main Course" className="bg-[#1A1A1A]">Main Course</option>
                             <option value="Chicken" className="bg-[#1A1A1A]">Chicken</option>
                             <option value="Grill" className="bg-[#1A1A1A]">Grill</option>
                             <option value="Produce" className="bg-[#1A1A1A]">Produce (Veggies)</option>
                             <option value="Beverages" className="bg-[#1A1A1A]">Beverages</option>
                             <option value="Dairy" className="bg-[#1A1A1A]">Dairy & Cheese</option>
                             <option value="Spices" className="bg-[#1A1A1A]">Spices & Sauces</option>
                             <option value="Packaging" className="bg-[#1A1A1A]">Packaging</option>
                          </select>
                          <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Quantity *</label>
                        <input name="quantity" type="number" required defaultValue={selectedItem?.quantity || 1} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all" />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Unit Price ($) *</label>
                        <input name="price" type="number" step="0.01" required defaultValue={selectedItem?.price} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all" />
                     </div>

                     <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Stock Status</label>
                        <div className="relative">
                          <select name="stock_status" required defaultValue={selectedItem?.stock_status || "in_stock"} className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-10 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer">
                             <option value="in_stock" className="bg-[#1A1A1A]">In Stock</option>
                             <option value="out_of_stock" className="bg-[#1A1A1A]">Out of Stock</option>
                          </select>
                          <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                        </div>
                     </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="mt-auto px-8 py-6 border-t border-white/8 flex items-center justify-end gap-3 flex-shrink-0">
                   <button type="button" onClick={closeDrawer} className="px-6 py-3 text-sm font-bold text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="px-8 py-3 bg-[#BF5933] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg flex items-center gap-2"
                   >
                     <Check size={16} /> Save Item
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
