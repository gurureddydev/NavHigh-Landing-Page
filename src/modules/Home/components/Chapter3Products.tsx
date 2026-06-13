'use client';

import React, { useEffect, useRef, useState } from 'react';

const PRODUCTS = [
    {
        id: 'agent',
        title: 'Agent Platform',
        category: 'AI Infrastructure',
        desc: 'Deploy and orchestrate autonomous AI agents across your enterprise. Multi-model, multi-tool, fully observable.',
        status: 'Live',
        statusColor: '#22c55e',
        accent: '#3b82f6',
        accentRgb: '59,130,246',
        tag: 'Multi-Agent',
    },
    {
        id: 'interview',
        title: 'Mock Interview Platform',
        category: 'Talent Intelligence',
        desc: 'AI-driven interview simulation with real-time feedback, scoring, and recruiter dashboards.',
        status: 'Live',
        statusColor: '#22c55e',
        accent: '#8b5cf6',
        accentRgb: '139,92,246',
        tag: 'AI-Powered',
    },
    {
        id: 'workflow',
        title: 'Workflow Automation',
        category: 'Business Systems',
        desc: 'Visual workflow builder with AI decision nodes, approval chains, and deep system integrations.',
        status: 'Beta',
        statusColor: '#f97316',
        accent: '#22d3ee',
        accentRgb: '34,211,238',
        tag: 'No-Code + AI',
    },
    {
        id: 'ecosystem',
        title: 'Enterprise Multi-Agent Ecosystem',
        category: 'AI Platform',
        desc: 'A unified intelligence layer connecting every tool, team, and process across your organization.',
        status: 'Coming Soon',
        statusColor: '#a78bfa',
        accent: '#f97316',
        accentRgb: '249,115,22',
        tag: 'Enterprise',
    },
];

interface ProductCardProps {
    product: (typeof PRODUCTS)[0];
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ x: dy * -8, y: dx * 8 });
    };

    return (
        <div
            ref={cardRef}
            className="relative flex-shrink-0 w-[min(80vw,480px)] rounded-3xl overflow-hidden cursor-default"
            style={{
                background: `linear-gradient(135deg, #0d0d1a 0%, #080814 100%)`,
                border: `1px solid rgba(${product.accentRgb},${hovered ? 0.25 : 0.1})`,
                transform: hovered
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(20px)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
                transition: hovered
                    ? 'transform 0.1s linear, box-shadow 0.4s ease, border-color 0.4s ease'
                    : 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease',
                boxShadow: hovered
                    ? `0 30px 80px rgba(${product.accentRgb},0.15), 0 0 0 1px rgba(${product.accentRgb},0.2)`
                    : '0 4px 24px rgba(0,0,0,0.4)',
                willChange: 'transform',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setTilt({ x: 0, y: 0 });
            }}
        >
            {/* Glow blob */}
            <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, rgba(${product.accentRgb},0.2) 0%, transparent 70%)`,
                    opacity: hovered ? 1 : 0.4,
                }}
            />

            <div className="relative z-10 p-8 h-full flex flex-col" style={{ minHeight: 340 }}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-auto">
                    <div>
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 block mb-2">
                            {product.category}
                        </span>
                        <h3
                            className="text-white text-2xl font-bold tracking-[-0.02em] leading-tight"
                            style={{
                                transition: 'color 0.3s',
                                color: hovered ? product.accent : '#ffffff',
                            }}
                        >
                            {product.title}
                        </h3>
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ml-4"
                        style={{
                            background: `rgba(${product.accentRgb},0.12)`,
                            color: product.statusColor,
                            border: `1px solid rgba(${product.accentRgb},0.2)`,
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: product.statusColor,
                                boxShadow: `0 0 6px ${product.statusColor}`,
                                animation: product.status === 'Live' ? 'nh-pulse 2s ease infinite' : 'none',
                            }}
                        />
                        {product.status}
                    </div>
                </div>

                {/* Index number */}
                <div
                    className="text-[6rem] font-bold leading-none select-none mt-4 mb-4"
                    style={{
                        color: `rgba(${product.accentRgb},0.07)`,
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Desc */}
                <p className="text-white/40 text-sm leading-relaxed mb-6">{product.desc}</p>

                {/* Tag */}
                <div className="flex items-center justify-between">
                    <span
                        className="text-[11px] px-3 py-1 rounded-full font-medium"
                        style={{
                            background: `rgba(${product.accentRgb},0.1)`,
                            color: product.accent,
                        }}
                    >
                        {product.tag}
                    </span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{
                            color: product.accent,
                            opacity: hovered ? 1 : 0.4,
                            transform: hovered ? 'translate(0,0)' : 'translate(-4px,0)',
                            transition: 'opacity 0.3s, transform 0.3s',
                        }}
                    >
                        <path
                            d="M4 10h12M10 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const Chapter3Products: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [headerInView, setHeaderInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setHeaderInView(true);
            },
            {
                threshold: 0.05,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        let gsapInstance: (typeof import('gsap'))['default'] | null = null;
        let stInstance: (typeof import('gsap/ScrollTrigger'))['ScrollTrigger'] | null = null;

        const setup = async () => {
            const { default: gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);
            gsapInstance = gsap;
            stInstance = ScrollTrigger;

            const container = containerRef.current;
            const track = trackRef.current;
            if (!container || !track) return;

            const totalMove = track.scrollWidth - container.offsetWidth;

            gsap.to(track, {
                x: -totalMove,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${totalMove + window.innerHeight * 0.5}`,
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                },
            });
        };

        setup();

        return () => {
            stInstance?.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#030308]">
            {/* Section header — above the pinned area */}
            <div className="max-w-7xl mx-auto px-6 md:px-14 pt-32 pb-16">
                <div
                    className={`transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-400/40" />
                        Products in Motion
                    </span>
                    <h2 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.04em] leading-[0.92]">
                        Built to move{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            business.
                        </span>
                    </h2>
                </div>
            </div>

            {/* Pinned scroll container */}
            <div ref={containerRef} className="relative overflow-hidden" style={{ height: '100vh' }}>
                <div
                    ref={trackRef}
                    className="absolute top-0 left-0 h-full flex items-center gap-6 pl-14 pr-24"
                    style={{ willChange: 'transform' }}
                >
                    {PRODUCTS.map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                    ))}
                </div>

                {/* Edge fade */}
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030308] to-transparent pointer-events-none z-10" />
            </div>
        </section>
    );
};
