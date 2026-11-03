import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle2, Cpu, Activity, Globe } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('请输入账号和密码');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050b14] select-none font-sans text-slate-100">
      {/* Left Column: Smart City Governance Visual Showcase */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-[#09152b] via-[#050b14] to-[#03070d]">
        {/* Background Decorative Tech Grid & Glowing Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#080e1c] rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
              智慧城市综合治理平台
            </h2>
            <p className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase">
              Smart City Comprehensive Governance Platform
            </p>
          </div>
        </div>

        {/* Center Hero Visual Showcase with Smart City Image / Graphic Illustration */}
        <div className="relative z-10 my-auto py-8">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#091124]/80 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent z-10 opacity-80" />
            
            {/* High fidelity Unsplash Smart City / Operations Center Image */}
            <img 
              src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1400&auto=format&fit=crop" 
              alt="智慧城市综合治理指挥中心" 
              className="w-full h-[360px] xl:h-[400px] object-cover object-center transform group-hover:scale-105 transition duration-700 opacity-75"
            />

          </div>
        </div>

        {/* Footer Features */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>多级协同指挥</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>AI 自动巡检</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>数据安全闭环</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">© 2026 Smart City Governance All Rights Reserved</span>
        </div>
      </div>

      {/* Right Column: Login Card Window */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative bg-[#070d18]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">智慧城市综合治理平台</h2>
              <p className="text-[10px] text-cyan-400 font-mono">Smart City Command Platform</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>安全认证通道</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              欢迎登录系统
            </h1>
            <p className="text-xs lg:text-sm text-slate-400">
              请输入您的管理账号与密码进入综合治理指挥中心
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 pt-2">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                登录账号
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号 (例如: admin)"
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1324] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  登录密码
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码 (例如: 123456)"
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1324] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400" />
                <span>记住登录状态</span>
              </label>
              <span className="text-cyan-400 hover:underline cursor-pointer">忘记密码?</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>立即登录系统</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
