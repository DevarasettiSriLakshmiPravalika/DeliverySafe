import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Wind, 
  ThermometerSun, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';

const API_BASE_URL = 'http://localhost:8080/api';

interface User {
  id: number;
  name: string;
  hourlyEarnings: number;
  workingHoursPerDay: number;
}

export default function Activity() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/init`, { method: 'POST' });
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to init user", err);
      }
    };
    init();
  }, []);

  const activities = [
    {
      id: 1,
      type: 'weather',
      title: 'Extreme Heat Recorded',
      desc: 'Temperature hit 46°C in your zone. Safety trigger activated.',
      time: '2 hours ago',
      icon: <ThermometerSun className="text-orange-500" />,
      status: 'payout-triggered',
      location: 'T. Nagar, Chennai'
    },
    {
      id: 2,
      type: 'system',
      title: 'Trust Score Updated',
      desc: 'Your safety trust score increased by 2% due to consistent GPS signals.',
      time: '5 hours ago',
      icon: <ShieldCheck className="text-emerald-500" />,
      status: 'completed',
      location: 'System'
    },
    {
      id: 3,
      type: 'weather',
      title: 'AQI Alert',
      desc: 'Air Quality Index reached 154 (Unhealthy). Monitoring for threshold (300).',
      time: 'Yesterday',
      icon: <Wind className="text-gray-400" />,
      status: 'monitoring',
      location: 'Velachery, Chennai'
    },
    {
      id: 4,
      type: 'payout',
      title: 'Payout Processed',
      desc: '₹320.00 transferred to your bank account ending in 4242.',
      time: 'Yesterday',
      icon: <AlertCircle className="text-emerald-500" />,
      status: 'completed',
      location: 'Banking'
    }
  ];

  return (
    <Layout user={user} status="Active">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight">Timeline</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Clock className="w-4 h-4" /> Real-time updates
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.map((item) => (
              <div key={item.id} className="p-8 hover:bg-gray-50 transition-colors flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 leading-none">{item.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> {item.location}
                    </div>
                    <div className={cn(
                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                        item.status === 'payout-triggered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        item.status === 'completed' ? "bg-gray-50 text-gray-500 border-gray-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                        {item.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 text-center">
            <button className="text-sm font-bold text-emerald-600 hover:underline">Load older activities</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
