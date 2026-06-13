'use client';

import React, { useEffect, useRef } from 'react';

interface HNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    pulse: number;
}

interface HeroCanvasProps {
    cursorX: number;
    cursorY: number;
    className?: string;
}

const SPOT_R = 300;
const COUNT = 110;

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ cursorX, cursorY, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef({ x: -999, y: -999 });

    // Sync cursor prop → ref (no re-render needed in draw loop)
    useEffect(() => {
        cursorRef.current = { x: cursorX, y: cursorY };
    }, [cursorX, cursorY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf: number;
        let nodes: HNode[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            nodes = Array.from({ length: COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: Math.random() * 2 + 0.4,
                pulse: Math.random() * Math.PI * 2,
            }));
        };

        let lastT = 0;
        const draw = (t: number) => {
            const dt = Math.min(t - lastT, 50) / 16.67;
            lastT = t;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: cx, y: cy } = cursorRef.current;
            const hasSpot = cx !== -999;

            // Update node positions
            nodes.forEach((n) => {
                n.x += n.vx * dt;
                n.y += n.vy * dt;
                n.pulse += 0.016 * dt;
                if (n.x < -12) n.x = canvas.width + 12;
                else if (n.x > canvas.width + 12) n.x = -12;
                if (n.y < -12) n.y = canvas.height + 12;
                else if (n.y > canvas.height + 12) n.y = -12;
            });

            // Connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d >= 150) continue;

                    // Always-on base connection (very faint)
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 150) * 0.045})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();

                    // Spotlight-brightened connection
                    if (hasSpot) {
                        const di = Math.sqrt((nodes[i].x - cx) ** 2 + (nodes[i].y - cy) ** 2);
                        const dj = Math.sqrt((nodes[j].x - cx) ** 2 + (nodes[j].y - cy) ** 2);
                        const near = Math.min(di, dj);
                        if (near < SPOT_R) {
                            const tf = 1 - near / SPOT_R;
                            const soft = tf * tf;
                            ctx.beginPath();
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                            ctx.strokeStyle = `rgba(99,155,255,${soft * (1 - d / 150) * 0.55})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            }

            // Nodes
            nodes.forEach((n) => {
                const pAlpha = 0.07 + 0.04 * Math.sin(n.pulse);
                let alpha = pAlpha;
                let radius = n.r;

                if (hasSpot) {
                    const d = Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2);
                    if (d < SPOT_R) {
                        const tf = (1 - d / SPOT_R) ** 1.5;
                        alpha = Math.max(alpha, tf * (0.65 + 0.25 * Math.sin(n.pulse)));
                        radius = n.r * (1 + tf * 1.2);

                        // Glow ring at cursor center
                        if (d < SPOT_R * 0.25) {
                            ctx.beginPath();
                            ctx.arc(n.x, n.y, radius + 2, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(147,197,253,${tf * 0.2})`;
                            ctx.fill();
                        }
                    }
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59,130,246,${alpha})`;
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        };

        resize();
        raf = requestAnimationFrame(draw);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
