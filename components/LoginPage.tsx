
import React, { useState } from 'react';
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate validation logic for "purchased users"
    setTimeout(() => {
      if (email.length > 3 && accessCode.length >= 4) {
        onLogin(email);
      } else {
        setError('Acesso negado. Certifique-se de usar o e-mail da compra e um código válido.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-800/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-red-900 p-[1px] mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
              <Sparkles className="text-red-600" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2 tracking-tight uppercase">ANGO – PROMPT PD</h1>
          <p className="text-gray-500 text-sm">Acesso exclusivo para membros da elite de IA</p>
        </div>

        {/* Modal-style Container with thin white borders */}
        <div className="bg-[#0f0f0f]/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">E-mail de Compra</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Código de Acesso</label>
              <input
                type="password"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-700 text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-start gap-2 animate-pulse">
                <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar na Plataforma
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Não tem acesso? <a href="#" className="text-red-500 hover:text-red-400 font-semibold transition-colors">Adquira Agora o Seu</a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest leading-loose">
          2024 PLATAFORMA DESENVOLVIDA PELA ANGO-PROMPT PD - Todos os Direitos Reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;