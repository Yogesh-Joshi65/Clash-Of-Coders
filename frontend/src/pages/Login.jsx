import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { login } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  const addLog = (message, data = null) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.log(logEntry, data || '');
    setDebugLog(prev => [...prev, logEntry]);
  };

  useEffect(() => {
    addLog("Login component mounted");
    addLog("Current localStorage user:", localStorage.getItem('user'));
    addLog("Current localStorage token:", localStorage.getItem('token'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugLog([]); // Clear previous logs

    addLog("🚀 LOGIN FORM SUBMITTED");
    addLog("Email:", formData.email);

    try {
      addLog("📡 Calling login API...");
      const response = await login(formData);
      
      addLog("✅ API Response received");
      addLog("Response object:", response);
      addLog("Response.data:", response.data);

      // For Axios, the actual data is in response.data
      const token = response.data?.token;
      const user = response.data?.user;

      addLog("Extracted token:", token);
      addLog("Extracted user:", user);

      if (!token) {
        addLog("❌ ERROR: No token found in response!");
        throw new Error("No token received from server");
      }

      addLog("💾 Saving to localStorage...");
      
      // Save token
      localStorage.setItem('token', token);
      addLog("Token saved");

      // Create user object
      const userObject = {
        _id: user?._id || user?.id || 'temp',
        username: user?.username || user?.name || formData.email.split('@')[0],
        email: user?.email || formData.email
      };

      addLog("User object to save:", userObject);

      // Save user
      localStorage.setItem('user', JSON.stringify(userObject));
      addLog("User saved to localStorage");

      // Verify immediately
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      addLog("Verification - user in storage:", savedUser);
      addLog("Verification - token in storage:", savedToken);

      if (!savedUser || !savedToken) {
        addLog("❌ ERROR: Data not found in localStorage after saving!");
        throw new Error("Failed to save to localStorage");
      }

      addLog("✅ Everything saved successfully!");
      addLog("🧭 Navigating to dashboard...");

      // Navigate
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);

    } catch (err) {
      addLog("❌ LOGIN ERROR");
      addLog("Error message:", err.message);
      addLog("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      addLog("Showing error to user:", errorMessage);
    } finally {
      setLoading(false);
      addLog("Login process completed (loading=false)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 font-sans text-white">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        {/* Login Form */}
        <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-slate-700">
          
          <div className="text-center mb-8">
            <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-slate-400 mt-2">Sign in to continue your battles</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/auth" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
              Create Account
            </Link>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-bold">Debug Console</h2>
          </div>
          
          <div className="bg-[#0f172a] rounded-lg p-4 h-[400px] overflow-y-auto font-mono text-xs">
            {debugLog.length === 0 ? (
              <div className="text-slate-500 text-center mt-8">
                Waiting for login attempt...
              </div>
            ) : (
              <div className="space-y-1">
                {debugLog.map((log, i) => (
                  <div key={i} className={`${
                    log.includes('❌') ? 'text-red-400' : 
                    log.includes('✅') ? 'text-green-400' : 
                    log.includes('🚀') || log.includes('🧭') ? 'text-blue-400' :
                    'text-slate-300'
                  }`}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button 
              onClick={() => {
                addLog("Manual check triggered");
                addLog("localStorage.user:", localStorage.getItem('user'));
                addLog("localStorage.token:", localStorage.getItem('token'));
              }}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
            >
              Check LocalStorage Now
            </button>
            
            <button 
              onClick={() => {
                localStorage.clear();
                addLog("localStorage cleared");
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 rounded text-sm transition-colors"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;