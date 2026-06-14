'use client';

import type { LucideIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Code2, Database, Target, Users } from 'lucide-react';

/* ── Service catalogue ─────────────────────────────────────────────────── */
interface Service {
    id: string;
    title: string;
    scale: string;
    desc: string;
    Icon: LucideIcon;
    num: string;
    accent: string;
    accentRgb: string;
    tags: string[];
}

const SERVICES: Service[] = [
    {
        id: 'product',
        title: 'Product Engineering',
        scale: '60+ shipped',
        desc: 'End-to-end product development — from architecture to deployment — built to scale and last.',
        Icon: Code2,
        num: '01',
        accent: '#3b82f6',
        accentRgb: '59,130,246',
        tags: ['Ships in 8 weeks', '3× faster iteration', 'SOC 2 compliant'],
    },
    {
        id: 'ai',
        title: 'AI Solutions',
        scale: '30+ integrations',
        desc: 'LLM integrations, multi-agent systems, and AI-native products that transform workflows.',
        Icon: Bot,
        num: '02',
        accent: '#a855f7',
        accentRgb: '168,85,247',
        tags: ['10× workflow speed', 'Plug-and-play APIs', 'Auto-scales'],
    },
    {
        id: 'systems',
        title: 'Business Systems',
        scale: '25+ deployments',
        desc: 'Custom ERP, CRM, and enterprise platforms designed around your operations.',
        Icon: Database,
        num: '03',
        accent: '#06b6d4',
        accentRgb: '6,182,212',
        tags: ['99.9% uptime SLA', 'ERP-ready', 'Multi-region'],
    },
    {
        id: 'talent',
        title: 'Talent Platforms',
        scale: '15+ platforms',
        desc: 'Intelligent recruitment, assessment, and talent-matching at scale.',
        Icon: Users,
        num: '04',
        accent: '#f97316',
        accentRgb: '249,115,22',
        tags: ['80% hire-time cut', 'AI-powered match', 'ATS-integrated'],
    },
    {
        id: 'consulting',
        title: 'Consulting',
        scale: '50+ engagements',
        desc: 'Strategic technology partnerships — not just advice, but accountability for outcomes.',
        Icon: Target,
        num: '05',
        accent: '#22c55e',
        accentRgb: '34,197,94',
        tags: ['Strategy to ship', 'Weekly sprints', 'CTO-level access'],
    },
];

const DEPLOY_LINES = [
    { text: '$ navhigh ship --env production', color: '#93c5fd' },
    { text: '✓  247 tests passed', color: '#4ade80' },
    { text: '✓  Build: 1.2 MB → 340 KB', color: '#4ade80' },
    { text: '✓  Deployed to 3 regions', color: '#4ade80' },
    { text: '✓  Live in 2.4 s', color: '#4ade80' },
    { text: '→  Ready. 60+ shipped.', color: '#fb923c' },
];

const UPTIME_BARS = Array.from({ length: 56 }, (_, i) => {
    return {
        degraded: [8, 23, 47].includes(i),
        h: Math.round(10 + Math.abs(Math.sin(i * 0.51) * 22)),
    };
});

const CANDIDATES = [
    { initials: 'SC', name: 'Sarah Chen', role: 'Senior Engineer', match: 94 },
    { initials: 'AK', name: 'Alex Kumar', role: 'Full Stack Dev', match: 87 },
    { initials: 'MT', name: 'Mike Torres', role: 'DevOps Lead', match: 78 },
];

const MILESTONES = [
    { week: 'Wk 1', label: 'Discovery', done: true, active: false },
    { week: 'Wk 2', label: 'Design', done: true, active: false },
    { week: 'Wk 4', label: 'Build', done: true, active: false },
    { week: 'Wk 6', label: 'QA', done: false, active: true },
    { week: 'Wk 8', label: 'Ship', done: false, active: false },
];

/* ── Shared atoms ──────────────────────────────────────────────────────── */
const Tag: React.FC<{ label: string; accent: string; accentRgb: string; lit: boolean }> = ({
    label,
    accent,
    accentRgb,
    lit,
}) => {
    return (
        <span
            className="text-[10px] font-medium px-2.5 py-[5px] rounded-full whitespace-nowrap transition-all duration-300"
            style={{
                background: lit ? `rgba(${accentRgb},0.16)` : 'rgba(255,255,255,0.05)',
                color: lit ? accent : 'rgba(255,255,255,0.38)',
                border: `1px solid ${lit ? `rgba(${accentRgb},0.32)` : 'rgba(255,255,255,0.09)'}`,
            }}
        >
            {label}
        </span>
    );
};

const StudyLink: React.FC<{ accent: string }> = ({ accent }) => {
    return (
        <a
            href="#"
            onClick={(e) => {
                return e.preventDefault();
            }}
            className="inline-flex items-center gap-1.5 group transition-opacity duration-200 hover:opacity-80"
            style={{ color: accent }}
            aria-label="Read case study"
        >
            <span className="text-[11px] font-semibold tracking-wide">Case study</span>
            <span className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                →
            </span>
        </a>
    );
};

/* ── Terminal preview (Product Engineering) ────────────────────────────── */
const TerminalPreview: React.FC = () => {
    const [visible, setVisible] = useState(0);

    useEffect(() => {
        const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (pref) {
            setVisible(DEPLOY_LINES.length);
            return;
        }
        const timers: ReturnType<typeof setTimeout>[] = [];
        let count = 0;

        const runCycle = () => {
            count = 0;
            setVisible(0);
            const tick = () => {
                if (count >= DEPLOY_LINES.length) {
                    timers.push(setTimeout(runCycle, 3200));
                    return;
                }
                count++;
                setVisible(count);
                timers.push(setTimeout(tick, 430));
            };
            timers.push(setTimeout(tick, 430));
        };

        runCycle();
        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <div
            className="flex flex-col h-full"
            style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
        >
            <div
                className="flex items-center gap-1.5 px-5 py-3 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-auto text-white/20 text-[10px] font-mono tracking-wider">deploy.sh</span>
            </div>
            <div className="flex-1 flex flex-col justify-center px-5 py-6 font-mono text-[11px] leading-[2.1]">
                {DEPLOY_LINES.map((line, i) => {
                    return (
                        <div
                            key={i}
                            className="transition-all duration-300 ease-out"
                            style={{
                                color: line.color,
                                opacity: i < visible ? 1 : 0,
                                transform: i < visible ? 'translateX(0)' : 'translateX(-10px)',
                                transitionDelay: `${i * 18}ms`,
                            }}
                        >
                            {line.text}
                        </div>
                    );
                })}
                {visible < DEPLOY_LINES.length && (
                    <div className="w-1.5 h-[14px] bg-white/35 inline-block animate-pulse mt-0.5" />
                )}
            </div>
        </div>
    );
};

/* ── AI chat preview ───────────────────────────────────────────────────── */
const AIChatPreview: React.FC<{ accent: string; accentRgb: string }> = ({ accent, accentRgb }) => {
    const [step, setStep] = useState<number>(() => {
        if (typeof window === 'undefined') return 0;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3 : 0;
    });

    useEffect(() => {
        const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (pref) return;
        const timers: ReturnType<typeof setTimeout>[] = [];

        const runCycle = () => {
            setStep(1);
            timers.push(
                setTimeout(() => {
                    setStep(2);
                    timers.push(
                        setTimeout(() => {
                            setStep(3);
                            timers.push(
                                setTimeout(() => {
                                    setStep(0);
                                    timers.push(setTimeout(runCycle, 500));
                                }, 4000)
                            );
                        }, 1100)
                    );
                }, 800)
            );
        };

        const init = setTimeout(runCycle, 600);
        timers.push(init);
        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
            <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                <span className="text-[9px] font-mono tracking-[0.1em] text-white/30">AI ASSISTANT · LIVE</span>
            </div>
            <div className="p-4 flex flex-col gap-3" style={{ minHeight: 108 }}>
                <div
                    className="flex justify-end transition-all duration-500"
                    style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(6px)' }}
                >
                    <div
                        className="text-[11px] px-3 py-1.5 rounded-[10px] rounded-br-[2px] max-w-[85%]"
                        style={{ background: `rgba(${accentRgb},0.2)`, color: 'rgba(255,255,255,0.8)' }}
                    >
                        Summarize last quarter
                    </div>
                </div>

                {step === 2 && (
                    <div className="flex gap-1 pl-1 items-center h-6">
                        {[0, 1, 2].map((i) => {
                            return (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                                    style={{ background: accent, opacity: 0.7, animationDelay: `${i * 150}ms` }}
                                />
                            );
                        })}
                    </div>
                )}

                {step === 3 && (
                    <div
                        className="flex transition-all duration-500"
                        style={{
                            opacity: step === 3 ? 1 : 0,
                            transform: step === 3 ? 'translateY(0)' : 'translateY(6px)',
                        }}
                    >
                        <div
                            className="text-[11px] px-3 py-1.5 rounded-[10px] rounded-bl-[2px] leading-[1.6]"
                            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.72)' }}
                        >
                            Revenue ↑ 34% · Churn ↓ 8% · NPS 72 · 3 enterprise deals closed.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Uptime bars preview (Business Systems) ────────────────────────────── */
const UptimePreview: React.FC<{ accent: string }> = ({ accent }) => {
    return (
        <div>
            <div className="flex items-end gap-[2px]" style={{ height: 44 }}>
                {UPTIME_BARS.map((bar, i) => {
                    return (
                        <div
                            key={i}
                            className="flex-1 rounded-[1px] transition-all duration-500"
                            style={{
                                height: bar.h,
                                background: bar.degraded ? '#fb923c' : accent,
                                opacity: bar.degraded ? 0.75 : 0.35 + (i / UPTIME_BARS.length) * 0.65,
                                transitionDelay: `${i * 10}ms`,
                            }}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between items-center mt-2.5">
                <span className="text-[9px] font-mono text-white/25">56-day window</span>
                <span className="text-[11px] font-bold" style={{ color: accent }}>
                    99.9% uptime
                </span>
            </div>
        </div>
    );
};

/* ── Match bars preview (Talent Platforms) ─────────────────────────────── */
const TalentPreview: React.FC<{ accent: string; accentRgb: string }> = ({ accent, accentRgb }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setAnimated(true);
        }, 400);
        return () => {
            clearTimeout(t);
        };
    }, []);

    return (
        <div className="flex flex-col gap-3">
            {CANDIDATES.map((c, i) => {
                return (
                    <div key={c.name} className="flex items-center gap-2.5">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                            style={{
                                background: `rgba(${accentRgb},0.18)`,
                                border: `1px solid rgba(${accentRgb},0.35)`,
                                color: accent,
                            }}
                        >
                            {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-white/80 truncate">{c.name}</div>
                            <div className="text-[9px] text-white/30">{c.role}</div>
                        </div>
                        <div
                            className="w-14 h-1 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: animated ? `${c.match}%` : '0%',
                                    background: accent,
                                    transitionDelay: `${i * 120}ms`,
                                }}
                            />
                        </div>
                        <span
                            className="text-[10px] font-bold flex-shrink-0"
                            style={{ color: accent, minWidth: 26, textAlign: 'right' }}
                        >
                            {c.match}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

/* ── Milestone timeline preview (Consulting) ───────────────────────────── */
const milestoneBg = (m: (typeof MILESTONES)[number], accent: string): string => {
    if (m.done) return accent;
    if (m.active) return 'transparent';
    return 'rgba(255,255,255,0.1)';
};

const TimelinePreview: React.FC<{ accent: string; accentRgb: string }> = ({ accent, accentRgb }) => {
    return (
        <div className="relative pt-2">
            {/* Track line */}
            <div className="absolute top-[18px] left-3 right-3 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {/* Progress fill — 3 of 5 done = 60% */}
            <div
                className="absolute top-[18px] left-3 h-px"
                style={{ width: '55%', background: accent, opacity: 0.6 }}
            />
            <div className="flex justify-between relative">
                {MILESTONES.map((m) => {
                    return (
                        <div key={m.week} className="flex flex-col items-center gap-1.5" style={{ width: 36 }}>
                            <div
                                className="w-3 h-3 rounded-full z-10 transition-all duration-300"
                                style={{
                                    background: milestoneBg(m, accent),
                                    border: m.active ? `2px solid ${accent}` : 'none',
                                    boxShadow: m.active ? `0 0 10px ${accent}88` : 'none',
                                }}
                            />
                            <span className="text-[8px] font-mono text-white/25">{m.week}</span>
                            <span
                                className="text-[9px] font-medium text-center leading-tight"
                                style={{
                                    color: m.done || m.active ? `rgba(${accentRgb},0.9)` : 'rgba(255,255,255,0.2)',
                                }}
                            >
                                {m.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Card shared wrapper ─────────────────────────────────────────────────── */
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

/* ── Large hero card — Product Engineering ──────────────────────────────── */
const LargeCard: React.FC<{ service: Service; inView: boolean }> = ({ service, inView }) => {
    const [hov, setHov] = useState(false);

    return (
        <div
            className={`relative rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[380px] cursor-default transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
            }`}
            style={{
                background: CARD_BG,
                border: `1px solid ${hov ? `rgba(${service.accentRgb},0.4)` : CARD_BORDER}`,
                boxShadow: hov
                    ? `0 0 0 1px rgba(${service.accentRgb},0.2), 0 40px 80px rgba(${service.accentRgb},0.14)`
                    : 'none',
                transform: hov ? 'translateY(-4px)' : undefined,
                transition:
                    'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.7s, filter 0.7s',
                transitionDelay: '0s',
            }}
            onMouseEnter={() => {
                return setHov(true);
            }}
            onMouseLeave={() => {
                return setHov(false);
            }}
        >
            {/* Glow in top-left */}
            <div
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle, rgba(${service.accentRgb},0.18) 0%, transparent 70%)`,
                    opacity: hov ? 1 : 0.25,
                }}
            />

            {/* Left: text */}
            <div className="relative z-10 flex-1 flex flex-col p-8 md:p-10">
                {/* Num + icon */}
                <div className="flex items-center gap-3 mb-7">
                    <span className="font-mono text-[10px] text-white/18" style={{ letterSpacing: '0.12em' }}>
                        {service.num}
                    </span>
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300"
                        style={{
                            background: `rgba(${service.accentRgb},0.1)`,
                            border: `1px solid rgba(${service.accentRgb},0.25)`,
                            transform: hov ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
                        }}
                    >
                        <service.Icon
                            size={17}
                            strokeWidth={1.8}
                            style={{ color: service.accent }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Title */}
                <h3
                    className="text-[1.6rem] md:text-[1.9rem] font-bold tracking-[-0.035em] leading-[1.1] transition-colors duration-300"
                    style={{ color: hov ? service.accent : '#f1f5f9' }}
                >
                    {service.title}
                </h3>
                <p className="mt-1.5 text-[11px] font-semibold tracking-wider" style={{ color: `${service.accent}99` }}>
                    {service.scale}
                </p>

                <p className="mt-5 text-[14px] leading-[1.7] text-white/45 max-w-[320px]">{service.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-6">
                    {service.tags.map((tag) => {
                        return (
                            <Tag
                                key={tag}
                                label={tag}
                                accent={service.accent}
                                accentRgb={service.accentRgb}
                                lit={hov}
                            />
                        );
                    })}
                </div>

                {/* CTA */}
                <div
                    className="mt-auto pt-7"
                    style={{
                        borderTop: `1px solid rgba(${service.accentRgb},${hov ? 0.18 : 0.07})`,
                        marginTop: 'auto',
                    }}
                >
                    <StudyLink accent={service.accent} />
                </div>
            </div>

            {/* Right: terminal panel */}
            <div className="hidden md:flex flex-col flex-shrink-0 w-[272px]">
                <TerminalPreview />
            </div>
        </div>
    );
};

/* ── Small card ─────────────────────────────────────────────────────────── */
const SmallCard: React.FC<{ service: Service; inView: boolean; delay: number }> = ({ service, inView, delay }) => {
    const [hov, setHov] = useState(false);

    const renderPreview = () => {
        if (service.id === 'ai') {
            return <AIChatPreview accent={service.accent} accentRgb={service.accentRgb} />;
        }
        if (service.id === 'systems') {
            return <UptimePreview accent={service.accent} />;
        }
        if (service.id === 'talent') {
            return <TalentPreview accent={service.accent} accentRgb={service.accentRgb} />;
        }
        if (service.id === 'consulting') {
            return <TimelinePreview accent={service.accent} accentRgb={service.accentRgb} />;
        }
        return null;
    };

    return (
        <div
            className={`relative rounded-2xl overflow-hidden flex flex-col cursor-default transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
            }`}
            style={{
                background: CARD_BG,
                border: `1px solid ${hov ? `rgba(${service.accentRgb},0.35)` : CARD_BORDER}`,
                boxShadow: hov
                    ? `0 0 0 1px rgba(${service.accentRgb},0.18), 0 24px 56px rgba(${service.accentRgb},0.1)`
                    : 'none',
                transform: hov ? 'translateY(-3px)' : undefined,
                transition:
                    'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.7s, filter 0.7s',
                transitionDelay: `${delay}s`,
            }}
            onMouseEnter={() => {
                return setHov(true);
            }}
            onMouseLeave={() => {
                return setHov(false);
            }}
        >
            {/* Top accent stripe on hover */}
            <div
                className="absolute top-0 inset-x-0 h-[1.5px] transition-opacity duration-400 pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(${service.accentRgb},0.7) 40%, rgba(${service.accentRgb},0.7) 60%, transparent)`,
                    opacity: hov ? 1 : 0,
                }}
            />

            {/* Glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 0% 0%, rgba(${service.accentRgb},0.07) 0%, transparent 70%)`,
                    opacity: hov ? 1 : 0,
                }}
            />

            <div className="relative z-10 p-7 flex flex-col h-full gap-0">
                {/* Header row: icon + scale */}
                <div className="flex items-start justify-between mb-5">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 flex-shrink-0"
                        style={{
                            background: `rgba(${service.accentRgb},0.1)`,
                            border: `1px solid rgba(${service.accentRgb},0.22)`,
                            transform: hov ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
                        }}
                    >
                        <service.Icon
                            size={16}
                            strokeWidth={1.8}
                            style={{ color: service.accent }}
                            aria-hidden="true"
                        />
                    </div>
                    <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide"
                        style={{
                            background: `rgba(${service.accentRgb},0.1)`,
                            color: service.accent,
                            border: `1px solid rgba(${service.accentRgb},0.2)`,
                        }}
                    >
                        {service.scale}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className="font-bold tracking-[-0.025em] leading-snug transition-colors duration-300"
                    style={{ fontSize: '1.05rem', color: hov ? service.accent : '#f1f5f9' }}
                >
                    {service.title}
                </h3>
                <p className="text-[12.5px] leading-relaxed mt-2 text-white/40">{service.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                    {service.tags.map((tag) => {
                        return (
                            <Tag
                                key={tag}
                                label={tag}
                                accent={service.accent}
                                accentRgb={service.accentRgb}
                                lit={hov}
                            />
                        );
                    })}
                </div>

                {/* Mini visualization */}
                <div
                    className="mt-5 rounded-xl p-4 flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                    {renderPreview()}
                </div>

                {/* CTA */}
                <div
                    className="mt-auto pt-5"
                    style={{ borderTop: `1px solid rgba(${service.accentRgb},${hov ? 0.14 : 0.06})` }}
                >
                    <StudyLink accent={service.accent} />
                </div>
            </div>
        </div>
    );
};

/* ── Section ────────────────────────────────────────────────────────────── */
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
            { threshold: 0.05 }
        );
        obs.observe(el);
        return () => {
            obs.disconnect();
        };
    }, []);

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative overflow-hidden py-28 md:py-40"
            style={{ background: '#060B14' }}
        >
            {/* ── Background atmosphere ── */}
            {/* Dot grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                    opacity: 0.5,
                }}
            />
            {/* Aurora glow — top right */}
            <div
                className="absolute -top-40 -right-40 w-[700px] h-[500px] pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.12) 0%, rgba(168,85,247,0.06) 45%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
            {/* Fade edges */}
            <div
                className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, #060B14, transparent)' }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #060B14, transparent)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* ── Section header ── */}
                <div
                    className={`mb-16 md:mb-20 flex flex-col md:flex-row md:items-end gap-10 md:gap-20 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="flex-1">
                        <span
                            className="inline-flex items-center gap-2 mb-5 text-[10px] font-bold tracking-[0.3em] uppercase"
                            style={{ color: 'rgba(59,130,246,0.6)' }}
                        >
                            <span className="block w-5 h-px" style={{ background: 'rgba(59,130,246,0.5)' }} />
                            02 — Capabilities
                        </span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.9] text-white">
                            Five pillars.
                            <br />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                One vision.
                            </span>
                        </h2>
                        <p className="mt-5 text-[15px] leading-relaxed max-w-md text-white/40">
                            Distinct disciplines, unified by the belief that great engineering changes everything.
                        </p>
                    </div>

                    {/* Right: social proof numbers */}
                    <div className="flex gap-10 md:gap-12 md:pb-2">
                        {[
                            { val: '180+', label: 'Projects shipped' },
                            { val: '98%', label: 'Client retention' },
                            { val: '$2B+', label: 'Value delivered' },
                        ].map((stat) => {
                            return (
                                <div key={stat.label} className="flex flex-col gap-1">
                                    <span className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-white">
                                        {stat.val}
                                    </span>
                                    <span className="text-[11px] text-white/35 whitespace-nowrap">{stat.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Bento grid ── */}
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-stretch">
                    <div className="md:col-span-7">
                        <LargeCard service={SERVICES[0]} inView={inView} />
                    </div>
                    <div className="md:col-span-5">
                        <SmallCard service={SERVICES[1]} inView={inView} delay={0.1} />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                    {SERVICES.slice(2).map((svc, i) => {
                        return <SmallCard key={svc.id} service={svc} inView={inView} delay={0.15 + i * 0.08} />;
                    })}
                </div>
            </div>
        </section>
    );
};
