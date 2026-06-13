'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealLayerProps {
    image: string;
    cursorX: number;
    cursorY: number;
}

const SPOTLIGHT_R = 260;

export const RevealLayer: React.FC<RevealLayerProps> = ({ image, cursorX, cursorY }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const revealDivRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const revealDiv = revealDivRef.current;
        if (!canvas || !revealDiv || dimensions.width === 0 || dimensions.height === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Build radial gradient at (cursorX, cursorY) from 0 to SPOTLIGHT_R
        const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
        gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
        ctx.fill();

        try {
            const dataUrl = canvas.toDataURL();
            revealDiv.style.maskImage = `url(${dataUrl})`;
            revealDiv.style.webkitMaskImage = `url(${dataUrl})`;
            revealDiv.style.maskSize = '100% 100%';
            revealDiv.style.webkitMaskSize = '100% 100%';
            revealDiv.style.maskRepeat = 'no-repeat';
            revealDiv.style.webkitMaskRepeat = 'no-repeat';
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to convert canvas to DataURL for maskImage', error);
        }
    }, [cursorX, cursorY, dimensions]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="absolute inset-0 pointer-events-none"
                style={{ display: 'none' }}
            />
            <div
                ref={revealDivRef}
                className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
                style={{ backgroundImage: `url(${image})` }}
            />
        </>
    );
};
