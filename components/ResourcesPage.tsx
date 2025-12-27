
import React from 'react';
import { ExternalLink, Code, Layout, Globe, Cpu, ShoppingBag, Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { Section } from '../types';

interface Resource {
  id?: Section;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  isInternal?: boolean;
}

interface ResourcesPageProps {
  onNavigate: (section: Section) => void;
}

const RESOURCES: Resource[] = [
  {
    id: 'PromptGenerator',
    name: 'Ango – Prompt PD',
    category: 'Engenharia de Prompts',
    description: 'A nossa plataforma premium para dominar a arte de criar comandos de IA de alta performance.',
    icon: <Sparkles className="text-red-500" />,
    url: '#',
    isInternal: true
  },
  {
    name: 'Google AI Studio',
    category: 'Desenvolvimento de IA',
    description: 'Ambiente oficial do Google para prototipar e testar modelos Gemini com as APIs mais recentes.',
    icon: <Cpu className="text-blue-500" />,
    url: 'https://aistudio.google.com/'
  },
  {
    name: 'Dyad.sh',
    category: 'Infraestrutura',
    description: 'Serviços de infraestrutura e deployment otimizados para aplicações modernas.',
    icon: <Terminal className="text-purple-500" />,
    url: 'https://dyad.sh/'
  },
  {
    name: 'Lovable',
    category: 'No-Code / Low-Code',
    description: 'Crie aplicações web completas a partir de prompts de IA de forma intuitiva.',
    icon: <Layout className="text-pink-500" />,
    url: 'https://lovable.dev/'
  },
  {
    name: 'Vercel',
    category: 'Hosting & Frontend',
    description: 'A plataforma padrão ouro para hospedar aplicações React e Next.js com velocidade extrema.',
    icon: <Globe className="text-white" />,
    url: 'https://vercel.com/'
  },
  {
    name: 'Netlify',
    category: 'Hosting & Automation',
    description: 'Automatize o workflow de deploy das suas aplicações web com simplicidade e robustez.',
    icon: <Globe className="text-teal-500" />,
    url: 'https://netlify.com/'
  },
  {
    name: 'Shopify',
    category: 'E-commerce',
    description: 'A maior plataforma do mundo para criar, gerir e escalar lojas online profissionais.',
    icon: <ShoppingBag className="text-green-500" />,
    url: 'https://www.shopify.com/'
  },
  {
    name: 'Recursos de Código',
    category: 'Desenvolvimento',
    description: 'Repositórios e bibliotecas essenciais para acelerar o desenvolvimento do seu ecossistema digital.',
    icon: <Code className="text-orange-500" />,
    url: '#'
  }
];

const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const handleAction = (res: Resource) => {
    if (res.isInternal && res.id) {
      onNavigate(res.id);
    } else if (res.url !== '#') {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header Compacto e Elevado */}
      <div className="mb-8 md:mb-12 text-center relative flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full text-red-500 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-4 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          📚 Centro de Recursos
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-white uppercase mb-3 tracking-tighter">Plataformas de Elite</h2>
        <p className="text-gray-500 font-medium max-w-xl text-xs md:text-sm leading-relaxed px-4">
          Ferramentas essenciais selecionadas para escalar o seu negócio. Todos os links abrem em tela cheia em aba separada.
        </p>
      </div>

      {/* Grid Flexível que centraliza a última linha quando incompleta */}
      <div className="flex flex-wrap justify-center gap-5 md:gap-6">
        {RESOURCES.map((res, index) => (
          <div
            key={index}
            className="group bg-[#141414] border border-white/5 rounded-[28px] md:rounded-[36px] p-6 md:p-7 transition-all duration-300 hover:border-red-600/30 hover:bg-[#1a1a1a] hover:translate-y-[-4px] flex flex-col shadow-2xl w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                {React.cloneElement(res.icon as React.ReactElement, { size: 22 })}
              </div>
              {res.url !== '#' && !res.isInternal && (
                <div className="p-2 bg-white/5 rounded-xl opacity-40 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-600/5 px-2.5 py-1 rounded-lg border border-red-600/10">
                {res.category}
              </span>
            </div>
            
            <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
              {res.name}
            </h3>
            
            <p className="text-gray-600 text-[11px] md:text-xs leading-relaxed mb-6 flex-1">
              {res.description}
            </p>
            
            <button
              onClick={() => handleAction(res)}
              className="w-full bg-white/5 hover:bg-red-600 group-hover:bg-red-600/10 group-hover:hover:bg-red-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5"
            >
              {res.isInternal ? 'Abrir Sistema' : 'Aceder Agora'}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-red-600/10 to-transparent border border-white/5 rounded-[28px] md:rounded-[36px] text-center relative overflow-hidden group">
        <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2">Dúvidas sobre integração?</h4>
        <p className="text-gray-500 font-medium mb-6 max-w-md mx-auto text-xs">
          A nossa comunidade de especialistas ajuda-o a dominar estas ferramentas.
        </p>
        <button 
          onClick={() => onNavigate('Dúvidas')}
          className="bg-red-600 hover:bg-red-700 text-white font-black py-3 px-8 rounded-xl shadow-xl shadow-red-600/20 transition-all uppercase tracking-widest text-[9px]"
        >
          Consultar Suporte
        </button>
      </div>
    </div>
  );
};

export default ResourcesPage;
