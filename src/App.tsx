/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Moon, Sun, Heart, CheckCircle2, Home, Compass, User, Play, Pause, Settings, Calendar, Activity, ArrowLeft, X } from 'lucide-react';

// --- Types ---
type Tab = 'home' | 'explore' | 'profile';
type ViewState = 'main' | 'breathing' | 'session';

interface SessionData {
  title: string;
  desc: string;
  time: string;
  icon: React.ElementType;
}

// --- Components ---

const Annotation = ({
  title,
  text,
  side,
  top,
  delay,
}: {
  title: string;
  text: string;
  side: 'left' | 'right';
  top: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      className={`absolute hidden lg:flex flex-col w-80 ${
        side === 'left' ? 'right-[calc(100%+4rem)] items-end text-right' : 'left-[calc(100%+4rem)] items-start text-left'
      }`}
      style={{ top }}
    >
      {/* Connecting Line */}
      <div
        className={`absolute top-6 w-16 h-[2px] bg-accent/50 shadow-[0_0_10px_var(--color-accent-glow)] ${
          side === 'left' ? 'left-full' : 'right-full'
        }`}
      />
      
      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 hover:border-accent/50 p-6 rounded-2xl shadow-2xl hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all duration-300 relative group cursor-crosshair">
        {/* Inner Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
        
        <h4 className="text-accent font-display font-bold text-sm uppercase tracking-widest mb-3 drop-shadow-[0_0_8px_var(--color-accent-glow)]">{title}</h4>
        <p className="text-text-muted text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, textShadow: "0 0 8px var(--color-accent)" }}
    whileTap={{ scale: 0.9 }}
    className={`flex flex-col items-center gap-1.5 p-2 min-w-[64px] transition-colors ${active ? 'text-accent drop-shadow-[0_0_12px_var(--color-accent-glow)]' : 'text-text-muted hover:text-accent'}`}
  >
    <div className={`relative ${active ? 'scale-110 transition-transform' : ''}`}>
      {icon}
      {active && (
        <motion.div layoutId="nav-indicator" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_var(--color-accent)]" />
      )}
    </div>
    <span className="text-[10px] font-medium tracking-wider uppercase">{label}</span>
  </motion.button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  
  // Functional States
  const [progress] = useState(5); // minutes
  const [settings, setSettings] = useState({ notifications: true, sounds: false });
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Mantén' | 'Exhala'>('Inhala');

  // Breathing Logic
  useEffect(() => {
    if (currentView !== 'breathing') return;
    
    let phaseIndex = 0;
    const phases: ('Inhala' | 'Mantén' | 'Exhala')[] = ['Inhala', 'Mantén', 'Exhala', 'Mantén'];
    const times = [4000, 4000, 4000, 4000]; // Box breathing (4s each)
    let timeout: NodeJS.Timeout;

    const nextPhase = () => {
      setBreathPhase(phases[phaseIndex]);
      timeout = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % 4;
        nextPhase();
      }, times[phaseIndex]);
    };
    
    nextPhase();
    return () => clearTimeout(timeout);
  }, [currentView]);

  const openSession = (session: SessionData) => {
    setSelectedSession(session);
    setIsPlaying(false);
    setCurrentView('session');
  };

  const renderHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-10 pb-6">
      {/* Header */}
      <div className="relative w-full">
        <header className="text-center py-2">
          <h1 className="font-display text-3xl font-bold text-text mb-2 tracking-tight">Buenos días, Jhostin</h1>
          <p className="text-text-muted text-sm font-medium">Tu mente está tranquila hoy.</p>
        </header>
      </div>

      {/* Central Pulse Button */}
      <div className="relative w-full flex justify-center py-6">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px var(--color-accent-glow)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('breathing')}
            className="w-40 h-40 rounded-full bg-surface border border-accent/50 text-accent flex flex-col items-center justify-center shadow-[0_0_40px_var(--color-accent-glow)] relative z-10 transition-shadow"
          >
            <Wind size={40} strokeWidth={1.5} className="mb-2 drop-shadow-[0_0_8px_var(--color-accent-glow)]" />
            <span className="font-display font-bold text-sm tracking-widest uppercase">Respirar</span>
          </motion.button>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="relative w-full">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-text mb-2 tracking-wide uppercase text-sm text-text-muted">Prácticas sugeridas</h2>
          
          {[
            { title: 'Despertar Suave', desc: 'Meditación guiada', time: '3 min', icon: Sun },
            { title: 'Escaneo Corporal', desc: 'Relajación profunda', time: '10 min', icon: Heart }
          ].map((item, i) => (
            <motion.div
              key={i}
              onClick={() => openSession(item)}
              whileHover={{ scale: 1.04, borderColor: "var(--color-accent)", boxShadow: "0 0 25px var(--color-accent-glow)" }}
              whileTap={{ scale: 0.96 }}
              className="bg-surface p-4 rounded-2xl flex items-center gap-4 cursor-pointer border border-white/5 transition-colors shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 shadow-[inset_0_0_15px_var(--color-accent-glow)]">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-text">{item.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <span className="text-xs font-bold text-accent">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full mt-2">
        <div className="bg-surface p-5 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-display font-bold text-text text-sm">Tu progreso hoy</h3>
              <p className="text-xs text-text-muted mt-1">Objetivo: 15 min</p>
            </div>
            <div className="flex items-center gap-1 text-accent drop-shadow-[0_0_5px_var(--color-accent-glow)]">
              <CheckCircle2 size={16} strokeWidth={2} />
              <span className="font-display font-bold text-sm">{progress} min</span>
            </div>
          </div>
          <div className="h-2 w-full bg-bg rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 15) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-accent rounded-full shadow-[0_0_10px_var(--color-accent-glow)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderExplore = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8 pb-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-text mb-2 tracking-tight">Explorar</h1>
        <p className="text-text-muted text-sm font-medium">Encuentra tu práctica ideal para hoy.</p>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
        {['Todos', 'Dormir', 'Ansiedad', 'Foco', 'Respiración'].map((cat, i) => (
          <motion.button 
            key={cat} 
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px var(--color-accent-glow)" }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 font-display font-bold tracking-wide ${i === 0 ? 'bg-accent text-bg shadow-[0_0_15px_var(--color-accent-glow)]' : 'bg-surface text-text-muted hover:text-accent hover:border-accent/50 border border-white/5'}`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {[
          { title: 'Sueño Profundo', desc: 'Meditación guiada', time: '15 min', icon: Moon },
          { title: 'Calmar la Ansiedad', desc: 'Respiración 4-7-8', time: '5 min', icon: Wind },
          { title: 'Foco y Claridad', desc: 'Atención plena', time: '10 min', icon: Sun },
          { title: 'Amor Propio', desc: 'Escaneo corporal', time: '20 min', icon: Heart },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            onClick={() => openSession(item)}
            whileHover={{ scale: 1.04, borderColor: "var(--color-accent)", boxShadow: "0 0 25px var(--color-accent-glow)" }}
            whileTap={{ scale: 0.96 }}
            className="bg-surface p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 border border-white/5 shadow-lg group"
          >
            <div className="w-12 h-12 rounded-full bg-accent/5 group-hover:bg-accent/10 flex items-center justify-center text-accent shrink-0 transition-colors">
              <item.icon size={24} strokeWidth={1.5} className="group-hover:drop-shadow-[0_0_8px_var(--color-accent-glow)] transition-all" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-text group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted group-hover:text-accent transition-colors">{item.time}</span>
              <button className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:shadow-[0_0_10px_var(--color-accent-glow)] transition-shadow">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8 pb-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text mb-2 tracking-tight">Mi Perfil</h1>
          <p className="text-text-muted text-sm font-medium">Tu viaje hacia la calma.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90, boxShadow: "0 0 20px var(--color-accent-glow)", borderColor: "var(--color-accent)" }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-accent transition-all border border-white/5"
        >
          <Settings size={20} />
        </motion.button>
      </header>

      <motion.div 
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px var(--color-accent-glow)", borderColor: "var(--color-accent)" }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-white/5 shadow-lg relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="w-16 h-16 rounded-full bg-surface border border-accent/50 flex items-center justify-center text-accent text-2xl font-display font-bold shadow-[0_0_15px_var(--color-accent-glow)] z-10">
          J
        </div>
        <div className="z-10">
          <h2 className="font-display font-bold text-lg text-text">Jhostin</h2>
          <p className="text-sm text-accent font-medium">Miembro Pro</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05, borderColor: "var(--color-accent)", boxShadow: "0 0 25px var(--color-accent-glow)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-surface p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 shadow-lg transition-colors group cursor-pointer"
        >
          <Activity className="text-accent group-hover:drop-shadow-[0_0_8px_var(--color-accent-glow)] transition-all" size={24} />
          <div>
            <div className="text-3xl font-display font-bold text-text group-hover:text-accent transition-colors">120</div>
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mt-1">Minutos</div>
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05, borderColor: "var(--color-accent)", boxShadow: "0 0 25px var(--color-accent-glow)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-surface p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 shadow-lg transition-colors group cursor-pointer"
        >
          <Calendar className="text-accent group-hover:drop-shadow-[0_0_8px_var(--color-accent-glow)] transition-all" size={24} />
          <div>
            <div className="text-3xl font-display font-bold text-text group-hover:text-accent transition-colors">5</div>
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mt-1">Racha</div>
          </div>
        </motion.div>
      </div>

      <div className="bg-surface rounded-2xl border border-white/5 p-5 shadow-lg">
        <h3 className="font-display font-bold text-text mb-5 uppercase text-sm tracking-wider text-text-muted">Ajustes rápidos</h3>
        <div className="flex flex-col gap-5">
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
            className="flex items-center justify-between group cursor-pointer"
          >
            <span className="text-sm font-medium text-text-muted group-hover:text-text transition-colors">Notificaciones diarias</span>
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.notifications ? 'bg-accent/20 border border-accent/50 shadow-[0_0_10px_var(--color-accent-glow)]' : 'bg-bg border border-white/10'}`}>
              <motion.div 
                animate={{ x: settings.notifications ? 24 : 4 }}
                className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${settings.notifications ? 'bg-accent shadow-[0_0_5px_var(--color-accent-glow)]' : 'bg-text-muted'}`} 
              />
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSettings(s => ({ ...s, sounds: !s.sounds }))}
            className="flex items-center justify-between group cursor-pointer"
          >
            <span className="text-sm font-medium text-text-muted group-hover:text-text transition-colors">Sonidos de fondo</span>
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.sounds ? 'bg-accent/20 border border-accent/50 shadow-[0_0_10px_var(--color-accent-glow)]' : 'bg-bg border border-white/10'}`}>
              <motion.div 
                animate={{ x: settings.sounds ? 24 : 4 }}
                className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${settings.sounds ? 'bg-accent shadow-[0_0_5px_var(--color-accent-glow)]' : 'bg-text-muted'}`} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderBreathing = () => (
    <motion.div 
      key="breathing"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.1 }} 
      className="absolute inset-0 bg-bg z-50 flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={() => setCurrentView('main')}
        className="absolute top-12 left-6 w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text hover:text-accent hover:border-accent/50 transition-all z-50"
      >
        <X size={24} />
      </button>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Breathing Circle Animation */}
        <motion.div
          animate={{ 
            scale: breathPhase === 'Inhala' ? 1.5 : breathPhase === 'Exhala' ? 1 : breathPhase === 'Mantén' ? (breathPhase === 'Inhala' ? 1.5 : 1) : 1,
            opacity: breathPhase === 'Mantén' ? 0.5 : 0.8
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-accent/20 border-2 border-accent shadow-[0_0_50px_var(--color-accent-glow)]"
        />
        
        <div className="z-10 text-center">
          <motion.h2 
            key={breathPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-display text-4xl font-bold text-text drop-shadow-[0_0_10px_var(--color-accent-glow)]"
          >
            {breathPhase}
          </motion.h2>
          <p className="text-accent mt-2 font-medium tracking-widest uppercase text-sm">4-4-4-4</p>
        </div>
      </div>
    </motion.div>
  );

  const renderSession = () => {
    if (!selectedSession) return null;
    const Icon = selectedSession.icon;

    return (
      <motion.div 
        key="session"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 50 }} 
        className="absolute inset-0 bg-bg z-50 flex flex-col p-6 pt-12"
      >
        <header className="flex items-center justify-between mb-12">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView('main')}
            className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text hover:text-accent hover:border-accent/50 transition-all"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <span className="font-display font-bold text-accent tracking-widest uppercase text-xs">Reproduciendo</span>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div 
            animate={{ 
              boxShadow: isPlaying ? "0 0 60px var(--color-accent-glow)" : "0 0 20px rgba(0,0,0,0)",
              scale: isPlaying ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-surface border border-accent/20 flex items-center justify-center mb-10 relative"
          >
            <div className="absolute inset-0 rounded-full bg-accent/5" />
            <Icon size={80} className="text-accent drop-shadow-[0_0_15px_var(--color-accent-glow)]" strokeWidth={1} />
          </motion.div>

          <h2 className="font-display text-3xl font-bold text-text mb-3">{selectedSession.title}</h2>
          <p className="text-text-muted text-lg">{selectedSession.desc}</p>
        </div>

        <div className="mt-auto pb-10">
          {/* Fake Progress Bar */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs text-text-muted font-medium">0:00</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden relative">
              <motion.div 
                animate={{ width: isPlaying ? "100%" : "0%" }}
                transition={{ duration: parseInt(selectedSession.time) * 60, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)]"
              />
            </div>
            <span className="text-xs text-text-muted font-medium">{selectedSession.time}</span>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 30px var(--color-accent-glow)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-accent text-bg flex items-center justify-center shadow-[0_0_20px_var(--color-accent-glow)]"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-transparent text-text font-sans flex items-center justify-center lg:p-8 relative overflow-hidden">
      
      {/* Outer Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="relative flex items-center justify-center w-full h-[100dvh] lg:h-auto lg:max-w-6xl">
        
        {/* Phone Mockup Container */}
        <div className="relative w-full h-full lg:max-w-[375px] lg:h-[812px] bg-bg lg:rounded-[3rem] lg:border-[8px] lg:border-surface shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden shrink-0 z-10">
          
          {/* Hardware Notch */}
          <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-surface rounded-b-3xl z-50 items-center justify-center">
            <div className="w-16 h-1.5 bg-black/50 rounded-full"></div>
          </div>

          {/* App Content Area */}
          <div className="w-full h-full flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentView === 'main' && (
                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto pb-24 px-6 pt-8 lg:pt-14 scrollbar-hide">
                    <AnimatePresence mode="wait">
                      {activeTab === 'home' && <React.Fragment key="home">{renderHome()}</React.Fragment>}
                      {activeTab === 'explore' && <React.Fragment key="explore">{renderExplore()}</React.Fragment>}
                      {activeTab === 'profile' && <React.Fragment key="profile">{renderProfile()}</React.Fragment>}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation */}
                  <nav className="absolute bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-around items-center px-2">
                      <NavItem icon={<Home size={24} strokeWidth={1.5} />} label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                      <NavItem icon={<Compass size={24} strokeWidth={1.5} />} label="Explorar" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
                      <NavItem icon={<User size={24} strokeWidth={1.5} />} label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    </div>
                  </nav>
                </motion.div>
              )}
              
              {currentView === 'breathing' && renderBreathing()}
              {currentView === 'session' && renderSession()}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Annotations (Visible on larger screens only when in main view) */}
        <AnimatePresence mode="wait">
          {currentView === 'main' && activeTab === 'home' && (
            <React.Fragment key="ann-home">
              <Annotation
                title="Estética Neón"
                text="Contraste extremo con fondos ultra oscuros para resaltar elementos interactivos mediante brillos (glows)."
                side="left"
                top="15%"
                delay={0.2}
              />
              <Annotation
                title="Botón de Pulso"
                text="Haz clic en 'Respirar' para abrir la vista inmersiva de respiración guiada (4-4-4-4)."
                side="right"
                top="40%"
                delay={0.4}
              />
              <Annotation
                title="Jerarquía Visual"
                text="Uso de tipografía Space Grotesk para títulos, creando un aspecto tecnológico, moderno y estructurado."
                side="left"
                top="65%"
                delay={0.6}
              />
            </React.Fragment>
          )}

          {currentView === 'main' && activeTab === 'explore' && (
            <React.Fragment key="ann-explore">
              <Annotation
                title="Navegación Fluida"
                text="Scroll horizontal sin barras (scrollbar-hide) para un descubrimiento de categorías inmersivo y limpio."
                side="left"
                top="20%"
                delay={0.2}
              />
              <Annotation
                title="Micro-interacciones"
                text="Haz clic en cualquier tarjeta para abrir el reproductor de meditación funcional."
                side="right"
                top="50%"
                delay={0.4}
              />
            </React.Fragment>
          )}

          {currentView === 'main' && activeTab === 'profile' && (
            <React.Fragment key="ann-profile">
              <Annotation
                title="Gamificación"
                text="Estadísticas visuales con tipografía display de alto contraste para reforzar el hábito del usuario."
                side="left"
                top="30%"
                delay={0.2}
              />
              <Annotation
                title="Controles Rápidos"
                text="Prueba a hacer clic en los switches estilo neón para ver cómo cambian de estado."
                side="right"
                top="60%"
                delay={0.4}
              />
            </React.Fragment>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
