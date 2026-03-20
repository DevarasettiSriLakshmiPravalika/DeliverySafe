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
  MapPin,
  Clock,
  Wallet,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { cn } from './lib/utils';

type DriverStatus = 'Active' | 'Disrupted';
type ClaimStatus = 'None' | 'Pending' | 'Approved' | 'Flagged';

interface WeatherState {
  condition: string;
  aqi: number;
  temp: number;
}

export default function App() {
  const HOURLY_EARNINGS = 80;
  const HOURS_LOST = 4;

  const [status, setStatus] = useState<DriverStatus>('Active');
  const [weather, setWeather] = useState<WeatherState>({
    condition: 'Clear',
    aqi: 45,
    temp: 32,
  });
  
  const [trustScore, setTrustScore] = useState<number>(92);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('None');
  const [suspiciousActivity, setSuspiciousActivity] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Auto-clear alert
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const simulateDisruption = (type: 'rain' | 'aqi' | 'heat') => {
    setStatus('Disrupted');
    const calculatedPayout = HOURS_LOST * HOURLY_EARNINGS;
    setPayoutAmount(calculatedPayout);
    
    // If flagged before, stay flagged
    if (claimStatus !== 'Flagged') {
      setClaimStatus('Approved');
    }

    if (type === 'rain') {
      setWeather({ condition: 'Heavy Rain', aqi: 42, temp: 24 });
      setAlertMsg('Disruption Detected: Heavy Rain (>50mm) recorded in your zone.');
    } else if (type === 'aqi') {
      setWeather({ condition: 'Smog', aqi: 312, temp: 34 });
      setAlertMsg('Disruption Detected: High AQI (>300). Safety protocol activated.');
    } else {
      setWeather({ condition: 'Extreme Heat', aqi: 65, temp: 46 });
      setAlertMsg('Disruption Detected: Extreme Heat (>45°C) recorded. Take precautions.');
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
    setWeather({ condition: 'Clear', aqi: 45, temp: 32 });
    setTrustScore(92);
    setClaimStatus('None');
    setSuspiciousActivity(false);
    setPayoutAmount(0);
    setAlertMsg(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      {/* Toast Alert */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className={cn(
              "p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start gap-3",
              suspiciousActivity 
                ? "bg-red-500/90 border-red-600 text-white" 
                : "bg-gray-900/90 border-gray-800 text-white"
            )}>
              {suspiciousActivity ? <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" /> : <CloudLightning className="w-5 h-5 shrink-0 mt-0.5" />}
              <p className="font-medium text-sm">{alertMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">DeliverSafe Dashboard</h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" /> Chennai, TN
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={resetSimulation}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                U
              </div>
              <div>
                <p className="text-sm font-semibold">User 1</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn("w-2 h-2 rounded-full", status === 'Active' ? 'bg-green-500' : 'bg-red-500 animate-pulse')} />
                  <span className="text-xs font-medium text-gray-600">{status}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info Columns */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Wallet className="w-4 h-4" />
                  <h3 className="text-sm font-medium">Daily Earnings</h3>
                </div>
                <div className="text-3xl font-bold">₹480</div>
                <p className="text-xs text-gray-400 mt-1">Today's active hours</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-sm font-medium">Est. Hourly</h3>
                </div>
                <div className="text-3xl font-bold">₹{HOURLY_EARNINGS}</div>
                <p className="text-xs text-gray-400 mt-1">Based on current zone</p>
              </div>
            </div>

            {/* Weather & Environment */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Current Environment</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <CloudRain className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs text-blue-600/80 font-medium">Condition</p>
                  <p className="text-sm font-bold text-blue-900 mt-1">{weather.condition}</p>
                </div>
                <div className={cn("p-4 rounded-xl border text-center transition-colors", 
                  weather.aqi > 300 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                )}>
                  <Wind className={cn("w-6 h-6 mx-auto mb-2", weather.aqi > 300 ? "text-red-500" : "text-gray-500")} />
                  <p className={cn("text-xs font-medium", weather.aqi > 300 ? "text-red-600/80" : "text-gray-500")}>AQI</p>
                  <p className={cn("text-sm font-bold mt-1", weather.aqi > 300 ? "text-red-900" : "text-gray-900")}>{weather.aqi}</p>
                </div>
                <div className={cn("p-4 rounded-xl border text-center transition-colors", 
                  weather.temp > 40 ? "bg-orange-50 border-orange-200" : "bg-amber-50 border-amber-200"
                )}>
                  <ThermometerSun className={cn("w-6 h-6 mx-auto mb-2", weather.temp > 40 ? "text-orange-500" : "text-amber-500")} />
                  <p className={cn("text-xs font-medium", weather.temp > 40 ? "text-orange-600/80" : "text-amber-600/80")}>Temperature</p>
                  <p className={cn("text-sm font-bold mt-1", weather.temp > 40 ? "text-orange-900" : "text-amber-900")}>{weather.temp}°C</p>
                </div>
              </div>
            </div>

            {/* Claim Status Section */}
            {claimStatus !== 'None' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "p-6 rounded-2xl border shadow-sm",
                  claimStatus === 'Flagged' ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      claimStatus === 'Flagged' ? "text-red-800" : "text-green-800"
                    )}>
                      {claimStatus === 'Flagged' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      Claim Status: {claimStatus}
                    </h2>
                    
                    {claimStatus === 'Approved' ? (
                      <div className="mt-2 text-green-700">
                        <p className="font-medium text-2xl mt-3">₹{payoutAmount}</p>
                        <p className="text-sm opacity-80 mt-1">✅ Payout processed for {HOURS_LOST} hours lost.</p>
                      </div>
                    ) : (
                      <div className="mt-2 text-red-700">
                        <p className="font-medium text-2xl mt-3">₹{payoutAmount / 2}</p>
                        <p className="text-sm opacity-80 mt-1">⚠️ Under Review (Partial payout issued securely)</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Trust Score System */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Trust Score</h2>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" className="stroke-gray-100" strokeWidth="12" />
                  <motion.circle 
                    cx="64" cy="64" r="56" fill="none" 
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      trustScore >= 80 ? "stroke-green-500" : 
                      trustScore >= 50 ? "stroke-yellow-500" : "stroke-red-500"
                    )}
                    strokeWidth="12" 
                    strokeDasharray="351.86"
                    initial={{ strokeDashoffset: 351.86 }}
                    animate={{ strokeDashoffset: 351.86 - (351.86 * trustScore) / 100 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-4xl font-black">{trustScore}<span className="text-lg">%</span></div>
              </div>

              <div className={cn("px-4 py-1.5 rounded-full text-sm font-bold border", getScoreColor(trustScore))}>
                {trustScore >= 80 ? 'Safe' : trustScore >= 50 ? 'Medium Risk' : 'Flagged'}
              </div>
            </div>

            {/* Simulations Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Simulate Events</h2>
              
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-400">Environmental Triggers</p>
                <button 
                  onClick={() => simulateDisruption('rain')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Simulate Heavy Rain</span>
                  <CloudRain className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </button>
                <button 
                  onClick={() => simulateDisruption('aqi')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Simulate High AQI</span>
                  <Wind className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                </button>
                <button 
                  onClick={() => simulateDisruption('heat')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Simulate Extreme Heat</span>
                  <ThermometerSun className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                </button>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-3">AI Fraud Detection</p>
                  <button 
                    onClick={simulateFraud}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-red-500 bg-gray-50 hover:bg-red-50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Simulate Suspicious Activity</span>
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fraud Insights Panel (Bonus) */}
            <AnimatePresence>
              {suspiciousActivity && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg relative overflow-hidden"
                >
                  {/* bg decor */}
                  <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-800/50" />
                  
                  <div className="relative z-10">
                    <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Fraud Insights
                    </h2>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                        <Navigation className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Location Mismatch</p>
                          <p className="text-xs text-red-400/80 mt-0.5">Device GPS differs from network node.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-yellow-400 bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20">
                        <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Unusual Activity</p>
                          <p className="text-xs text-yellow-400/80 mt-0.5">High velocity between orders impossible.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
