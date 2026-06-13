'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Chapter1Engineering } from './components/Chapter1Engineering';
import { Chapter2Services } from './components/Chapter2Services';
import { Chapter3Products } from './components/Chapter3Products';
import { Chapter4HowWeWork } from './components/Chapter4HowWeWork';
import { Chapter6CaseStudies } from './components/Chapter6CaseStudies';
import { Chapter7WhyNavHigh } from './components/Chapter7WhyNavHigh';
import { Chapter8Insights } from './components/Chapter8Insights';
import { FinalChapter } from './components/FinalChapter';
import { Hero3D } from './components/Hero3D';
import { TechSolarSystem3D } from './components/TechSolarSystem3D';

const NAV_ITEMS = ['Services', 'Products', 'Work', 'About', 'Insights'];

/* ─── NavHigh logo mark (arrow chevron) ─────────────────────── */
const NavHighMark: React.FC<{ size?: number; fill?: string }> = ({ size = 24, fill = '#ffffff' }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={fill}>
        <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
);

const Home: React.FC = () => {
    /* ── Smoothed cursor for hero canvas ────────────────────── */
    const mouseRaw = useRef({ x: -999, y: -999 });
    const mouseSmooth = useRef({ x: -999, y: -999 });
    const rafCursor = useRef<number | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    /* Scroll-based nav glassmorphism */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Smooth cursor loop */
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseRaw.current = { x: e.clientX, y: e.clientY };
            if (mouseSmooth.current.x === -999) mouseSmooth.current = { x: e.clientX, y: e.clientY };
        };

        const tick = () => {
            if (mouseSmooth.current.x !== -999) {
                mouseSmooth.current.x += (mouseRaw.current.x - mouseSmooth.current.x) * 0.1;
                mouseSmooth.current.y += (mouseRaw.current.y - mouseSmooth.current.y) * 0.1;
                setCursorPos({ x: mouseSmooth.current.x, y: mouseSmooth.current.y });
            }
            rafCursor.current = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove);
        rafCursor.current = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener('mousemove', onMove);
            if (rafCursor.current) cancelAnimationFrame(rafCursor.current);
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#030308] tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* ══════════════════════════════════════════════════
                FIXED NAVIGATION
            ══════════════════════════════════════════════════ */}
            <nav
                className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-8 py-4 transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(3,3,8,0.85)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                }}
            >
                {/* Logo + wordmark */}
                <div className="flex items-center gap-2.5 select-none">
                    <NavHighMark size={22} fill="#ffffff" />
                    <span className="text-white font-bold text-lg tracking-[-0.03em]">NavHigh</span>
                </div>

                {/* Desktop pill nav */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.07] backdrop-blur-md border border-white/[0.1] rounded-full px-2 py-1.5">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item}
                            className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* CTA + hamburger */}
                <div className="flex items-center gap-3">
                    <button className="hidden md:flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95">
                        Get Started
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 bg-[#030308]/97 z-[90] flex flex-col justify-center items-center gap-6 md:hidden">
                    {NAV_ITEMS.map((item, i) => (
                        <button
                            key={item}
                            onClick={() => setMenuOpen(false)}
                            className="text-2xl font-semibold text-white/80 hover:text-white transition-colors"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="mt-4 bg-[#e8702a] text-white text-base font-semibold px-8 py-3.5 rounded-full"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                HERO — NavHigh Technologies
            ══════════════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden bg-[#030308]" style={{ height: '100dvh' }}>
                {/* 3-D particle logo canvas */}
                <Hero3D
                    cursorX={cursorPos.x}
                    cursorY={cursorPos.y}
                    className="absolute inset-0 pointer-events-none z-10"
                />

                {/* Radial vignette darkens edges */}
                <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_35%,#030308_100%)]" />

                {/* Top + bottom gradient fades */}
                <div className="absolute inset-x-0 top-0 h-40 z-20 pointer-events-none bg-gradient-to-b from-[#030308] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-[#030308] to-transparent" />

                {/* Subtle blue glow at center */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    }}
                />

                {/* ── Hero content ────────────────────────────── */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                    {/* Label */}
                    <div className="hero-anim hero-fade mb-6" style={{ animationDelay: '0.15s' }}>
                        <span className="inline-flex items-center gap-2 text-blue-400/70 text-[11px] font-semibold tracking-[0.3em] uppercase">
                            <span className="block w-4 h-px bg-blue-400/50" />
                            NavHigh Technologies
                            <span className="block w-4 h-px bg-blue-400/50" />
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-white leading-[0.9] flex flex-col items-center gap-1 pointer-events-none">
                        <span
                            className="block font-bold text-[clamp(2.8rem,8.5vw,7.5rem)] tracking-[-0.04em] hero-anim hero-reveal"
                            style={{ animationDelay: '0.28s' }}
                        >
                            We Build What
                        </span>
                        <span
                            className="block font-bold text-[clamp(2.8rem,8.5vw,7.5rem)] tracking-[-0.04em] hero-anim hero-reveal"
                            style={{
                                animationDelay: '0.44s',
                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 45%, #f97316 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Moves Business.
                        </span>
                    </h1>

                    {/* Sub */}
                    <p
                        className="mt-7 max-w-[520px] text-white/50 text-lg leading-relaxed hero-anim hero-fade"
                        style={{ animationDelay: '0.62s' }}
                    >
                        AI-native products, scalable systems, and long-term engineering partnerships for ambitious
                        companies.
                    </p>

                    {/* CTAs */}
                    <div
                        className="mt-10 flex flex-col sm:flex-row items-center gap-3 hero-anim hero-fade pointer-events-auto"
                        style={{ animationDelay: '0.78s' }}
                    >
                        <button className="bg-[#e8702a] hover:bg-[#d2611f] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
                            Start Building
                        </button>
                        <button className="text-white/60 hover:text-white text-sm font-medium px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 transition-all duration-200">
                            See Our Work →
                        </button>
                    </div>

                    {/* Stats strip */}
                    <div
                        className="mt-14 flex items-center gap-8 sm:gap-12 hero-anim hero-fade"
                        style={{ animationDelay: '0.95s' }}
                    >
                        {[
                            { v: '150+', l: 'Projects' },
                            { v: '98%', l: 'Retention' },
                            { v: '40+', l: 'Enterprise clients' },
                        ].map((s, i) => (
                            <React.Fragment key={s.l}>
                                {i > 0 && <span className="w-px h-6 bg-white/10" />}
                                <div className="text-center">
                                    <div className="text-white font-bold text-xl tracking-tight">{s.v}</div>
                                    <div className="text-white/30 text-xs mt-0.5">{s.l}</div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Cursor hint — bottom left */}
                <div
                    className="absolute bottom-10 left-8 z-30 hidden sm:flex items-center gap-2 hero-anim hero-fade"
                    style={{ animationDelay: '1.1s' }}
                >
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                    <span className="text-white/25 text-xs tracking-wide">Move cursor to explore</span>
                </div>

                {/* Scroll indicator — bottom center */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 hero-anim hero-fade"
                    style={{ animationDelay: '1.2s' }}
                >
                    <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                    <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                CHAPTERS
            ══════════════════════════════════════════════════ */}
            <Chapter1Engineering />
            <Chapter2Services />
            <Chapter3Products />
            <Chapter4HowWeWork />
            <TechSolarSystem3D />
            <Chapter6CaseStudies />
            <Chapter7WhyNavHigh />
            <Chapter8Insights />
            <FinalChapter />
        </main>
    );
};

export default Home;
