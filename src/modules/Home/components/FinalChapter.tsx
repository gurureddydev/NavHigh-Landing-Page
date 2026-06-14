'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logoSrc from '@/icons/logo_navhigh.png';

interface Particle {
    x: number;
    y: number;
    tx: number;
    ty: number;
    vx: number;
    vy: number;
    r: number;
    settled: boolean;
}

const LOGO_POINTS: Array<[number, number]> = [
    [0.5, 0.25],
    [0.35, 0.42],
    [0.5, 0.42],
    [0.65, 0.42],
    [0.5, 0.58],
    [0.35, 0.58],
    [0.5, 0.58],
    [0.65, 0.58],
    [0.42, 0.35],
    [0.58, 0.35],
    [0.42, 0.65],
    [0.58, 0.65],
    [0.38, 0.3],
    [0.62, 0.3],
    [0.38, 0.7],
    [0.62, 0.7],
    [0.5, 0.32],
    [0.5, 0.68],
    [0.44, 0.44],
    [0.56, 0.44],
    [0.44, 0.56],
    [0.56, 0.56],
];

export const FinalChapter: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const [inView, setInView] = useState(false);
    const [btnTranslate, setBtnTranslate] = useState({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setInView(true);
            },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Cursor-following glow
    useEffect(() => {
        const section = sectionRef.current;
        const glow = glowRef.current;
        if (!section || !glow) return;
        const onMove = (e: MouseEvent) => {
            const rect = section.getBoundingClientRect();
            cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            glow.style.transform = `translate(${cursorRef.current.x - 200}px, ${cursorRef.current.y - 200}px)`;
        };
        section.addEventListener('mousemove', onMove);
        return () => section.removeEventListener('mousemove', onMove);
    }, []);

    // Magnetic button
    const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setBtnTranslate({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 });
    };
    const handleBtnLeave = () => setBtnTranslate({ x: 0, y: 0 });

    // Convergence canvas
    useEffect(() => {
        if (!inView) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
            canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
        };

        const init = () => {
            particles = Array.from({ length: LOGO_POINTS.length * 3 + 40 }, (_, idx) => {
                const targetIdx = idx % LOGO_POINTS.length;
                const [tx, ty] = LOGO_POINTS[targetIdx];
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    tx: tx * canvas.width,
                    ty: ty * canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    r: Math.random() * 1.5 + 0.5,
                    settled: false,
                };
            });
        };

        let startTime = performance.now();
        const CONVERGE_AFTER = 1200;

        const draw = (t: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = t - startTime;
            const progress = Math.min((elapsed - CONVERGE_AFTER) / 2400, 1);

            particles.forEach((p) => {
                if (elapsed > CONVERGE_AFTER) {
                    const ease = 1 - Math.pow(1 - Math.max(progress, 0), 3);
                    p.x += (p.tx - p.x) * 0.04 * ease + p.vx * (1 - ease) * 0.3;
                    p.y += (p.ty - p.y) * 0.04 * ease + p.vy * (1 - ease) * 0.3;
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                }

                const alpha = 0.15 + progress * 0.4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + progress, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37,99,235,${alpha})`;
                ctx.fill();
            });

            // Draw connections near target points
            if (progress > 0.3) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        const maxDist = 60 + (1 - progress) * 100;
                        if (d < maxDist) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(37,99,235,${(1 - d / maxDist) * progress * 0.25})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            raf = requestAnimationFrame(draw);
        };

        resize();
        init();
        raf = requestAnimationFrame(draw);
        window.addEventListener('resize', () => {
            resize();
            init();
            startTime = performance.now();
        });

        return () => cancelAnimationFrame(raf);
    }, [inView]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-[#EEF2FF] overflow-hidden flex flex-col items-center justify-center"
        >
            {/* Convergence canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.6 }}
            />

            {/* Cursor glow */}
            <div
                ref={glowRef}
                className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
                    transition: 'transform 0.1s linear',
                    top: 0,
                    left: 0,
                }}
            />

            {/* Edge vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,#EEF2FF_100%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FAFBFF] to-transparent pointer-events-none" />

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Label */}
                <div
                    className={`transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-600/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-8">
                        <span className="block w-5 h-px bg-blue-500/40" />
                        Get Started
                        <span className="block w-5 h-px bg-blue-500/40" />
                    </span>
                </div>

                {/* Headline */}
                <h2
                    className={`text-[#0F172A] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.9] mb-6 transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-10 blur-sm'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    Ready to Build
                    <br />
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Something Exceptional?
                    </span>
                </h2>

                {/* Sub */}
                <p
                    className={`text-[#0F172A]/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: '0.4s' }}
                >
                    Let&apos;s talk about your product, your challenge, and what engineering-first looks like for your
                    business.
                </p>

                {/* CTA buttons */}
                <div
                    className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: '0.58s' }}
                >
                    {/* Primary magnetic CTA */}
                    <button
                        ref={btnRef}
                        onMouseMove={handleBtnMove}
                        onMouseLeave={handleBtnLeave}
                        className="relative px-10 py-4 rounded-full text-white font-semibold text-sm overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                            transform: `translate(${btnTranslate.x}px, ${btnTranslate.y}px)`,
                            transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
                            boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
                        }}
                    >
                        <span className="relative z-10">Start the Conversation</span>
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                        />
                    </button>

                    {/* Secondary */}
                    <button className="px-8 py-4 rounded-full text-[#0F172A]/55 font-medium text-sm border border-[#0F172A]/12 hover:border-[#0F172A]/25 hover:text-[#0F172A] transition-all duration-300">
                        View our work →
                    </button>
                </div>

                {/* Footer nav */}
                <div
                    className={`mt-24 pt-8 border-t border-[#0F172A]/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#0F172A]/25 text-xs transition-[opacity] duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: '0.8s' }}
                >
                    <div className="flex items-center gap-2">
                        <Image
                            src={logoSrc}
                            alt="NavHigh"
                            width={22}
                            height={22}
                            className="object-contain opacity-50"
                        />
                        <span className="text-[#0F172A]/40 font-medium">NavHigh Technologies</span>
                    </div>
                    <span>© {new Date().getFullYear()} NavHigh Technologies. All rights reserved.</span>
                    <div className="flex items-center gap-6">
                        {['Privacy', 'Terms', 'Contact'].map((item) => (
                            <button key={item} className="hover:text-[#0F172A]/60 transition-colors duration-200">
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
