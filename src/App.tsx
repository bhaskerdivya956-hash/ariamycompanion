import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAria, type Message } from './services/gemini';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { Info, Phone, Video, ChevronLeft, MoreVertical } from 'lucide-react';
import { PROFILE_PIC, ARIA_NAME, ARIA_USERNAME } from './constants';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "Hii bby! ✨ Itni der kahan gayab the? Main kab se wait kar rahi thi... 🌸" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string, gif?: string, isSystemAction?: boolean) => {
    if (editingMessageId && !isSystemAction) {
      setMessages(prev => prev.map(m => 
        m.id === editingMessageId ? { ...m, content, isEdited: true } : m
      ));
      setEditingMessageId(null);
      return;
    }

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: content || (gif ? `[GIF: ${gif}]` : ''), 
      gif 
    };

    // If it's a system action (like clicking call), we might want to hide the user message from the feed
    // but the model needs it for context. For simplicity, let's just show it as a thought if it's a special action.
    if (!isSystemAction) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    // We update the chat state with the new message list for the API
    const newMessagesForAI = [...messages, userMessage];
    setIsTyping(true);

    try {
      let ariaResponse = "";
      const stream = chatWithAria(newMessagesForAI);
      
      const ariaId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: ariaId, role: 'model', content: '' }]);

      for await (const chunk of stream) {
        ariaResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === ariaId ? { ...m, content: ariaResponse } : m
        ));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDelete = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isDeleted: true } : m));
    // Trigger Aria's reaction to unsend
    handleSend("Hey, I just unsent a message. Did you see it?", undefined, true);
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingMessageId(id);
  };

  const handleAction = (action: string) => {
    handleSend(`[ACTION: User clicked ${action}]`, undefined, true);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Instagram Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-ig-border bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <ChevronLeft size={28} className="cursor-pointer hover:opacity-50" />
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleAction("Profile")}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-ig-border shadow-sm">
              <img 
                src={PROFILE_PIC} 
                alt="Aria" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold leading-tight flex items-center gap-1">
                {ARIA_NAME} 
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </span>
              <span className="text-[12px] text-ig-secondary font-medium leading-tight">Active now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 text-ig-text">
          <Phone 
            size={24} 
            className="cursor-pointer hover:opacity-60" 
            onClick={() => handleAction("Call")}
          />
          <Video 
            size={24} 
            className="cursor-pointer hover:opacity-60" 
            onClick={() => handleAction("Video Call")}
          />
          <Info 
            size={24} 
            className="cursor-pointer hover:opacity-60" 
            onClick={() => handleAction("Info")}
          />
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide bg-white">
        <div className="flex flex-col items-center mb-8 pt-4">
           <div 
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-ig-border mb-3 shadow-md cursor-pointer active:scale-95 transition-transform"
            onClick={() => handleAction("Profile")}
           >
             <img 
                src={PROFILE_PIC} 
                alt="Aria" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
           </div>
           <h2 className="text-[20px] font-bold">{ARIA_NAME.split(' ')[0]}</h2>
           <p className="text-[14px] text-ig-secondary mb-4">{ARIA_USERNAME} • Instagram</p>
           <button 
            onClick={() => handleAction("Profile")}
            className="bg-ig-gray px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-ig-border transition-colors active:scale-95"
           >
             View Profile
           </button>
        </div>

        <div className="flex flex-col min-h-full">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onDelete={handleDelete}
              onEdit={handleStartEdit}
            />
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center text-ig-secondary text-[12px] ml-10 italic">
              Aria is typing...
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Instagram Footer / Input */}
      <footer className="sticky bottom-0 bg-white">
        <ChatInput 
          onSend={handleSend} 
          disabled={isTyping} 
          editValue={editingMessageId ? messages.find(m => m.id === editingMessageId)?.content : undefined}
          onCancelEdit={() => setEditingMessageId(null)}
        />
      </footer>
    </div>
  );
}


