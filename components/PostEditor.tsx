
import React, { useState, useRef } from 'react';
import { UI_ICONS } from '../constants';
import { ContentType, Post } from '../types';
import { X, PlayCircle, Image as ImageIcon } from 'lucide-react';

interface PostEditorProps {
  onPublish: (postData: Partial<Post>) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ onPublish }) => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePublish = () => {
    if (!content.trim() && !mediaUrl) return;
    onPublish({
      content,
      type: contentType,
      mediaUrl: mediaUrl || undefined,
      visibility: 'members',
    });
    setContent('');
    setContentType('text');
    setMediaUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: ContentType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setContentType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaUrl(null);
    setContentType('text');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 shadow-xl mb-8 transition-all">
      <div className="flex gap-4">
        <img 
          src="https://picsum.photos/seed/goncalo/100" 
          className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover" 
          alt="Profile" 
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partilhe a sua jornada, os seus resultados ou as suas dúvidas..."
            className="w-full bg-transparent border-none focus:ring-0 text-gray-200 placeholder:text-gray-600 resize-none min-h-[80px] text-sm"
          />

          {/* Media Preview */}
          {mediaUrl && (
            <div className="relative mt-2 mb-4 rounded-2xl overflow-hidden border border-white/10 bg-black/40 group max-h-[300px] flex items-center justify-center">
              {contentType === 'image' ? (
                <img src={mediaUrl} className="max-w-full h-auto object-contain" alt="Preview" />
              ) : (
                <div className="relative w-full aspect-video flex items-center justify-center">
                  <video src={mediaUrl} className="max-w-full h-full object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle className="text-white opacity-80" size={48} />
                  </div>
                </div>
              )}
              <button 
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 mt-2">
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'image')} 
              />
              <input 
                type="file" 
                ref={videoInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={(e) => handleFileChange(e, 'video')} 
              />
              
              <button 
                onClick={() => imageInputRef.current?.click()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${contentType === 'image' && mediaUrl ? 'bg-red-600/20 text-red-500' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <ImageIcon size={16} /> Imagem
              </button>
              <button 
                onClick={() => videoInputRef.current?.click()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${contentType === 'video' && mediaUrl ? 'bg-red-600/20 text-red-500' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <PlayCircle size={16} /> Vídeo
              </button>
            </div>
            
            <button
              onClick={handlePublish}
              disabled={!content.trim() && !mediaUrl}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              Publicar {UI_ICONS.Send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
