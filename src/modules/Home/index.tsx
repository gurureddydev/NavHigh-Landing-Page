'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import logoSrc from '@/icons/logo_navhigh.png';
import { Chapter1Engineering } from './components/Chapter1Engineering';
import { Chapter2Services } from './components/Chapter2Services';
import { Chapter3Products } from './components/Chapter3Products';
import { Chapter4HowWeWork } from './components/Chapter4HowWeWork';
import { Chapter5TechEcosystem } from './components/Chapter5TechEcosystem';
import { Chapter6CaseStudies } from './components/Chapter6CaseStudies';
import { Chapter7WhyNavHigh } from './components/Chapter7WhyNavHigh';
import { Chapter8Insights } from './components/Chapter8Insights';
import { Chapter9Internships } from './components/Chapter9Internships';
import { EcosystemCanvas } from './components/EcosystemCanvas';
import { FinalChapter } from './components/FinalChapter';
import { HeroCanvas } from './components/HeroCanvas';

const NAV_ITEMS = ['Services', 'Products', 'Work', 'About', 'Insights', 'Internships'];

/* Replace names with actual client logos when available */
const TRUSTED_LOGOS = [
    { name: 'SpeedRadio', weight: 700, spacing: '-0.04em' },
    { name: 'AXIOM', weight: 300, spacing: '0.22em' },
    { name: 'TechScale', weight: 600, spacing: '-0.02em' },
    { name: 'BuildBase', weight: 800, spacing: '-0.05em' },
    { name: 'Nexora', weight: 400, spacing: '0.04em' },
];

/* ─── Custom cursor ──────────────────────────────────────────────────── */
const CustomCursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -200, y: -200 });
    const ringPosRef = useRef({ x: -200, y: -200 });
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        document.body.classList.add('custom-cursor-active');

        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
            }
        };

        const tick = () => {
            ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.1;
            ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.1;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPosRef.current.x}px,${ringPosRef.current.y}px)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            document.body.classList.remove('custom-cursor-active');
            window.removeEventListener('mousemove', onMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div
                ref={dotRef}
                className="nh-cursor-dot fixed top-0 left-0 z-[9999] pointer-events-none"
                style={{
                    width: 8,
                    height: 8,
                    marginLeft: -4,
                    marginTop: -4,
                    borderRadius: '50%',
                    background: '#0F172A',
                    willChange: 'transform',
                }}
            />
            <div
                ref={ringRef}
                className="nh-cursor-ring fixed top-0 left-0 z-[9998] pointer-events-none"
                style={{
                    width: 40,
                    height: 40,
                    marginLeft: -20,
                    marginTop: -20,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(59,130,246,0.55)',
                    willChange: 'transform',
                    transition: 'width 0.2s, height 0.2s, margin 0.2s, border-color 0.2s',
                }}
            />
        </>
    );
};

/* ─── Glass metric card (hero right column) ──────────────────────────── */
const MetricCard: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    return (
        <div
            className="rounded-2xl px-5 py-4 select-none"
            style={{
                background: 'rgba(255,255,255,0.90)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(15,23,42,0.07)',
                borderLeft: '3px solid rgba(37,99,235,0.4)',
                boxShadow:
                    '0 8px 32px rgba(15,23,42,0.10), 0 2px 8px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}
        >
            <div className="text-[#2563eb] font-bold text-2xl tracking-tight leading-none tabular-nums">{value}</div>
            <div className="text-[#0F172A]/40 text-xs mt-1.5 font-medium">{label}</div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────── */

const Home: React.FC = () => {
    const mouseRaw = useRef({ x: -999, y: -999 });
    const mouseSmooth = useRef({ x: -999, y: -999 });
    const rafCursor = useRef<number | null>(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [statsInView, setStatsInView] = useState(false);

    const scrollToSection = (item: string) => {
        const idMap: Record<string, string> = {
            Services: 'services',
            Products: 'products',
            Work: 'how-we-work',
            About: 'about',
            Insights: 'insights',
            Internships: 'internships',
        };
        const id = idMap[item];
        if (id) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    /* Animate counters after hero entrance animations finish */
    useEffect(() => {
        const timer = setTimeout(() => {
            return setStatsInView(true);
        }, 1000);
        return () => {
            return clearTimeout(timer);
        };
    }, []);

    const count150 = useCountUp(150, statsInView);
    const count98 = useCountUp(98, statsInView);
    const count40 = useCountUp(40, statsInView);

    useEffect(() => {
        const onScroll = () => {
            return setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            return window.removeEventListener('scroll', onScroll);
        };
    }, []);

    /* Smooth cursor — updates mouseSmooth ref; canvases read it directly each RAF frame */
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseRaw.current = { x: e.clientX, y: e.clientY };
            if (mouseSmooth.current.x === -999) mouseSmooth.current = { x: e.clientX, y: e.clientY };
        };

        const tick = () => {
            if (mouseSmooth.current.x !== -999) {
                mouseSmooth.current.x += (mouseRaw.current.x - mouseSmooth.current.x) * 0.1;
                mouseSmooth.current.y += (mouseRaw.current.y - mouseSmooth.current.y) * 0.1;
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
        <main className="min-h-screen bg-[#FAFBFF] tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <CustomCursor />

            {/* ═══════════════════════════════════════════════════
                FIXED NAVIGATION
            ═══════════════════════════════════════════════════ */}
            <nav
                className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-8 py-4 transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(250,251,255,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(24px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(15,23,42,0.08)' : '1px solid transparent',
                }}
            >
                <div className="flex items-center gap-2 select-none">
                    <Image
                        src={logoSrc}
                        alt="NavHigh"
                        width={36}
                        height={36}
                        className="object-contain"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.4))' }}
                    />
                    <span className="text-[#0F172A] font-bold text-lg tracking-[-0.03em]">NavHigh</span>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-[#0F172A]/[0.04] backdrop-blur-md border border-[#0F172A]/[0.08] rounded-full px-2 py-1.5">
                    {NAV_ITEMS.map((item) => {
                        return (
                            <button
                                key={item}
                                onClick={() => {
                                    return scrollToSection(item);
                                }}
                                className="px-4 py-1.5 rounded-full text-sm font-medium text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-[#0F172A]/[0.06] transition-all duration-200"
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/careers"
                        className="hidden md:inline-block text-sm font-semibold text-[#0F172A]/60 hover:text-[#0F172A] px-3 py-1.5 transition-colors"
                    >
                        Careers
                    </a>
                    <button className="hidden md:flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#3b82f6]/30">
                        Get Started
                    </button>
                    <button
                        onClick={() => {
                            return setMenuOpen(!menuOpen);
                        }}
                        className="md:hidden text-[#0F172A] p-1.5 rounded-lg hover:bg-[#0F172A]/[0.06] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 bg-[#FAFBFF]/97 z-[90] flex flex-col justify-center items-center gap-6 md:hidden">
                    {NAV_ITEMS.map((item, i) => {
                        return (
                            <button
                                key={item}
                                onClick={() => {
                                    setMenuOpen(false);
                                    scrollToSection(item);
                                }}
                                className="text-2xl font-semibold text-[#0F172A]/80 hover:text-[#0F172A] transition-colors"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                {item}
                            </button>
                        );
                    })}
                    <a
                        href="/careers"
                        onClick={() => {
                            return setMenuOpen(false);
                        }}
                        className="text-2xl font-semibold text-[#0F172A]/80 hover:text-[#0F172A] transition-colors mt-2"
                    >
                        Careers
                    </a>
                    <button
                        onClick={() => {
                            return setMenuOpen(false);
                        }}
                        className="mt-4 bg-[#2563eb] text-white text-base font-semibold px-8 py-3.5 rounded-full"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════
                HERO — SPLIT LAYOUT
            ═══════════════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden bg-[#FAFBFF]" style={{ height: '100dvh' }}>
                {/* Particle network background — reads mouseSmooth ref directly, no re-render needed */}
                <HeroCanvas cursorRef={mouseSmooth} className="absolute inset-0 pointer-events-none z-10" />

                {/* Vignette + edge fades */}
                <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,transparent_30%,#FAFBFF_100%)]" />
                <div className="absolute inset-x-0 top-0 h-36 z-20 pointer-events-none bg-gradient-to-b from-[#FAFBFF] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-40 z-20 pointer-events-none bg-gradient-to-t from-[#FAFBFF] to-transparent" />

                {/* Right-side blue atmospheric glow */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 55% 60% at 75% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 40% 50% at 20% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)',
                    }}
                />

                {/* ── Split content ── */}
                <div className="absolute inset-0 z-30 flex">
                    {/* LEFT: Text column */}
                    <div className="flex flex-col justify-center w-full lg:w-[54%] px-5 sm:px-8 lg:px-16 xl:px-20 pointer-events-auto">
                        {/* Eyebrow label */}
                        <div className="hero-anim hero-fade mb-7" style={{ animationDelay: '0.15s' }}>
                            <span className="inline-flex items-center gap-2.5 text-blue-600/70 text-[11px] font-semibold tracking-[0.3em] uppercase">
                                <span className="block w-5 h-px bg-blue-500/50" />
                                NavHigh Technologies
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-[#0F172A] leading-[0.88] flex flex-col gap-1 pointer-events-none">
                            <span
                                className="block font-bold text-[clamp(2.6rem,6.5vw,5.6rem)] tracking-[-0.04em] hero-anim hero-reveal"
                                style={{ animationDelay: '0.28s' }}
                            >
                                We Ship What
                            </span>
                            <span
                                className="block font-bold text-[clamp(2.6rem,6.5vw,5.6rem)] tracking-[-0.04em] hero-anim hero-reveal"
                                style={{
                                    animationDelay: '0.44s',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 45%, #6d28d9 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Others Won&apos;t.
                            </span>
                        </h1>

                        {/* Sub */}
                        <p
                            className="mt-7 max-w-[480px] text-[#0F172A]/50 text-base md:text-lg leading-relaxed hero-anim hero-fade"
                            style={{ animationDelay: '0.62s' }}
                        >
                            AI-native products, scalable systems, and long-term engineering partnerships for ambitious
                            companies.
                        </p>

                        {/* CTAs */}
                        <div
                            className="mt-7 flex flex-wrap items-center gap-3 hero-anim hero-fade"
                            style={{ animationDelay: '0.78s' }}
                        >
                            <button
                                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#3b82f6]/30 w-full sm:w-auto text-center"
                                style={{ boxShadow: '0 0 24px rgba(59,130,246,0.2)' }}
                            >
                                Start Building
                            </button>
                            <button className="text-[#0F172A]/55 hover:text-[#0F172A] text-sm font-medium px-5 py-3.5 rounded-full border border-[#0F172A]/10 hover:border-[#0F172A]/22 transition-all duration-200">
                                See Our Work →
                            </button>
                        </div>

                        {/* Stats strip — counters animate after hero entrance */}
                        <div
                            className="mt-8 lg:mt-12 flex items-center gap-5 sm:gap-8 hero-anim hero-fade"
                            style={{ animationDelay: '0.95s' }}
                        >
                            {[
                                { v: `${count150}+`, l: 'Projects Delivered' },
                                { v: `${count98}%`, l: 'Client Retention' },
                                { v: `${count40}+`, l: 'Enterprise Clients' },
                            ].map((s, i) => {
                                return (
                                    <React.Fragment key={s.l}>
                                        {i > 0 && <span className="w-px h-5 bg-[#0F172A]/10" />}
                                        <div>
                                            <div className="text-[#0F172A] font-bold text-lg tracking-tight tabular-nums">
                                                {s.v}
                                            </div>
                                            <div className="text-[#0F172A]/35 text-xs mt-0.5">{s.l}</div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Trusted by — social proof strip */}
                        <div className="mt-7 lg:mt-10 hero-anim hero-fade" style={{ animationDelay: '1.1s' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-px flex-1 bg-[#0F172A]/[0.07]" />
                                <span className="text-[#0F172A]/25 text-[10px] font-medium tracking-[0.2em] uppercase whitespace-nowrap">
                                    Trusted by
                                </span>
                                <div className="h-px flex-1 bg-[#0F172A]/[0.07]" />
                            </div>
                            <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto pb-1 no-scrollbar">
                                {TRUSTED_LOGOS.map((logo) => {
                                    return (
                                        <span
                                            key={logo.name}
                                            className="whitespace-nowrap text-[#0F172A]/30 hover:text-[#0F172A]/55 transition-colors duration-200 select-none cursor-default text-sm"
                                            style={{ fontWeight: logo.weight, letterSpacing: logo.spacing }}
                                        >
                                            {logo.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile visual accent — compact tech dots row */}
                        <div
                            className="lg:hidden flex items-center gap-3 mt-8 hero-anim hero-fade"
                            style={{ animationDelay: '1.25s' }}
                            aria-hidden="true"
                        >
                            {[
                                { color: '#2563eb', label: 'AI' },
                                { color: '#7c3aed', label: 'Cloud' },
                                { color: '#0891b2', label: 'Scale' },
                            ].map((dot) => {
                                return (
                                    <div key={dot.label} className="flex items-center gap-1.5">
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: dot.color,
                                                boxShadow: `0 0 6px ${dot.color}80`,
                                            }}
                                        />
                                        <span
                                            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                                            style={{ color: `${dot.color}99` }}
                                        >
                                            {dot.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Ecosystem canvas column (desktop only) */}
                    <div className="hidden lg:flex flex-1 relative items-center justify-center">
                        {/* Reads mouseSmooth ref directly — zero React re-renders on cursor move */}
                        <EcosystemCanvas cursorRef={mouseSmooth} className="absolute inset-0" />

                        {/* Floating metric glass cards with animated counters */}
                        <div className="absolute top-[15%] right-8 nh-float-a" style={{ animationDelay: '0s' }}>
                            <MetricCard value={`${count150}+`} label="Projects Delivered" />
                        </div>
                        <div className="absolute top-[46%] left-12 nh-float-c" style={{ animationDelay: '1.2s' }}>
                            <MetricCard value={`${count98}%`} label="Client Retention" />
                        </div>
                        <div className="absolute bottom-[18%] right-12 nh-float-b" style={{ animationDelay: '0.6s' }}>
                            <MetricCard value={`${count40}+`} label="Enterprise Clients" />
                        </div>
                    </div>
                </div>

                {/* Cursor hint */}
                <div
                    className="absolute bottom-10 left-8 z-30 hidden sm:flex items-center gap-2 hero-anim hero-fade"
                    style={{ animationDelay: '1.1s' }}
                >
                    <div className="w-5 h-5 rounded-full border border-[#0F172A]/15 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <span className="text-[#0F172A]/30 text-xs tracking-wide">Move cursor to explore</span>
                </div>

                {/* Scroll indicator */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 hero-anim hero-fade"
                    style={{ animationDelay: '1.2s' }}
                >
                    <span className="text-[#0F172A]/25 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                    <div className="w-px h-8 bg-gradient-to-b from-[#0F172A]/20 to-transparent" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                CHAPTERS
            ═══════════════════════════════════════════════════ */}
            <Chapter1Engineering />
            <Chapter2Services />
            <Chapter3Products />
            <Chapter4HowWeWork />
            <Chapter5TechEcosystem />
            <Chapter6CaseStudies />
            <Chapter7WhyNavHigh />
            <Chapter8Insights />
            <Chapter9Internships />
            <FinalChapter />
        </main>
    );
};

export default Home;
