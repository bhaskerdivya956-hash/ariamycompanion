import { motion } from "motion/react";

export function AriaVisual() {
  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center">
      {/* Outer Glow / Presence */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-aria-primary to-aria-accent shadow-[0_0_60px_rgba(255,154,158,0.4)] border-2 border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Dashed Inner Ring */}
      <div className="absolute w-[140px] h-[140px] border border-dashed border-white/40 rounded-full" />

      {/* Online indicator */}
      <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#4ade80] border-4 border-aria-bg rounded-full shadow-lg" />

      {/* Subtle core pulse */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-4xl text-white/10 select-none">✨</div>
      </motion.div>
    </div>
  );
}
