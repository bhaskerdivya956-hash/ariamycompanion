import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Image as ImageIcon, Smile, Mic, Camera, Sticker } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Popover from '@radix-ui/react-popover';

interface ChatInputProps {
  onSend: (message: string, gif?: string) => void;
  disabled?: boolean;
  editValue?: string;
  onCancelEdit?: () => void;
}

const COMMON_GIFS = [
  { term: 'hello', label: 'Hello 👋' },
  { term: 'love', label: 'Love ❤️' },
  { term: 'laugh', label: 'Laugh 😂' },
  { term: 'hugging', label: 'Hug 🫂' },
  { term: 'blushing', label: 'Blush 😊' },
  { term: 'angry', label: 'Angry 😠' },
];

export function ChatInput({ onSend, disabled, editValue, onCancelEdit }: ChatInputProps) {
  const [input, setInput] = useState('');
  
  useEffect(() => {
    if (editValue !== undefined) {
      setInput(editValue);
    }
  }, [editValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleGifSelect = (term: string) => {
    onSend('', term);
  };

  return (
    <div className="relative p-3 w-full bg-white">
      {editValue !== undefined && (
        <div className="flex items-center justify-between px-4 py-2 bg-ig-gray rounded-t-xl text-[12px] border-b border-white">
          <span className="text-ig-secondary">Editing message...</span>
          <button onClick={onCancelEdit} className="text-ig-blue font-bold">Cancel</button>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "relative flex items-center border border-ig-border bg-white transition-all pl-4 pr-2 min-h-[44px]",
          editValue !== undefined ? "rounded-b-[22px]" : "rounded-[22px]"
        )}
      >
        <button type="button" className="text-ig-text hover:opacity-70 flex-shrink-0 mr-3">
          <Camera size={24} />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 text-ig-text placeholder:text-ig-secondary"
        />

        <div className="flex items-center gap-3">
          {!input.trim() ? (
            <>
              <button type="button" className="text-ig-text hover:opacity-70 group relative">
                <Mic size={24} />
              </button>
              <button type="button" className="text-ig-text hover:opacity-70">
                <ImageIcon size={24} />
              </button>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button type="button" className="text-ig-text hover:opacity-70">
                    <Sticker size={24} />
                  </button>
                </Popover.Trigger>
                <Popover.Content className="bg-white border border-ig-border rounded-xl shadow-2xl p-2 z-50 w-[240px]">
                  <p className="text-[10px] uppercase text-ig-secondary font-bold mb-2 px-2">Popular GIFs</p>
                  <div className="grid grid-cols-2 gap-1">
                    {COMMON_GIFS.map((gif) => (
                      <button
                        key={gif.term}
                        type="button"
                        onClick={() => handleGifSelect(gif.term)}
                        className="px-3 py-2 text-sm text-ig-text hover:bg-ig-gray rounded-lg transition-colors text-left"
                      >
                        {gif.label}
                      </button>
                    ))}
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Root>
            </>
          ) : (
            <button
              type="submit"
              disabled={disabled}
              className="text-ig-blue font-bold text-[16px] px-2 hover:opacity-70 active:scale-95 transition-all"
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

import { cn } from '@/src/lib/utils';

