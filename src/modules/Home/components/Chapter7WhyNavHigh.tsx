'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useCountUp } from '@/hooks/useCountUp';
import logoSrc from '@/icons/logo_navhigh.png';

const OTHERS = [
    'Static deliverables',
    'Template-driven',
    'Short-term engagements',
    'Generic solutions',
    'Project handoffs',
    'Speed over quality',
];

const NAVHIGH = [
    'Engineering-first culture',
    'AI-native by default',
    'Long-term partnerships',
    'Product mindset',
    'Accountability at every stage',
    'Quality without compromise',
];

const STATS = [
    { value: 150, suffix: '+', label: 'Projects Delivered' },
    { value: 98, suffix: '%', label: 'Client Retention Rate' },
    { value: 12, suffix: 'x', label: 'Avg ROI Improvement' },
];

const StatCounter: React.FC<{ value: number; suffix: string; label: string; active: boolean }> = ({
    value,
    suffix,
    label,
    active,
}) => {
    const count = useCountUp(value, active);
    return (
        <div className="text-center">
            <div className="text-5xl font-bold text-[#0F172A] tracking-tight">
                {count}
                <span className="text-blue-600">{suffix}</span>
            </div>
            <div className="text-[#0F172A]/40 text-sm mt-2">{label}</div>
        </div>
    );
};

export const Chapter7WhyNavHigh: React.FC = () => {
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

    return (
        <section ref={sectionRef} className="relative bg-[#F5F7FA] overflow-hidden py-32 md:py-40">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAFBFF] to-transparent pointer-events-none" />

            {/* Ambient glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-16 text-center transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-600/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-500/40" />
                        Why NavHigh
                        <span className="block w-5 h-px bg-blue-500/40" />
                    </span>
                    <h2 className="text-[#0F172A] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92]">
                        The difference is{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            deliberate.
                        </span>
                    </h2>
                </div>

                {/* Comparison grid */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    {/* Others column */}
                    <div className="rounded-3xl border border-[#0F172A]/[0.07] bg-white p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full border border-[#0F172A]/10 flex items-center justify-center">
                                <span className="text-[#0F172A]/25 text-lg leading-none">✕</span>
                            </div>
                            <span className="text-[#0F172A]/30 text-sm font-semibold tracking-wide uppercase">
                                Typical Agencies
                            </span>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {OTHERS.map((item, i) => {
                                return (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-sm py-3 border-b border-[#0F172A]/[0.05] last:border-0 transition-all duration-500"
                                        style={{ transitionDelay: `${0.35 + i * 0.07}s`, opacity: inView ? 1 : 0 }}
                                    >
                                        <span className="text-[#0F172A]/15 font-mono text-xs w-5 flex-shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[#0F172A]/30 line-through decoration-[#0F172A]/15">
                                            {item}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* NavHigh column */}
                    <div
                        className="rounded-3xl border p-8 relative overflow-hidden"
                        style={{
                            borderColor: 'rgba(37,99,235,0.2)',
                            background: 'rgba(37,99,235,0.03)',
                            boxShadow: '0 0 60px rgba(37,99,235,0.05), 0 4px 24px rgba(15,23,42,0.06)',
                        }}
                    >
                        {/* Glow top-right */}
                        <div
                            className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'rgba(37,99,235,0.12)',
                                        border: '1px solid rgba(37,99,235,0.3)',
                                    }}
                                >
                                    <Image
                                        src={logoSrc}
                                        alt="NavHigh"
                                        width={18}
                                        height={18}
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase">
                                    NavHigh Technologies
                                </span>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {NAVHIGH.map((item, i) => {
                                    return (
                                        <li
                                            key={item}
                                            className="flex items-center gap-3 text-sm py-3 border-b border-blue-500/[0.08] last:border-0 transition-all duration-500"
                                            style={{
                                                color: '#0F172A',
                                                transitionDelay: `${0.35 + i * 0.07}s`,
                                                opacity: inView ? 1 : 0,
                                                transform: inView ? 'translateX(0)' : 'translateX(12px)',
                                            }}
                                        >
                                            <span
                                                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                                                style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}
                                            >
                                                ✓
                                            </span>
                                            {item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div
                    className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 border-t border-b border-[#0F172A]/[0.07] transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '0.5s' }}
                >
                    {STATS.map((s) => {
                        return (
                            <StatCounter
                                key={s.label}
                                value={s.value}
                                suffix={s.suffix}
                                label={s.label}
                                active={inView}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
