"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Search, X, Lock, Key, Bus, MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type TabState = "sleep" | "track" | "driver";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabState>("track");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [driverPin, setDriverPin] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] text-slate-800 font-sans selection:bg-indigo-100">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 z-10 sticky top-0 md:px-6">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="BusTracker Logo" width={44} height={44} className="rounded-xl shadow-sm border border-slate-200" priority />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-widest uppercase">Connected</span>
          </div>
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-slate-700">Admin</span>
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex w-full bg-white border-b border-slate-100 shadow-sm z-0">
        <button
          onClick={() => setActiveTab("sleep")}
          className={`flex-1 py-3.5 flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === "sleep" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-400"
          }`}
        >
          <span className="text-xl">😴</span>
          <span className="text-[10px] sm:text-xs font-bold">Sleep</span>
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`flex-1 py-3.5 flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === "track" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-400"
          }`}
        >
          <span className="text-xl">🗺️</span>
          <span className="text-[10px] sm:text-xs font-bold">Track Bus</span>
        </button>
        <button
          onClick={() => setActiveTab("driver")}
          className={`flex-1 py-3.5 flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === "driver" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-400"
          }`}
        >
          <span className="text-xl">🚌</span>
          <span className="text-[10px] sm:text-xs font-bold">Driver</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:p-6 overflow-y-auto w-full">
        {deferredPrompt && (
          <div className="mb-4 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
             <div className="text-sm text-indigo-800 font-medium">Install BusAlert for quick access</div>
             <button onClick={handleInstallClick} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700">Install</button>
          </div>
        )}

        {/* --- TRACK BUS TAB --- */}
        {activeTab === "track" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Find My Bus Banner */}
            <div className="bg-[#e4efff] border border-[#d6e7fc] rounded-3xl p-5 mb-5 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-2xl drop-shadow-sm">🗺️</span>
                </div>
                <div className="pt-1">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">Find My Bus</h2>
                  <p className="text-sm font-medium text-slate-600 leading-snug">
                    Search by your stop name to see live buses.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-16">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-lg grayscale text-slate-700 font-bold opacity-80">🔍</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type stop: Ambur, Chennai..."
                className="w-full h-14 pl-12 pr-12 bg-white rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-[15px] font-medium placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Empty State / Instructional Text */}
            <div className="flex flex-col items-center justify-center text-center mt-8">
              <div className="text-3xl mb-4 opacity-50 grayscale flex items-center space-x-1">
                 <span className="bg-slate-200 text-white rounded p-1 text-sm border-2 border-slate-300">05:22</span>
                 <span className="bg-[#c2c1ee] rounded-full p-2 text-white border-2 border-slate-300"><Bus className="w-5 h-5"/></span>
              </div>
              <p className="text-[#888c99] font-medium text-[15px]">
                Search your stop name to see live buses
              </p>
            </div>
          </div>
        )}

        {/* --- DRIVER TAB --- */}
        {activeTab === "driver" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Driver Mode Banner */}
            <div className="bg-[#e0fce5] border border-[#c9f5d3] rounded-3xl p-5 mb-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-2xl drop-shadow-sm">🚌</span>
                </div>
                <div className="pt-1">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">Driver Mode</h2>
                  <p className="text-sm font-medium text-slate-600 leading-snug">
                    Enter your 4-digit PIN to go live.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Driver Login</h3>
              <input
                type="text"
                pattern="[0-9]*"
                maxLength={4}
                value={driverPin}
                onChange={(e) => setDriverPin(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full h-14 px-5 bg-[#f8fafc] rounded-2xl border border-slate-200 mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-lg font-bold tracking-widest placeholder-slate-300 text-slate-700 transition-all text-center"
              />
              <button className="w-full h-14 bg-[#eef1f5] hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center space-x-2 transition-colors active:scale-[0.98]">
                <Key className="w-5 h-5 text-orange-400" />
                <span className="text-[17px] text-indigo-700 font-black tracking-tight">Enter PIN</span>
              </button>
            </div>
          </div>
        )}

        {/* --- SLEEP TAB --- */}
        {activeTab === "sleep" && (
          <div className="flex flex-col items-center justify-center h-[50vh] animate-in fade-in slide-in-from-bottom-2 duration-300 text-center px-6">
            <span className="text-6xl mb-6">😴</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Resting...</h3>
            <p className="text-slate-500 font-medium">Tracking is paused to save battery. Switch tabs to resume.</p>
          </div>
        )}
      </main>

      {/* --- ADMIN MODAL OVERLAY --- */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181a29] w-full max-w-[360px] rounded-[36px] p-8 shadow-2xl relative border border-[#2c2f42] animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#24273a] hover:bg-[#32364a] text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="text-4xl mb-3 drop-shadow-md">🔐</span>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Admin Access</h2>
              <p className="text-xs text-[#8c92a5] text-center px-4 font-medium leading-relaxed">
                BusAlert Fleet Monitor — Authorized personnel only
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#1e2133] border border-[#3e4460] rounded-xl h-14 pl-5 text-white placeholder-[#5a617d] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#1e2133] border border-[#3e4460] rounded-xl h-14 pl-5 text-white placeholder-[#5a617d] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-14 rounded-xl flex items-center justify-center space-x-2 mt-4 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-[0.98]">
                <Key className="w-4 h-4 text-orange-200" />
                <span className="tracking-wide">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
