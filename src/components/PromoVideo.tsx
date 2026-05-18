import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Armchair, Box, CheckCircle2, ChevronRight, Clock, Coffee,
  Heart, Home, MapPin, Moon, Package, PackageCheck, PackageOpen,
  Pause, Play, RotateCcw, ShieldCheck, Sparkles, Star, Truck,
  Volume2, VolumeX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SCENE_DURATION = 5000;

const SceneRender: React.FC<{ scene: Scene }> = ({ scene }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.03 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center overflow-hidden ${scene.bgClass}`}
  >
    {scene.content()}
  </motion.div>
);

type Scene = { bgClass: string; content: () => React.ReactNode };

// ─── Shared helpers ────────────────────────────────────────────────────────────

const Tag = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8102E]/15 border border-[#C8102E]/30 text-[#C8102E] text-[11px] font-black tracking-[0.2em] uppercase"
  >
    {children}
  </motion.div>
);

const scenes: Scene[] = [

  // ── 1 — CHAOS / PROBLEM ─────────────────────────────────────────────────────
  {
    bgClass: 'bg-[#FDF6EE]',
    content: () => (
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
        {/* Scattered boxes */}
        <div className="relative h-32 w-full max-w-xs">
          {[
            { l: '5%',  t: '55%', rot: -18, s: 'w-12 h-12', op: 'opacity-40', d: 0.08 },
            { l: '22%', t: '10%', rot:   8, s: 'w-20 h-20', op: 'opacity-70', d: 0.16 },
            { l: '44%', t: '50%', rot:  -5, s: 'w-11 h-11', op: 'opacity-50', d: 0.12 },
            { l: '63%', t: '8%',  rot:  14, s: 'w-16 h-16', op: 'opacity-60', d: 0.22 },
            { l: '80%', t: '48%', rot: -10, s: 'w-10 h-10', op: 'opacity-40', d: 0.28 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: b.l, top: b.t }}
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: b.d, duration: 0.55 }}
            >
              <div style={{ transform: `rotate(${b.rot}deg)` }}>
                <Box className={`${b.s} text-[#1A243D] ${b.op}`} />
              </div>
            </motion.div>
          ))}
          <motion.div
            className="absolute"
            style={{ right: '2%', top: '0%' }}
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <Clock className="w-10 h-10 text-[#C8102E]" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.65 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1A243D] leading-tight"
        >
          MOVING DAY<br />
          <span className="text-[#C8102E]">SHOULDN'T</span><br />
          FEEL LIKE CHAOS.
        </motion.h2>
      </div>
    ),
  },

  // ── 2 — BRAND INTRO ──────────────────────────────────────────────────────────
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-xl">
        <motion.div
          initial={{ scale: 0.65, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 110, damping: 14 }}
        >
          <img src="/logo/LogoImage.png" alt="MapleNest" className="h-24 w-auto drop-shadow-2xl" />
        </motion.div>

        {/* Truck slide-in */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 75 }}
          className="flex items-center gap-3"
        >
          <Truck className="w-10 h-10 text-[#C8102E]" />
          <div className="w-28 h-1 bg-gradient-to-r from-[#C8102E] to-transparent rounded-full" />
        </motion.div>

        <motion.div
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-[#C8102E] font-black text-sm tracking-[0.35em] uppercase mb-1">MEET</p>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            MAPLE<span className="text-[#C8102E]">NEST</span>
          </h2>
          <p className="text-[#F5F5DC]/60 font-semibold tracking-[0.2em] text-xs mt-2 uppercase">
            Moving &amp; Setup
          </p>
        </motion.div>
      </div>
    ),
  },

  // ── 3 — WE MOVE · PACK · PROTECT ────────────────────────────────────────────
  {
    bgClass: 'bg-white',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-2xl">
        <Tag>Our Service</Tag>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { Icon: Truck,      label: 'WE MOVE.',    sub: 'Safe transport',    d: 0.2, bg: 'bg-[#1A243D]' },
            { Icon: Package,    label: 'WE PACK.',    sub: 'Premium materials', d: 0.38, bg: 'bg-[#C8102E]' },
            { Icon: ShieldCheck,label: 'WE PROTECT.', sub: 'Fully insured',     d: 0.56, bg: 'bg-[#1A243D]' },
          ].map(({ Icon, label, sub, d, bg }, i) => (
            <motion.div
              key={i}
              initial={{ y: 32, opacity: 0, scale: 0.88 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: d, type: 'spring', stiffness: 100 }}
              className={`${bg} rounded-2xl p-4 md:p-5 flex flex-col items-center gap-2.5`}
            >
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="font-black text-xs md:text-sm tracking-wide text-white leading-tight">{label}</span>
              <span className="text-[10px] text-white/60 font-medium">{sub}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-slate-400 text-sm font-semibold"
        >
          Start to finish — door to door 🍁
        </motion.p>
      </div>
    ),
  },

  // ── 4 — DOOR TO DOOR ─────────────────────────────────────────────────────────
  {
    bgClass: 'bg-[#F5F5DC]',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-3xl">
        <motion.h2
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-5xl font-black text-[#1A243D]"
        >
          DOOR <span className="text-[#C8102E]">TO</span> DOOR MOVING
        </motion.h2>

        <div className="relative w-full flex items-center justify-between px-4 py-2">
          {/* Origin */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.28, type: 'spring' }}
            className="flex flex-col items-center gap-1.5 z-10"
          >
            <div className="w-14 h-14 bg-slate-300 rounded-2xl flex items-center justify-center shadow-md">
              <Home className="w-7 h-7 text-[#1A243D]" />
            </div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest">OLD HOME</span>
          </motion.div>

          {/* SVG route + truck */}
          <div className="flex-1 relative mx-2" style={{ height: 64 }}>
            <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M 20 30 Q 150 4 280 30"
                stroke="#C8102E"
                strokeWidth="2.5"
                strokeDasharray="8 5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.4, ease: 'easeInOut' }}
              />
            </svg>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={{ left: '4%' }}
              animate={{ left: '78%' }}
              transition={{ delay: 0.7, duration: 1.7, ease: 'easeInOut' }}
            >
              <div className="w-10 h-10 bg-[#C8102E] rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Destination */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.3, type: 'spring' }}
            className="flex flex-col items-center gap-1.5 z-10"
          >
            <div className="w-14 h-14 bg-[#C8102E] rounded-2xl flex items-center justify-center shadow-md">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#C8102E] tracking-widest">NEW HOME</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          className="flex items-center gap-2 text-slate-500 text-sm font-semibold"
        >
          <MapPin className="w-4 h-4 text-[#C8102E]" />
          London, ON &amp; Surrounding Area
        </motion.div>
      </div>
    ),
  },

  // ── 5 — WE UNPACK ────────────────────────────────────────────────────────────
  {
    bgClass: 'bg-white',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-2xl">
        <motion.h2
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-black text-[#1A243D]"
        >
          WE <span className="text-[#C8102E]">UNPACK.</span>
        </motion.h2>

        {/* Central box with orbiting room icons */}
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.28, type: 'spring', stiffness: 120 }}
            className="w-20 h-20 bg-[#1A243D] rounded-2xl flex items-center justify-center shadow-xl z-10 absolute"
          >
            <PackageOpen className="w-10 h-10 text-white" />
          </motion.div>

          {[
            { Icon: Coffee,      label: 'Kitchen',  angle: -90, d: 0.55 },
            { Icon: Armchair,    label: 'Living',   angle:   0, d: 0.7  },
            { Icon: Moon,        label: 'Bedroom',  angle:  90, d: 0.85 },
            { Icon: PackageCheck,label: 'Closet',   angle: 180, d: 1.0  },
          ].map(({ Icon, label, angle, d }, i) => {
            const r = 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center gap-1"
                style={{ left: 110 + x - 24, top: 110 + y - 24 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: d, type: 'spring', stiffness: 130 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F5DC] border border-[#1A243D]/10 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-[#1A243D]" />
                </div>
                <span className="text-[9px] font-black text-slate-500 whitespace-nowrap tracking-wide">{label}</span>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-slate-400 text-sm font-semibold"
        >
          Every room. Every box. Every item.
        </motion.p>
      </div>
    ),
  },

  // ── 6 — WE SET UP YOUR HOME ──────────────────────────────────────────────────
  {
    bgClass: 'bg-[#F0F2F5]',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-sm">
        <motion.h2
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-5xl font-black text-[#1A243D]"
        >
          WE SET UP<br /><span className="text-[#C8102E]">YOUR HOME.</span>
        </motion.h2>

        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { Icon: Moon,        label: 'Bedroom',    d: 0.28 },
            { Icon: Armchair,    label: 'Living Room', d: 0.44 },
            { Icon: Coffee,      label: 'Kitchen',    d: 0.60 },
            { Icon: PackageCheck,label: 'Closet',     d: 0.76 },
          ].map(({ Icon, label, d }, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: d, type: 'spring', stiffness: 120 }}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm border border-slate-100 relative"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A243D]/5 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#1A243D]" />
              </div>
              <span className="text-xs font-black text-slate-700 tracking-wide">{label}</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: d + 0.45, type: 'spring', stiffness: 220 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 7 — WHITE GLOVE SERVICE ──────────────────────────────────────────────────
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          className="relative"
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-[#C8102E]" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#C8102E]/25 blur-xl pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            WHITE GLOVE<br />
            <span className="text-[#C8102E]">SERVICE</span>
          </h2>
          <p className="text-[#F5F5DC]/55 text-sm font-semibold mt-2 tracking-wide">
            A SETUP, NOT JUST A MOVE.
          </p>
        </motion.div>

        <div className="flex flex-col gap-2 w-full">
          {[
            'Full unboxing & organization',
            'Furniture assembly included',
            'Zero boxes left behind',
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: -22, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="flex items-center gap-2.5 text-sm text-white/80"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 8 — FIRST NIGHT ──────────────────────────────────────────────────────────
  {
    bgClass: 'bg-[#0E1628]',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-xl">
        {/* Night scene */}
        <div className="relative flex items-end justify-center" style={{ height: 140, width: 240 }}>
          {/* Stars */}
          {([[-70, 15], [75, 5], [-20, -10], [50, 30]] as [number, number][]).map(([x, y], i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${x}px)`, top: y }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.6 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            >
              <Star className="w-3 h-3 text-[#F5F5DC] fill-[#F5F5DC]" />
            </motion.div>
          ))}

          {/* Moon */}
          <motion.div
            className="absolute"
            style={{ right: 10, top: 0 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Moon className="w-10 h-10 text-[#F5F5DC] opacity-75 fill-[#F5F5DC]" />
          </motion.div>

          {/* House silhouette */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="w-44 h-28 bg-white/10 rounded-t-3xl border border-white/20 flex flex-col items-center justify-end overflow-hidden relative"
          >
            {/* Glowing window */}
            <motion.div
              className="absolute top-5 w-14 h-9 bg-amber-300/50 rounded-lg border border-amber-200/40 shadow-lg"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="w-full h-8 bg-[#C8102E]/70 rounded-t-lg" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.75 }}
          className="text-3xl md:text-4xl font-black text-white text-center leading-tight"
        >
          SLEEP SOUNDLY<br />
          <span className="text-[#C8102E]">YOUR FIRST NIGHT.</span>
        </motion.h2>
      </div>
    ),
  },

  // ── 9 — WALK IN. SIT DOWN. YOU'RE HOME. ─────────────────────────────────────
  {
    bgClass: 'bg-[#FDF6EE]',
    content: () => (
      <div className="flex flex-col items-center gap-7 w-full max-w-xl">
        <div className="relative">
          <motion.div
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Armchair className="w-32 h-32 text-[#1A243D]" />
          </motion.div>

          {/* Beating heart */}
          <motion.div
            animate={{ scale: [1, 1.22, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-5 -top-3"
          >
            <Heart className="w-11 h-11 text-[#C8102E] fill-[#C8102E]" />
          </motion.div>

          {/* Coffee cup */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 180 }}
            className="absolute -left-7 bottom-3 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center"
          >
            <Coffee className="w-5 h-5 text-[#1A243D]" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.75 }}
          className="text-3xl md:text-5xl font-black text-[#1A243D] leading-tight"
        >
          WALK IN. SIT DOWN.<br />
          <span className="text-[#C8102E]">YOU'RE HOME.</span>
        </motion.h2>
      </div>
    ),
  },

  // ── 10 — CTA FINAL ───────────────────────────────────────────────────────────
  {
    bgClass: 'bg-[#1A243D]',
    content: () => (
      <div className="flex flex-col items-center gap-6 w-full relative">
        {/* Maple watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[240px] leading-none opacity-[0.035]">🍁</span>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 95, damping: 14 }}
        >
          <img src="/logo/Logo-Moving.jpg" alt="MapleNest Moving & Setup" className="h-20 w-auto drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center space-y-1.5 z-10"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            BOOK YOUR<br />
            <span className="text-[#C8102E]">HASSLE-FREE MOVE</span><br />
            TODAY
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[#F5F5DC]/55 text-sm font-semibold mt-1">
            <MapPin className="w-4 h-4 text-[#C8102E]" />
            London, ON &amp; Surrounding Area
          </div>
        </motion.div>

        <motion.a
          href="#estimate"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.62 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-[#C8102E] hover:bg-red-700 text-white px-7 py-3.5 rounded-full text-base font-black transition-colors shadow-xl shadow-red-900/40 cursor-pointer z-10"
        >
          Get Your Free Quote <ChevronRight className="w-5 h-5" />
        </motion.a>
      </div>
    ),
  },
];

// ── PromoVideo ─────────────────────────────────────────────────────────────────

export default function PromoVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio
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

  // Scene timer + progress
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
    return () => { cancelAnimationFrame(animFrame); clearTimeout(timer); };
  }, [currentScene, isPlaying]);

  const handlePlayPause = () => {
    if (currentScene === scenes.length - 1) {
      setCurrentScene(0); setProgress(0); setIsPlaying(true);
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
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <SceneRender key={currentScene} scene={scenes[currentScene]} />
        </AnimatePresence>
      </div>

      {/* Scene counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 text-white text-xs font-bold backdrop-blur-sm">
        {currentScene + 1} / {scenes.length}
      </div>

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => setIsMuted((m) => !m)}
        aria-label={isMuted ? 'Enable music' : 'Mute music'}
        className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm text-white text-xs font-bold transition-all duration-300 cursor-pointer ${
          isMuted ? 'bg-black/35 hover:bg-black/55' : 'bg-[#C8102E]/90 hover:bg-[#C8102E] shadow-lg shadow-red-900/40'
        }`}
      >
        {isMuted && <span className="absolute inset-0 rounded-full animate-ping bg-white/20 pointer-events-none" />}
        {isMuted
          ? <><VolumeX className="w-3.5 h-3.5 shrink-0" /><span>Sound off</span></>
          : <><Volume2 className="w-3.5 h-3.5 shrink-0" /><span>Sound on</span></>}
      </motion.button>

      {/* Controls — appear on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Play / Pause"
          >
            {isEnded ? <RotateCcw className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Segmented progress */}
          <div className="flex-1 flex gap-0.5 h-1.5">
            {scenes.map((_, idx) => (
              <div key={idx} className="flex-1 relative h-full bg-white/25 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full transition-none"
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
