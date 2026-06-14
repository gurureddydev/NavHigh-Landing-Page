'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ── Types & data ──────────────────────────────────────────────────────── */
type PFrame = 'web' | 'mobile';
type PFilter = 'all' | 'web' | 'mobile' | 'ai';

interface Project {
    id: string;
    num: string;
    title: string;
    category: string;
    frame: PFrame;
    accent: string;
    rgb: string;
    desc: string;
    stack: string[];
    url: string;
    status: 'Live' | 'Beta' | 'Coming Soon';
    filters: PFilter[];
}

const PROJECTS: Project[] = [
    {
        id: 'speedradio',
        num: '01',
        title: 'SpeedRadio',
        category: 'Live Streaming Platform',
        frame: 'web',
        accent: '#ea580c',
        rgb: '234,88,12',
        desc: 'Live radio streaming with AI-powered playlists, real-time listener analytics, and full broadcaster management tools built for scale.',
        stack: ['React', 'Node.js', 'WebRTC', 'AWS'],
        url: 'speedradio.com',
        status: 'Live',
        filters: ['all', 'web'],
    },
    {
        id: 'interview',
        num: '02',
        title: 'AI Interview Pro',
        category: 'AI · Talent SaaS',
        frame: 'web',
        accent: '#7c3aed',
        rgb: '124,58,237',
        desc: 'AI-driven interview simulator with real-time confidence scoring, feedback rubrics, and deep recruiter analytics dashboards.',
        stack: ['Next.js', 'GPT-4o', 'Python', 'PostgreSQL'],
        url: 'aiinterviewpro.io',
        status: 'Live',
        filters: ['all', 'web', 'ai'],
    },
    {
        id: 'workflow',
        num: '03',
        title: 'WorkflowAI',
        category: 'No-Code Automation',
        frame: 'web',
        accent: '#0891b2',
        rgb: '8,145,178',
        desc: 'Visual workflow builder with AI decision nodes, multi-step approval chains, and deep enterprise integrations.',
        stack: ['React', 'Python', 'Kafka', 'PostgreSQL'],
        url: 'workflowai.io',
        status: 'Beta',
        filters: ['all', 'web', 'ai'],
    },
    {
        id: 'talent',
        num: '04',
        title: 'TalentMatch',
        category: 'Mobile App · AI Matching',
        frame: 'mobile',
        accent: '#16a34a',
        rgb: '22,163,74',
        desc: 'AI talent matching app connecting top engineers with high-growth companies. From apply to offer in under 48 hours.',
        stack: ['React Native', 'FastAPI', 'Redis', 'ML'],
        url: 'talentmatch.io',
        status: 'Live',
        filters: ['all', 'mobile', 'ai'],
    },
    {
        id: 'nexora',
        num: '05',
        title: 'Nexora Analytics',
        category: 'Enterprise Dashboard',
        frame: 'web',
        accent: '#2563eb',
        rgb: '37,99,235',
        desc: 'Real-time enterprise analytics with AI-powered insights, custom reports, and multi-source data fusion at petabyte scale.',
        stack: ['Next.js', 'Python', 'ClickHouse', 'D3.js'],
        url: 'nexora.io',
        status: 'Live',
        filters: ['all', 'web', 'ai'],
    },
];

const FILTER_TABS: { key: PFilter; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'ai', label: 'AI-Powered' },
];

/* ── Helper: dot-indicator bg with no nested ternary ──────────────────── */
const statusDotColor = (s: Project['status']): string => {
    if (s === 'Live') return '#16a34a';
    if (s === 'Beta') return '#ea580c';
    return '#7c3aed';
};

/* ── CSS Mockups ──────────────────────────────────────────────────────── */

/* Waveform bar heights for SpeedRadio */
const WAVE = [4, 10, 18, 26, 20, 12, 6, 16, 24, 28, 18, 8, 14, 22, 26, 16, 10, 20, 24, 14, 8, 18];

const SpeedRadioMockup: React.FC<{ accent: string }> = ({ accent }) => {
    return (
        <div className="w-full h-full flex flex-col" style={{ background: '#0d0f14' }}>
            {/* App nav */}
            <div
                className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg" style={{ background: accent }} />
                    <span className="text-white font-bold text-[13px]">SpeedRadio</span>
                </div>
                <div className="flex items-center gap-3">
                    {['Trending', 'Genres', 'Live'].map((nav) => {
                        return (
                            <span key={nav} className="text-[10px] text-white/40">
                                {nav}
                            </span>
                        );
                    })}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                    <span className="text-[10px] font-bold" style={{ color: accent }}>
                        LIVE
                    </span>
                </div>
            </div>

            {/* Content row */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: player */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-5">
                    {/* Album art */}
                    <div
                        className="w-20 h-20 rounded-2xl flex-shrink-0"
                        style={{
                            background: `linear-gradient(135deg, ${accent}cc, ${accent}44)`,
                            boxShadow: `0 8px 32px ${accent}44`,
                        }}
                    />
                    <div className="text-center">
                        <div className="text-white font-semibold text-[13px]">Midnight Frequency</div>
                        <div className="text-white/40 text-[10px] mt-0.5">DJ Arjun · Electronic · Now Playing</div>
                    </div>

                    {/* Waveform */}
                    <div className="flex items-end gap-[2px] h-9 w-full max-w-[160px]">
                        {WAVE.map((h, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex-1 rounded-[1px]"
                                    style={{
                                        height: h,
                                        background: i < 13 ? accent : 'rgba(255,255,255,0.12)',
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Progress */}
                    <div className="w-full max-w-[180px]">
                        <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-full rounded-full" style={{ width: '58%', background: accent }} />
                        </div>
                        <div className="flex justify-between mt-1 text-[9px] text-white/25">
                            <span>2:34</span>
                            <span>4:15</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {(['◁', '▶', '▷'] as const).map((btn, i) => {
                            const isPlay = i === 1;
                            return (
                                <div
                                    key={btn}
                                    className="flex items-center justify-center rounded-full cursor-default select-none"
                                    style={{
                                        width: isPlay ? 42 : 30,
                                        height: isPlay ? 42 : 30,
                                        background: isPlay ? accent : 'rgba(255,255,255,0.07)',
                                        color: 'white',
                                        fontSize: isPlay ? 16 : 12,
                                    }}
                                >
                                    {btn}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: playlist */}
                <div
                    className="w-[130px] flex-shrink-0 flex flex-col"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}
                >
                    <div className="px-3 pt-3 pb-2 text-[8px] font-bold tracking-[0.15em] text-white/25">UP NEXT</div>
                    {[{ w: '80%' }, { w: '65%' }, { w: '72%' }].map((row, i) => {
                        return (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2.5"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex-shrink-0"
                                    style={{ background: `rgba(${234},${88},${12},${i === 0 ? 0.35 : 0.12})` }}
                                />
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <div className="h-1.5 rounded-full bg-white/15" style={{ width: row.w }} />
                                    <div className="h-1 rounded-full bg-white/08 w-[55%]" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const InterviewProMockup: React.FC<{ accent: string }> = ({ accent }) => {
    return (
        <div className="w-full h-full flex flex-col" style={{ background: '#fafafa' }}>
            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-3 bg-white flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md" style={{ background: accent }} />
                    <span className="font-bold text-[12px]" style={{ color: '#0F172A' }}>
                        AI Interview Pro
                    </span>
                </div>
                <div
                    className="px-2.5 py-1 rounded-full text-[9px] font-bold"
                    style={{ background: `rgba(${124},${58},${237},0.1)`, color: accent }}
                >
                    Q2 of 5 · 2:47 remaining
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden gap-0">
                {/* Left: video + question */}
                <div className="flex-1 flex flex-col gap-3 p-4" style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    {/* Video placeholder */}
                    <div
                        className="rounded-xl flex-1 flex items-center justify-center"
                        style={{
                            background: '#111827',
                            border: `1px solid rgba(${124},${58},${237},0.3)`,
                            minHeight: 100,
                        }}
                    >
                        <div className="text-center">
                            <div
                                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-[13px]"
                                style={{
                                    background: `rgba(${124},${58},${237},0.3)`,
                                    border: `1px solid rgba(${124},${58},${237},0.5)`,
                                }}
                            >
                                RK
                            </div>
                            <span className="text-white/30 text-[9px]">Interview Room · HD</span>
                        </div>
                    </div>
                    {/* Question */}
                    <div
                        className="rounded-lg p-3"
                        style={{
                            background: `rgba(${124},${58},${237},0.07)`,
                            border: `1px solid rgba(${124},${58},${237},0.15)`,
                        }}
                    >
                        <div className="text-[9px] font-bold text-white/40 mb-1">CURRENT QUESTION</div>
                        <div className="text-[11px] font-medium" style={{ color: '#0F172A' }}>
                            Describe your approach to designing a distributed caching system.
                        </div>
                    </div>
                </div>

                {/* Right: AI analysis */}
                <div className="w-[160px] flex-shrink-0 flex flex-col gap-0 p-3">
                    <div className="text-[9px] font-bold tracking-wider text-[#0F172A]/40 mb-3">AI ANALYSIS</div>
                    {[
                        { label: 'Confidence', score: 82 },
                        { label: 'Clarity', score: 74 },
                        { label: 'Depth', score: 88 },
                    ].map(({ label, score }) => {
                        return (
                            <div key={label} className="mb-3">
                                <div className="flex justify-between text-[9px] mb-1">
                                    <span className="text-[#0F172A]/50">{label}</span>
                                    <span className="font-bold" style={{ color: accent }}>
                                        {score}%
                                    </span>
                                </div>
                                <div className="h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${score}%`, background: accent }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="mt-1 text-[8px] font-bold tracking-wider text-[#0F172A]/30 mb-2">KEYWORDS</div>
                    <div className="flex flex-wrap gap-1">
                        {['Redis', 'CDN', 'TTL', 'Eviction'].map((kw) => {
                            return (
                                <span
                                    key={kw}
                                    className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                                    style={{ background: `rgba(${124},${58},${237},0.1)`, color: accent }}
                                >
                                    {kw}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const WorkflowMockup: React.FC<{ accent: string }> = ({ accent }) => {
    const NODES = [
        { label: 'Webhook', icon: '⚡', x: '6%' },
        { label: 'AI Classify', icon: '🤖', x: '32%' },
        { label: 'Route', icon: '⑆', x: '58%' },
        { label: 'Notify', icon: '✉', x: '80%' },
    ];
    return (
        <div className="w-full h-full flex" style={{ background: '#0a0f1a' }}>
            {/* Sidebar */}
            <div
                className="w-[52px] flex-shrink-0 flex flex-col items-center gap-3 py-4"
                style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
                {['▣', '⊞', '⋯', '⚙'].map((ic, i) => {
                    return (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] cursor-default"
                            style={{
                                background: i === 0 ? `rgba(${8},${145},${178},0.2)` : 'rgba(255,255,255,0.04)',
                                color: i === 0 ? accent : 'rgba(255,255,255,0.3)',
                                border: i === 0 ? `1px solid rgba(${8},${145},${178},0.35)` : '1px solid transparent',
                            }}
                        >
                            {ic}
                        </div>
                    );
                })}
            </div>

            {/* Canvas */}
            <div className="flex-1 relative flex items-center justify-center p-6">
                {/* Dotted grid background */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    {[18, 44, 70].map((x, i) => {
                        return (
                            <line
                                key={i}
                                x1={`${x}%`}
                                y1="50%"
                                x2={`${x + 20}%`}
                                y2="50%"
                                stroke={`rgba(${8},${145},${178},0.4)`}
                                strokeWidth="1.5"
                                strokeDasharray="4 3"
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                <div className="relative z-10 flex items-center gap-4 w-full">
                    {NODES.map((node, i) => {
                        const isActive = i === 1;
                        return (
                            <div key={node.label} className="flex flex-col items-center gap-1.5 flex-1">
                                <div
                                    className="rounded-xl px-3 py-2 text-center w-full"
                                    style={{
                                        background: isActive
                                            ? `rgba(${8},${145},${178},0.2)`
                                            : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${isActive ? `rgba(${8},${145},${178},0.55)` : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: isActive ? `0 0 24px rgba(${8},${145},${178},0.25)` : 'none',
                                    }}
                                >
                                    <div className="text-[14px] mb-1">{node.icon}</div>
                                    <div
                                        className="text-[9px] font-semibold"
                                        style={{ color: isActive ? accent : 'rgba(255,255,255,0.5)' }}
                                    >
                                        {node.label}
                                    </div>
                                </div>
                                {isActive && (
                                    <div
                                        className="text-[8px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                                        style={{ background: `rgba(${8},${145},${178},0.2)`, color: accent }}
                                    >
                                        Processing…
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const TalentMatchMockup: React.FC<{ accent: string; rgb: string }> = ({ accent, rgb }) => {
    return (
        <div className="w-full h-full flex flex-col" style={{ background: '#0d1117', fontFamily: 'Inter, sans-serif' }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
                <span className="text-[9px] font-semibold text-white/60">9:41</span>
                <div className="flex gap-1 items-center">
                    <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
                        <rect x="0" y="4" width="2" height="5" fill="white" opacity="0.5" rx="0.5" />
                        <rect x="3" y="2.5" width="2" height="6.5" fill="white" opacity="0.6" rx="0.5" />
                        <rect x="6" y="1" width="2" height="8" fill="white" opacity="0.8" rx="0.5" />
                        <rect x="9" y="0" width="2" height="9" fill="white" rx="0.5" />
                    </svg>
                    <span className="text-white/60 text-[9px]">WiFi</span>
                    <span className="text-white/60 text-[9px]">⬆ 87%</span>
                </div>
            </div>

            {/* App header */}
            <div
                className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <span className="text-white/20 text-[11px]">←</span>
                <span className="text-white font-bold text-[13px]">TalentMatch</span>
                <div className="w-7 h-7 rounded-full" style={{ background: `rgba(${rgb},0.2)` }} />
            </div>

            {/* Profile card */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3">
                {/* Avatar */}
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                    style={{
                        background: `linear-gradient(135deg, rgba(${rgb},0.5), rgba(${rgb},0.2))`,
                        border: `2px solid rgba(${rgb},0.4)`,
                        boxShadow: `0 0 24px rgba(${rgb},0.3)`,
                    }}
                >
                    AK
                </div>

                <div className="text-center">
                    <div className="text-white font-bold text-[14px]">Alex Kumar</div>
                    <div className="text-white/40 text-[10px]">Senior Full Stack Engineer · Mumbai</div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                    {['React', 'Node.js', 'Python', 'AWS'].map((sk) => {
                        return (
                            <span
                                key={sk}
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    background: `rgba(${rgb},0.12)`,
                                    color: accent,
                                    border: `1px solid rgba(${rgb},0.25)`,
                                }}
                            >
                                {sk}
                            </span>
                        );
                    })}
                </div>

                {/* Match score */}
                <div
                    className="w-full rounded-2xl p-3"
                    style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.2)` }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-white/40">AI Match Score</span>
                        <span className="text-[18px] font-bold" style={{ color: accent }}>
                            94%
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                            className="h-full rounded-full"
                            style={{ width: '94%', background: `linear-gradient(90deg, ${accent}88, ${accent})` }}
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 w-full">
                    <div
                        className="flex-1 h-10 rounded-2xl flex items-center justify-center text-[12px] font-semibold cursor-default"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
                    >
                        ✕ Pass
                    </div>
                    <div
                        className="flex-1 h-10 rounded-2xl flex items-center justify-center text-[12px] font-semibold cursor-default text-white"
                        style={{ background: accent, boxShadow: `0 4px 16px rgba(${rgb},0.4)` }}
                    >
                        ✓ Match
                    </div>
                </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-3 pt-2">
                <div className="w-24 h-1 rounded-full bg-white/20" />
            </div>
        </div>
    );
};

const NexoraMockup: React.FC<{ accent: string; rgb: string }> = ({ accent, rgb }) => {
    const BAR_HEIGHTS = [35, 50, 42, 68, 80, 72, 90];
    return (
        <div className="w-full h-full flex" style={{ background: '#f8fafc' }}>
            {/* Sidebar */}
            <div
                className="w-[52px] flex-shrink-0 flex flex-col items-center py-4 gap-4"
                style={{ background: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px]"
                    style={{ background: accent }}
                >
                    N
                </div>
                {['📊', '👥', '📈', '⚙'].map((ic, i) => {
                    return (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm cursor-default"
                            style={{
                                background: i === 0 ? `rgba(${rgb},0.2)` : 'rgba(255,255,255,0.04)',
                                border: i === 0 ? `1px solid rgba(${rgb},0.3)` : '1px solid transparent',
                            }}
                        >
                            {ic}
                        </div>
                    );
                })}
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col p-4 gap-3 min-w-0">
                {/* KPIs */}
                <div className="flex gap-2">
                    {[
                        { label: 'Revenue', val: '$2.4M', delta: '+12%' },
                        { label: 'Users', val: '14.2K', delta: '+8%' },
                        { label: 'Churn', val: '2.1%', delta: '−3%' },
                    ].map((kpi) => {
                        return (
                            <div
                                key={kpi.label}
                                className="flex-1 rounded-xl p-2.5"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}
                            >
                                <div className="text-[8px] text-[#0F172A]/40 mb-1">{kpi.label}</div>
                                <div className="text-[13px] font-bold text-[#0F172A]">{kpi.val}</div>
                                <div
                                    className="text-[9px] font-semibold"
                                    style={{ color: kpi.delta.startsWith('−') ? '#dc2626' : '#16a34a' }}
                                >
                                    {kpi.delta}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chart */}
                <div
                    className="rounded-xl p-3 flex-1 flex flex-col"
                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold text-[#0F172A]">Revenue · Q4 2024</span>
                        <span className="text-[9px]" style={{ color: accent }}>
                            ↑ 12% vs last quarter
                        </span>
                    </div>
                    <div className="flex items-end gap-1.5 flex-1 pb-1">
                        {BAR_HEIGHTS.map((h, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex-1 rounded-t-sm"
                                    style={{
                                        height: `${h}%`,
                                        background: i === BAR_HEIGHTS.length - 1 ? accent : `rgba(${rgb},0.3)`,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Device frames ────────────────────────────────────────────────────── */
const BrowserFrame: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div
            className="rounded-2xl overflow-hidden w-full"
            style={{
                boxShadow: `0 32px 80px rgba(${project.rgb},0.12), 0 0 0 1px rgba(0,0,0,0.07)`,
            }}
        >
            {/* Chrome */}
            <div
                className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
                style={{ background: '#ECEFF4', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
            >
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <div
                    className="flex-1 mx-2 rounded-md px-3 py-1 text-[10px] font-mono"
                    style={{ background: 'white', color: '#6B7280', border: '1px solid rgba(0,0,0,0.07)' }}
                >
                    🔒 {project.url}
                </div>
            </div>
            {/* Mockup */}
            <div style={{ height: 290, overflow: 'hidden' }}>
                {project.id === 'speedradio' && <SpeedRadioMockup accent={project.accent} />}
                {project.id === 'interview' && <InterviewProMockup accent={project.accent} />}
                {project.id === 'workflow' && <WorkflowMockup accent={project.accent} />}
                {project.id === 'nexora' && <NexoraMockup accent={project.accent} rgb={project.rgb} />}
            </div>
        </div>
    );
};

const PhoneFrame: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="relative flex-shrink-0" style={{ width: 220, height: 440 }}>
            {/* Phone outline */}
            <div
                className="absolute inset-0 rounded-[36px]"
                style={{
                    background: '#1a1a1a',
                    boxShadow: `0 32px 80px rgba(${project.rgb},0.16), 0 0 0 6px #2a2a2a, 0 0 0 7px #1a1a1a`,
                }}
            />
            {/* Screen */}
            <div className="absolute overflow-hidden rounded-[30px]" style={{ inset: 5 }}>
                {project.id === 'talent' && <TalentMatchMockup accent={project.accent} rgb={project.rgb} />}
            </div>
            {/* Notch */}
            <div
                className="absolute rounded-b-xl"
                style={{
                    top: 5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 60,
                    height: 18,
                    background: '#1a1a1a',
                    zIndex: 10,
                }}
            />
        </div>
    );
};

/* ── Desktop: project row (left list) ─────────────────────────────────── */
const ProjectRow: React.FC<{
    project: Project;
    active: boolean;
    paused: boolean;
    onClick: () => void;
}> = ({ project, active, paused, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 cursor-pointer"
            style={{
                background: active ? `rgba(${project.rgb},0.07)` : 'transparent',
                border: `1px solid ${active ? `rgba(${project.rgb},0.2)` : 'transparent'}`,
            }}
            aria-pressed={active}
        >
            {/* Accent bar */}
            <div
                className="w-0.5 self-stretch rounded-full flex-shrink-0 transition-all duration-300"
                style={{
                    background: active ? project.accent : 'rgba(15,23,42,0.1)',
                    minHeight: 44,
                }}
            />

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#0F172A]/25">{project.num}</span>
                    <span
                        className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `rgba(${project.rgb},0.1)`, color: project.accent }}
                    >
                        {project.status}
                    </span>
                </div>
                <div
                    className="font-bold text-[14px] tracking-[-0.02em] transition-colors duration-200 truncate"
                    style={{ color: active ? project.accent : '#0F172A' }}
                >
                    {project.title}
                </div>
                <div className="text-[11px] text-[#0F172A]/40 truncate mt-0.5">{project.category}</div>

                {/* Auto-progress bar */}
                {active && (
                    <div
                        className="h-0.5 rounded-full mt-2.5 overflow-hidden"
                        style={{ background: 'rgba(15,23,42,0.08)' }}
                    >
                        <div
                            key={`${project.id}-${paused}`}
                            className="h-full rounded-full"
                            style={{
                                background: project.accent,
                                width: paused ? '100%' : '0%',
                                transition: paused ? 'none' : 'width 4.5s linear',
                                transitionDelay: paused ? '0s' : '50ms',
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Arrow indicator */}
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                    background: active ? `rgba(${project.rgb},0.12)` : 'rgba(15,23,42,0.04)',
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateX(0)' : 'translateX(-8px)',
                }}
                aria-hidden="true"
            >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                        d="M2 5.5h7M5.5 2l3.5 3.5L5.5 9"
                        stroke={project.accent}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </button>
    );
};

/* ── Desktop: right showcase panel ───────────────────────────────────── */
const ProjectShowcase: React.FC<{ project: Project }> = ({ project }) => {
    const [shown, setShown] = useState(project);
    const [vis, setVis] = useState(true);

    useEffect(() => {
        if (shown.id === project.id) return;
        const t1 = setTimeout(() => {
            setVis(false);
        }, 0);
        const t2 = setTimeout(() => {
            setShown(project);
            setVis(true);
        }, 220);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [project.id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            className="flex flex-col gap-6 transition-all duration-300 ease-out"
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(10px)' }}
        >
            {/* Device frame */}
            {shown.frame === 'web' ? (
                <BrowserFrame project={shown} />
            ) : (
                <div className="flex justify-center py-4">
                    <PhoneFrame project={shown} />
                </div>
            )}

            {/* Project details */}
            <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-10">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#0F172A] tracking-[-0.03em]">{shown.title}</h3>
                        <span
                            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ background: `rgba(${shown.rgb},0.09)`, color: shown.accent }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    background: statusDotColor(shown.status),
                                    animation: shown.status === 'Live' ? 'nh-pulse 2s ease infinite' : 'none',
                                }}
                            />
                            {shown.status}
                        </span>
                    </div>
                    <p className="text-[#0F172A]/50 text-[13px] leading-relaxed">{shown.desc}</p>
                </div>

                <div className="flex flex-col gap-3 flex-shrink-0 items-start">
                    <div className="flex flex-wrap gap-1.5">
                        {shown.stack.map((s) => {
                            return (
                                <span
                                    key={s}
                                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                                    style={{
                                        background: `rgba(${shown.rgb},0.07)`,
                                        color: shown.accent,
                                        border: `1px solid rgba(${shown.rgb},0.15)`,
                                    }}
                                >
                                    {s}
                                </span>
                            );
                        })}
                    </div>
                    <a
                        href="#"
                        onClick={(e) => {
                            return e.preventDefault();
                        }}
                        className="inline-flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-70"
                        style={{ color: shown.accent }}
                        aria-label={`View ${shown.title} case study`}
                    >
                        <span className="text-[11px] font-semibold">View case study</span>
                        <span className="text-sm" aria-hidden="true">
                            →
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

/* ── Mobile: stacked project card ─────────────────────────────────────── */
const MobileProjectCard: React.FC<{ project: Project; inView: boolean; delay: number }> = ({
    project,
    inView,
    delay,
}) => {
    return (
        <div
            className={`rounded-3xl overflow-hidden transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
            style={{
                background: 'white',
                border: `1px solid rgba(${project.rgb},0.12)`,
                boxShadow: `0 4px 24px rgba(${project.rgb},0.08)`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${delay}s`,
            }}
        >
            {/* Mockup preview */}
            <div className="relative overflow-hidden" style={{ height: 220, background: '#f1f5f9' }}>
                {project.frame === 'web' ? (
                    <div>
                        {/* Mini browser chrome */}
                        <div
                            className="flex items-center gap-1.5 px-3 py-2"
                            style={{ background: '#ECEFF4', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                        >
                            <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                            <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                            <div
                                className="flex-1 mx-2 rounded px-2 py-0.5 text-[9px] font-mono text-[#9CA3AF]"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}
                            >
                                {project.url}
                            </div>
                        </div>
                        {/* Scaled down mockup */}
                        <div className="overflow-hidden" style={{ height: 185, transformOrigin: 'top left' }}>
                            <div
                                style={{
                                    transform: 'scale(0.75)',
                                    transformOrigin: 'top left',
                                    width: '133%',
                                    height: '133%',
                                }}
                            >
                                {project.id === 'speedradio' && <SpeedRadioMockup accent={project.accent} />}
                                {project.id === 'interview' && <InterviewProMockup accent={project.accent} />}
                                {project.id === 'workflow' && <WorkflowMockup accent={project.accent} />}
                                {project.id === 'nexora' && <NexoraMockup accent={project.accent} rgb={project.rgb} />}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="relative" style={{ width: 130, height: 200 }}>
                            <div
                                className="absolute inset-0 rounded-[22px]"
                                style={{ background: '#1a1a1a', boxShadow: '0 0 0 4px #2a2a2a, 0 0 0 5px #1a1a1a' }}
                            />
                            <div className="absolute overflow-hidden rounded-[18px]" style={{ inset: 4 }}>
                                {project.id === 'talent' && (
                                    <TalentMatchMockup accent={project.accent} rgb={project.rgb} />
                                )}
                            </div>
                            <div
                                className="absolute rounded-b-lg"
                                style={{
                                    top: 4,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 36,
                                    height: 10,
                                    background: '#1a1a1a',
                                    zIndex: 10,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Gradient fade at bottom */}
                <div
                    className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, white, transparent)' }}
                />
            </div>

            {/* Details */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="font-bold text-[16px] text-[#0F172A] tracking-[-0.025em]">{project.title}</div>
                        <div className="text-[11px] text-[#0F172A]/45 mt-0.5">{project.category}</div>
                    </div>
                    <span
                        className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                        style={{ background: `rgba(${project.rgb},0.09)`, color: project.accent }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: statusDotColor(project.status),
                                animation: project.status === 'Live' ? 'nh-pulse 2s ease infinite' : 'none',
                            }}
                        />
                        {project.status}
                    </span>
                </div>

                <p className="text-[#0F172A]/48 text-[12.5px] leading-relaxed mb-4">{project.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.stack.map((s) => {
                        return (
                            <span
                                key={s}
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    background: `rgba(${project.rgb},0.07)`,
                                    color: project.accent,
                                    border: `1px solid rgba(${project.rgb},0.15)`,
                                }}
                            >
                                {s}
                            </span>
                        );
                    })}
                </div>

                <a
                    href="#"
                    onClick={(e) => {
                        return e.preventDefault();
                    }}
                    className="inline-flex items-center gap-1.5 group transition-opacity duration-200 hover:opacity-70"
                    style={{ color: project.accent }}
                    aria-label={`View ${project.title} case study`}
                >
                    <span className="text-[11px] font-semibold">View case study</span>
                    <span
                        className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                    >
                        →
                    </span>
                </a>
            </div>
        </div>
    );
};

/* ── Section ────────────────────────────────────────────────────────────── */
export const Chapter3Products: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [active, setActive] = useState(0);
    const [filter, setFilter] = useState<PFilter>('all');
    const [paused, setPaused] = useState(false);

    const filtered = PROJECTS.filter((p) => {
        return p.filters.includes(filter);
    });

    const current = filtered[active] ?? filtered[0];

    /* Reset active when filter changes (async to satisfy set-state-in-effect rule) */
    useEffect(() => {
        const t = setTimeout(() => {
            setActive(0);
        }, 0);
        return () => {
            clearTimeout(t);
        };
    }, [filter]);

    /* Auto-rotate */
    useEffect(() => {
        if (paused) return;
        const interval = setInterval(() => {
            setActive((prev) => {
                return (prev + 1) % filtered.length;
            });
        }, 4500);
        return () => {
            clearInterval(interval);
        };
    }, [paused, filtered.length]);

    /* IntersectionObserver */
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
        <section ref={sectionRef} className="relative bg-white overflow-hidden py-24 md:py-40">
            {/* Ambient glow matching active project */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
                style={{
                    background: `radial-gradient(ellipse at 80% 10%, rgba(${current?.rgb ?? '59,130,246'},0.07) 0%, transparent 65%)`,
                    filter: 'blur(40px)',
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 0% 100%, rgba(15,23,42,0.03) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* ── Header ── */}
                <div
                    className={`transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 mb-5 text-[10px] font-bold tracking-[0.28em] uppercase text-blue-600/50">
                        <span className="block w-5 h-px bg-blue-500/40" />
                        03 — Portfolio
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <h2 className="text-[#0F172A] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.9]">
                            Built to move{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                business.
                            </span>
                        </h2>

                        {/* Filter tabs */}
                        <div className="flex flex-wrap gap-2 md:mb-2">
                            {FILTER_TABS.map((tab) => {
                                const isActive = filter === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => {
                                            return setFilter(tab.key);
                                        }}
                                        className="px-4 py-2 rounded-full text-[11px] font-semibold transition-all duration-250 cursor-pointer"
                                        style={{
                                            background: isActive ? '#0F172A' : 'rgba(15,23,42,0.06)',
                                            color: isActive ? 'white' : 'rgba(15,23,42,0.55)',
                                            border: `1px solid ${isActive ? '#0F172A' : 'transparent'}`,
                                        }}
                                        aria-pressed={isActive}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <p className="mt-4 text-[#0F172A]/45 text-[15px] max-w-lg leading-relaxed">
                        Real products, real clients, real outcomes. Here&apos;s what five years of building looks like.
                    </p>
                </div>

                {/* ── Desktop spotlight ── */}
                <div
                    className={`hidden md:flex gap-10 mt-14 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '0.15s' }}
                    onMouseEnter={() => {
                        return setPaused(true);
                    }}
                    onMouseLeave={() => {
                        return setPaused(false);
                    }}
                >
                    {/* Left: project list */}
                    <div className="w-[280px] flex-shrink-0 flex flex-col gap-1">
                        {filtered.map((project, i) => {
                            return (
                                <ProjectRow
                                    key={project.id}
                                    project={project}
                                    active={i === active}
                                    paused={paused}
                                    onClick={() => {
                                        return setActive(i);
                                    }}
                                />
                            );
                        })}

                        {/* Dot indicators */}
                        <div className="flex gap-2 px-4 mt-4">
                            {filtered.map((_, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="h-1 rounded-full transition-all duration-400 cursor-pointer"
                                        style={{
                                            width: i === active ? 24 : 6,
                                            background:
                                                i === active
                                                    ? (filtered[active]?.accent ?? '#2563eb')
                                                    : 'rgba(15,23,42,0.15)',
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Go to project ${i + 1}`}
                                        onClick={() => {
                                            return setActive(i);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') setActive(i);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: featured showcase */}
                    <div className="flex-1 min-w-0">{current && <ProjectShowcase project={current} />}</div>
                </div>

                {/* ── Mobile stacked cards ── */}
                <div className="md:hidden mt-10 flex flex-col gap-5">
                    {filtered.map((project, i) => {
                        return (
                            <MobileProjectCard
                                key={project.id}
                                project={project}
                                inView={inView}
                                delay={0.1 + i * 0.08}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
