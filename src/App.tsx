import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Menu, X, Truck, Wrench, Home, Package, Building2,
  Car, Clock, Users, ShieldCheck, DollarSign,
  MapPin, Camera, Settings, Star, ArrowRight, Leaf,
  CheckCircle2, CalendarDays, Phone, Mail, Sun, Moon,
  Sparkles, CheckCircle, XCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import PromoVideo from './components/PromoVideo';
import emailjs from '@emailjs/browser';

// ── useDarkMode ───────────────────────────────────────────────────────────────

function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('maplenest-theme');
      if (stored) return stored === 'dark';
    } catch {}
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('maplenest-theme', dark ? 'dark' : 'light');
    } catch {}
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return [dark, toggle];
}

// ── AnimatedCounter ───────────────────────────────────────────────────────────

interface AnimatedCounterProps {
  to: number;
  suffix?: string;
  display?: (val: number) => string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ to, suffix = '', display }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  const formatted = display ? display(value) : `${value}${suffix}`;

  return <span ref={ref}>{formatted}</span>;
};

// ── Navbar ────────────────────────────────────────────────────────────────────

interface NavbarProps {
  dark: boolean;
  toggleDark: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ dark, toggleDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60'
        : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0">
            <img src="/logo/Logo-Moving.jpg" alt="MapleNest Moving & Setup" className="h-16 w-auto" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors text-sm"
              >
                {l.label}
              </a>
            ))}

            {/* Phone — desktop only */}
            <a
              href="tel:+12269776703"
              className="hidden lg:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              (226) 977-6703
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <a
              href="#estimate"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30"
            >
              Get a Free Estimate
            </a>
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="tel:+12269776703"
                className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                (226) 977-6703
              </a>
              <a
                href="#estimate"
                onClick={() => setIsOpen(false)}
                className="block mt-3 text-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
              >
                Get a Free Estimate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────

const Hero = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden bg-white dark:bg-slate-950"
  >
    {/* Soft background blobs */}
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-red-50/60 dark:bg-red-950/20 blur-3xl" />
      <div className="absolute top-60 -left-32 w-[500px] h-[500px] rounded-full bg-slate-100/70 dark:bg-slate-800/30 blur-3xl" />
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        {/* Logo centralizada */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <img src="/logo/Logo-Moving.jpg" alt="MapleNest Moving & Setup" className="w-auto max-w-sm md:max-w-md" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6"
        >
          We Don't Just Move You.{' '}
          <span className="text-red-600 relative inline-block">
            We Set Up Your Home.
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none" height="8">
              <path d="M0 5 Q50 0 100 5" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Packing, moving, unpacking, furniture assembly and home organization, all in one seamless experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-4"
        >
          <a
            href="#estimate"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-base transition-all shadow-lg shadow-red-500/30 hover:shadow-xl group"
          >
            Get a Free Estimate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-full font-semibold text-base transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            How It Works
          </a>
        </motion.div>
      </div>

      {/* Promo video */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <PromoVideo />
      </motion.div>

      {/* Trust row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex items-center justify-center gap-5 text-sm text-slate-500 dark:text-slate-400 mt-8"
      >
        <div className="flex -space-x-2">
          {['S', 'D', 'E', 'M'].map((c, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center font-semibold text-xs text-slate-500 dark:text-slate-300">
              {c}
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-0.5 text-amber-400 mb-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={13} />)}
          </div>
          <span>4.9 stars · 320+ successful moves across Ontario</span>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

// ── Stats bar ─────────────────────────────────────────────────────────────────

const STATS = [
  { to: 320, suffix: '+', label: 'Successful Moves' },
  { to: 49, display: (v: number) => `${(v / 10).toFixed(1)} ★`, label: 'Avg Rating' },
  { to: 5, suffix: '+', label: 'Years Experience' },
  { to: 8, suffix: '', label: 'Cities Served' },
];

const StatsBar = () => (
  <div className="bg-slate-900 dark:bg-slate-950 py-10">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="text-3xl font-extrabold text-red-400 mb-1">
              <AnimatedCounter to={s.to} suffix={s.suffix} display={s.display} />
            </div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// ── Services ──────────────────────────────────────────────────────────────────

const SERVICES = [
  { Icon: Truck, title: 'Residential Moving', desc: 'Safe, efficient moving for homes of all sizes across Ontario.' },
  { Icon: Wrench, title: 'Furniture Assembly', desc: 'Expert disassembly and reassembly of all your furniture, handled with care.' },
  { Icon: Settings, title: 'Home Setup', desc: "We arrange furniture and connect appliances so you are ready to live from day one." },
  { Icon: Package, title: 'Packing & Unpacking', desc: 'Careful packing of your belongings with premium materials.' },
  { Icon: Building2, title: 'Condo Moving', desc: 'Specialized service for elevators, tight spaces, and building rules.' },
  { Icon: Car, title: 'Small Moves', desc: 'Cost-effective solutions for studios or a handful of items.' },
  { Icon: Clock, title: 'Last-Minute Moving', desc: 'Flexible scheduling for urgent and unexpected moving needs.' },
  { Icon: Users, title: 'Newcomer Support', desc: 'Extra guidance and setup help for those newly arriving in Ontario.' },
];

const Services = () => (
  <section id="services" className="py-24 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">One company. Everything handled.</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          From packing the first box to assembling your bed in the new place, we handle every detail.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            className="bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 border border-transparent dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── How it Works ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: '01', title: 'Tell us about your move', desc: 'Share your origin, destination, home type, and preferred date.' },
  { num: '02', title: 'Get a clear estimate', desc: 'Receive a transparent, upfront quote with no hidden fees.' },
  { num: '03', title: 'Book Your Hassle-Free Move', desc: 'Lock in your date. Our trained team will arrive on time.' },
  { num: '04', title: 'We move and set up', desc: 'We handle transport, unboxing, and furniture assembly.' },
  { num: '05', title: 'Enjoy your new place', desc: 'Relax in your fully set-up home. Welcome home.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How MapleNest Works</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">A seamless, stress-free process designed around your comfort.</p>
      </motion.div>

      <div className="relative">
        <div className="hidden lg:block absolute top-[46px] left-[calc(10%+48px)] right-[calc(10%+48px)] h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-5 group-hover:border-red-100 dark:group-hover:border-red-900 group-hover:shadow-lg transition-all duration-300 relative z-10">
                <span className="text-2xl font-extrabold text-slate-200 dark:text-slate-500 group-hover:text-red-500 transition-colors duration-300">
                  {step.num}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Features / Why Us ─────────────────────────────────────────────────────────

const FEATURES = [
  { Icon: Home, title: 'Full Home Setup', desc: 'More than moving, we help make your home fully ready from day one.' },
  { Icon: DollarSign, title: 'Upfront Pricing', desc: 'Clear rates before we start. No hidden fees, ever.' },
  { Icon: MapPin, title: 'Real-Time Tracking', desc: 'Know exactly where your belongings are during transit.' },
  { Icon: Camera, title: 'Photo Inventory', desc: 'Digital record of all your items for complete peace of mind.' },
  { Icon: Home, title: 'Setup After Moving', desc: "We don't just drop boxes; we build beds and arrange rooms." },
  { Icon: Building2, title: 'Condo Expertise', desc: 'We handle elevator bookings, parking, and building rules.' },
];

const Features = () => (
  <section id="why-us" className="py-24 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
    <Leaf className="absolute -bottom-20 -right-20 w-80 h-80 text-slate-800/60 pointer-events-none" />
    <Leaf className="absolute -top-10 -left-10 w-48 h-48 text-slate-800/40 pointer-events-none rotate-180" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:w-1/3 lg:sticky lg:top-32"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Why Ontarians<br />Choose MapleNest
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            We go beyond traditional moving. Our full relocation experience is built on care, transparency, and getting you settled in fast.
          </p>
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-red-600/30"
          >
            Book Your Move <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="bg-slate-800/60 dark:bg-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-red-900/50 hover:bg-slate-800 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-700/70 text-red-400 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Price Calculator ──────────────────────────────────────────────────────────

type PriceTier = 'standard' | 'premium';
type BedSize = '1bed' | '2bed' | '3bed' | '4bed';

const STANDARD_PRICES: Record<BedSize, number> = {
  '1bed': 1800,
  '2bed': 2400,
  '3bed': 3400,
  '4bed': 4800,
};

const PREMIUM_PRICES: Record<BedSize, number> = {
  '1bed': 3000,
  '2bed': 4500,
  '3bed': 5500,
  '4bed': 7000,
};

const BED_LABELS: Record<BedSize, string> = {
  '1bed': '1 Bedroom',
  '2bed': '2 Bedrooms',
  '3bed': '3 Bedrooms',
  '4bed': '4 Bedrooms',
};

const PriceCalculator = () => {
  const [tier, setTier] = useState<PriceTier>('standard');
  const [bedSize, setBedSize] = useState<BedSize | ''>('');

  const prices = tier === 'standard' ? STANDARD_PRICES : PREMIUM_PRICES;
  const price = bedSize ? prices[bedSize] : null;

  const btnBase = 'px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all';
  const btnActive = 'border-red-600 bg-red-600 text-white';
  const btnInactive = 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-800 bg-white dark:bg-slate-800';

  return (
    <section id="calculator" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Confidential Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How Much Will Your Move Cost?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">Select your service and home size for a starting price.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/40 border border-slate-100 dark:border-slate-700 p-8 md:p-10"
        >
          {/* Tier selector */}
          <div className="mb-8">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Service Package</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setTier('standard')}
                className={`flex flex-col gap-1 p-4 rounded-2xl border-2 text-left transition-all ${tier === 'standard' ? 'border-red-600 bg-red-50 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-600 hover:border-red-200 bg-white dark:bg-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Standard Full Service</span>
                  {tier === 'standard' && <CheckCircle2 className="w-4 h-4 text-red-600 ml-auto" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">Packing, transport, unpacking, setup & bed assembly</p>
              </button>

              <button
                onClick={() => setTier('premium')}
                className={`flex flex-col gap-1 p-4 rounded-2xl border-2 text-left transition-all ${tier === 'premium' ? 'border-red-600 bg-red-50 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-600 hover:border-red-200 bg-white dark:bg-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Premium White Glove</span>
                  {tier === 'premium' && <CheckCircle2 className="w-4 h-4 text-red-600 ml-auto" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">Everything in Standard + closet/kitchen org & box removal</p>
              </button>
            </div>
          </div>

          {/* Bed size */}
          <div className="mb-8">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Home Size</p>
            <div className="flex flex-wrap gap-2">
              {(['1bed', '2bed', '3bed', '4bed'] as BedSize[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBedSize(b)}
                  className={`${btnBase} ${bedSize === b ? btnActive : btnInactive}`}
                >
                  {BED_LABELS[b]}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {bedSize ? (
              <motion.div
                key={`${tier}-${bedSize}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-6 text-center"
              >
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {tier === 'standard' ? 'Standard Full Service' : 'Premium White Glove'} · {BED_LABELS[bedSize]}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Let's get you a quote for this move.
                </p>
                <a
                  href="#estimate"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-red-500/20"
                >
                  Get My Free Quote <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                  Pricing confirmed after on-site or virtual consultation.
                </p>
              </motion.div>
            ) : (
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-6 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-sm">Select your service package and home size.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// ── Before / After ────────────────────────────────────────────────────────────

const WITHOUT_US = [
  'Boxes stacked randomly for days',
  'IKEA bed unassembled on the floor',
  'Kitchen items in random boxes',
  'Wardrobe panels leaning on the wall',
  "You're exhausted after moving day",
  'It takes weeks to feel "at home"',
];

const WITH_US = [
  'Everything unpacked & in place',
  'IKEA bed assembled, sheets on',
  'Kitchen organised by category',
  'Wardrobe built & clothes hung',
  'You relax with coffee the same evening',
  'You feel at home from day one',
];

const BeforeAfter = () => (
  <section className="py-24 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          From Chaos to Cozy — In One Day
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Here's what changes when MapleNest takes care of your move.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* Without us */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-700 dark:text-red-400 text-base">Without MapleNest</h3>
          </div>
          <ul className="space-y-3">
            {WITHOUT_US.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Divider arrow */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
            <ArrowRight className="w-5 h-5 text-white dark:text-slate-900" />
          </div>
        </div>

        {/* With us */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-700 dark:text-green-400 text-base">With MapleNest</h3>
          </div>
          <ul className="space-y-3">
            {WITH_US.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-green-500 mt-0.5 shrink-0 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

// ── Ontario Coverage ──────────────────────────────────────────────────────────

const COVERAGE_REGIONS = [
  {
    region: 'Southwestern Ontario',
    cities: ['London', 'Windsor', 'Kitchener', 'Waterloo', 'Cambridge', 'Woodstock', 'St. Thomas'],
  },
  {
    region: 'Greater Toronto Area',
    cities: ['Toronto', 'Mississauga', 'Brampton', 'Hamilton'],
  },
];

const OntarioCoverage = () => (
  <section id="coverage" className="py-24 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm mb-5">
          <MapPin className="w-3.5 h-3.5" /> Where We Operate
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Cities We Serve
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          London, Brampton, Windsor, Hamilton, Kitchener, Waterloo, Mississauga, Toronto, Cambridge, Woodstock and St. Thomas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {COVERAGE_REGIONS.map(({ region, cities }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6"
          >
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{region}</h3>
            <ul className="space-y-2.5">
              {cities.map((city) => (
                <li key={city} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {city}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── Estimate Wizard ───────────────────────────────────────────────────────────

type WizardHomeType = 'Studio' | '1 Bed' | '2 Bed' | '3 Bed' | 'House';
type WizardService = 'Moving Only' | 'Move + Furniture Assembly' | 'Full Service (Move + Pack + Assemble)';

interface WizardForm {
  from: string;
  to: string;
  date: string;
  homeType: WizardHomeType | '';
  services: WizardService[];
  name: string;
  email: string;
  phone: string;
}

const WIZARD_HOME_TYPES: WizardHomeType[] = ['Studio', '1 Bed', '2 Bed', '3 Bed', 'House'];
const WIZARD_SERVICES: { label: WizardService; Icon: React.FC<{ className?: string }> }[] = [
  { label: 'Moving Only', Icon: Truck },
  { label: 'Move + Furniture Assembly', Icon: Wrench },
  { label: 'Full Service (Move + Pack + Assemble)', Icon: Sparkles },
];

const EstimateWizard = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<WizardForm>({
    from: '', to: '', date: '', homeType: '', services: [],
    name: '', email: '', phone: '',
  });

  const setField = <K extends keyof WizardForm>(key: K, val: WizardForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleService = (s: WizardService) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  };

  const goNext = () => { setDirection(1); setStep((s) => s + 1); };
  const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-red-400 focus:ring-4 focus:ring-red-50 dark:focus:ring-red-950/40 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700 text-sm';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5';

  const variants = {
    initial: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    animate: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <section id="estimate" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm mb-5">
            <CalendarDays className="w-3.5 h-3.5" /> Free, No-Obligation Estimate
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Get Your Free Estimate</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">Tell us about your move. We'll send a clear, upfront quote within 2 hours.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/40 border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-red-600 px-8 py-5 flex items-center gap-3">
            <Leaf className="w-6 h-6 text-white/80" fill="currentColor" />
            <div>
              <p className="text-white font-bold text-lg">MapleNest Moving Estimate</p>
              <p className="text-red-200 text-sm">Transparent pricing · No surprises</p>
            </div>
          </div>

          {/* Progress indicator */}
          {!submitted && (
            <div className="px-8 pt-6 pb-0">
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <React.Fragment key={i}>
                    <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-600'}`} />
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-slate-400 dark:text-slate-500">Your Move</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Your Home</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Contact</span>
              </div>
            </div>
          )}

          <div className="p-8 md:p-10 pt-6 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Estimate Request Sent!</h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Our team will reach out to <strong className="text-slate-900 dark:text-white">{form.email}</strong> within 2 hours with your free quote.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setStep(0); setForm({ from: '', to: '', date: '', homeType: '', services: [], name: '', email: '', phone: '' }); }}
                    className="mt-8 text-red-600 dark:text-red-400 hover:text-red-700 font-medium text-sm"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : step === 0 ? (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Step 1 of 3 — Your Move</h3>
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Moving From</label>
                      <input type="text" placeholder="Toronto, ON" value={form.from} onChange={(e) => setField('from', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Moving To</label>
                      <input type="text" placeholder="Ottawa, ON" value={form.to} onChange={(e) => setField('to', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Move Date</label>
                      <input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <button
                    onClick={goNext}
                    className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Step 2 of 3 — Your Home</h3>

                  <div className="mb-6">
                    <p className={labelCls}>Home Type</p>
                    <div className="flex flex-wrap gap-2">
                      {WIZARD_HOME_TYPES.map((h) => (
                        <button
                          key={h}
                          onClick={() => setField('homeType', h)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                            form.homeType === h
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-300 bg-white dark:bg-slate-700'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className={labelCls}>Services Needed</p>
                    <div className="space-y-2">
                      {WIZARD_SERVICES.map(({ label, Icon }) => (
                        <button
                          key={label}
                          onClick={() => toggleService(label)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                            form.services.includes(label)
                              ? 'border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                              : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-200 bg-white dark:bg-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium">{label}</span>
                          {form.services.includes(label) && <CheckCircle2 className="w-4 h-4 ml-auto text-red-600 dark:text-red-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="flex-1 py-3.5 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all hover:border-slate-300 dark:hover:border-slate-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Step 3 of 3 — Contact Info</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await emailjs.send(
                          'service_fvathhx',
                          'template_y6smoww',
                          {
                            from_city: form.from,
                            to_city: form.to,
                            move_date: form.date,
                            home_type: form.homeType,
                            services: form.services.join(', '),
                            client_name: form.name,
                            client_email: form.email,
                            client_phone: form.phone,
                          },
                          'YhsGCRCbDh6xdny3I'
                        );
                      } finally {
                        setSubmitted(true);
                      }
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input type="text" placeholder="Jane Smith" required value={form.name} onChange={(e) => setField('name', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input type="email" placeholder="jane@email.com" required value={form.email} onChange={(e) => setField('email', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone (optional)</label>
                      <input type="tel" placeholder="(416) 555-0100" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={inputCls} />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                      {['No commitment required', 'Free within 2 hours', 'Upfront pricing'].map((t) => (
                        <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900/50">
                          <CheckCircle2 className="w-3 h-3" /> {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex-1 py-3.5 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all hover:border-slate-300 dark:hover:border-slate-500"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/25"
                      >
                        Get My Free Estimate <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ── Testimonials ──────────────────────────────────────────────────────────────

const REVIEWS = [
  { name: 'Sarah L.', loc: 'Toronto, ON', text: 'Moving is usually a nightmare, but MapleNest made it a breeze. They not only moved my stuff safely but set up my entire living room. Incredible service!' },
  { name: 'David M.', loc: 'London, ON', text: 'The upfront pricing was exactly what I paid. No surprises. The photo inventory gave me so much peace of mind for my cross-city move.' },
  { name: 'Elena K.', loc: 'Mississauga, ON', text: 'As a newcomer to Ontario, finding a reliable moving company was stressful. MapleNest assembled all my furniture and handled every condo rule perfectly.' },
];

const Testimonials = () => (
  <section className="py-24 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Loved by Ontarians</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">Don't just take our word for it. Here's what our customers say.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col relative"
          >
            <div className="absolute top-5 right-7 text-7xl font-serif text-slate-100 dark:text-slate-700 leading-none select-none pointer-events-none">"</div>
            <div className="flex gap-1 mb-5 text-amber-400">
              {[...Array(5)].map((_, j) => <Star key={j} fill="currentColor" size={16} />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1 relative z-10">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950 dark:to-red-900 flex items-center justify-center font-bold text-red-600 dark:text-red-400 text-base shrink-0">
                {r.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</div>
                <div className="text-slate-400 dark:text-slate-500 text-xs">{r.loc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'Do you disassemble and reassemble IKEA furniture?',
    a: "Yes — and we're very good at it. Disassembling and reassembling ALL furniture (IKEA included) is a standard part of every move. PAX wardrobes, HEMNES beds, KALLAX shelving — we've built them all. You won't need to lift a screwdriver.",
  },
  {
    q: 'Do you handle condo moves with elevator restrictions?',
    a: "Absolutely. We coordinate elevator bookings, secure parking permits, and follow every building's move-in rules. Condos are our specialty.",
  },
  {
    q: 'What areas of Ontario do you serve?',
    a: 'We serve London, Brampton, Windsor, Hamilton, Kitchener, Waterloo, Mississauga, Toronto, Cambridge, Woodstock and St. Thomas. See our coverage map above.',
  },
  {
    q: 'Is my move insured?',
    a: 'Yes. All moves include standard protection. For high-value or fragile items, we work with your insurance provider. Ask us about full-value protection when you book.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend 2–4 weeks for weekend moves. Weekday availability is often better. We also offer last-minute bookings with 24–48 hours notice — just call us.',
  },
  {
    q: 'Can I book JUST furniture assembly without a move?',
    a: "Yes! Furniture assembly is available as a standalone service. Whether it's new IKEA pieces or disassembly for a renovation, we've got you covered.",
  },
  {
    q: "What items can't you move?",
    a: 'Hazardous materials (propane, paint, chemicals) and live plants. For specialty items like pianos, pool tables, or large safes, ask us and we\'ll find a solution.',
  },
  {
    q: 'How long does a typical move take?',
    a: 'Studio/1-bed: 3–5 hours. 2-bed apartment: 5–7 hours. 3-bed house with full setup: 8–12 hours. Times vary based on floors, elevator access, and add-on services.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Common Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">Everything you need to know before your move.</p>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? 'border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/10'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50'
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`text-sm font-semibold leading-snug ${openIndex === i ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400'}`}>
                  {i === 0 && <span className="inline-block mr-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">Popular</span>}
                  {item.q}
                </span>
                {openIndex === i
                  ? <ChevronUp className="w-4 h-4 text-red-500 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                }
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-red-100 dark:border-red-900/30 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Blog Tips ─────────────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    Icon: CheckCircle2,
    title: '8-Week Moving Checklist',
    tags: ['Planning', 'Free Download'],
    snippet: 'From booking your movers to notifying utilities — a week-by-week timeline to keep your move on track.',
    cta: 'Read Guide',
  },
  {
    Icon: Package,
    title: 'How to Pack Fragile Items Like a Pro',
    tags: ['Packing', 'Safety'],
    snippet: 'Our packers share the exact techniques they use every day: dish packs, cell boxes, and the bubble wrap method.',
    cta: 'Read Guide',
  },
  {
    Icon: Building2,
    title: 'Condo Moves in Ontario: The Complete Guide',
    tags: ['Condo', 'Ontario'],
    snippet: 'Elevator bookings, parking permits, damage deposits — everything you need to know before move day.',
    cta: 'Read Guide',
  },
];

const BlogTips = () => (
  <section className="py-24 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Moving Tips from Our Team</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">Practical advice from people who move Ontarians every day.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map(({ Icon, title, tags, snippet, cta }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-7 flex flex-col group hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-5">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 flex-1">{snippet}</p>
            <a href="#" className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-semibold group-hover:gap-2.5 transition-all">
              {cta} <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="mb-4">
            <img src="/logo/LogoImage.png" alt="MapleNest" className="h-12 w-auto" />
          </div>
          <p className="text-sm leading-relaxed mb-5">We move. We set up. You enjoy your new home. Ontario's premium moving & furniture assembly service.</p>
          <div className="flex flex-col gap-2 text-sm">
            <a href="tel:+12269776703" className="hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500 shrink-0" /> (226) 977-6703
            </a>
            <a href="mailto:maplenestmovingsetup@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500 shrink-0" /> maplenestmovingsetup@gmail.com
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {['Residential Moving', 'Condo Moving', 'Furniture Assembly', 'Packing Services', 'Home Setup'].map((s) => (
              <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#coverage" className="hover:text-white transition-colors">Coverage Area</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm">Ontario Cities</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              'London', 'Brampton', 'Windsor', 'Hamilton',
              'Kitchener', 'Waterloo', 'Mississauga', 'Toronto',
              'Cambridge', 'Woodstock', 'St. Thomas',
            ].map((city) => (
              <li key={city} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} MapleNest Moving & Setup Inc. All rights reserved. Ontario, Canada.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

// ── WhatsApp Button ───────────────────────────────────────────────────────────

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) { setVisible(true); return; }
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2"
        >
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
              >
                Chat on WhatsApp
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href="https://wa.me/12269776703?text=Hi%20MapleNest!%20I%27m%20interested%20in%20your%20moving%20services.%20Could%20you%20help%20me%20with%20my%20upcoming%20move%3F"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Chat on WhatsApp"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/40 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              width="28"
              height="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Mobile Floating CTA ───────────────────────────────────────────────────────

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-4 right-24 z-40 md:hidden"
        >
          <a
            href="#estimate"
            className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-2xl shadow-red-600/40"
          >
            Get a Free Estimate <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────

// ── Gallery ───────────────────────────────────────────────────────────────────

const GALLERY_ITEMS = [
  { src: '/images/gallery/slide-03-checklist.jpg',       title: 'Your First Night, Perfectly Set Up',           tag: 'White Glove' },
  { src: '/images/gallery/slide-05-clutter-free.jpg',    title: 'The Complete Moving Experience. Door to Door.', tag: 'Moving'      },
  { src: '/images/gallery/slide-07-home-organizing.jpg', title: 'Moving Next Week? Here Is Your Checklist.',     tag: 'Tips'        },
  { src: '/images/gallery/slide-09-finishing-touch.jpg', title: 'Their Space, Ready First.',                     tag: 'Family'      },
  { src: '/images/gallery/slide-12-door-to-door.jpg',    title: 'Your Kitchen, Move-In Ready.',                  tag: 'Kitchen'     },
  { src: '/images/gallery/slide-01-first-night.jpg',     title: 'Do More Than Move. Set Up.',                    tag: 'Organising'  },
  { src: '/images/gallery/slide-04-family-move.jpg',     title: 'Your New Chapter Begins With Ease.',            tag: 'Moving'      },
  { src: '/images/gallery/slide-06-kitchen.jpg',         title: 'The Finishing Touch. A Stress-Free Welcome.',   tag: 'Setup'       },
  { src: '/images/gallery/slide-08-new-chapter.jpg',     title: 'White Glove. A Setup, Not Just a Move.',        tag: 'White Glove' },
  { src: '/images/gallery/slide-10-white-glove.jpg',     title: "Walk In. Sit Down. You're Home.",               tag: 'Moving'      },
];

const TAG_COLORS: Record<string, string> = {
  'White Glove': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Moving':      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Tips':        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Family':      'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  'Setup':       'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Kitchen':     'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'Organising':  'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const Gallery = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Close on ESC
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i! + 1) % GALLERY_ITEMS.length);
      if (e.key === 'ArrowLeft')  setLightbox((i) => (i! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <section id="gallery" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 font-medium text-sm mb-4">
            <Leaf className="w-3.5 h-3.5" /> Our Work in Action
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            See What MapleNest Delivers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            From first-night setups to white glove organization. Real results from real Ontario moves.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
              onClick={() => setLightbox(i)}
              className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-400"
              aria-label={item.title}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${TAG_COLORS[item.tag] ?? 'bg-white/20 text-white'}`}>
                  {item.tag}
                </span>
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2 text-left">
                  {item.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/maplenestmoving"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition-all"
          >
            {/* Instagram icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Follow @maplenestmoving on Instagram
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_ITEMS[lightbox].src}
                alt={GALLERY_ITEMS[lightbox!].title}
                className="w-full rounded-2xl shadow-2xl"
              />

              {/* Title bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${TAG_COLORS[GALLERY_ITEMS[lightbox].tag] ?? 'bg-white/20 text-white'}`}>
                  {GALLERY_ITEMS[lightbox].tag}
                </span>
                <p className="text-white font-semibold text-base leading-snug">
                  {GALLERY_ITEMS[lightbox].title}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl hover:bg-red-50 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Prev / Next */}
              <button
                onClick={() => setLightbox((i) => (i! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Previous"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <button
                onClick={() => setLightbox((i) => (i! + 1) % GALLERY_ITEMS.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Next"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>

              {/* Counter */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                {lightbox + 1} / {GALLERY_ITEMS.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, toggleDark] = useDarkMode();

  return (
    <div className="min-h-screen selection:bg-red-100 selection:text-red-800">
      <Navbar dark={dark} toggleDark={toggleDark} />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <HowItWorks />
        <Features />
        <PriceCalculator />
        <OntarioCoverage />
        <EstimateWizard />
        <Testimonials />
        <Gallery />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
      <FloatingCTA />
    </div>
  );
}
