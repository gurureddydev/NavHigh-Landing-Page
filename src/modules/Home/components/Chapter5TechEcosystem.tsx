'use client';

import React, { useEffect, useRef, useState } from 'react';

const CATEGORIES = [
    {
        id: 'frontend',
        label: 'Frontend',
        color: '#3b82f6',
        rgb: '59,130,246',
        x: 20,
        y: 18,
        nodes: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
        id: 'backend',
        label: 'Backend',
        color: '#22d3ee',
        rgb: '34,211,238',
        x: 72,
        y: 18,
        nodes: ['Node.js', 'Java', 'Python', 'PostgreSQL'],
    },
    {
        id: 'ai',
        label: 'AI & ML',
        color: '#a78bfa',
        rgb: '167,139,250',
        x: 20,
        y: 70,
        nodes: ['OpenAI', 'LangGraph', 'LangChain', 'Vector DBs'],
    },
    {
        id: 'infra',
        label: 'Infrastructure',
        color: '#f97316',
        rgb: '249,115,22',
        x: 72,
        y: 70,
        nodes: ['Docker', 'AWS', 'Vercel', 'Cloudflare'],
    },
];

const CONNECTIONS = [
    ['frontend', 'backend'],
    ['frontend', 'ai'],
    ['backend', 'infra'],
    ['ai', 'infra'],
    ['frontend', 'infra'],
    ['backend', 'ai'],
];

export const Chapter5TechEcosystem: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

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

    const isConnected = (catId: string) => {
        if (!hoveredId) return false;
        return CONNECTIONS.some(([a, b]) => (a === hoveredId && b === catId) || (b === hoveredId && a === catId));
    };

    const getCategoryById = (id: string) => CATEGORIES.find((c) => c.id === id);

    return (
        <section ref={sectionRef} className="relative bg-[#040410] overflow-hidden py-32 md:py-40">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030308] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-16 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-400/40" />
                        Technology Ecosystem
                    </span>
                    <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92] max-w-2xl">
                        A living{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #a78bfa, #3b82f6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            system.
                        </span>
                    </h2>
                    <p className="mt-4 text-white/40 text-lg max-w-lg leading-relaxed">
                        Hover any category to illuminate its connections across the stack.
                    </p>
                </div>

                {/* Graph container */}
                <div
                    className={`relative transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    {/* SVG connections */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ overflow: 'visible' }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {CONNECTIONS.map(([aId, bId]) => {
                            const a = getCategoryById(aId);
                            const b = getCategoryById(bId);
                            if (!a || !b) return null;
                            const active = hoveredId === aId || hoveredId === bId || hoveredId === null;
                            const highlight = hoveredId === aId || hoveredId === bId;
                            return (
                                <line
                                    key={`${aId}-${bId}`}
                                    x1={a.x + '%'}
                                    y1={a.y + '%'}
                                    x2={b.x + '%'}
                                    y2={b.y + '%'}
                                    stroke={highlight ? a.color : 'rgba(255,255,255,0.06)'}
                                    strokeWidth={highlight ? '0.4' : '0.2'}
                                    style={{
                                        opacity: active ? (highlight ? 0.9 : 0.06) : 0.06,
                                        transition: 'opacity 0.4s ease, stroke 0.4s ease, stroke-width 0.4s ease',
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {/* Category hubs */}
                    <div className="grid grid-cols-2 gap-6">
                        {CATEGORIES.map((cat) => {
                            const active = hoveredId === cat.id;
                            const connected = isConnected(cat.id);
                            const dimmed = hoveredId !== null && !active && !connected;

                            return (
                                <div
                                    key={cat.id}
                                    className="rounded-2xl border p-6 cursor-default transition-all duration-500"
                                    style={{
                                        borderColor: active
                                            ? cat.color
                                            : connected
                                              ? `rgba(${cat.rgb},0.3)`
                                              : 'rgba(255,255,255,0.06)',
                                        background: active ? `rgba(${cat.rgb},0.08)` : 'rgba(255,255,255,0.02)',
                                        boxShadow: active ? `0 0 40px rgba(${cat.rgb},0.12)` : 'none',
                                        opacity: dimmed ? 0.3 : 1,
                                        transform: active ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                    onMouseEnter={() => setHoveredId(cat.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Category label */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div
                                            className="w-3 h-3 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: cat.color,
                                                boxShadow: active ? `0 0 12px rgba(${cat.rgb},0.8)` : 'none',
                                            }}
                                        />
                                        <span
                                            className="text-sm font-semibold tracking-wide transition-colors duration-300"
                                            style={{ color: active ? cat.color : 'rgba(255,255,255,0.5)' }}
                                        >
                                            {cat.label}
                                        </span>
                                    </div>

                                    {/* Tech nodes */}
                                    <div className="flex flex-wrap gap-2">
                                        {cat.nodes.map((node) => (
                                            <span
                                                key={node}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
                                                style={{
                                                    background: active
                                                        ? `rgba(${cat.rgb},0.15)`
                                                        : 'rgba(255,255,255,0.04)',
                                                    color: active ? cat.color : 'rgba(255,255,255,0.35)',
                                                    border: active
                                                        ? `1px solid rgba(${cat.rgb},0.25)`
                                                        : '1px solid rgba(255,255,255,0.06)',
                                                }}
                                            >
                                                {node}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center hub label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-16 h-16 rounded-full border border-white/10 bg-[#040410] flex items-center justify-center transition-all duration-500"
                            style={{
                                boxShadow: hoveredId ? `0 0 30px rgba(59,130,246,0.2)` : '0 0 0 rgba(0,0,0,0)',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 256 256" fill="rgba(255,255,255,0.4)">
                                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
