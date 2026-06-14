'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import logoSrc from '@/icons/logo_navhigh.png';

const ECOSYSTEM_NODES = [
    { label: 'AI Agents', color: '#3b82f6', rgb: '59,130,246' },
    { label: 'Enterprise Systems', color: '#22d3ee', rgb: '34,211,238' },
    { label: 'Talent Intelligence', color: '#a78bfa', rgb: '167,139,250' },
    { label: 'Automation Workflows', color: '#f97316', rgb: '249,115,22' },
    { label: 'Data Platforms', color: '#22c55e', rgb: '34,197,94' },
];

interface EcosystemCanvasProps {
    cursorRef: React.MutableRefObject<{ x: number; y: number }>;
    className?: string;
}

export const EcosystemCanvas: React.FC<EcosystemCanvasProps> = ({ cursorRef, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoOverlayRef = useRef<HTMLDivElement>(null);
    const satelliteEls = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let raf: number;
        let startTime = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.offsetWidth : 640;
            canvas.height = parent ? parent.offsetHeight : 720;
        };

        const draw = (t: number) => {
            if (!startTime) startTime = t;
            const elapsed = prefersReduced ? 0 : (t - startTime) / 1000;

            const W = canvas.width;
            const H = canvas.height;

            if (W < 10 || H < 10) {
                if (!prefersReduced) raf = requestAnimationFrame(draw);
                return;
            }

            ctx.clearRect(0, 0, W, H);

            /* ── Mouse parallax ─────────────────────────────── */
            const { x: mx, y: my } = cursorRef.current;
            const hasM = mx !== -999 && !prefersReduced;
            const parallaxX = hasM ? (mx / window.innerWidth - 0.75) * 36 : 0;
            const parallaxY = hasM ? (my / window.innerHeight - 0.5) * 24 : 0;
            const cx = W * 0.5 + parallaxX;
            const cy = H * 0.5 + parallaxY;

            const overlay = logoOverlayRef.current;
            if (overlay) {
                overlay.style.transform = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))`;
            }

            const orbitR = Math.min(W, H) * 0.3;

            /* ── Outer decorative rings (3 tiers) ──────────── */
            [1.55, 1.75, 1.95].forEach((mul, idx) => {
                ctx.beginPath();
                ctx.arc(cx, cy, orbitR * mul, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(59,130,246,${[0.045, 0.028, 0.014][idx]})`;
                ctx.setLineDash([4, 12]);
                ctx.lineWidth = 0.8;
                ctx.stroke();
                ctx.setLineDash([]);
            });

            /* ── Main orbit ring ────────────────────────────── */
            ctx.beginPath();
            ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(59,130,246,0.12)';
            ctx.setLineDash([6, 10]);
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.setLineDash([]);

            /* ── Compute satellite positions ─────────────────── */
            const satellites = ECOSYSTEM_NODES.map((node, i) => {
                const baseAngle = (i / ECOSYSTEM_NODES.length) * Math.PI * 2 - Math.PI / 2;
                const angle = baseAngle + elapsed * 0.1;
                const wobble = Math.sin(elapsed * 0.45 + i * 1.4) * 7;
                const satX = cx + Math.cos(angle) * (orbitR + wobble);
                const satY = cy + Math.sin(angle) * (orbitR + wobble);
                const ddx = satX - cx;
                const ddy = satY - cy;
                const dlen = Math.sqrt(ddx * ddx + ddy * ddy);
                const lx = satX + (ddx / dlen) * 38;
                const ly = satY + (ddy / dlen) * 38;
                return { ...node, satX, satY, lx, ly };
            });

            /* ── Push satellite label positions to DOM ──────── */
            satellites.forEach((sat, i) => {
                const el = satelliteEls.current[i];
                if (el) {
                    el.style.left = `${sat.lx}px`;
                    el.style.top = `${sat.ly}px`;
                }
            });

            /* ── Lines: center → satellites ─────────────────── */
            satellites.forEach((sat, i) => {
                const pulse = 0.12 + 0.08 * Math.sin(elapsed * 0.8 + i);
                const grad = ctx.createLinearGradient(cx, cy, sat.satX, sat.satY);
                grad.addColorStop(0, `rgba(${sat.rgb},${pulse + 0.42})`);
                grad.addColorStop(0.55, `rgba(${sat.rgb},${pulse + 0.18})`);
                grad.addColorStop(1, `rgba(${sat.rgb},${pulse * 0.12})`);

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(sat.satX, sat.satY);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.4;
                ctx.stroke();

                /* Traveling energy dot */
                if (!prefersReduced) {
                    const progress = (((elapsed * 0.45 + i * 0.22) % 1) + 1) % 1;
                    const tdx = sat.satX - cx;
                    const tdy = sat.satY - cy;
                    const tx = cx + tdx * progress;
                    const ty = cy + tdy * progress;

                    ctx.beginPath();
                    ctx.arc(tx, ty, 7, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${sat.rgb},0.2)`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${sat.rgb},1)`;
                    ctx.fill();
                }
            });

            /* ── Skip-connections between satellites ────────── */
            for (let i = 0; i < satellites.length; i++) {
                const next = satellites[(i + 2) % satellites.length];
                ctx.beginPath();
                ctx.moveTo(satellites[i].satX, satellites[i].satY);
                ctx.lineTo(next.satX, next.satY);
                ctx.strokeStyle = 'rgba(15,23,42,0.06)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            /* ── Center deep glow (blue → purple gradient) ──── */
            const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
            cGrad.addColorStop(0, 'rgba(37,99,235,0.40)');
            cGrad.addColorStop(0.28, 'rgba(59,130,246,0.20)');
            cGrad.addColorStop(0.55, 'rgba(99,155,255,0.08)');
            cGrad.addColorStop(0.75, 'rgba(124,58,237,0.04)');
            cGrad.addColorStop(1, 'rgba(59,130,246,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, 160, 0, Math.PI * 2);
            ctx.fillStyle = cGrad;
            ctx.fill();

            /* ── Pulsing rings around center (4 tiers) ──────── */
            const p = prefersReduced ? 0.5 : 0.5 + 0.5 * Math.sin(elapsed * 1.6);
            [56, 70, 88, 108].forEach((r, idx) => {
                const baseAlphas = [0.5, 0.24, 0.11, 0.045];
                const alpha = baseAlphas[idx] + (idx === 1 ? p * 0.16 : 0);
                ctx.beginPath();
                ctx.arc(cx, cy, r + (idx === 1 ? p * 4 : 0), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
                const ringWidths = [1.4, 2.0, 0.9, 0.9];
                ctx.lineWidth = ringWidths[idx] ?? 0.9;
                ctx.stroke();
            });

            /* ── Satellite nodes ─────────────────────────────── */
            satellites.forEach((sat) => {
                /* Ambient halo */
                const sGrad = ctx.createRadialGradient(sat.satX, sat.satY, 0, sat.satX, sat.satY, 54);
                sGrad.addColorStop(0, `rgba(${sat.rgb},0.30)`);
                sGrad.addColorStop(0.5, `rgba(${sat.rgb},0.10)`);
                sGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.arc(sat.satX, sat.satY, 54, 0, Math.PI * 2);
                ctx.fillStyle = sGrad;
                ctx.fill();

                /* Outer ring */
                ctx.beginPath();
                ctx.arc(sat.satX, sat.satY, 12, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${sat.rgb},0.14)`;
                ctx.fill();
                ctx.strokeStyle = `rgba(${sat.rgb},0.62)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                /* Inner radial fill */
                const innerGrad = ctx.createRadialGradient(sat.satX, sat.satY, 0, sat.satX, sat.satY, 7);
                innerGrad.addColorStop(0, `rgba(${sat.rgb},0.75)`);
                innerGrad.addColorStop(1, `rgba(${sat.rgb},0.18)`);
                ctx.beginPath();
                ctx.arc(sat.satX, sat.satY, 7, 0, Math.PI * 2);
                ctx.fillStyle = innerGrad;
                ctx.fill();

                /* Core dot */
                ctx.beginPath();
                ctx.arc(sat.satX, sat.satY, 5, 0, Math.PI * 2);
                ctx.fillStyle = sat.color;
                ctx.fill();

                /* Specular highlight */
                ctx.beginPath();
                ctx.arc(sat.satX - 1.5, sat.satY - 1.5, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.65)';
                ctx.fill();
            });

            /* ── Ambient drift particles ─────────────────────── */
            if (!prefersReduced) {
                for (let i = 0; i < 24; i++) {
                    const seed = i * 137.508;
                    const px2 = ((Math.sin(seed) * 0.5 + 0.5) * W + elapsed * (4 + (i % 6) * 2.5)) % W;
                    const py2 = (Math.cos(seed * 1.61) * 0.5 + 0.5) * H;
                    const alpha = (0.06 + 0.04 * Math.sin(elapsed * 0.7 + i)) * 0.7;
                    ctx.beginPath();
                    ctx.arc(px2, py2, 0.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(59,130,246,${alpha})`;
                    ctx.fill();
                }
            }

            if (!prefersReduced) raf = requestAnimationFrame(draw);
        };

        resize();

        if (prefersReduced) {
            draw(performance.now());
        } else {
            raf = requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, [cursorRef]);

    return (
        <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* DOM label badges — positions updated via direct DOM mutation in RAF (zero re-renders) */}
            {ECOSYSTEM_NODES.map((node, i) => {
                return (
                    <div
                        key={node.label}
                        ref={(el) => {
                            satelliteEls.current[i] = el;
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            zIndex: 3,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                padding: '4px 9px 4px 7px',
                                borderRadius: 24,
                                background: `rgba(${node.rgb},0.09)`,
                                border: `1px solid rgba(${node.rgb},0.28)`,
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                boxShadow: `0 4px 14px rgba(${node.rgb},0.14), inset 0 1px 0 rgba(255,255,255,0.5)`,
                                whiteSpace: 'nowrap',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                color: node.color,
                            }}
                        >
                            <div
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    backgroundColor: node.color,
                                    boxShadow: `0 0 6px ${node.color}cc`,
                                    flexShrink: 0,
                                }}
                            />
                            {node.label}
                        </div>
                    </div>
                );
            })}

            {/* Center logo — parallax applied via logoOverlayRef */}
            <div
                ref={logoOverlayRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 96,
                    height: 96,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 2,
                    filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.85)) drop-shadow(0 0 36px rgba(37,99,235,0.45))',
                }}
            >
                <Image
                    src={logoSrc}
                    alt="NavHigh"
                    width={96}
                    height={96}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    priority
                />
            </div>
        </div>
    );
};
