import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-stretch justify-between overflow-hidden bg-zinc-950">
      {/* Left Content - Text */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 md:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h2 className="text-xs md:text-sm font-mono text-zinc-700 tracking-[0.3em] uppercase mb-16">
            Portfolio &mdash; 2026
          </h2>
          
          <h1 className="text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] font-bold tracking-tighter text-white leading-[0.8] uppercase flex flex-col">
            <span>AI & DATA</span>
            <span className="text-zinc-800/80">DRIVEN</span>
            <span>MARKETER</span>
          </h1>

          <div className="mt-20 max-w-md">
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
              가설은 <span className="text-white font-medium">AI</span>로 빠르게 그리고,<br />
              검증은 <span className="text-white font-medium">데이터</span>로 날카롭게 합니다.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-12 bg-zinc-800" />
              <p className="text-zinc-600 text-[10px] md:text-xs leading-relaxed uppercase tracking-[0.3em] font-medium">
                Creative x Performance x Automation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-6 md:left-16 flex items-center gap-4 text-zinc-800"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Scroll to explore</span>
        </motion.div>
      </div>

      {/* Right Content - Image Container */}
      <div className="relative flex-1 md:h-screen bg-zinc-950 overflow-hidden flex items-end justify-center md:justify-end">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex items-end"
        >
          {/* 
            Adjusted styling for the new profile image:
            - Removed scale to ensure the head is not cut off.
          */}
          <img 
            src="/profile.png" 
            alt="Shin Yongmin"
            className="w-full h-full object-contain object-bottom brightness-110 contrast-110 mix-blend-lighten"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle vignette/gradient to blend the bottom of the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent h-1/4 bottom-0" />
          
          {/* Star Icon at bottom right */}
          <motion.div 
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-12 right-12 text-zinc-800"
          >
            <Sparkles className="w-16 h-16" />
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
