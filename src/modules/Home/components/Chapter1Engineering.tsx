'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { NodeCanvas } from './NodeCanvas';

/* ── SVG tech icons ─────────────────────────────────────────────────────── */

const ReactIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="1.6" fill="currentColor" />
            <ellipse cx="8" cy="8" rx="6.5" ry="2.5" stroke="currentColor" strokeWidth="1.1" />
            <ellipse
                cx="8"
                cy="8"
                rx="6.5"
                ry="2.5"
                stroke="currentColor"
                strokeWidth="1.1"
                transform="rotate(60 8 8)"
            />
            <ellipse
                cx="8"
                cy="8"
                rx="6.5"
                ry="2.5"
                stroke="currentColor"
                strokeWidth="1.1"
                transform="rotate(-60 8 8)"
            />
        </svg>
    );
};

const PythonIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
                d="M4 2.5h4.5C9.9 2.5 11 3.4 11 5v2.5H6C4.6 7.5 3.5 8.5 3.5 9.8V11H2c-1.2 0-1.5-.9-1.5-2V5c0-1.6 1-2.5 3.5-2.5z"
                fill="currentColor"
                fillOpacity="0.85"
            />
            <path
                d="M12 13.5H7.5C6.1 13.5 5 12.6 5 11V8.5h5c1.4 0 2.5-1 2.5-2.3V5H14c1.2 0 1.5.9 1.5 2v4c0 1.6-1 2.5-3.5 2.5z"
                fill="currentColor"
                fillOpacity="0.85"
            />
            <circle cx="7" cy="4.8" r="0.75" fill="white" />
            <circle cx="9" cy="11.2" r="0.75" fill="white" />
        </svg>
    );
};

const AWSIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
                d="M3.5 9C2.1 9 1 7.9 1 6.7 1 5 2.5 4 4 4.5 4.2 2.5 5.8 1 8 1s3.8 1.5 3.8 3.5c.5-.1 1 0 1.4.3.7.4 1 1.3.5 2.1-.3.6-1 1.1-1.7 1.1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M5 12.5l3 2 3-2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M8 9.5V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
};

const TypeScriptIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.12" />
            <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.1" />
            <path d="M3.5 6h4M5.5 6v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path
                d="M9 10c0 .6.5 1 1.2 1 .8 0 1.3-.5 1.3-1.2S10.8 8.6 10.3 8.4 9 7.9 9 7.2 9.5 6 10.3 6s1.2.5 1.2.9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
};

const DockerIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.5" y="8.5" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <rect x="5.5" y="8.5" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="8.5" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <rect x="5.5" y="5.8" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="5.8" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="3.1" width="3" height="2.2" rx="0.6" fill="currentColor" />
            <path d="M1 12.5c1.5-.8 4.5-.8 7 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M13 11.5c.8-.2 1.5.5 1.5 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
    );
};

/* ── Architecture diagram data ────────────────────────────────────────────── */
const ARCH_LAYERS = [
    { label: 'Frontend', tech: 'React · Next.js · TypeScript', color: '#2563eb', rgb: '37,99,235' },
    { label: 'API Layer', tech: 'Node.js · GraphQL · REST', color: '#0891b2', rgb: '8,145,178' },
    { label: 'AI Engine', tech: 'LangGraph · OpenAI · Python', color: '#7c3aed', rgb: '124,58,237' },
    { label: 'Data Layer', tech: 'PostgreSQL · Redis · S3', color: '#16a34a', rgb: '22,163,74' },
];

const ArchDiagram: React.FC = () => {
    return (
        <div className="flex flex-col gap-1.5 w-full" style={{ maxWidth: 'min(210px, 100%)' }}>
            {ARCH_LAYERS.map((layer, i) => {
                return (
                    <React.Fragment key={layer.label}>
                        <div
                            className="rounded-xl px-4 py-2.5 relative"
                            style={{
                                background: `rgba(${layer.rgb},0.07)`,
                                border: `1px solid rgba(${layer.rgb},0.22)`,
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-0.5">
                                <div
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{
                                        backgroundColor: layer.color,
                                        boxShadow: `0 0 6px rgba(${layer.rgb},0.7)`,
                                    }}
                                />
                                <span
                                    className="text-[11px] font-bold tracking-[-0.01em]"
                                    style={{ color: layer.color }}
                                >
                                    {layer.label}
                                </span>
                            </div>
                            <span className="text-[10px] text-[#0F172A]/38 font-medium leading-none">{layer.tech}</span>
                        </div>
                        {i < ARCH_LAYERS.length - 1 && (
                            <div className="flex justify-center">
                                <svg width="10" height="9" viewBox="0 0 10 9" fill="none" aria-hidden="true">
                                    <path
                                        d="M5 0v6M2 4l3 4 3-4"
                                        stroke="rgba(15,23,42,0.18)"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ── Floating tech badge ────────────────────────────────────────────── */
interface BadgeProps {
    label: string;
    accent: string;
    accentRgb: string;
    icon: React.ReactNode;
    floatClass: string;
    style?: React.CSSProperties;
    hideOnMobile?: boolean;
}

const TechBadge: React.FC<BadgeProps> = ({ label, accent, accentRgb, icon, floatClass, style, hideOnMobile }) => {
    return (
        <div className={`absolute select-none ${floatClass} ${hideOnMobile ? 'hidden lg:block' : ''}`} style={style}>
            <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold"
                style={{
                    background: `rgba(${accentRgb},0.08)`,
                    border: `1px solid rgba(${accentRgb},0.22)`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: `0 6px 24px rgba(${accentRgb},0.1)`,
                    color: accent,
                }}
            >
                {icon}
                {label}
            </div>
        </div>
    );
};

/* ── Scrolling tech ticker ───────────────────────────────────────────── */
const TICKER_ITEMS = [
    'React',
    'Next.js',
    'TypeScript',
    'LangGraph',
    'OpenAI',
    'Python',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Node.js',
    'GraphQL',
    'Redis',
    'Terraform',
    'FastAPI',
];

/* ── Stat items ──────────────────────────────────────────────────────── */
const STATS = [
    { value: 150, suffix: '+', label: 'Projects Delivered', color: '#2563eb' },
    { value: 98, suffix: '%', label: 'Client Retention', color: '#0891b2' },
    { value: 40, suffix: '+', label: 'Enterprise Clients', color: '#7c3aed' },
];

const BADGES: BadgeProps[] = [
    {
        label: 'React',
        accent: '#2563eb',
        accentRgb: '37,99,235',
        icon: <ReactIcon />,
        floatClass: 'nh-float-a',
        style: { top: '14%', left: '8%' },
    },
    {
        label: 'Python',
        accent: '#ea580c',
        accentRgb: '234,88,12',
        icon: <PythonIcon />,
        floatClass: 'nh-float-d',
        style: { top: '38%', left: '3%' },
        hideOnMobile: true,
    },
    {
        label: 'AWS',
        accent: '#16a34a',
        accentRgb: '22,163,74',
        icon: <AWSIcon />,
        floatClass: 'nh-float-b',
        style: { bottom: '28%', left: '18%' },
        hideOnMobile: true,
    },
    {
        label: 'TypeScript',
        accent: '#0891b2',
        accentRgb: '8,145,178',
        icon: <TypeScriptIcon />,
        floatClass: 'nh-float-e',
        style: { top: '22%', right: '6%' },
    },
    {
        label: 'Docker',
        accent: '#7c3aed',
        accentRgb: '124,58,237',
        icon: <DockerIcon />,
        floatClass: 'nh-float-c',
        style: { bottom: '18%', right: '10%' },
    },
];

/* ── Visual panel (left column) ────────────────────────────────────────── */
const VisualPanel: React.FC = () => {
    return (
        <div className="relative w-full h-full min-h-0">
            {/* Node canvas background */}
            <NodeCanvas
                className="absolute inset-0 opacity-40"
                count={50}
                connectionDist={130}
                color="37,99,235"
                speed={0.28}
                mouseRepel={false}
            />

            {/* Geometric frame */}
            <div
                className="absolute inset-6 rounded-3xl border pointer-events-none"
                style={{
                    borderColor: 'rgba(37,99,235,0.12)',
                    background: 'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(37,99,235,0.04) 0%, transparent 70%)',
                }}
            />

            {/* Corner accent marks */}
            {[
                { top: 8, left: 8 },
                { top: 8, right: 8 },
                { bottom: 8, left: 8 },
                { bottom: 8, right: 8 },
            ].map((pos, i) => {
                return (
                    <div
                        key={i}
                        className="absolute w-6 h-6 pointer-events-none"
                        style={{
                            ...pos,
                            borderTop: i < 2 ? '1px solid rgba(37,99,235,0.3)' : 'none',
                            borderBottom: i >= 2 ? '1px solid rgba(37,99,235,0.3)' : 'none',
                            borderLeft: i % 2 === 0 ? '1px solid rgba(37,99,235,0.3)' : 'none',
                            borderRight: i % 2 === 1 ? '1px solid rgba(37,99,235,0.3)' : 'none',
                            borderTopLeftRadius: i === 0 ? 6 : 0,
                            borderTopRightRadius: i === 1 ? 6 : 0,
                            borderBottomLeftRadius: i === 2 ? 6 : 0,
                            borderBottomRightRadius: i === 3 ? 6 : 0,
                        }}
                    />
                );
            })}

            {/* Architecture stack diagram — shows actual NavHigh tech stack */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8">
                <ArchDiagram />
            </div>

            {/* Floating tech badges */}
            {BADGES.map((b) => {
                return <TechBadge key={b.label} {...b} />;
            })}

            {/* Grid scan lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-3xl overflow-hidden"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(37,99,235,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.8) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────── */

export const Chapter1Engineering: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setInView(true);
            },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => {
            return obs.disconnect();
        };
    }, []);

    const count150 = useCountUp(STATS[0].value, inView);
    const count98 = useCountUp(STATS[1].value, inView);
    const count40 = useCountUp(STATS[2].value, inView);
    const counts = [count150, count98, count40];

    const reveal = (_delay: string, extra = '') => {
        return `transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${extra} ${
            inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
        }`;
    };

    const scrollToHowWeWork = () => {
        document.getElementById('how-we-work')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={sectionRef} className="relative bg-[#FAFBFF] overflow-hidden">
            {/* Section-level node background */}
            <div className="absolute inset-0 pointer-events-none">
                <NodeCanvas
                    className="absolute inset-0 opacity-15"
                    count={35}
                    connectionDist={120}
                    color="37,99,235"
                    speed={0.18}
                    mouseRepel={false}
                />
            </div>

            {/* Edge fades */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FAFBFF] to-transparent pointer-events-none z-10" />

            <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 md:px-14 pt-20 sm:pt-28 md:pt-36 lg:pt-44 pb-8 md:pb-12">
                {/* Asymmetric split grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 md:gap-14 lg:gap-20 items-center">
                    {/* LEFT: Visual panel */}
                    <div
                        className={`relative order-2 lg:order-1 h-[280px] sm:h-[380px] lg:h-[580px] transition-[opacity,transform] duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
                        style={{ transitionDelay: '0.1s' }}
                    >
                        <VisualPanel />
                    </div>

                    {/* RIGHT: Text content */}
                    <div className="order-1 lg:order-2 flex flex-col">
                        {/* Eyebrow */}
                        <div className={reveal('0s', 'mb-7')}>
                            <span className="inline-flex items-center gap-2.5 text-blue-600/65 text-[11px] font-semibold tracking-[0.28em] uppercase">
                                <span className="block w-5 h-px bg-blue-500/45" />
                                Engineering Beyond Software
                            </span>
                        </div>

                        {/* Headline */}
                        <h2 className={reveal('0.18s', 'max-w-xl')} style={{ transitionDelay: '0.18s' }}>
                            <span className="block text-[#0F172A] text-[clamp(2.8rem,5.5vw,5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
                                Engineering
                            </span>
                            <span
                                className="block text-[clamp(2.8rem,5.5vw,5rem)] font-bold leading-[0.92] tracking-[-0.04em]"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Beyond
                            </span>
                            <span className="block text-[#0F172A] text-[clamp(2.8rem,5.5vw,5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
                                Software.
                            </span>
                        </h2>

                        {/* Description */}
                        <p
                            className={reveal(
                                '0.38s',
                                'mt-6 md:mt-9 max-w-md text-[#0F172A]/50 text-base md:text-lg leading-relaxed'
                            )}
                            style={{ transitionDelay: '0.38s' }}
                        >
                            We create products, intelligence, and digital systems that scale businesses from idea to
                            enterprise — and beyond. Not just software. Outcomes.
                        </p>

                        {/* Horizontal divider */}
                        <div
                            className={`mt-10 h-px bg-gradient-to-r from-blue-500/20 via-transparent to-transparent transition-[opacity] duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
                            style={{ transitionDelay: '0.52s' }}
                        />

                        {/* Stats — animated counters */}
                        <div
                            className={`mt-8 md:mt-10 grid grid-cols-3 gap-3 sm:gap-6 transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                            style={{ transitionDelay: '0.58s' }}
                        >
                            {STATS.map((s, i) => {
                                return (
                                    <div key={s.label} className="group">
                                        <div
                                            className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums transition-colors duration-300"
                                            style={{ color: s.color }}
                                        >
                                            {counts[i]}
                                            {s.suffix}
                                        </div>
                                        <div className="text-[#0F172A]/40 text-xs mt-1.5 font-medium leading-snug">
                                            {s.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA — smooth scrolls to Chapter 4 */}
                        <div
                            className={`mt-10 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                            style={{ transitionDelay: '0.72s' }}
                        >
                            <button
                                onClick={scrollToHowWeWork}
                                className="inline-flex items-center gap-2.5 text-sm text-blue-600 hover:text-[#0F172A] font-medium transition-colors duration-200 group"
                            >
                                Explore our approach
                                <svg
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 7h10M7 2l5 5-5 5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-width scrolling tech ticker */}
            <div
                className={`relative z-20 border-t border-[#0F172A]/[0.05] overflow-hidden transition-[opacity] duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '0.9s' }}
            >
                <div className="nh-ticker flex items-center py-4">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => {
                        return (
                            <span
                                key={i}
                                className="flex items-center gap-6 text-[#0F172A]/22 text-sm font-medium whitespace-nowrap px-6"
                            >
                                {item}
                                <span
                                    className="w-1 h-1 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(15,23,42,0.15)' }}
                                />
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Bottom edge fade — sits above ticker so it fades out at section boundary */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAFBFF] to-transparent pointer-events-none z-30" />
        </section>
    );
};
