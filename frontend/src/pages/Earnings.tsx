import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Wallet, 
  ArrowUpRight, 
  ChevronRight,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8080/api';

interface User {
  id: number;
  name: string;
  hourlyEarnings: number;
  workingHoursPerDay: number;
}

interface Payout {
  id: number;
  amount: number;
  reason: string;
  timestamp: string;
}

export default function Earnings() {
  const [user, setUser] = useState<User | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/init`, { method: 'POST' });
        const userData = await res.json();
        setUser(userData);
        fetchPayoutHistory(userData.id);
      } catch (err) {
        console.error("Failed to init user", err);
      }
    };
    init();
  }, []);

  const fetchPayoutHistory = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/payouts`);
      const history = await res.json();
      setPayoutHistory(history);
    } catch (err) {
      console.error("Failed to fetch payouts", err);
    }
  };

  const downloadCSV = () => {
    if (payoutHistory.length === 0) return;
    
    const headers = ["Date", "Time", "Reason", "Amount (INR)"];
    const rows = payoutHistory.map(p => [
      new Date(p.timestamp).toLocaleDateString(),
      new Date(p.timestamp).toLocaleTimeString(),
      p.reason,
      p.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payout_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPayouts = payoutHistory.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout user={user} status="Active">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Wallet className="text-emerald-600 w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                </div>
            </div>
            <div>
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Payouts</h3>
                <div className="text-4xl font-black text-gray-900">₹{totalPayouts.toFixed(2)}</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <CreditCard className="text-blue-600 w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Weekly Premium</h3>
                <div className="text-4xl font-black text-gray-900">₹20.00</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-white font-black uppercase tracking-widest text-[10px]">Active Policy</h3>
                    <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <div>
                    <div className="text-emerald-500 font-black text-xl mb-1 flex items-center gap-2">PLATINUM PLUS <ChevronRight className="w-4 h-4" /></div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Valid till April 2026</p>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Payout Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight">Payout History</h2>
                <button 
                  onClick={downloadCSV}
                  disabled={payoutHistory.length === 0}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Download CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date & Time</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reason</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payoutHistory.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-900">{new Date(p.timestamp).toLocaleDateString()}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(p.timestamp).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-600">{p.reason}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100">Completed</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="font-black text-gray-900 text-lg">₹{p.amount.toFixed(2)}</div>
                                </td>
                            </tr>
                        ))}
                        {payoutHistory.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <Wallet className="text-gray-200 w-8 h-8" />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-gray-50 flex justify-between items-center px-8 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400">Showing {payoutHistory.length} of {payoutHistory.length} entries</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase disabled:opacity-50" disabled>Prev</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
