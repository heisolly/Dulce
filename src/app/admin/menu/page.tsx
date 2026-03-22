"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Pizza,
  Beef,
  Coffee,
  IceCream,
  Utensils,
  Store,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Search,
  ChevronDown,
  X,
  RefreshCcw,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type MenuTab = "Normal Menu" | "Special Deals" | "New Year Special" | "Deserts and Drinks";
type DrawerType = "none" | "add-category" | "edit-category" | "add-item" | "edit-item";

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<MenuTab>("Normal Menu");
  const [drawer, setDrawer] = useState<DrawerType>("none");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbMenuItems, setDbMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const { data: catData, error: catError } = await supabase.from("categories").select("*");
      if (catError) throw catError;
      setDbCategories(catData || []);

      const { data: itemData, error: itemError } = await supabase
        .from("menu_items")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (itemError) throw itemError;
      setDbMenuItems(itemData || []);
    } catch (err) {
      console.error("Error fetching menu data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMenuData();
  }, []);

  const closeDrawer = () => {
    setDrawer("none");
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) fetchMenuData();
    else alert("Failed to delete item: " + error.message);
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    
    const { error } = await supabase.from("categories").insert([{ name }]);
    if (error) {
      alert(error.message);
    } else {
      closeDrawer();
      fetchMenuData();
    }
  };

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    
    const { error } = await supabase.from("categories").update({ name }).eq("id", selectedCategory.id);
    if (error) {
      alert(error.message);
    } else {
      closeDrawer();
      fetchMenuData();
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      category_id: formData.get("category_id") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string || "active",
      // default image for now
      image_url: "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg"
    };

    const { error } = await supabase.from("menu_items").insert([payload]);
    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchMenuData();
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      category_id: formData.get("category_id") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
    };

    const { error } = await supabase.from("menu_items").update(payload).eq("id", selectedItem.id);
    if (error) alert(error.message);
    else {
      closeDrawer();
      fetchMenuData();
    }
  };

  const filteredItems = dbMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategoryId === "all" || item.category_id === activeCategoryId;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 w-full font-body relative h-full">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#FEF7F1] tracking-wider flex items-center gap-3">
            <Utensils size={24} className="text-[#BF5933]" />
            Menu Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {dbMenuItems.length} menu items across {dbCategories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMenuData}
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

      {/* ── Categories Section ── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-heading font-bold text-white/80 tracking-widest uppercase">Menu Categories</h2>
          <button 
            onClick={() => setDrawer("add-category")}
            className="w-full sm:w-auto px-5 py-2.5 bg-white/5 text-white/80 border border-white/10 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => setActiveCategoryId("all")}
            className={`flex-shrink-0 w-32 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all border ${
              activeCategoryId === "all" 
                ? "bg-[#BF5933] border-[#BF5933] shadow-lg shadow-[#BF5933]/20" 
                : "bg-[#1E1E1E] border-white/5 hover:border-white/20"
            }`}
          >
            <div className={`p-2.5 rounded-xl ${activeCategoryId === "all" ? "bg-white/20 text-white" : "bg-white/5 text-[#DAA28B]"}`}>
              <Store size={20} />
            </div>
            <div className="text-center">
              <p className={`text-xs font-bold uppercase tracking-wider ${activeCategoryId === "all" ? "text-white" : "text-white/80"}`}>All Items</p>
              <p className={`text-[10px] font-medium mt-1 ${activeCategoryId === "all" ? "text-white/70" : "text-white/40"}`}>{dbMenuItems.length} total</p>
            </div>
          </motion.div>
          {dbCategories.map((cat) => {
            const itemCount = dbMenuItems.filter(i => i.category_id === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex-shrink-0 w-32 p-4 rounded-2xl flex flex-col justify-between items-center gap-3 cursor-pointer transition-all border group relative ${
                  isActive 
                    ? "bg-[#BF5933] border-[#BF5933] shadow-lg shadow-[#BF5933]/20" 
                    : "bg-[#1E1E1E] border-white/5 hover:border-white/20"
                }`}
              >
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); setDrawer("edit-category"); }} className="p-1.5 rounded-md bg-black/40 text-white/70 hover:text-white transition-colors">
                    <Edit2 size={12} />
                  </button>
                </div>
                <div className={`p-2.5 rounded-xl ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-[#DAA28B]"}`}>
                  <Utensils size={20} />
                </div>
                <div className="text-center w-full">
                  <p className={`text-xs font-bold uppercase tracking-wider truncate mb-1 ${isActive ? "text-white" : "text-white/80"}`}>{cat.name}</p>
                  <p className={`text-[10px] font-medium ${isActive ? "text-white/70" : "text-white/40"}`}>{itemCount} items</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Menu List Section ── */}
      <section className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-heading font-bold text-[#FEF7F1] tracking-widest uppercase">
              {activeCategoryId === "all" ? "All Items" : dbCategories.find(c => c.id === activeCategoryId)?.name + " Items"}
            </h2>
            <span className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs font-bold">{filteredItems.length}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1E1E1E] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#BF5933] transition-all placeholder:text-white/30"
              />
            </div>
            <button 
              onClick={() => { setSelectedItem(null); setDrawer("add-item"); }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#BF5933] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg shadow-[#BF5933]/25 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} /> New Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-xl w-fit border border-white/8">
          {(["Normal Menu", "Special Deals", "Deserts and Drinks"] as MenuTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? "bg-[#BF5933] text-white shadow-md shadow-[#BF5933]/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 w-full bg-[#1E1E1E] border border-white/8 rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#181818] border-b border-white/8">
                  <th className="py-4 px-5 w-10"><input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded opacity-50" /></th>
                  <th className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] w-[80px]">Photo</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Product Name & Desc</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Category</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Price</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-5 py-3"><div className="h-16 rounded-xl bg-white/5 animate-pulse" /></td>
                    </tr>
                  ))
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-white/30 text-sm">
                      No menu items found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors group">
                      <td className="py-4 px-5"><input type="checkbox" className="accent-[#BF5933] w-4 h-4 rounded opacity-30 group-hover:opacity-100 transition-opacity" /></td>
                      <td className="py-4 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-white/10 flex-shrink-0">
                          <Image src={item.image_url || "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg"} alt={item.name} fill sizes="48px" className="object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#FEF7F1] truncate max-w-[250px]">{item.name}</span>
                          <span className="text-xs text-white/40 truncate max-w-[250px] mt-0.5">{item.description || "No description"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-white/70">{item.categories?.name || "N/A"}</td>
                      <td className="py-4 px-4 font-bold text-sm text-[#FEF7F1]">${item.price}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          item.status === 'active' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {item.status || "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => { setSelectedItem(item); setDrawer("edit-item"); }} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Category Drawer ── */}
      <AnimatePresence>
        {(drawer === "add-category" || drawer === "edit-category") && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-[#181818] z-[60] shadow-2xl flex flex-col border-l border-white/8 md:rounded-l-[28px] overflow-hidden"
            >
              <form onSubmit={drawer === "add-category" ? handleAddCategory : handleEditCategory} className="flex flex-col flex-1 h-full">
                <div className="flex items-center justify-between px-8 py-7 border-b border-white/8 flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white tracking-wider">
                      {drawer === "add-category" ? "Add Category" : "Edit Category"}
                    </h2>
                  </div>
                  <button type="button" onClick={closeDrawer} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-6 px-8 py-8 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Category Name *</label>
                    <input 
                      name="name"
                      type="text" 
                      defaultValue={drawer === "edit-category" ? selectedCategory?.name : ""}
                      placeholder="e.g. Italian Pizzas" 
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-auto px-8 py-6 border-t border-white/8 flex items-center justify-end gap-3 flex-shrink-0">
                  <button type="button" onClick={closeDrawer} className="px-6 py-3 text-sm font-bold text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-[#BF5933] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg flex items-center gap-2">
                    <Check size={16} /> Save
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* ── Menu Item Drawer ── */}
        {(drawer === "add-item" || drawer === "edit-item") && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[520px] bg-[#181818] z-[60] shadow-2xl flex flex-col border-l border-white/8 md:rounded-l-[28px] overflow-hidden"
            >
              <form onSubmit={drawer === "add-item" ? handleAddMenuItem : handleEditMenuItem} className="flex flex-col flex-1 h-full">
                <div className="flex items-center justify-between px-8 py-7 border-b border-white/8 flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white tracking-wider">
                      {drawer === "add-item" ? "Add Menu Item" : "Edit Menu Item"}
                    </h2>
                  </div>
                  <button type="button" onClick={closeDrawer} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-6 px-8 py-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10">
                  {/* Photo Upload Area */}
                  <div className="w-full h-32 bg-white/4 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer group relative overflow-hidden">
                    {drawer === "edit-item" && selectedItem?.image_url ? (
                      <>
                        <Image src={selectedItem.image_url} alt="Meal" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="z-10 flex flex-col items-center">
                          <ImageIcon size={24} className="text-white drop-shadow-lg" />
                          <span className="text-xs font-bold text-white mt-2 drop-shadow-md">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-white/5 rounded-full text-white/50 group-hover:text-white transition-colors">
                          <ImageIcon size={24} />
                        </div>
                        <span className="text-xs font-bold text-white/50 group-hover:text-white transition-colors">Click to upload photo</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Item Name *</label>
                      <input 
                        name="name" 
                        type="text" 
                        required 
                        defaultValue={selectedItem?.name}
                        placeholder="e.g. Classic Cheeseburger" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Category *</label>
                      <div className="relative">
                        <select 
                          name="category_id" 
                          required 
                          defaultValue={selectedItem?.category_id || (activeCategoryId !== "all" ? activeCategoryId : "")}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-10 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-[#1A1A1A] text-white/50">Select Category</option>
                          {dbCategories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-[#1A1A1A] text-white">{cat.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Price ($) *</label>
                      <input 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        required 
                        defaultValue={selectedItem?.price}
                        placeholder="0.00" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all" 
                      />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Status</label>
                      <div className="relative">
                        <select 
                          name="status" 
                          defaultValue={selectedItem?.status || "active"}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-10 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
                        >
                          <option value="active" className="bg-[#1A1A1A]">Active (Available)</option>
                          <option value="inactive" className="bg-[#1A1A1A]">Inactive (Hidden/Out of stock)</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Description</label>
                      <textarea 
                        name="description" 
                        rows={4} 
                        defaultValue={selectedItem?.description}
                        placeholder="Enter appetizing description..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#BF5933] focus:bg-white/8 placeholder:text-white/20 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-8 py-6 border-t border-white/8 flex items-center justify-end gap-3 flex-shrink-0">
                  <button type="button" onClick={closeDrawer} className="px-6 py-3 text-sm font-bold text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-[#BF5933] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4694A] transition-all shadow-lg flex items-center gap-2">
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
