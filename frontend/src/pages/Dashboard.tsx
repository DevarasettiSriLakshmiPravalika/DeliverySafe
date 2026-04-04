import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudRain,
  Wind,
  ThermometerSun,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  CloudLightning,
  Navigation,
  Activity,
  Wallet,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { cn } from '../lib/utils';

const API_BASE_URL = 'http://localhost:8080/api';

type DriverStatus = 'Active' | 'Disrupted';
type ClaimStatus = 'None' | 'Pending' | 'Approved' | 'Flagged';

interface WeatherState {
  condition: string;
  aqi: number;
  temp: number;
  rainfall: number;
}

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<DriverStatus>('Active');
  const [weather, setWeather] = useState<WeatherState>({
    condition: 'Clear',
    aqi: 45,
    temp: 32,
    rainfall: 10,
  });
  
  const [trustScore, setTrustScore] = useState<number>(92);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('None');
  const [suspiciousActivity, setSuspiciousActivity] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
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

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const simulateDisruption = async (type: 'rain' | 'aqi' | 'heat') => {
    if (!user) return;

    let weatherUpdate: WeatherState;
    if (type === 'rain') {
      weatherUpdate = { condition: 'Heavy Rain', aqi: 42, temp: 24, rainfall: 60 };
    } else if (type === 'aqi') {
      weatherUpdate = { condition: 'Smog', aqi: 312, temp: 34, rainfall: 5 };
    } else {
      weatherUpdate = { condition: 'Extreme Heat', aqi: 65, temp: 46, rainfall: 0 };
    }

    setWeather(weatherUpdate);
    setStatus('Disrupted');

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: weatherUpdate.temp,
          rainfall: weatherUpdate.rainfall,
          aqi: weatherUpdate.aqi
        })
      });

      if (res.status === 200) {
        const payout = await res.json();
        setPayoutAmount(payout.amount);
        setClaimStatus('Approved');
        setAlertMsg(`Disruption Detected: ${payout.reason}. Payout Triggered!`);
        fetchPayoutHistory(user.id);
      } else {
        setAlertMsg("Environment condition updated. No payout threshold met.");
        setClaimStatus('None');
        setStatus('Active');
      }
    } catch (err) {
      console.error("Failed to report weather", err);
    }
  };

  const simulateFraud = () => {
    setTrustScore(40);
    setSuspiciousActivity(true);
    setClaimStatus('Flagged');
    setAlertMsg('⚠️ Suspicious behavior detected (possible GPS spoofing)');
  };

  const resetSimulation = () => {
    setStatus('Active');
    setWeather({ condition: 'Clear', aqi: 45, temp: 32, rainfall: 10 });
    setTrustScore(92);
    setClaimStatus('None');
    setSuspiciousActivity(false);
    setPayoutAmount(0);
    setAlertMsg(null);
  };

  return (
    <Layout user={user} status={status} onReset={resetSimulation}>
        <AnimatePresence>
            {alertMsg && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
                <div className={cn(
                "p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3",
                suspiciousActivity 
                    ? "bg-red-600 border-red-500 text-white" 
                    : "bg-gray-900 border-gray-800 text-white"
                )}>
                {suspiciousActivity ? <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" /> : <CloudLightning className="w-5 h-5 shrink-0 mt-0.5" />}
                <p className="font-bold text-sm leading-snug">{alertMsg}</p>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <Wallet className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Earnings Rate</h3>
                            <div className="text-4xl font-black text-gray-900">₹{user?.hourlyEarnings || 0}<span className="text-lg text-gray-400">/hr</span></div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <Wind className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Weekly Coverage</h3>
                            <div className="text-4xl font-black text-gray-900">{user?.workingHoursPerDay || 0}h<span className="text-lg text-gray-400">/day</span></div>
                        </div>
                    </motion.div>
                </div>

                {/* Environment Section */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight">Environmental Monitor</h2>
                        <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-400 border border-gray-100">Live 1s</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-[#F0F9FF] border border-blue-50">
                            <CloudRain className="w-10 h-10 text-blue-500 mb-6" />
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Condition</p>
                            <p className="text-lg font-black text-blue-900 leading-none mt-1">{weather.condition}</p>
                        </div>
                        <div className={cn("p-6 rounded-2xl border transition-all duration-500", weather.aqi > 300 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100")}>
                            <Wind className={cn("w-10 h-10 mb-6 transition-colors", weather.aqi > 300 ? "text-red-500" : "text-gray-400")} />
                            <p className={cn("text-xs font-bold uppercase tracking-widest", weather.aqi > 300 ? "text-red-400" : "text-gray-400")}>Air Quality</p>
                            <p className={cn("text-lg font-black leading-none mt-1", weather.aqi > 300 ? "text-red-900" : "text-gray-900")}>{weather.aqi} AQI</p>
                        </div>
                        <div className={cn("p-6 rounded-2xl border transition-all duration-500", weather.temp > 45 ? "bg-orange-50 border-orange-100" : "bg-[#FFF7ED] border-orange-50")}>
                            <ThermometerSun className={cn("w-10 h-10 mb-6 transition-colors", weather.temp > 45 ? "text-orange-500" : "text-orange-400")} />
                            <p className={cn("text-xs font-bold uppercase tracking-widest", weather.temp > 45 ? "text-orange-400" : "text-orange-400")}>Temperature</p>
                            <p className={cn("text-lg font-black leading-none mt-1", weather.temp > 45 ? "text-orange-900" : "text-orange-900")}>{weather.temp}°C</p>
                        </div>
                    </div>
                </section>

                {/* Active Claims */}
                {claimStatus !== 'None' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-8 rounded-[32px] border relative overflow-hidden", claimStatus === 'Flagged' ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100")}>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", claimStatus === 'Flagged' ? "bg-red-100" : "bg-emerald-100")}>
                                        {claimStatus === 'Flagged' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
                                    </div>
                                    <h2 className={cn("text-xl font-black tracking-tight", claimStatus === 'Flagged' ? "text-red-900" : "text-emerald-900")}>
                                        {claimStatus === 'Flagged' ? "Partial Payout Issued" : "Claim Approved"}
                                    </h2>
                                </div>
                                <div>
                                    <p className={cn("text-4xl font-black tracking-tighter", claimStatus === 'Flagged' ? "text-red-600" : "text-emerald-600")}>₹{claimStatus === 'Flagged' ? payoutAmount / 2 : payoutAmount}</p>
                                    <p className={cn("font-bold text-sm mt-1", claimStatus === 'Flagged' ? "text-red-500" : "text-emerald-500")}>{claimStatus === 'Flagged' ? "⚠️ Under Fraud Review" : "✅ Transferred to Bank Account"}</p>
                                </div>
                            </div>
                        </div>
                        <div className={cn("absolute -right-16 -bottom-16 w-64 h-64 rounded-full opacity-10", claimStatus === 'Flagged' ? "bg-red-600" : "bg-emerald-600")} />
                    </motion.div>
                )}

                {/* History Table (Summary) */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight">Recent Payouts</h2>
                        <Link to="/earnings" className="text-emerald-600 font-bold text-sm hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {payoutHistory.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                        <Wallet className="text-emerald-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-gray-900">₹{p.amount}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.reason}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">{new Date(p.timestamp).toLocaleDateString()}</p>
                                    <p className="text-xs font-bold text-gray-400">{new Date(p.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                        {payoutHistory.length === 0 && <p className="text-gray-400 font-bold text-center py-6">No payouts recorded yet.</p>}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-8">
                {/* Trust Score Card */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Safety Trust Score</h2>
                        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="84" fill="none" className="stroke-gray-50" strokeWidth="20" />
                                <motion.circle cx="96" cy="96" r="84" fill="none" className={cn("transition-all duration-1000 ease-out", trustScore >= 80 ? "stroke-emerald-500" : trustScore >= 50 ? "stroke-yellow-500" : "stroke-red-500")} strokeWidth="20" strokeDasharray="527.78" initial={{ strokeDashoffset: 527.78 }} animate={{ strokeDashoffset: 527.78 - (527.78 * trustScore) / 100 }} strokeLinecap="round" />
                            </svg>
                            <div className="text-5xl font-black tracking-tighter text-gray-900">{trustScore}<span className="text-2xl text-gray-300">%</span></div>
                        </div>
                        <div className={cn("px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-block border", trustScore >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : trustScore >= 50 ? "text-yellow-600 bg-yellow-50 border-yellow-100" : "text-red-600 bg-red-50 border-red-100")}>
                            {trustScore >= 80 ? 'Verified Safe' : trustScore >= 50 ? 'Medium Risk' : 'High Risk Flag'}
                        </div>
                    </div>
                </div>

                {/* Simulation Tools */}
                <div className="bg-gray-900 p-8 rounded-[32px] shadow-2xl shadow-gray-200">
                    <h2 className="text-white text-lg font-black tracking-tight mb-8 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" /> Demo Controls
                    </h2>
                    <div className="space-y-3">
                        <button onClick={() => simulateDisruption('rain')} className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500 transition-all flex items-center justify-between group">
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Simulate Heavy Rain</span>
                            <CloudRain className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <button onClick={() => simulateDisruption('aqi')} className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500 transition-all flex items-center justify-between group">
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Simulate High AQI</span>
                            <Wind className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                        </button>
                        <button onClick={() => simulateDisruption('heat')} className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500 transition-all flex items-center justify-between group">
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Simulate Heatwave</span>
                            <ThermometerSun className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                        </button>
                        <div className="pt-8 mt-4 border-t border-white/10">
                            <button onClick={simulateFraud} className="w-full text-left p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500 transition-all flex items-center justify-between group">
                                <span className="text-sm font-black text-red-500 uppercase tracking-widest">Trigger Fraud</span>
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fraud Insights */}
                <AnimatePresence>
                    {suspiciousActivity && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-600 p-8 rounded-[32px] shadow-xl relative overflow-hidden">
                            <Activity className="absolute -right-8 -bottom-8 w-48 h-48 text-red-500 opacity-50" />
                            <div className="relative z-10">
                                <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Fraud Insights
                                </h2>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 bg-black/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <Navigation className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-wider">GPS Mismatch</p>
                                            <p className="text-[10px] text-red-100 font-medium leading-relaxed mt-1">Device location data differs from network cell towers by 1.2km.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 bg-black/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <Activity className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-wider">Unusual Velocity</p>
                                            <p className="text-[10px] text-red-100 font-medium leading-relaxed mt-1">Detected movement speed of 120km/h in a traffic-heavy rain zone.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </aside>
        </div>
    </Layout>
  );
}
