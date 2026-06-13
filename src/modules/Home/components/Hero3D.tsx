'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────
   NavHigh logo is two parallelograms in 256×256 SVG space.

   Mapped to normalised world coords (centre at 0,0, Y flipped):
     x_norm = (svgX - 128) / 128
     y_norm = -(svgY - 128) / 128

   Bottom quad:  P(s,t) = (1-s-t,  t-1) · scale
   Top quad:     P(s,t) = (1-s-t,  t  ) · scale
   Both for s,t ∈ [0,1]
───────────────────────────────────────────────────────────────── */

const LOGO_SCALE = 3.6;
const LOGO_COUNT = 14_000;
const AMBIENT_COUNT = 4_000;
const LERP = 0.028;
const REPEL_R = 1.9;
const REPEL_R2 = REPEL_R * REPEL_R;
const REPEL_F = 0.055;

function sampleLogo(count: number): Float32Array {
    const pos = new Float32Array(count * 3);
    const half = Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
        const s = Math.random();
        const t = Math.random();
        const x = (1 - s - t) * LOGO_SCALE;
        const y = (i < half ? t - 1 : t) * LOGO_SCALE;
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    }
    return pos;
}

function sampleSphere(count: number, rMin: number, rMax: number): Float32Array {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = rMin + Math.random() * (rMax - rMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi) * 0.4;
    }
    return pos;
}

const VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
uniform float uTime;
varying float vAlpha;
varying float vCore;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  float pulse = 1.0 + 0.1 * sin(uTime * 1.6 + aPhase);
  gl_PointSize = aSize * pulse * (380.0 / -mvPos.z);
  gl_Position  = projectionMatrix * mvPos;
  vAlpha = 0.55 + 0.28 * sin(uTime * 0.75 + aPhase);
  vCore  = 0.5  + 0.5  * sin(uTime * 0.45 + aPhase * 0.7);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
varying float vCore;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv);
  if (d > 0.5) discard;
  float ring = 1.0 - smoothstep(0.12, 0.5, d);
  float core = (1.0 - smoothstep(0.0,  0.18, d)) * vCore;
  vec3  col  = uColor + core * vec3(0.35, 0.48, 0.82);
  gl_FragColor = vec4(col, ring * vAlpha);
}
`;

interface Hero3DProps {
    cursorX: number;
    cursorY: number;
    className?: string;
}

export const Hero3D: React.FC<Hero3DProps> = ({ cursorX, cursorY, className = '' }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef({ x: -999, y: -999 });

    useEffect(() => {
        cursorRef.current = { x: cursorX, y: cursorY };
    }, [cursorX, cursorY]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        /* ── renderer ───────────────────────────────────────────── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(mount.offsetWidth, mount.offsetHeight);
        mount.appendChild(renderer.domElement);

        /* ── scene + camera ─────────────────────────────────────── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.offsetWidth / mount.offsetHeight, 0.1, 200);
        camera.position.set(0, 0.6, 8.5);
        camera.lookAt(0, 0, 0);

        /* ── logo particles ─────────────────────────────────────── */
        const targetPos = sampleLogo(LOGO_COUNT);
        const initialPos = sampleSphere(LOGO_COUNT, 5, 10);
        const currentPos = initialPos.slice() as Float32Array;

        const sizes = new Float32Array(LOGO_COUNT);
        const phases = new Float32Array(LOGO_COUNT);
        for (let i = 0; i < LOGO_COUNT; i++) {
            sizes[i] = Math.random() * 2.8 + 0.6;
            phases[i] = Math.random() * Math.PI * 2;
        }

        const logoGeo = new THREE.BufferGeometry();
        logoGeo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
        logoGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        logoGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

        const logoMat = new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0.22, 0.58, 1.0) } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const logoPoints = new THREE.Points(logoGeo, logoMat);
        scene.add(logoPoints);

        /* ── ambient star field ─────────────────────────────────── */
        const ambientPos = sampleSphere(AMBIENT_COUNT, 6, 18);
        const ambSizes = new Float32Array(AMBIENT_COUNT);
        const ambPhases = new Float32Array(AMBIENT_COUNT);
        for (let i = 0; i < AMBIENT_COUNT; i++) {
            ambSizes[i] = Math.random() * 1.2 + 0.3;
            ambPhases[i] = Math.random() * Math.PI * 2;
        }
        const ambGeo = new THREE.BufferGeometry();
        ambGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
        ambGeo.setAttribute('aSize', new THREE.BufferAttribute(ambSizes, 1));
        ambGeo.setAttribute('aPhase', new THREE.BufferAttribute(ambPhases, 1));

        const ambMat = new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0.15, 0.4, 0.75) } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const ambPoints = new THREE.Points(ambGeo, ambMat);
        scene.add(ambPoints);

        /* ── visible frustum size at z=0 ────────────────────────── */
        const getVisSize = () => {
            const W = mount.offsetWidth;
            const H = mount.offsetHeight;
            const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
            const visH = 2 * camera.position.z * Math.tan(halfFov);
            const visW = visH * (W / H);
            return { visW, visH, W, H };
        };

        /* ── animation ──────────────────────────────────────────── */
        const clock = new THREE.Clock();
        let raf: number;

        const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            logoMat.uniforms.uTime.value = t;
            ambMat.uniforms.uTime.value = t;

            const { visW, visH, W, H } = getVisSize();
            const { x: rawCX, y: rawCY } = cursorRef.current;
            const hasCursor = rawCX !== -999;
            const mx = hasCursor ? (rawCX / W - 0.5) * visW : 0;
            const my = hasCursor ? -(rawCY / H - 0.5) * visH : 0;

            const buf = logoGeo.attributes.position.array as Float32Array;

            for (let i = 0; i < LOGO_COUNT; i++) {
                const ix = i * 3,
                    iy = ix + 1,
                    iz = ix + 2;

                /* spring toward target */
                currentPos[ix] += (targetPos[ix] - currentPos[ix]) * LERP;
                currentPos[iy] += (targetPos[iy] - currentPos[iy]) * LERP;
                currentPos[iz] += (targetPos[iz] - currentPos[iz]) * LERP;

                /* mouse repulsion */
                if (hasCursor) {
                    const dx = currentPos[ix] - mx;
                    const dy = currentPos[iy] - my;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < REPEL_R2) {
                        const d = Math.sqrt(d2) + 0.001;
                        const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
                        currentPos[ix] += (dx / d) * f;
                        currentPos[iy] += (dy / d) * f;
                    }
                }

                buf[ix] = currentPos[ix];
                buf[iy] = currentPos[iy];
                buf[iz] = currentPos[iz];
            }

            logoGeo.attributes.position.needsUpdate = true;

            /* gentle oscillation */
            logoPoints.rotation.y = Math.sin(t * 0.11) * 0.13;
            logoPoints.rotation.x = Math.sin(t * 0.07) * 0.07;

            /* ambient drift */
            ambPoints.rotation.y = t * 0.014;
            ambPoints.rotation.z = t * 0.007;

            renderer.render(scene, camera);
        };

        animate();

        /* ── resize ─────────────────────────────────────────────── */
        const onResize = () => {
            const W = mount.offsetWidth;
            const H = mount.offsetHeight;
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        };
        window.addEventListener('resize', onResize);

        /* ── cleanup ────────────────────────────────────────────── */
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            logoGeo.dispose();
            logoMat.dispose();
            ambGeo.dispose();
            ambMat.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
