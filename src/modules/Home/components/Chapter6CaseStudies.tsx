'use client';

import React, { useEffect, useRef, useState } from 'react';

const CASES = [
    {
        id: 'recruitment',
        category: 'AI / Talent',
        title: 'Intelligent Recruitment Automation',
        desc: 'Built an AI-native hiring platform that reduced time-to-hire by 60% while improving candidate quality scores across 12 enterprise clients.',
        metric: '60%',
        metricLabel: 'Faster hiring',
        accent: '#3b82f6',
        accentRgb: '59,130,246',
        gradient: 'from-[#0d1a3a] to-[#030308]',
        tag: 'AI Platform',
    },
    {
        id: 'workflow',
        category: 'Enterprise / Automation',
        title: 'Enterprise Workflow Orchestration',
        desc: 'Replaced a legacy ERP with a modular, AI-assisted workflow system — cutting operational costs by $2.4M annually for a 5,000-person organisation.',
        metric: '$2.4M',
        metricLabel: 'Annual savings',
        accent: '#22d3ee',
        accentRgb: '34,211,238',
        gradient: 'from-[#0a2028] to-[#030308]',
        tag: 'Systems Integration',
    },
    {
        id: 'data',
        category: 'Data / Analytics',
        title: 'Real-time Data Intelligence Platform',
        desc: 'Designed and shipped a streaming analytics platform processing 4M events/day — giving leadership live business intelligence across 8 global markets.',
        metric: '4M',
        metricLabel: 'Events / day',
        accent: '#a78bfa',
        accentRgb: '167,139,250',
        gradient: 'from-[#150d2a] to-[#030308]',
        tag: 'Data Engineering',
    },
];

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
            {
                threshold: 0.05,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#030308] overflow-hidden py-32 md:py-40">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030308] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-20 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-400/40" />
                        Case Studies
                    </span>
                    <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92]">
                        Results that{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            speak.
                        </span>
                    </h2>
                </div>

                {/* Case study cards */}
                <div className="flex flex-col gap-6">
                    {CASES.map((c, i) => (
                        <CaseCard key={c.id} study={c} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};

interface CaseCardProps {
    study: (typeof CASES)[0];
    index: number;
    inView: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({ study, index, inView }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`
                relative rounded-3xl overflow-hidden cursor-default
                transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-12 blur-sm'}
            `}
            style={{ transitionDelay: `${0.1 + index * 0.14}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${study.gradient} transition-opacity duration-500`}
                style={{ opacity: hovered ? 0.9 : 0.7 }}
            />
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse 60% 80% at 80% 50%, rgba(${study.accentRgb},0.12) 0%, transparent 65%)`,
                    opacity: hovered ? 1 : 0.4,
                }}
            />
            <div
                className="absolute inset-0 rounded-3xl border transition-colors duration-400"
                style={{ borderColor: hovered ? `rgba(${study.accentRgb},0.3)` : 'rgba(255,255,255,0.06)' }}
            />

            <div className="relative z-10 p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                    {/* Category + tag */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
                            {study.category}
                        </span>
                        <span
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                            style={{
                                background: `rgba(${study.accentRgb},0.15)`,
                                color: study.accent,
                            }}
                        >
                            {study.tag}
                        </span>
                    </div>

                    {/* Title */}
                    <h3
                        className="text-2xl md:text-3xl font-bold tracking-[-0.025em] mb-4 transition-colors duration-300"
                        style={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.85)' }}
                    >
                        {study.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-white/40 leading-relaxed text-sm md:text-base max-w-xl">{study.desc}</p>

                    {/* CTA */}
                    <div
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-all duration-300"
                        style={{
                            color: study.accent,
                            opacity: hovered ? 1 : 0.5,
                            transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
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

                {/* Metric */}
                <div className="text-center md:text-right flex-shrink-0">
                    <div
                        className="text-6xl md:text-7xl font-bold tracking-tight transition-all duration-500"
                        style={{
                            color: study.accent,
                            textShadow: hovered ? `0 0 40px rgba(${study.accentRgb},0.4)` : 'none',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        {study.metric}
                    </div>
                    <div className="text-white/30 text-sm mt-1">{study.metricLabel}</div>
                </div>
            </div>
        </div>
    );
};
