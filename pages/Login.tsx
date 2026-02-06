import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck, CheckCircle, User, Github, Command, Star, Check, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      agreed: false
  });
  
  const { addToast } = useToast();

  // Parallax Logic for Right Panel
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password Strength Logic
  const getPasswordStrength = (pass: string) => {
      let score = 0;
      if (pass.length > 7) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[0-9a-zA-Z]/.test(pass) === false) score++;
      return score;
  };
  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !formData.agreed) {
        addToast("Please agree to the Terms of Service", "error");
        return;
    }

    if (!isLogin && strength < 2) {
        addToast("Please choose a stronger password", "error");
        return;
    }

    setIsLoading(true);
    
    // Simulate realistic auth delay
    setTimeout(() => {
        setIsLoading(false);
        addToast(isLogin ? "Welcome back!" : "Account created successfully!", "success");
        onLogin();
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setFormData({ ...formData, password: '', agreed: false });
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* === LEFT PANEL: Form === */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 animate-enter bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Logo size={36} />
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Clientra</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    {isLogin ? 'Welcome back' : 'Start your free trial'}
                </h1>
                <p className="text-slate-500">
                    {isLogin ? 'Enter your details to access your workspace.' : 'Join 10,000+ freelancers managing better deals.'}
                </p>
            </div>

            {/* Social Login Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white text-slate-600 shadow-sm focus:ring-2 focus:ring-slate-100 outline-none">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white text-slate-700 shadow-sm focus:ring-2 focus:ring-slate-100 outline-none">
                        <Github className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white text-slate-700 shadow-sm focus:ring-2 focus:ring-slate-100 outline-none">
                        <Command className="h-5 w-5" />
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">Or continue with email</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Field (Animated Expand) */}
                <div className={`transition-all duration-300 ease-spring overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                            placeholder="e.g. Sarah Miller"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required={!isLogin} 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                            type="email" 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded hover:bg-slate-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {!isLogin && formData.password && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-enter">
                            <div className="flex gap-1 h-1.5 mb-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? (strength < 2 ? 'bg-rose-500' : strength < 4 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-medium">Strength</span>
                                <span className={`font-bold ${strength < 2 ? 'text-rose-500' : strength < 4 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                    {strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong'}
                                </span>
                            </div>
                            <ul className="mt-2 space-y-1">
                                <li className={`text-[10px] flex items-center gap-1.5 ${formData.password.length > 7 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    <Check className="h-3 w-3" /> At least 8 characters
                                </li>
                                <li className={`text-[10px] flex items-center gap-1.5 ${/[0-9]/.test(formData.password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    <Check className="h-3 w-3" /> Contains a number
                                </li>
                            </ul>
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-between items-center mt-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4" />
                                 <span className="text-xs text-slate-600 font-medium">Remember me</span>
                             </label>
                            <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">Forgot password?</a>
                        </div>
                    )}
                </div>

                {/* Terms Checkbox */}
                {!isLogin && (
                    <div className="flex items-start gap-3 pt-2">
                        <div className="flex items-center h-5">
                            <input 
                                id="terms" 
                                type="checkbox" 
                                checked={formData.agreed}
                                onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                            />
                        </div>
                        <label htmlFor="terms" className="text-xs text-slate-500 leading-snug">
                            I agree to the <a href="#" className="text-slate-900 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>.
                        </label>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed shadow-lg shadow-primary-200/50 hover:shadow-primary-600/30 mt-6"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            {isLogin ? 'Verifying...' : 'Creating Account...'}
                        </>
                    ) : (
                        <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                 <p className="text-sm text-slate-500 font-medium">
                    {isLogin ? "New to Clientra?" : "Already have an account?"}{" "}
                    <button 
                        onClick={toggleMode}
                        className="text-primary-600 font-bold hover:underline transition-colors focus:outline-none ml-1"
                    >
                        {isLogin ? 'Sign up for free' : 'Sign in'}
                    </button>
                </p>
            </div>
          </div>
          
          {/* Footer Trust */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> SOC2 Certified</span>
          </div>
      </div>

      {/* === RIGHT PANEL: Visuals (Desktop Only) === */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
           
           {/* Interactive Parallax Background */}
           <div className="absolute inset-0 z-0">
                <div 
                    className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-900/40 rounded-full blur-[100px] mix-blend-screen transition-transform duration-100 ease-out"
                    style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
                />
                <div 
                    className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-900/30 rounded-full blur-[120px] mix-blend-screen transition-transform duration-100 ease-out"
                    style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
                />
                <div 
                    className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-fuchsia-900/20 rounded-full blur-[80px] mix-blend-screen transition-transform duration-100 ease-out"
                    style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 40}px)` }}
                />
           </div>
           
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

           {/* Content Card */}
           <div className="relative z-10 max-w-lg w-full">
               
               {/* Testimonial */}
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                   {/* Quote Mark */}
                   <div className="absolute top-6 left-6 text-white/10 font-serif text-6xl leading-none">"</div>
                   
                   <div className="relative z-10">
                       <div className="flex gap-1 mb-6 text-amber-400">
                          {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" className="h-5 w-5" />)}
                       </div>
                       <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 tracking-tight">
                          "Clientra isn't just a CRM; it's my agency's brain. The <span className="text-primary-300">pipeline intelligence</span> helps us close 30% more deals without the stress."
                       </p>
                       <div className="flex items-center justify-between border-t border-white/10 pt-6">
                           <div className="flex items-center gap-4">
                               <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=random" className="h-12 w-12 rounded-full border-2 border-white/20" alt="Testimonial" />
                               <div>
                                   <div className="text-white font-bold text-base">Sarah Chen</div>
                                   <div className="text-slate-400 font-medium text-sm">Founder, Apex Digital</div>
                               </div>
                           </div>
                           <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                               <ArrowRight className="h-5 w-5 text-white -rotate-45" />
                           </div>
                       </div>
                   </div>
               </div>

               {/* Floating Badges (Parallax) */}
               <div 
                  className="absolute -top-12 -right-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse-soft"
                  style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * 15}px)` }}
               >
                   <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                       <CheckCircle2 className="h-6 w-6" />
                   </div>
                   <div>
                       <div className="text-white font-bold text-sm">Deal Won</div>
                       <div className="text-emerald-300 text-xs font-medium">+$12,500</div>
                   </div>
               </div>

           </div>
      </div>

    </div>
  );
};

export default Login;