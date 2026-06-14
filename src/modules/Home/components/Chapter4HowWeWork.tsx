'use client';

import React, { useEffect, useRef, useState } from 'react';

const STEPS = [
    {
        num: '01',
        label: 'Discover',
        desc: 'Deep-dive sessions to map your business, surface the real problems, and define what success looks like.',
    },
    {
        num: '02',
        label: 'Design',
        desc: 'Architecture, UX, and system design grounded in your constraints — before a single line of code.',
    },
    {
        num: '03',
        label: 'Build',
        desc: 'Rapid, iterative delivery with weekly demos. Engineering quality without bureaucracy.',
    },
    {
        num: '04',
        label: 'Scale',
        desc: 'Performance-tuning, infrastructure hardening, and growth-ready architecture from day one.',
    },
    {
        num: '05',
        label: 'Support',
        desc: 'Ongoing partnership — not a handoff. We stay accountable to the outcomes we promised.',
    },
];

export const Chapter4HowWeWork: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeSteps, setActiveSteps] = useState<boolean[]>(Array(STEPS.length).fill(false));
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        stepRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setActiveSteps((prev) => {
                                const next = [...prev];
                                next[i] = true;
                                return next;
                            });
                        }, i * 80);
                        obs.unobserve(entry.target);
                    }
                },
                { threshold: 0.4 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => {
            return observers.forEach((o) => {
                return o.disconnect();
            });
        };
    }, []);

    const [headerInView, setHeaderInView] = useState(false);
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setHeaderInView(true);
            },
            { threshold: 0.05 }
        );
        obs.observe(el);
        return () => {
            return obs.disconnect();
        };
    }, []);

    return (
        <section id="how-we-work" ref={sectionRef} className="relative bg-[#FAFBFF] overflow-hidden py-32 md:py-40">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F5F7FA] to-transparent pointer-events-none" />

            {/* Faint vertical rule */}
            <div className="absolute left-1/2 top-32 bottom-32 w-px bg-gradient-to-b from-transparent via-blue-400/15 to-transparent hidden lg:block pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-20 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-600/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-500/40" />
                        How We Work
                    </span>
                    <h2 className="text-[#0F172A] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92] max-w-2xl">
                        A process built <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #0891b2, #2563eb)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            for outcomes.
                        </span>
                    </h2>
                </div>

                {/* Steps */}
                <div className="relative flex flex-col gap-0">
                    {/* Animated vertical connector */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-[#0F172A]/06 hidden sm:block" />

                    {STEPS.map((step, i) => {
                        const active = activeSteps[i];
                        return (
                            <div
                                key={step.num}
                                ref={(el) => {
                                    stepRefs.current[i] = el;
                                }}
                                className={`
                                    relative flex items-start gap-8 py-10 sm:pl-16
                                    transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                                    ${active ? 'opacity-100 translate-x-0 blur-none' : 'opacity-0 -translate-x-6 blur-sm'}
                                `}
                                style={{ transitionDelay: `${i * 0.06}s` }}
                            >
                                {/* Node on the line */}
                                <div
                                    className="absolute left-[18px] top-11 w-5 h-5 rounded-full border-2 -translate-x-1/2 hidden sm:flex items-center justify-center transition-all duration-700"
                                    style={{
                                        borderColor: active ? '#2563eb' : 'rgba(15,23,42,0.15)',
                                        backgroundColor: active ? '#2563eb' : 'transparent',
                                        boxShadow: active ? '0 0 16px rgba(37,99,235,0.5)' : 'none',
                                    }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full bg-white transition-opacity duration-500"
                                        style={{ opacity: active ? 1 : 0 }}
                                    />
                                </div>

                                {/* Card */}
                                <div className="flex-1 group rounded-2xl border border-[#0F172A]/[0.07] bg-white p-8 hover:border-blue-400/30 hover:shadow-[0_8px_32px_rgba(37,99,235,0.07)] transition-all duration-500">
                                    <div className="flex items-start gap-6">
                                        {/* Number */}
                                        <span
                                            className="text-6xl font-bold leading-none select-none flex-shrink-0 transition-colors duration-500"
                                            style={{
                                                color: active ? 'rgba(37,99,235,0.2)' : 'rgba(15,23,42,0.07)',
                                            }}
                                        >
                                            {step.num}
                                        </span>
                                        <div>
                                            <h3 className="text-[#0F172A] text-2xl font-bold tracking-[-0.02em] mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                                {step.label}
                                            </h3>
                                            <p className="text-[#0F172A]/50 leading-relaxed text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
