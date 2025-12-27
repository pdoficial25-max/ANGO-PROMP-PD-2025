
import React, { useState, useRef } from 'react';
import { Post, Comment, ReactionType } from '../types';
import { REACTION_MAP } from '../constants';
import { MessageCircle, Share2, MoreHorizontal, Send, Eye, X, Calendar, User as UserIcon, ThumbsUp, CheckCircle2, UserPlus, UserMinus, Edit2, Trash2, Check, Play, Heart, MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  isFollowing: boolean;
  onReaction?: (type: ReactionType) => void;
  onCommentReaction?: (commentId: string, type: ReactionType) => void;
  onView?: () => void;
  onAddComment?: (content: string) => void;
  onFollow?: () => void;
  onEditPost?: (content: string) => void;
  onDeletePost?: () => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onMessageUser?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, currentUserId, isFollowing, onReaction, onCommentReaction, onView, onAddComment, onFollow, onEditPost, onDeletePost, onEditComment, onDeleteComment, onMessageUser 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState(post.content);
  const [isShared, setIsShared] = useState(false);
  
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [activeCommentMenuId, setActiveCommentMenuId] = useState<string | null>(null);

  const menuTimeoutRef = useRef<number | null>(null);
  const commentMenuTimeoutRef = useRef<number | null>(null);

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const handleOpenView = () => {
    if (onView) onView();
    setIsViewing(true);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) onAddComment(commentText);
    setCommentText('');
  };

  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 3000);
  };

  const totalReactions = (Object.values(post.reactions || {}) as number[]).reduce((a, b) => a + b, 0);

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return;
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShowReactionMenu(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => setShowReactionMenu(false), 500);
  };

  // Reações para Comentários
  const handleCommentReactionEnter = (commentId: string) => {
    if (window.innerWidth < 1024) return;
    if (commentMenuTimeoutRef.current) clearTimeout(commentMenuTimeoutRef.current);
    setActiveCommentMenuId(commentId);
  };

  const handleCommentReactionLeave = () => {
    commentMenuTimeoutRef.current = window.setTimeout(() => setActiveCommentMenuId(null), 500);
  };

  const isOwnPost = post.userId === currentUserId;

  const renderMedia = (isModal: boolean = false) => {
    if (post.type === 'image') {
      const src = post.mediaUrl || `https://picsum.photos/seed/${post.id}/800/450`;
      return (
        <div className={`mt-4 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center cursor-pointer group/img ${isModal ? '' : 'aspect-video md:aspect-[16/9]'}`} onClick={handleOpenView}>
          <img src={src} className={`${isModal ? 'w-full h-auto' : 'w-full h-full object-cover'} transition-transform duration-700 group-hover/img:scale-105`} alt="Post content" />
        </div>
      );
    }
    
    if (post.type === 'video' && post.mediaUrl) {
      return (
        <div className={`mt-4 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-black/40 relative group/vid ${isModal ? '' : 'aspect-video md:aspect-[16/9]'}`}>
          <video 
            src={post.mediaUrl} 
            className="w-full h-full object-contain"
            poster={`https://picsum.photos/seed/${post.id}/800/450`}
          />
          {!isModal && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vid:bg-black/40 transition-all cursor-pointer" onClick={handleOpenView}>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-[#141414] border border-white/5 rounded-[24px] md:rounded-[32px] p-4 md:p-6 mb-4 group transition-all duration-300 hover:border-red-600/20 relative overflow-hidden">
        {post.visibility === 'premium' && (
          <div className="absolute top-0 right-0">
            <div className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Premium</div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={post.userAvatar} className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl border border-white/10" alt={post.userName} />
            <div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <h4 className="font-bold text-xs md:text-sm text-gray-200">{post.userName}</h4>
                {!isOwnPost && (
                  <button 
                    onClick={onFollow}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${isFollowing ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-red-600/10 border-red-500/20 text-red-500'}`}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                )}
              </div>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">{timeAgo(post.timestamp)} atrás</p>
            </div>
          </div>
          
          <button onClick={() => setShowPostActions(!showPostActions)} className="text-gray-600 hover:text-gray-400 p-2 rounded-lg hover:bg-white/5">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm md:text-base leading-relaxed text-gray-300 whitespace-pre-wrap cursor-pointer" onClick={handleOpenView}>
            {post.content}
          </p>
          {renderMedia(false)}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-gray-500">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button 
                onClick={() => {
                  if (window.innerWidth < 1024) setShowReactionMenu(!showReactionMenu);
                  else if (onReaction) onReaction(post.userReaction || 'like');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl md:rounded-2xl transition-all ${post.userReaction ? 'bg-red-600/10 text-red-500' : 'hover:bg-white/5'}`}
              >
                {post.userReaction ? REACTION_MAP[post.userReaction].emoji : <ThumbsUp size={16} />}
                <span className="text-xs font-black">{totalReactions}</span>
              </button>

              {showReactionMenu && (
                <div className="absolute bottom-full left-0 mb-3 bg-[#1a1a1a] border border-white/10 rounded-[20px] md:rounded-[24px] p-2 flex gap-1 shadow-2xl z-50 backdrop-blur-xl animate-in slide-in-from-bottom-2">
                  {(Object.keys(REACTION_MAP) as ReactionType[]).slice(0, 6).map((type) => (
                    <button key={type} onClick={() => { if (onReaction) onReaction(type); setShowReactionMenu(false); }} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-xl">
                      {REACTION_MAP[type].emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 px-3 py-2 rounded-xl md:rounded-2xl hover:bg-white/5 ${showComments ? 'text-blue-500' : ''}`}>
              <MessageCircle size={16} /> <span className="text-xs font-black">{post.comments?.length || 0}</span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 text-gray-600 cursor-default">
              <Eye size={16} /> <span className="text-xs font-black">{post.views}</span>
            </div>

            {!isOwnPost && (
              <button onClick={onMessageUser} className="flex md:hidden p-2 text-gray-600 hover:text-red-500">
                <MessageSquare size={16} />
              </button>
            )}
          </div>
          
          <button onClick={handleShare} className={`p-3 rounded-xl md:rounded-2xl transition-all ${isShared ? 'text-green-500 bg-green-500/10' : 'hover:bg-white/5'}`}>
            {isShared ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in">
            <form onSubmit={handleAddCommentSubmit} className="flex gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Comentar..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600/30"
              />
              <button type="submit" className="bg-red-600 text-white p-2 rounded-xl active:scale-95 transition-transform"><Send size={14} /></button>
            </form>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {(post.comments || []).map((comment) => {
                // Fixed: Explicitly cast Object.values to number[] to avoid operator '+' error on unknown types
                const commentReactionsCount = comment.reactions ? (Object.values(comment.reactions) as number[]).reduce((a, b) => a + b, 0) : 0;
                
                return (
                  <div key={comment.id} className="flex gap-3 group/comment">
                    <img src={comment.userAvatar} className="w-8 h-8 md:w-9 md:h-9 rounded-xl shrink-0 border border-white/5" alt="" />
                    <div className="flex-1 space-y-1">
                      <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5 relative">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-black text-white uppercase tracking-tight">{comment.userName}</span>
                          <span className="text-[8px] text-gray-600 uppercase font-black">{timeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="text-[12px] text-gray-400 leading-relaxed font-medium">{comment.content}</p>
                        
                        {/* Reaction count bubble on comment */}
                        {commentReactionsCount > 0 && (
                          <div className="absolute -bottom-2 right-4 bg-[#1a1a1a] border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg shadow-black/40">
                            <div className="flex -space-x-1">
                              {/* Fixed: Cast Object.entries to [string, number][] for correct type inference in filter */}
                              {(Object.entries(comment.reactions || {}) as [string, number][])
                                .filter(([_, count]) => count > 0)
                                .slice(0, 3)
                                .map(([type]) => (
                                  <span key={type} className="text-[10px]">{REACTION_MAP[type as ReactionType]?.emoji}</span>
                                ))
                              }
                            </div>
                            <span className="text-[9px] font-black text-gray-400">{commentReactionsCount}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Comment Actions Area */}
                      <div className="flex items-center gap-4 px-2">
                        <div 
                          className="relative"
                          onMouseEnter={() => handleCommentReactionEnter(comment.id)}
                          onMouseLeave={handleCommentReactionLeave}
                        >
                          <button 
                            onClick={() => {
                              if (window.innerWidth < 1024) setActiveCommentMenuId(activeCommentMenuId === comment.id ? null : comment.id);
                              else if (onCommentReaction) onCommentReaction(comment.id, comment.userReaction || 'like');
                            }}
                            className={`text-[9px] font-black uppercase tracking-widest transition-colors ${comment.userReaction ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
                          >
                            {comment.userReaction ? REACTION_MAP[comment.userReaction].label : 'Gosto'}
                          </button>

                          {activeCommentMenuId === comment.id && (
                            <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-1.5 flex gap-1 shadow-2xl z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-1">
                              {['like', 'love', 'haha'].map((type) => (
                                <button 
                                  key={type} 
                                  onClick={() => {
                                    if (onCommentReaction) onCommentReaction(comment.id, type as ReactionType);
                                    setActiveCommentMenuId(null);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-lg"
                                  title={REACTION_MAP[type as ReactionType]?.label}
                                >
                                  {REACTION_MAP[type as ReactionType]?.emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <button className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest">Responder</button>
                        
                        {comment.userId === currentUserId && (
                          <button onClick={() => onDeleteComment?.(comment.id)} className="text-[9px] font-black text-gray-700 hover:text-red-500 uppercase tracking-widest opacity-0 group-hover/comment:opacity-100 transition-opacity">Eliminar</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isViewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setIsViewing(false)}>
          <div className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <img src={post.userAvatar} className="w-10 h-10 rounded-xl" alt="" />
                <h3 className="font-black text-white text-sm md:text-lg uppercase tracking-tight">{post.userName}</h3>
              </div>
              <button onClick={() => setIsViewing(false)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
              <p className="text-base md:text-xl text-gray-200 leading-relaxed font-light">{post.content}</p>
              {renderMedia(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
