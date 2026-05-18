import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Armchair,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  Home,
  MapPin,
  Moon,
  PackageCheck,
  PackageOpen,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SCENE_DURATION = 4000;

// ── Scene renderer ─────────────────────────────────────────────────────────────

const SceneRender: React.FC<{ scene: Scene }> = ({ scene }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.04 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center ${scene.bgClass}`}
  >
    {scene.content()}
  </motion.div>
);

// ── Scenes data ────────────────────────────────────────────────────────────────

type Scene = { bgClass: string; content: () => React.ReactNode };

const scenes: Scene[] = [
  // 1 — The chaos of moving
  {
    bgClass: 'bg-gray-100',
    content: () => (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ rotate: -10, x: -20, opacity: 0 }}
          animate={{ rotate: 0, x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          <Box className="w-24 h-24 text-[#1A243D] opacity-60 absolute -left-16 -bottom-8" />
          <PackageOpen className="w-32 h-32 text-[#C8102E]" />
          <Clock className="w-16 h-16 text-[#1A243D] opacity-50 absolute -right-12 top-0" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-5xl font-semibold text-[#1A243D] tracking-tight max-w-2xl"
        >
          Moving doesn't have to feel chaotic.
        </motion.h2>
      </div>
    ),
  },
  // 2 — MapleNest brand intro
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative flex items-center justify-center w-40 h-40 bg-white rounded-full shadow-2xl"
        >
          <Home className="w-20 h-20 text-[#1A243D] absolute" />
          <div className="text-[#C8102E] absolute -top-4 text-7xl font-sans drop-shadow-md opacity-40">🍁</div>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="flex items-center gap-4 text-white"
        >
          <Truck className="w-12 h-12 text-[#C8102E]" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-white tracking-tight"
        >
          MapleNest <span className="text-[#C8102E]">Moving</span> & Setup
        </motion.h1>
      </div>
    ),
  },
  // 3 — Safe transport
  {
    bgClass: 'bg-[#F5F5DC]',
    content: () => (
      <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-[#1A243D]"
        >
          Reliable. Safe. Door to Door.
        </motion.h2>
        <div className="grid grid-cols-3 gap-8 w-full">
          {[
            { Icon: ShieldCheck, title: 'Safe Transport', delay: 0.3 },
            { Icon: PackageCheck, title: 'Secure Packing', delay: 0.6 },
            { Icon: Home, title: 'Door to Door', delay: 0.9 },
          ].map(({ Icon, title, delay }, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay, type: 'spring' }}
              className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="w-10 h-10 text-[#1A243D]" />
              </div>
              <h3 className="text-xl font-medium text-[#1A243D]">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  // 4 — Unpack & organise
  {
    bgClass: 'bg-white',
    content: () => (
      <div className="flex flex-col items-center gap-10">
        <div className="flex gap-6">
          {[
            { Icon: PackageOpen, bg: 'bg-[#F5F5DC]', color: 'text-[#1A243D]', delay: 0.1 },
            { Icon: Coffee, bg: 'bg-[#F5F5DC]', color: 'text-[#1A243D]', delay: 0.4 },
            { Icon: CheckCircle2, bg: 'bg-[#C8102E]', color: 'text-white', delay: 0.7 },
          ].map(({ Icon, bg, color, delay }, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay }}
            >
              <div className={`w-24 h-24 rounded-2xl ${bg} flex items-center justify-center border-2 border-[#1A243D]/10 shadow-lg`}>
                <Icon className={`w-12 h-12 ${color}`} />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-4xl md:text-5xl font-bold text-[#1A243D]"
        >
          We unpack. We organize. <span className="text-[#C8102E]">We set up.</span>
        </motion.h2>
      </div>
    ),
  },
  // 5 — First night ready
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <Moon className="w-32 h-32 text-[#F5F5DC] opacity-20 absolute -top-16 -right-16" />
          <div className="w-48 h-32 bg-white/10 rounded-t-3xl border border-white/20 flex flex-col items-center justify-end overflow-hidden">
            <div className="w-full h-8 bg-[#C8102E]/80 rounded-t-lg" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-light text-white italic"
        >
          "Sleep soundly your first night."
        </motion.h2>
      </div>
    ),
  },
  // 6 — Family-friendly
  {
    bgClass: 'bg-[#F5F5DC]',
    content: () => (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="w-24 h-24 text-[#C8102E] fill-[#C8102E]" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-[#1A243D]"
        >
          Family-friendly move-in setup.
        </motion.h2>
      </div>
    ),
  },
  // 7 — White Glove
  {
    bgClass: 'bg-white',
    content: () => (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ rotate: -45, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-28 h-28 rounded-full bg-slate-50 border border-slate-100 shadow-md flex items-center justify-center p-6"
        >
          <Sparkles className="w-full h-full text-[#C8102E]" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A243D]">White Glove.</h2>
          <p className="text-2xl text-slate-500 font-medium">A setup, not just a move.</p>
        </motion.div>
      </div>
    ),
  },
  // 8 — Final result
  {
    bgClass: 'bg-[#F0F2F5]',
    content: () => (
      <div className="flex flex-col items-center gap-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Armchair className="w-40 h-40 text-[#1A243D]" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute -right-8 -top-8 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <span className="text-3xl">☕</span>
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-[#1A243D] tracking-tight leading-tight"
        >
          Walk in. Sit down.<br /> <span className="text-[#C8102E]">You're home.</span>
        </motion.h2>
      </div>
    ),
  },
  // 9 — CTA
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-10 w-full">
        <div className="text-[#C8102E] absolute inset-0 flex items-center justify-center text-[300px] opacity-5 pointer-events-none select-none">
          🍁
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <img src="/logo/Logo-Moving.jpg" alt="MapleNest Moving & Setup" className="h-28 w-auto drop-shadow-2xl" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-6"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white">Book your hassle-free move today</h3>
          <div className="flex items-center justify-center gap-2 text-[#F5F5DC] text-xl">
            <MapPin className="w-6 h-6 text-[#C8102E]" />
            Ontario, Canada
          </div>
        </motion.div>
        <motion.a
          href="#estimate"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 flex items-center gap-2 bg-[#C8102E] hover:bg-red-700 text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors z-10 shadow-lg shadow-red-900/50 cursor-pointer"
        >
          Get Your Free Quote <ChevronRight className="w-6 h-6" />
        </motion.a>
      </div>
    ),
  },
];

// ── PromoVideo ────────────────────────────────────────────────────────────────

export default function PromoVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio control
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(() => setIsMuted(true));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (currentScene === 0 && audioRef.current && isPlaying && !isMuted) {
      audioRef.current.currentTime = 0;
    }
  }, [currentScene, isPlaying, isMuted]);

  // Scene timer + progress bar
  useEffect(() => {
    if (!isPlaying || currentScene >= scenes.length - 1) {
      if (currentScene === scenes.length - 1) setProgress(100);
      return;
    }

    let animFrame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const pct = Math.min(((now - startTime) / SCENE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setCurrentScene((s) => s + 1);
      setProgress(0);
    }, SCENE_DURATION);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, [currentScene, isPlaying]);

  const handlePlayPause = () => {
    if (currentScene === scenes.length - 1) {
      setCurrentScene(0);
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const isEnded = currentScene === scenes.length - 1 && !isPlaying;

  return (
    <div className="relative w-full overflow-hidden bg-white rounded-2xl shadow-2xl aspect-video select-none group">
      <audio
        ref={audioRef}
        src="/songs/the_mountain-instrumental-uplifting-522470.mp3"
        loop
        preload="auto"
      />

      {/* Scene canvas */}
      <div className="absolute inset-0 bg-[#F5F5DC]">
        <AnimatePresence mode="wait">
          <SceneRender key={currentScene} scene={scenes[currentScene]} />
        </AnimatePresence>
      </div>

      {/* Scene counter badge */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 text-white text-xs font-medium backdrop-blur-sm">
        {currentScene + 1} / {scenes.length}
      </div>

      {/* Persistent sound button — always visible, top-left */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => setIsMuted((m) => !m)}
        aria-label={isMuted ? 'Enable music' : 'Mute music'}
        className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm text-white text-xs font-semibold transition-all duration-300 cursor-pointer ${
          isMuted
            ? 'bg-black/35 hover:bg-black/55'
            : 'bg-[#C8102E]/90 hover:bg-[#C8102E] shadow-lg shadow-red-900/40'
        }`}
      >
        {/* Ripple ring — only when muted, to draw attention */}
        {isMuted && (
          <span className="absolute inset-0 rounded-full animate-ping bg-white/20 pointer-events-none" />
        )}
        {isMuted ? (
          <><VolumeX className="w-3.5 h-3.5 shrink-0" /><span>Sound off</span></>
        ) : (
          <><Volume2 className="w-3.5 h-3.5 shrink-0" /><span>Sound on</span></>
        )}
      </motion.button>

      {/* Controls overlay — visible on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 text-white">
          {/* Play / Pause / Restart */}
          <button onClick={handlePlayPause} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Play / Pause">
            {isEnded ? <RotateCcw className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Scene progress track */}
          <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden flex gap-px">
            {scenes.map((_, idx) => (
              <div key={idx} className="flex-1 relative h-full">
                <div
                  className="absolute inset-0 bg-white rounded-full transition-none"
                  style={{
                    width: idx < currentScene ? '100%' : idx === currentScene ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
