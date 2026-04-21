import ReactMarkdown from 'react-markdown';
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { type Message } from "@/src/services/gemini";
import { MoreHorizontal, RotateCcw, Trash2, Edit2 } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { PROFILE_PIC } from '../constants';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
}

export function MessageBubble({ message, onDelete, onEdit }: MessageBubbleProps) {
  const isAria = message.role === 'model';

  if (message.isDeleted) {
    return (
      <div className={cn(
        "flex w-full mb-2 items-center gap-2 text-[12px] text-ig-secondary italic",
        isAria ? "justify-start" : "justify-end"
      )}>
        {isAria ? "Aria unsent a message" : "You unsent a message"}
      </div>
    );
  }

  // Helper to extract GIF if it's in the [GIF: description] format
  const gifMatch = message.content.match(/\[GIF: (.*?)\]/);
  const gifTerm = message.gif || (gifMatch ? gifMatch[1] : null);
  const cleanContent = message.content.replace(/\[GIF: (.*?)\]/, '').trim();

  // Simple GIF URL generator (using Giphy embed/search as proxy if it's just a term)
  const getGifUrl = (term: string) => {
    // If it's a direct URL, use it, otherwise use a placeholder/proxy
    if (term.startsWith('http')) return term;
    return `https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJocXBncm1qbmMxaXBnaTZnbW1qbmMxaXBnaTZnbW1qbmMxaXBnaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif`; 
    // In a real app we'd fetch. For now, let's use a semi-dynamic one or a high-quality placeholder.
    // Let's use a more realistic proxy or search service if possible. 
  };

  return (
    <div className={cn(
      "flex w-full mb-3 group",
      isAria ? "justify-start gap-2" : "justify-end"
    )}>
      {isAria && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-auto">
          <img 
            src={PROFILE_PIC} 
            alt="Aria" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className={cn(
        "relative max-w-[70%] flex flex-col",
        isAria ? "items-start" : "items-end"
      )}>
        {/* GIF Display */}
        {gifTerm && (
          <div className="mb-1 rounded-[18px] overflow-hidden max-w-[200px] shadow-sm">
            <img 
               src={`https://media1.giphy.com/media/search/${encodeURIComponent(gifTerm)}/giphy.gif?cid=ecf05e47...`}
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJocXBncm1qbmMxaXBnaTZnbW1qbmMxaXBnaTZnbW1qbmMxaXBnaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif';
               }}
               alt={gifTerm}
               className="w-full object-cover"
            />
          </div>
        )}

        {/* Text bubble */}
        {cleanContent && (
          <div className={cn(
            isAria ? "aria-bubble" : "user-bubble",
            "message-animate"
          )}>
            <div className="markdown-body">
              <ReactMarkdown>{cleanContent}</ReactMarkdown>
            </div>
          </div>
        )}

        {message.isEdited && (
          <span className="text-[10px] text-ig-secondary mt-1">Edited</span>
        )}
      </div>

      {!isAria && (
        <div className="self-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 hover:bg-ig-gray rounded-full text-ig-secondary">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white border border-ig-border rounded-xl shadow-xl p-1 z-50 min-w-[120px]">
              <DropdownMenu.Item 
                onSelect={() => onEdit?.(message.id, cleanContent)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ig-text hover:bg-ig-gray rounded-lg outline-none cursor-pointer"
              >
                <Edit2 size={14} /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                onSelect={() => onDelete?.(message.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg outline-none cursor-pointer"
              >
                <Trash2 size={14} /> Unsend
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      )}
    </div>
  );
}

