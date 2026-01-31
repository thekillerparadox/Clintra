import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        addToast("Welcome back, John!", "success");
        onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-enter">
        
        {/* Brand Header */}
        <div className="bg-slate-900 px-8 py-8 text-center group cursor-default">
            <div className="flex justify-center mb-4">
                 <div className="h-16 w-16 bg-slate-800 rounded-2xl shadow-lg shadow-black/20 flex items-center justify-center border border-slate-700">
                    <Logo size={40} color1="text-primary-500" color2="text-primary-300" animated />
                 </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Clientra CRM</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to manage your pipeline.</p>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Work Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                            type="email" 
                            defaultValue="demo@clientra.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                            type="password" 
                            defaultValue="password"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" 
                            required 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                    Don't have an account? <a href="#" className="text-primary-600 hover:underline font-medium">Start 14-day free trial</a>
                </p>
            </div>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Secured with 256-bit encryption
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;