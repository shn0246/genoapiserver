import { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import TrendAnalysis from './pages/tagtrends';

const App = () => {
  const [selectedPlant, setSelectedPlant] = useState("Yamanlı");
  const plants = ["Yamanlı", "Doğançay", "Kandil", "Sarıyarlar"];

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* HEADER / NAVIGATION */}
        <nav className="bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-10">
            {/* LOGO */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                <div className="text-slate-800 font-black text-xl tracking-tighter">
                    GENO<span className="text-blue-600">API</span>
                </div>
            </div>

            {/* MENÜ LİNKLERİ */}
            <div className="flex gap-2">
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Dashboard
              </NavLink>

              <NavLink 
                to="/trends" 
                className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Trend İzleme
              </NavLink>

            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* SANTRAL SEÇİCİ */}
            <div className="flex flex-col items-end border-r border-slate-200 pr-6 mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aktif Santral</span>
                <select 
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 cursor-pointer hover:bg-slate-100 transition-colors outline-none"
                >
                    {plants.map(plant => (
                        <option key={plant} value={plant}>{plant} HEPP</option>
                    ))}
                </select>
            </div>

            {/* STATUS PANEL */}
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bağlantı</span>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-600">PI Server - Online</span>
                </div>
            </div>
          </div>
        </nav>

        {/* ANA İÇERİK ALANI */}
        <main className="flex-grow container mx-auto py-6 px-4 md:px-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard selectedPlant={selectedPlant} />} />
            
            {/* TREND İZLEME - GÜNCEL ROUTE YAPISI */}
            {/* Hem ana sayfa hem de parametreli hali aynı bileşeni çağırıyor */}
            <Route path="/trends" element={<TrendAnalysis />} />
            <Route path="/trends/:tagName" element={<TrendAnalysis />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center mt-auto">
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                © {new Date().getFullYear()} Enerjisa Üretim - Genco API Monitoring System
            </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;