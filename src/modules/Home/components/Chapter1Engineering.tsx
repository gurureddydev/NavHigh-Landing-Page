'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NodeCanvas } from './NodeCanvas';

const STATS = [
    { value: '150+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Retention' },
    { value: '40+', label: 'Enterprise Clients' },
];

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
            {
                threshold: 0.1,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const revealClass = (delay: string, extra = '') =>
        `transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${extra} ${
            inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
        }`;

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-[#030308] overflow-hidden flex items-center">
            {/* Animated node network */}
            <NodeCanvas
                className="absolute inset-0 pointer-events-none"
                count={70}
                connectionDist={155}
                color="59,130,246"
                speed={0.3}
                mouseRepel
            />

            {/* Radial gradient vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#030308_100%)] pointer-events-none" />

            {/* Top + bottom fade */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 py-36">
                {/* Label */}
                <div className={revealClass('0s', 'mb-8')}>
                    <span className="inline-flex items-center gap-2 text-blue-400/70 text-[11px] font-semibold tracking-[0.28em] uppercase">
                        <span className="block w-5 h-px bg-blue-400/50" />
                        NavHigh Technologies
                    </span>
                </div>

                {/* Headline */}
                <h2 className={revealClass('0.18s', 'max-w-5xl')} style={{ transitionDelay: '0.18s' }}>
                    <span className="block text-white text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em]">
                        Engineering
                    </span>
                    <span
                        className="block text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em]"
                        style={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Beyond
                    </span>
                    <span className="block text-white text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em]">
                        Software.
                    </span>
                </h2>

                {/* Subheadline */}
                <p
                    className={revealClass('0.4s', 'mt-10 max-w-lg text-white/50 text-lg leading-relaxed')}
                    style={{ transitionDelay: '0.4s' }}
                >
                    We create products, intelligence, and digital systems that scale businesses from idea to enterprise
                    — and beyond.
                </p>

                {/* Stats row */}
                <div className={revealClass('0.6s', 'mt-16 flex flex-wrap gap-10')} style={{ transitionDelay: '0.6s' }}>
                    {STATS.map((s) => (
                        <div key={s.label} className="group">
                            <div className="text-4xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                                {s.value}
                            </div>
                            <div className="text-white/35 text-sm mt-1.5 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
