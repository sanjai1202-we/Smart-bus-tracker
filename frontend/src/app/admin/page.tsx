"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, Users, Bus, Navigation, Activity, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('buses');
  const [buses, setBuses] = useState<any[]>([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBus, setNewBus] = useState({ bus_number: '', capacity: 50, plate_number: '' });
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchBuses();
  }, [user]);

  const fetchBuses = () => {
    api.get('/buses').then(res => setBuses(res.data)).catch(console.error);
  };

  const handleAddBus = async () => {
    if (!newBus.bus_number || !newBus.plate_number) return toast.error('Check fields');
    try {
      await api.post('/buses', newBus);
      toast.success('Bus added successfully');
      setShowAddModal(false);
      fetchBuses();
      setNewBus({ bus_number: '', capacity: 50, plate_number: '' });
    } catch (error) {
      toast.error('Failed to add bus');
      console.error(error);
    }
  };

  const handleDeleteBus = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    try {
      await api.delete(`/buses/${id}`);
      toast.success('Bus deleted');
      fetchBuses();
    } catch (error) {
      toast.error('Failed to delete. May have assigned drivers.');
      console.error(error);
    }
  };

  const stats = [
    { label: 'Active Buses', value: buses.length.toString(), icon: Bus, color: 'text-primary-500' },
    { label: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-500' },
    { label: 'Alerts Today', value: '0', icon: ShieldAlert, color: 'text-green-500' },
    { label: 'Avg Speed', value: '38 km/h', icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="flex h-screen bg-background text-textMain">
      
      {/* Sidebar */}
      <div className="w-64 glass-panel border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-200">
            Admin Console
          </h2>
          <p className="text-xs text-textMuted mt-1 w-full truncate">College ID: {user?.college_id}</p>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-4">
           {['buses', 'drivers', 'students', 'alerts'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                    : 'text-textMuted hover:bg-white/5 hover:text-white'
                }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="p-4">
           <button onClick={() => { logout(); router.push('/login'); }} className="w-full bg-red-500/10 text-red-500 py-3 rounded-lg font-medium hover:bg-red-500/20 transition-colors">
             Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/5 blur-3xl shadow-[0_0_150px_rgba(20,184,166,0.1)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white capitalize">{activeTab} Management</h1>
              <p className="text-textMuted">Overview and real-time statistics</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg shadow-lg font-medium transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              + Add New
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
               <div key={i} className="glass-card p-6 border border-white/5 flex items-center justify-between">
                 <div>
                   <p className="text-textMuted text-sm font-medium mb-1">{stat.label}</p>
                   <p className="text-2xl font-bold text-white">{stat.value}</p>
                 </div>
                 <div className={`p-3 rounded-lg bg-black/40 ${stat.color} ring-1 ring-white/10`}>
                   <stat.icon className="w-6 h-6" />
                 </div>
               </div>
            ))}
          </div>

          {/* Table Area */}
          <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/20">
              <h3 className="font-semibold text-white">Registered Entities</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search..." className="bg-background border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-500 w-64" />
              </div>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 text-xs uppercase text-textMuted font-semibold border-b border-gray-800">
                    <th className="px-6 py-4">ID / Reg No</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4">Pairing Code</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {buses.length > 0 ? buses.map((bus: any) => (
                    <tr key={bus.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white group-hover:text-primary-400 transition-colors">
                        Bus {bus.bus_number} 
                        <span className="block text-xs font-normal text-gray-500 mt-0.5">{bus.plate_number}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {bus.drivers?.[0]?.users?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 font-mono text-primary-400 tracking-wider font-bold">
                        {bus.pairing_code || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary-500 hover:text-primary-400 text-sm font-medium mr-4">Edit</button>
                        <button 
                          onClick={() => handleDeleteBus(bus.id)}
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-textMuted border-b border-gray-800">
                         No data available or configure your Supabase instance to view records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card w-full max-w-md p-6 border border-gray-700">
             <h3 className="text-xl font-bold text-white mb-4">Add New Bus</h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">Bus Number (e.g. Bus-02)</label>
                   <input 
                      type="text" 
                      value={newBus.bus_number}
                      onChange={e => setNewBus({...newBus, bus_number: e.target.value})}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">Plate Number</label>
                   <input 
                      type="text" 
                      value={newBus.plate_number}
                      onChange={e => setNewBus({...newBus, plate_number: e.target.value})}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                   <input 
                      type="number" 
                      value={newBus.capacity}
                      onChange={e => setNewBus({...newBus, capacity: Number(e.target.value)})}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors"
                   />
                </div>
             </div>
             <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium">
                  Cancel
                </button>
                <button 
                  onClick={handleAddBus}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg shadow-lg font-medium transition-colors">
                  Save
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
