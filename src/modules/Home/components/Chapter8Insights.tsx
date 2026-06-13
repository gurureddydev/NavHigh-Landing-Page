'use client';

import React, { useEffect, useRef, useState } from 'react';

const ARTICLES = [
    {
        id: 'ai-enterprise',
        category: 'AI Strategy',
        title: 'The Future of AI-Native Enterprise Systems',
        excerpt:
            'Why the companies that treat AI as infrastructure — not feature — will define the next decade of enterprise software.',
        date: 'Jun 2026',
        read: '5 min read',
        accent: '#3b82f6',
        accentRgb: '59,130,246',
    },
    {
        id: 'talent-scale',
        category: 'Talent Tech',
        title: 'Building Scalable Talent Platforms at Scale',
        excerpt:
            'From matching algorithms to recruiter co-pilots: the architectural patterns behind modern talent intelligence systems.',
        date: 'May 2026',
        read: '7 min read',
        accent: '#8b5cf6',
        accentRgb: '139,92,246',
    },
    {
        id: 'engineering-culture',
        category: 'Culture',
        title: 'Why Engineering Culture Defines Product Success',
        excerpt:
            'The most expensive line in your tech budget is the culture you tolerate. How great teams ship better products.',
        date: 'Apr 2026',
        read: '4 min read',
        accent: '#22d3ee',
        accentRgb: '34,211,238',
    },
    {
        id: 'ai-workflows',
        category: 'Architecture',
        title: 'The Architecture of Modern AI Workflows',
        excerpt:
            'LangGraph, multi-agent orchestration, and the patterns that separate toy demos from production AI systems.',
        date: 'Mar 2026',
        read: '8 min read',
        accent: '#f97316',
        accentRgb: '249,115,22',
    },
];

interface ArticleCardProps {
    article: (typeof ARTICLES)[0];
    index: number;
    inView: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index, inView }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            className={`
                group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 cursor-default overflow-hidden
                transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'}
            `}
            style={{ transitionDelay: `${0.08 + index * 0.1}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 20% 0%, rgba(${article.accentRgb},0.07) 0%, transparent 70%)`,
                    opacity: hovered ? 1 : 0,
                }}
            />
            <div
                className="absolute inset-0 rounded-2xl border pointer-events-none transition-all duration-400"
                style={{ borderColor: hovered ? `rgba(${article.accentRgb},0.2)` : 'transparent' }}
            />

            <div className="relative z-10">
                {/* Category + meta */}
                <div className="flex items-center justify-between mb-5">
                    <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                        style={{
                            background: `rgba(${article.accentRgb},${hovered ? 0.18 : 0.1})`,
                            color: article.accent,
                        }}
                    >
                        {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-white/20">
                        <span>{article.date}</span>
                        <span>·</span>
                        <span>{article.read}</span>
                    </div>
                </div>

                {/* Title */}
                <h3
                    className="font-bold text-lg leading-snug tracking-[-0.015em] mb-3 transition-colors duration-300"
                    style={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.82)' }}
                >
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-white/35 text-sm leading-relaxed mb-6">{article.excerpt}</p>

                {/* Read more */}
                <div
                    className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
                    style={{
                        color: article.accent,
                        opacity: hovered ? 1 : 0.45,
                        transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
                    }}
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
            {
                threshold: 0.06,
            }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#030308] overflow-hidden py-32 md:py-40">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#040412] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div>
                        <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                            <span className="block w-5 h-px bg-blue-400/40" />
                            Insights
                        </span>
                        <h2 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.04em] leading-[0.92]">
                            Thinking out{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                loud.
                            </span>
                        </h2>
                    </div>
                    <button className="flex-shrink-0 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-5 py-2.5 rounded-full transition-all duration-300 self-start sm:self-end">
                        View all articles →
                    </button>
                </div>

                {/* Grid: 2 cols on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ARTICLES.map((a, i) => (
                        <ArticleCard key={a.id} article={a} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};
