
import React, { useState, useRef, useEffect } from 'react';
import { Section, Post, UserRole, User, ReactionType, Comment, AppNotification } from './types';
import Sidebar from './components/Sidebar';
import PostEditor from './components/PostEditor';
import PostCard from './components/PostCard';
import LoginPage from './components/LoginPage';
import AIChatbot from './components/AIChatbot';
import ResourcesPage from './components/ResourcesPage';
import PromptGenerator from './components/PromptGenerator';
import MessagesSection from './components/MessagesSection';
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  MessageSquare, 
  UserCircle, 
  ChevronDown, 
  Camera, 
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  User as UserIcon,
  AlignLeft,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  X
} from 'lucide-react';

const INITIAL_USER_DATA: User = {
  id: 'u1',
  name: 'Gonçalo Almeida',
  email: 'goncalo.almeida@ango-ia.com',
  role: UserRole.PREMIUM,
  avatar: 'https://picsum.photos/seed/goncalo/100',
  followingIds: ['admin'],
  bio: 'Especialista em Engenharia de Prompts e IA Generativa.',
  city: 'Lisboa',
  area: 'IA & Marketing'
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'success',
    title: 'Acesso Premium Ativo',
    description: 'A tua conta foi atualizada para o plano Elite com sucesso.',
    timestamp: Date.now() - 1000 * 60 * 45,
    isRead: false
  },
  {
    id: 'n2',
    type: 'info',
    title: 'Novo Curso de Gemini',
    description: 'O módulo de Prompt Engineering Avançado já está disponível.',
    timestamp: Date.now() - 1000 * 60 * 180,
    isRead: false
  },
  {
    id: 'n3',
    type: 'message',
    title: 'Feedback de Mentor',
    description: 'O mentor respondeu à tua dúvida sobre encadeamento de prompts.',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    isRead: true
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('Feed');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [headline] = useState("Transforme ideias em produtos, marcas e vendas com IA.");
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER_DATA);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [targetChatUserId, setTargetChatUserId] = useState<string | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio || '',
    city: currentUser.city || '',
    area: currentUser.area || '',
    avatar: currentUser.avatar
  });

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      userId: 'admin',
      userName: 'Admin ANGO',
      userAvatar: 'https://picsum.photos/seed/admin/100',
      type: 'text',
      content: 'Bem-vindos à nova atualização da plataforma! Já exploraram a secção de recursos?',
      timestamp: Date.now() - 3600000,
      visibility: 'public',
      likes: 24,
      reactions: { like: 15, love: 5, hug: 2, fire: 3, rocket: 1, photo: 0, haha: 2, wow: 1, sad: 1, angry: 0 },
      views: 142,
      commentsCount: 2,
      comments: [
        { id: 'c1', userId: 'u2', userName: 'Marta Silva', userAvatar: 'https://picsum.photos/seed/marta/100', content: 'Incrível! Gostei muito das novidades.', timestamp: Date.now() - 1800000, reactions: { like: 2 }, userReaction: undefined }
      ]
    },
    {
      id: 'p2',
      userId: 'u2',
      userName: 'Marta Silva',
      userAvatar: 'https://picsum.photos/seed/marta/100',
      type: 'image',
      content: 'Acabei de gerar este prompt de marketing. Os resultados foram incríveis!',
      timestamp: Date.now() - 7200000,
      visibility: 'premium',
      likes: 89,
      reactions: { like: 50, love: 20, hug: 15, fire: 30, rocket: 10, photo: 5, haha: 10, wow: 5, sad: 4, angry: 0 },
      views: 567,
      commentsCount: 0,
      comments: []
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleViewPost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, views: p.views + 1 } : p
    ));
  };

  const handlePublishPost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: postData.type || 'text',
      content: postData.content || '',
      mediaUrl: postData.mediaUrl,
      timestamp: Date.now(),
      visibility: postData.visibility || 'members',
      likes: 0,
      reactions: { like: 0, love: 0, hug: 0, fire: 0, rocket: 0, photo: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      views: 0,
      commentsCount: 0,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      const updatedUser: User = {
        ...currentUser,
        name: profileForm.name,
        email: profileForm.email,
        bio: profileForm.bio,
        city: profileForm.city,
        area: profileForm.area,
        avatar: profileForm.avatar
      };
      setCurrentUser(updatedUser);
      setIsSavingProfile(false);
      setActiveSection('Feed');
    }, 1200);
  };

  const isFullscreen = activeSection === 'PromptGenerator';

  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'following') return currentUser.followingIds.includes(post.userId);
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'alert': return <AlertCircle size={16} className="text-red-500" />;
      case 'message': return <MessageSquare size={16} className="text-purple-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'Feed':
        return (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full px-4">
            <header className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 tracking-tight text-red-600 uppercase leading-tight">
                BEM-VINDO À PLATAFORMA <br /> ANGO – PROMPT PD
              </h2>
              <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed mb-6 mx-auto max-w-xl">
                {headline}
              </p>
              <div className="flex justify-center gap-2 bg-white/5 p-1 rounded-2xl w-fit mx-auto border border-white/10">
                <button onClick={() => setFeedFilter('all')} className={`px-6 md:px-8 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${feedFilter === 'all' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>Todos</button>
                <button onClick={() => setFeedFilter('following')} className={`px-6 md:px-8 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${feedFilter === 'following' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>A Seguir</button>
              </div>
            </header>
            <PostEditor onPublish={handlePublishPost} />
            <div className="space-y-4 pb-20">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUserId={currentUser.id}
                  isFollowing={currentUser.followingIds.includes(post.userId)}
                  onView={() => handleViewPost(post.id)}
                  onMessageUser={() => {
                    setTargetChatUserId(post.userId);
                    setActiveSection('Mensagens');
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'Mensagens':
        return <MessagesSection currentUser={currentUser} initialTargetUserId={targetChatUserId} />;
      case 'PromptGenerator':
        return <PromptGenerator />;
      case 'Recursos':
        return <ResourcesPage onNavigate={setActiveSection} />;
      case 'Meu Perfil':
        return (
          <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <UserCircle size={14} /> Definições de Conta
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">Meu Perfil</h2>
              <p className="text-gray-500 font-medium text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Personalize o seu perfil e torne-se mais visível na comunidade da elite de IA.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-28 h-28 md:w-36 md:h-36 rounded-[32px] md:rounded-[44px] cursor-pointer overflow-hidden border-4 border-red-600/20 hover:border-red-600 transition-all shadow-2xl shadow-red-600/10"
                >
                  <img src={profileForm.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Avatar" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-[7px] md:text-[8px] font-black text-white uppercase tracking-widest text-center px-4">Alterar Foto</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-4">Clique no ícone para fazer upload da sua foto</p>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-[40px] md:rounded-[56px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                  {/* Nome Completo - Alargado (Span 2) */}
                  <div className="md:col-span-2 space-y-2.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-2"><UserIcon size={14} className="text-red-600" /> Nome Completo</label>
                    <input type="text" placeholder="Ex.: Jonce João Pedro Domingos" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-red-600/50 outline-none transition-all" />
                  </div>

                  {/* Bio - Já alargado (Span 2) */}
                  <div className="md:col-span-2 space-y-2.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-2"><AlignLeft size={14} className="text-red-600" /> Bio</label>
                    <textarea value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white focus:border-red-600/50 outline-none transition-all min-h-[120px] resize-none" />
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-2"><MapPin size={14} className="text-red-600" /> Cidade</label>
                    <input type="text" placeholder="Ex.: Malanje" value={profileForm.city} onChange={(e) => setProfileForm({...profileForm, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-red-600/50 outline-none transition-all" />
                  </div>

                  {/* Área de Actuação */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-2"><Briefcase size={14} className="text-red-600" /> Área de Actuação</label>
                    <input type="text" placeholder="Ex.: Web Design" value={profileForm.area} onChange={(e) => setProfileForm({...profileForm, area: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-red-600/50 outline-none transition-all" />
                  </div>

                  {/* E-mail - Abaixo de Cidade e Alargado (Span 2) */}
                  <div className="md:col-span-2 space-y-2.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-2"><Mail size={14} className="text-red-600" /> E-mail</label>
                    <input type="email" placeholder="Ex.: angopromport@gmail.com" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-red-600/50 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="mt-12 flex justify-center">
                  <button type="submit" disabled={isSavingProfile} className="w-full md:w-auto min-w-[280px] bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50">
                    {isSavingProfile ? <><Loader2 className="animate-spin" size={18} /> Guardando...</> : <><Check size={18} /> Guardar Alterações</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
             <h3 className="text-2xl font-black text-white uppercase mb-4">{activeSection}</h3>
             <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 overflow-x-hidden flex">
      {!isFullscreen && (
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          isMobileOpen={isMobileSidebarOpen}
          toggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main className={`${!isFullscreen ? 'md:ml-64' : ''} min-h-screen flex flex-col flex-1 transition-all duration-500 relative`}>
        {isFullscreen && (
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        )}

        <header className={`sticky top-0 z-40 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 ${isFullscreen ? 'bg-transparent border-transparent' : 'bg-[#0a0a0a]/80 backdrop-blur-xl'}`}>
          <div className="flex items-center gap-4">
            {!isFullscreen ? (
              <>
                <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden text-gray-400 p-2"><Menu size={20} /></button>
                <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5 w-64">
                  <Search size={16} className="text-gray-500" />
                  <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none text-sm w-full text-white outline-none" />
                </div>
              </>
            ) : (
              <button onClick={() => setActiveSection('Feed')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 transition-all active:scale-95 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Voltar ao Dashboard</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sistema de Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className={`p-3 rounded-2xl transition-all relative ${isNotificationsOpen ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-600 text-[9px] font-black text-white flex items-center justify-center rounded-full border-2 border-[#0a0a0a] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[380px] bg-[#0f0f0f] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Notificações</h3>
                    <button onClick={markAllNotificationsAsRead} className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest">Limpar Tudo</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-5 border-b border-white/5 flex gap-4 transition-all cursor-pointer hover:bg-white/5 ${notif.isRead ? 'opacity-40' : 'bg-red-600/5'}`}
                      >
                        <div className="mt-1 shrink-0">{getNotificationIcon(notif.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between gap-2 mb-1">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{notif.title}</h4>
                            <span className="text-[8px] text-gray-600 flex items-center gap-1 font-bold whitespace-nowrap uppercase"><Clock size={10} /> Há pouco</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{notif.description}</p>
                        </div>
                        {!notif.isRead && <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></div>}
                      </div>
                    )) : (
                      <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                        <Bell size={32} className="text-gray-800" />
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Sem novas notificações</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white/5 text-center">
                    <button className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white">Ver histórico completo</button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setActiveSection('Mensagens')} className={`p-3 rounded-2xl transition-all relative ${activeSection === 'Mensagens' ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-white/5'}`}>
              <MessageSquare size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-[#0a0a0a]"></span>
            </button>

            <div className="h-8 w-[1px] bg-white/5 mx-1 md:mx-2"></div>

            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 p-1 pl-1 pr-4 bg-white/5 rounded-2xl border border-white/5">
                <img src={currentUser.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 border-red-600 object-cover" alt="User" />
                <ChevronDown size={12} className={`text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#0f0f0f] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden py-3 backdrop-blur-2xl">
                   <button onClick={() => { setActiveSection('Meu Perfil'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-4 px-5 py-3.5 text-xs font-black text-gray-400 hover:text-white hover:bg-red-600 transition-all uppercase tracking-widest">
                     <UserCircle size={18} /> Meu Perfil
                   </button>
                   <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3.5 text-xs font-black text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest">
                     <LogOut size={18} /> Sair
                   </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={`flex-1 py-6 md:py-8`}>
          {renderContent()}
        </section>
      </main>
      <AIChatbot />
    </div>
  );
};

export default App;
