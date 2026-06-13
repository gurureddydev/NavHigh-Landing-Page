'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    pulse: number;
}

interface NodeCanvasProps {
    className?: string;
    count?: number;
    connectionDist?: number;
    color?: string;
    speed?: number;
    mouseRepel?: boolean;
}

export const NodeCanvas: React.FC<NodeCanvasProps> = ({
    className = '',
    count = 65,
    connectionDist = 160,
    color = '59,130,246',
    speed = 0.35,
    mouseRepel = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf: number;
        let nodes: Node[] = [];

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.offsetWidth : window.innerWidth;
            canvas.height = parent ? parent.offsetHeight : window.innerHeight;
        };

        const init = () => {
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                r: Math.random() * 1.8 + 0.4,
                pulse: Math.random() * Math.PI * 2,
            }));
        };

        let lastT = 0;
        const draw = (t: number) => {
            const dt = Math.min(t - lastT, 50) / 16.67;
            lastT = t;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            nodes.forEach((n) => {
                n.x += n.vx * dt;
                n.y += n.vy * dt;
                n.pulse += 0.018 * dt;

                if (n.x < -10) n.x = canvas.width + 10;
                else if (n.x > canvas.width + 10) n.x = -10;
                if (n.y < -10) n.y = canvas.height + 10;
                else if (n.y > canvas.height + 10) n.y = -10;

                if (mouseRepel && mx !== -9999) {
                    const dx = n.x - mx;
                    const dy = n.y - my;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110 && d > 0) {
                        n.x += (dx / d) * 1.8 * dt;
                        n.y += (dy / d) * 1.8 * dt;
                    }
                }

                const alpha = 0.35 + 0.35 * Math.sin(n.pulse);
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(${color},${(1 - d / connectionDist) * 0.22})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            raf = requestAnimationFrame(draw);
        };

        resize();
        init();
        raf = requestAnimationFrame(draw);

        const onResize = () => {
            resize();
            init();
        };
        const onMouse = (e: MouseEvent) => {
            if (!mouseRepel) return;
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouse);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouse);
        };
    }, [count, connectionDist, color, speed, mouseRepel]);

    return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
