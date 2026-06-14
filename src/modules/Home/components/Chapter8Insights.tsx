'use client';

import React, { useEffect, useRef, useState } from 'react';

const ARTICLES = [
    {
        id: 'ai-enterprise',
        featured: true,
        category: 'AI Strategy',
        title: 'The Future of AI-Native Enterprise Systems',
        excerpt:
            'Why the companies that treat AI as infrastructure — not a feature — will define the next decade of enterprise software. The shift from AI experiments to AI foundations.',
        date: 'Jun 2026',
        read: '5 min read',
        accent: '#2563eb',
        accentRgb: '37,99,235',
        issue: 'Vol. 4 — Issue 12',
    },
    {
        id: 'talent-scale',
        featured: false,
        category: 'Talent Tech',
        title: 'Building Scalable Talent Platforms at Scale',
        excerpt:
            'From matching algorithms to recruiter co-pilots: the architectural patterns behind modern talent intelligence.',
        date: 'May 2026',
        read: '7 min read',
        accent: '#7c3aed',
        accentRgb: '124,58,237',
        issue: 'Vol. 4 — Issue 11',
    },
    {
        id: 'engineering-culture',
        featured: false,
        category: 'Culture',
        title: 'Why Engineering Culture Defines Product Success',
        excerpt:
            'The most expensive line in your tech budget is the culture you tolerate. How great teams ship better products.',
        date: 'Apr 2026',
        read: '4 min read',
        accent: '#0891b2',
        accentRgb: '8,145,178',
        issue: 'Vol. 4 — Issue 10',
    },
    {
        id: 'ai-workflows',
        featured: false,
        category: 'Architecture',
        title: 'The Architecture of Modern AI Workflows',
        excerpt:
            'LangGraph, multi-agent orchestration, and the patterns that separate toy demos from production systems.',
        date: 'Mar 2026',
        read: '8 min read',
        accent: '#ea580c',
        accentRgb: '234,88,12',
        issue: 'Vol. 4 — Issue 09',
    },
];

const FeaturedCard: React.FC<{ article: (typeof ARTICLES)[0]; inView: boolean }> = ({ article, inView }) => {
    const [hovered, setHovered] = useState(false);
    const [readWidth, setReadWidth] = useState(0);

    return (
        <article
            className={`group relative rounded-3xl overflow-hidden cursor-default col-span-1 md:col-span-7 transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
            }`}
            style={{
                transitionDelay: '0.08s',
                minHeight: 420,
                background: '#FFFFFF',
                border: `1px solid rgba(${article.accentRgb},${hovered ? 0.25 : 0.1})`,
                boxShadow: hovered
                    ? `0 24px 64px rgba(${article.accentRgb},0.1), 0 4px 24px rgba(15,23,42,0.06)`
                    : '0 4px 24px rgba(15,23,42,0.07)',
                transition: 'box-shadow 0.4s, border-color 0.4s',
            }}
            onMouseEnter={() => {
                setHovered(true);
                setReadWidth(100);
            }}
            onMouseLeave={() => {
                setHovered(false);
                setReadWidth(0);
            }}
        >
            {/* Layered background glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 10% 20%, rgba(${article.accentRgb},0.06) 0%, transparent 65%)`,
                    opacity: hovered ? 1 : 0.5,
                }}
            />

            {/* Scan line on hover */}
            <div
                className="absolute top-0 left-8 right-8 h-px pointer-events-none transition-opacity duration-400"
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(${article.accentRgb},0.6), transparent)`,
                    opacity: hovered ? 1 : 0,
                }}
            />

            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full" style={{ minHeight: 420 }}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-auto">
                    <div className="flex items-center gap-3">
                        <span
                            className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300"
                            style={{
                                background: `rgba(${article.accentRgb},${hovered ? 0.15 : 0.08})`,
                                color: article.accent,
                                border: `1px solid rgba(${article.accentRgb},0.2)`,
                            }}
                        >
                            {article.category}
                        </span>
                        <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#0F172A]/35"
                            style={{ background: 'rgba(15,23,42,0.04)', border: '1px solid rgba(15,23,42,0.07)' }}
                        >
                            Featured
                        </span>
                    </div>
                    <div className="text-[10px] text-[#0F172A]/25 text-right">
                        <div>{article.issue}</div>
                        <div className="mt-0.5">
                            {article.date} · {article.read}
                        </div>
                    </div>
                </div>

                {/* Large editorial number */}
                <div
                    className="text-[7rem] font-bold leading-none select-none my-4 transition-colors duration-500"
                    style={{ color: `rgba(${article.accentRgb},${hovered ? 0.1 : 0.05})` }}
                >
                    01
                </div>

                {/* Title */}
                <h3
                    className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] leading-tight mb-5 transition-colors duration-300"
                    style={{ color: hovered ? article.accent : '#0F172A' }}
                >
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[#0F172A]/50 leading-relaxed text-sm md:text-[15px] max-w-lg mb-8">
                    {article.excerpt}
                </p>

                {/* Read progress bar + CTA */}
                <div className="flex items-center justify-between mt-auto">
                    <div
                        className="flex items-center gap-3 text-sm font-medium transition-all duration-300"
                        style={{ color: article.accent, opacity: hovered ? 1 : 0.45 }}
                    >
                        Read article
                        <svg
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                        >
                            <path
                                d="M2 7h10M7 2l5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Reading progress bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-[#0F172A]/25 text-[10px]">Reading progress</span>
                        <div className="w-20 h-0.5 rounded-full bg-[#0F172A]/06 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${readWidth}%`,
                                    background: article.accent,
                                    boxShadow: readWidth > 0 ? `0 0 6px rgba(${article.accentRgb},0.5)` : 'none',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

interface SmallCardProps {
    article: (typeof ARTICLES)[0];
    index: number;
    inView: boolean;
}

const SmallArticleCard: React.FC<SmallCardProps> = ({ article, index, inView }) => {
    const [hovered, setHovered] = useState(false);
    const [readWidth, setReadWidth] = useState(0);

    return (
        <article
            className={`group relative rounded-2xl overflow-hidden cursor-default flex flex-col transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'
            }`}
            style={{
                transitionDelay: `${0.15 + index * 0.1}s`,
                background: '#FFFFFF',
                border: `1px solid rgba(${article.accentRgb},${hovered ? 0.2 : 0.08})`,
                transform: hovered ? 'translateY(-4px)' : undefined,
                boxShadow: hovered
                    ? `0 20px 50px rgba(${article.accentRgb},0.1), 0 4px 16px rgba(15,23,42,0.06)`
                    : '0 2px 12px rgba(15,23,42,0.05)',
                transition:
                    'box-shadow 0.4s, border-color 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 1s, filter 1s',
            }}
            onMouseEnter={() => {
                setHovered(true);
                setReadWidth(100);
            }}
            onMouseLeave={() => {
                setHovered(false);
                setReadWidth(0);
            }}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse 70% 50% at 20% 10%, rgba(${article.accentRgb},0.06) 0%, transparent 70%)`,
                    opacity: hovered ? 1 : 0,
                }}
            />
            {/* Top scan line */}
            <div
                className="absolute top-0 left-6 right-6 h-px pointer-events-none transition-opacity duration-400"
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(${article.accentRgb},0.5), transparent)`,
                    opacity: hovered ? 1 : 0,
                }}
            />

            <div className="relative z-10 p-7 flex flex-col flex-1">
                {/* Issue + meta */}
                <div className="flex items-center justify-between mb-5">
                    <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-300"
                        style={{
                            background: `rgba(${article.accentRgb},${hovered ? 0.14 : 0.08})`,
                            color: article.accent,
                        }}
                    >
                        {article.category}
                    </span>
                    <div className="text-[10px] text-[#0F172A]/25">
                        {article.date} · {article.read}
                    </div>
                </div>

                {/* Editorial number */}
                <div
                    className="text-[3.5rem] font-bold leading-none select-none mb-3 transition-colors duration-500"
                    style={{ color: `rgba(${article.accentRgb},${hovered ? 0.12 : 0.06})` }}
                >
                    {String(index + 2).padStart(2, '0')}
                </div>

                {/* Title */}
                <h3
                    className="font-bold text-lg leading-snug tracking-[-0.018em] mb-3 transition-colors duration-300"
                    style={{ color: hovered ? article.accent : '#0F172A' }}
                >
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[#0F172A]/45 text-sm leading-relaxed flex-1 mb-6">{article.excerpt}</p>

                {/* CTA + reading bar */}
                <div className="flex items-center justify-between mt-auto">
                    <div
                        className="flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:translate-x-1"
                        style={{ color: article.accent, opacity: hovered ? 1 : 0.4 }}
                    >
                        Read article
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path
                                d="M1.5 6.5h10M6.5 1.5l5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="w-14 h-0.5 rounded-full bg-[#0F172A]/06 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${readWidth}%`, background: article.accent }}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};

export const Chapter8Insights: React.FC = () => {
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
        return () => obs.disconnect();
    }, []);

    const featured = ARTICLES[0];
    const rest = ARTICLES.slice(1);

    return (
        <section ref={sectionRef} className="relative bg-[#FAFBFF] overflow-hidden py-32 md:py-44">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F5F7FA] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#EEF2FF] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div>
                        <span className="inline-flex items-center gap-2 text-blue-600/58 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                            <span className="block w-5 h-px bg-blue-500/40" />
                            Insights
                        </span>
                        <h2 className="text-[#0F172A] text-5xl md:text-6xl font-bold tracking-[-0.04em] leading-[0.92]">
                            Thinking out{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #ea580c, #f97316)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                loud.
                            </span>
                        </h2>
                        <p className="mt-4 text-[#0F172A]/40 text-sm max-w-xs leading-relaxed">
                            Dispatches from the edge of technology, product, and enterprise transformation.
                        </p>
                    </div>
                    <button className="flex-shrink-0 text-sm text-[#0F172A]/40 hover:text-[#0F172A] border border-[#0F172A]/10 hover:border-[#0F172A]/25 px-5 py-2.5 rounded-full transition-all duration-300 self-start sm:self-end">
                        View all articles →
                    </button>
                </div>

                {/* Row 1: featured (7 cols) + first regular (5 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    <div className="md:col-span-7">
                        <FeaturedCard article={featured} inView={inView} />
                    </div>
                    <div className="md:col-span-5 md:mt-8">
                        <SmallArticleCard article={rest[0]} index={0} inView={inView} />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <SmallArticleCard article={rest[1]} index={1} inView={inView} />
                    </div>
                    <div className="md:mt-6">
                        <SmallArticleCard article={rest[2]} index={2} inView={inView} />
                    </div>
                </div>
            </div>
        </section>
    );
};
