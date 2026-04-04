import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Heart, ArrowRight, CloudRain, ThermometerSun } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">DeliverySafe</span>
        </div>
        <Link 
          to="/dashboard" 
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
        >
          Launch Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Parametric Insurance 2.0</span>
          </div>
          <h1 className="text-7xl font-black leading-[0.9] tracking-tighter mb-8">
            Protecting your <span className="text-emerald-600">Daily Hustle</span> automatically.
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
            The first AI-powered insurance platform for delivery partners. We monitor weather, pollution, and disruptions so you never lose a day's earnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/dashboard" 
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200"
            >
              Get Started for ₹20/week <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-400 blur-[120px] opacity-20 rounded-full -z-10" />
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-700">
             <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase">Live Weather Monitor</div>
             </div>
             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <CloudRain className="w-8 h-8 text-blue-500" />
                    <div>
                        <p className="text-sm font-bold text-blue-900">Heavy Rainfall Detected</p>
                        <p className="text-xs text-blue-600">Payout threshold exceeded (+50mm)</p>
                    </div>
                    <div className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-black">ACTIVE</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100 opacity-50">
                    <ThermometerSun className="w-8 h-8 text-orange-500" />
                    <div>
                        <p className="text-sm font-bold text-orange-900">Heat Alert</p>
                        <p className="text-xs text-orange-600">Current temp: 32°C</p>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Instant Payout</p>
                            <p className="text-4xl font-black text-gray-900">₹320.00</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Heart className="text-emerald-600 w-6 h-6 fill-emerald-600" />
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Social Proof */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">Trusted by 100+ Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="text-3xl font-black text-center">Zomato</div>
                <div className="text-3xl font-black text-center">Swiggy</div>
                <div className="text-3xl font-black text-center">Zepto</div>
                <div className="text-3xl font-black text-center">Blinkit</div>
            </div>
        </div>
      </section>
    </div>
  );
}
