'use client';

import React, { useEffect, useRef, useState } from 'react';

const SERVICES = [
    {
        id: 'product',
        title: 'Product Engineering',
        desc: 'End-to-end product development — from architecture to deployment — built to scale.',
        icon: '⬡',
        accent: '59,130,246',
        accentHex: '#3b82f6',
    },
    {
        id: 'ai',
        title: 'AI Solutions',
        desc: 'LLM integrations, multi-agent systems, and AI-native products that transform workflows.',
        icon: '◈',
        accent: '139,92,246',
        accentHex: '#8b5cf6',
    },
    {
        id: 'systems',
        title: 'Business Systems',
        desc: 'Custom ERP, CRM, and enterprise platforms designed around your operations.',
        icon: '⬟',
        accent: '34,211,238',
        accentHex: '#22d3ee',
    },
    {
        id: 'talent',
        title: 'Talent Platforms',
        desc: 'Intelligent recruitment, assessment, and talent-matching systems at scale.',
        icon: '◇',
        accent: '249,115,22',
        accentHex: '#f97316',
    },
    {
        id: 'consulting',
        title: 'Consulting',
        desc: 'Strategic technology partnerships — not just advice, but accountability.',
        icon: '◻',
        accent: '34,197,94',
        accentHex: '#22c55e',
    },
];

interface ServiceCardProps {
    service: (typeof SERVICES)[0];
    index: number;
    inView: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, inView }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`
                relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8
                transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                cursor-default
                ${inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'}
            `}
            style={{
                transitionDelay: `${0.1 + index * 0.1}s`,
                boxShadow: hovered
                    ? `0 0 0 1px rgba(${service.accent},0.3), 0 20px 60px rgba(${service.accent},0.08), inset 0 1px 0 rgba(255,255,255,0.06)`
                    : '0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)',
                transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 1s, filter 1s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Glow accent */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 60% 50% at 30% 0%, rgba(${service.accent},0.08) 0%, transparent 70%)`,
                    opacity: hovered ? 1 : 0,
                }}
            />

            {/* Icon */}
            <div
                className="text-2xl mb-5 transition-transform duration-300"
                style={{
                    color: service.accentHex,
                    transform: hovered ? 'scale(1.15) rotate(8deg)' : 'scale(1) rotate(0deg)',
                }}
            >
                {service.icon}
            </div>

            {/* Title */}
            <h3
                className="text-white font-semibold text-xl mb-3 tracking-[-0.02em] transition-colors duration-300"
                style={{ color: hovered ? service.accentHex : '#ffffff' }}
            >
                {service.title}
            </h3>

            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed">{service.desc}</p>

            {/* Arrow */}
            <div
                className="absolute bottom-6 right-6 transition-all duration-300"
                style={{
                    color: service.accentHex,
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translate(0,0)' : 'translate(-4px,4px)',
                }}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 3h10v10h-2V6.414L3.707 13.707 2.293 12.293 9.586 5H3V3z" />
                </svg>
            </div>

            {/* Connection dot */}
            <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300"
                style={{
                    backgroundColor: service.accentHex,
                    opacity: hovered ? 0.9 : 0.25,
                    boxShadow: hovered ? `0 0 8px rgba(${service.accent},0.8)` : 'none',
                }}
            />
        </div>
    );
};

export const Chapter2Services: React.FC = () => {
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
                threshold: 0.08,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#040412] overflow-hidden py-32 md:py-40">
            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030308] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-16 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-400/40" />
                        What We Build
                    </span>
                    <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92] max-w-2xl">
                        Five pillars,{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            one vision.
                        </span>
                    </h2>
                    <p className="mt-5 text-white/40 text-lg max-w-lg leading-relaxed">
                        Distinct disciplines. Unified by the belief that great engineering changes everything.
                    </p>
                </div>

                {/* Services grid — 3 top, 2 bottom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SERVICES.slice(0, 3).map((s, i) => (
                        <ServiceCard key={s.id} service={s} index={i} inView={inView} />
                    ))}
                    {SERVICES.slice(3).map((s, i) => (
                        <ServiceCard key={s.id} service={s} index={i + 3} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};
