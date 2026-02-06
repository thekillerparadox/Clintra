import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import DealDetail from './pages/DealDetail';
import DealsList from './pages/DealsList';
import ClientProfile from './pages/ClientProfile';
import ClientsList from './pages/ClientsList';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Activities from './pages/Activities';
import Automations from './pages/Automations';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Login from './pages/Login';
import QuickCapture from './components/QuickCapture';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './components/Toast';
import { Plus, Menu, Bell, Search as SearchIcon, FileText } from 'lucide-react';

// Shell Layout for Authenticated Users
const AuthenticatedLayout: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    // Use h-dvh for better mobile support (dynamic viewport height)
    <div className="flex h-screen h-dvh bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 w-full">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                    <Menu className="h-5 w-5" />
                </button>
                
                {/* Search Bar - Matches Reference */}
                <div 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-lg cursor-pointer transition-colors w-full max-w-lg"
                >
                    <SearchIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Search deals, contacts, or companies...</span>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
                </button>

                <button 
                    onClick={() => setIsQuickCaptureOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
                >
                    <Plus className="h-4 w-4" /> New Deal
                </button>
                
                {/* Mobile FAB replacement in header */}
                <button 
                    onClick={() => setIsQuickCaptureOpen(true)}
                    className="sm:hidden flex items-center justify-center bg-primary-600 text-white p-2 rounded-lg"
                >
                     <Plus className="h-5 w-5" />
                </button>

                <div className="h-9 w-9 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 border border-orange-200 cursor-pointer hidden sm:flex">
                    <FileText className="h-5 w-5" />
                </div>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 scrollbar-stable">
            <div className="max-w-[1600px] mx-auto min-h-full pb-20 lg:pb-0">
                {children}
            </div>
        </div>
        
        {/* Overlays */}
        <QuickCapture isOpen={isQuickCaptureOpen} onClose={() => setIsQuickCaptureOpen(false)} />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authState = localStorage.getItem('clientra_auth');
    if (authState === 'true') {
        setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
      setIsAuthenticated(true);
      localStorage.setItem('clientra_auth', 'true');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('clientra_auth');
  };

  return (
    <ToastProvider>
        <HashRouter>
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } />
            
            <Route path="/*" element={
                isAuthenticated ? (
                    <AuthenticatedLayout onLogout={handleLogout}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/pipeline" element={<Pipeline />} />
                            <Route path="/deals" element={<DealsList />} />
                            <Route path="/deals/:id" element={<DealDetail />} />
                            
                            <Route path="/contacts" element={<ClientsList />} />
                            <Route path="/contacts/:id" element={<ClientProfile />} />
                            <Route path="/clients" element={<Navigate to="/contacts" replace />} />

                            <Route path="/tasks" element={<Tasks />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/activities" element={<Activities />} />
                            <Route path="/automations" element={<Automations />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthenticatedLayout>
                ) : (
                    <Navigate to="/login" replace />
                )
            } />
        </Routes>
        </HashRouter>
    </ToastProvider>
  );
};

export default App;