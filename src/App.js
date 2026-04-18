import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Plane,
  Users,
  DollarSign,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// 1. إعداد الاتصال بـ Supabase
// استبدل الروابط أدناه بالقيم الخاصة بمشروعك من إعدادات Supabase (Project Settings > API)
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  // حالات النظام (States)
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  // حالات حقول الإدخال (Form States)
  const [formData, setFormData] = useState({
    name: "",
    hotel_name: "",
    start_date: "",
    itinerary: "",
  });

  // جلب البيانات عند فتح التطبيق
  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTrips(data);
  }

  // دالة حفظ الرحلة في قاعدة البيانات
  const handleSaveTrip = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("trips").insert([formData]);

    if (error) {
      alert("حدث خطأ أثناء الحفظ: " + error.message);
    } else {
      setShowModal(false);
      setFormData({ name: "", hotel_name: "", start_date: "", itinerary: "" });
      fetchTrips(); // تحديث القائمة فوراً
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-left" dir="ltr">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="flex items-center mb-10 space-x-2">
          <Plane className="text-blue-400" />
          <h1 className="text-xl font-bold italic tracking-tight">OmniTour</h1>
        </div>
        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<Plane size={20} />} label="Trips" />
          <NavItem icon={<Users size={20} />} label="Travelers" />
          <NavItem icon={<DollarSign size={20} />} label="Expenses" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800">
              System Dashboard
            </h2>
            <p className="text-slate-500 font-medium">
              Monitoring {trips.length} active trips
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center space-x-2 font-bold"
          >
            <span>+ Create New Trip</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            title="Total Trips"
            value={trips.length}
            color="border-b-blue-500"
          />
          <StatsCard
            title="Active Travelers"
            value="--"
            color="border-b-green-500"
          />
          <StatsCard
            title="Pending Expenses"
            value="0.00"
            color="border-b-amber-500"
          />
        </div>

        {/* Trip List / Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-6">
            Recent Trips Activity
          </h3>

          {trips.length === 0 ? (
            <div className="py-20 text-center">
              <Plane size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">
                No trips found in the database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 font-bold">
                      {new Date(trip.start_date).getDate()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{trip.name}</h4>
                      <p className="text-xs text-slate-500">
                        {trip.hotel_name}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black mb-6 text-slate-800">
              New Expedition
            </h3>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Trip Display Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Baghdad Group - Winter 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={formData.hotel_name}
                    onChange={(e) =>
                      setFormData({ ...formData, hotel_name: e.target.value })
                    }
                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                    placeholder="Hotel Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Itinerary / Program
                </label>
                <textarea
                  value={formData.itinerary}
                  onChange={(e) =>
                    setFormData({ ...formData, itinerary: e.target.value })
                  }
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition h-28"
                  placeholder="Describe the main events..."
                ></textarea>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                <span>
                  {loading ? "Saving to Database..." : "Finalize & Save"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// UI Components
function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon} <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}

function StatsCard({ title, value, color }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${color}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  );
}
