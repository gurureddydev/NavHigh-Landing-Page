'use client';

import React, { useEffect, useRef, useState } from 'react';

const CASES = [
    {
        id: 'recruitment',
        side: 'right' as const,
        category: 'AI / Talent',
        title: 'Intelligent Recruitment Automation',
        desc: 'Built an AI-native hiring platform that reduced time-to-hire by 60% while improving candidate quality scores across 12 enterprise clients.',
        metric: '60%',
        metricLabel: 'Faster hiring',
        metricSub: 'across 12 enterprise clients',
        accent: '#2563eb',
        accentRgb: '37,99,235',
        tag: 'AI Platform',
    },
    {
        id: 'workflow',
        side: 'left' as const,
        category: 'Enterprise / Automation',
        title: 'Enterprise Workflow Orchestration',
        desc: 'Replaced a legacy ERP with a modular, AI-assisted workflow system — cutting operational costs by $2.4M annually for a 5,000-person organisation.',
        metric: '$2.4M',
        metricLabel: 'Annual savings',
        metricSub: 'for a 5,000-person org',
        accent: '#0891b2',
        accentRgb: '8,145,178',
        tag: 'Systems Integration',
    },
    {
        id: 'data',
        side: 'right' as const,
        category: 'Data / Analytics',
        title: 'Real-time Data Intelligence Platform',
        desc: 'Designed and shipped a streaming analytics platform processing 4M events/day — giving leadership live intelligence across 8 global markets.',
        metric: '4M',
        metricLabel: 'Events / day',
        metricSub: 'across 8 global markets',
        accent: '#7c3aed',
        accentRgb: '124,58,237',
        tag: 'Data Engineering',
    },
];

interface CaseRowProps {
    study: (typeof CASES)[0];
    index: number;
    inView: boolean;
}

const CaseRow: React.FC<CaseRowProps> = ({ study, index, inView }) => {
    const [hovered, setHovered] = useState(false);
    const isLeft = study.side === 'left';

    return (
        <div
            className={`relative overflow-hidden rounded-3xl cursor-default transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-14 blur-sm'
            }`}
            style={{ transitionDelay: `${0.1 + index * 0.16}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Card background */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(${isLeft ? '135deg' : '225deg'}, rgba(${study.accentRgb},0.06) 0%, #ffffff 50%, #F8FAFF 100%)`,
                    opacity: hovered ? 1 : 0.85,
                }}
            />
            {/* Accent glow */}
            <div
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 55% 70% at ${isLeft ? '15%' : '85%'} 50%, rgba(${study.accentRgb},0.08) 0%, transparent 65%)`,
                    opacity: hovered ? 1 : 0.4,
                }}
            />
            {/* Border */}
            <div
                className="absolute inset-0 rounded-3xl border transition-colors duration-400 pointer-events-none"
                style={{ borderColor: hovered ? `rgba(${study.accentRgb},0.3)` : 'rgba(15,23,42,0.08)' }}
            />

            {/* Top scan line on hover */}
            <div
                className="absolute top-0 left-8 right-8 h-px pointer-events-none transition-opacity duration-400"
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(${study.accentRgb},0.5), transparent)`,
                    opacity: hovered ? 1 : 0,
                }}
            />

            <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0`}>
                {/* Metric block */}
                <div
                    className={`flex flex-col justify-center px-10 py-12 md:py-16 ${isLeft ? 'order-1' : 'order-1 md:order-2'}`}
                    style={{
                        borderRight: !isLeft ? 'none' : `1px solid rgba(${study.accentRgb},0.1)`,
                        borderLeft: isLeft ? 'none' : `1px solid rgba(${study.accentRgb},0.1)`,
                    }}
                >
                    {/* Huge metric */}
                    <div
                        className="font-bold leading-none tracking-[-0.04em] transition-all duration-500 select-none"
                        style={{
                            fontSize: 'clamp(4.5rem, 10vw, 9rem)',
                            color: study.accent,
                            textShadow: hovered ? `0 0 60px rgba(${study.accentRgb},0.25)` : 'none',
                            transform: hovered ? 'scale(1.03)' : 'scale(1)',
                        }}
                    >
                        {study.metric}
                    </div>
                    <div className="mt-3 text-[#0F172A]/65 text-lg font-semibold tracking-tight">
                        {study.metricLabel}
                    </div>
                    <div className="mt-1 text-[#0F172A]/35 text-sm">{study.metricSub}</div>

                    {/* Decorative glyph */}
                    <div
                        className="mt-8 text-[5rem] leading-none select-none"
                        style={{ color: `rgba(${study.accentRgb},0.07)` }}
                    >
                        {index === 0 ? '↑' : index === 1 ? '$' : '⟳'}
                    </div>
                </div>

                {/* Text block */}
                <div
                    className={`flex flex-col justify-center px-10 py-12 md:py-16 ${isLeft ? 'order-2' : 'order-2 md:order-1'}`}
                >
                    {/* Category + tag */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0F172A]/35">
                            {study.category}
                        </span>
                        <span
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                            style={{
                                background: `rgba(${study.accentRgb},0.1)`,
                                color: study.accent,
                                border: `1px solid rgba(${study.accentRgb},0.22)`,
                            }}
                        >
                            {study.tag}
                        </span>
                    </div>

                    {/* Case number */}
                    <div className="text-[10px] font-mono text-[#0F172A]/20 mb-3">
                        CASE {String(CASES.findIndex((c) => c.id === study.id) + 1).padStart(2, '0')} / 03
                    </div>

                    {/* Title */}
                    <h3
                        className="text-2xl md:text-3xl font-bold tracking-[-0.025em] mb-5 leading-tight transition-colors duration-300"
                        style={{ color: hovered ? study.accent : '#0F172A' }}
                    >
                        {study.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#0F172A]/50 leading-relaxed text-sm md:text-[15px] max-w-sm">{study.desc}</p>

                    {/* CTA */}
                    <div
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-all duration-300"
                        style={{
                            color: study.accent,
                            opacity: hovered ? 1 : 0.45,
                            transform: hovered ? 'translateX(0)' : 'translateX(-5px)',
                        }}
                    >
                        Read case study
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M2 7h10M7 2l5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Chapter6CaseStudies: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setInView(true);
            },
            { threshold: 0.04 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#EEF2FF] overflow-hidden py-32 md:py-44">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAFBFF] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F5F7FA] to-transparent pointer-events-none" />

            {/* Ambient glow center */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-[0.04]"
                style={{ background: 'radial-gradient(ellipse, #2563eb 0%, #7c3aed 100%)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-16 md:mb-20 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 text-blue-600/58 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                                <span className="block w-5 h-px bg-blue-500/40" />
                                Case Studies
                            </span>
                            <h2 className="text-[#0F172A] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92]">
                                Results that{' '}
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #0891b2, #7c3aed)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    speak.
                                </span>
                            </h2>
                        </div>
                        <p className="text-[#0F172A]/40 text-sm max-w-xs leading-relaxed md:text-right flex-shrink-0">
                            Real outcomes for real companies. Numbers that matter, partnerships that last.
                        </p>
                    </div>
                </div>

                {/* Case rows */}
                <div className="flex flex-col gap-4">
                    {CASES.map((c, i) => (
                        <CaseRow key={c.id} study={c} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};
