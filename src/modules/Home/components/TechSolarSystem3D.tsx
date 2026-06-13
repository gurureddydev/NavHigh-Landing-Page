'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─── planet / moon configuration ───────────────────────────────── */
const PLANETS = [
    {
        id: 'frontend',
        label: 'Frontend',
        color: '#3b82f6',
        emissive: 0x3b82f6,
        orbitR: 4.2,
        speed: 0.28,
        tiltDeg: 14,
        size: 0.52,
        glowColor: 0x60a5fa,
        moons: [
            { label: 'React', color: '#61dafb', emissive: 0x61dafb },
            { label: 'Next.js', color: '#e2e8f0', emissive: 0xffffff },
            { label: 'TypeScript', color: '#3178c6', emissive: 0x3178c6 },
            { label: 'Tailwind', color: '#38bdf8', emissive: 0x38bdf8 },
        ],
    },
    {
        id: 'backend',
        label: 'Backend',
        color: '#22d3ee',
        emissive: 0x22d3ee,
        orbitR: 6.0,
        speed: 0.2,
        tiltDeg: -20,
        size: 0.52,
        glowColor: 0x67e8f9,
        moons: [
            { label: 'Node.js', color: '#68a063', emissive: 0x68a063 },
            { label: 'Java', color: '#f89820', emissive: 0xf89820 },
            { label: 'Python', color: '#ffd43b', emissive: 0xffd43b },
            { label: 'PostgreSQL', color: '#336791', emissive: 0x336791 },
        ],
    },
    {
        id: 'ai',
        label: 'AI & ML',
        color: '#a78bfa',
        emissive: 0xa78bfa,
        orbitR: 7.9,
        speed: 0.14,
        tiltDeg: 28,
        size: 0.62,
        glowColor: 0xc4b5fd,
        moons: [
            { label: 'OpenAI', color: '#10a37f', emissive: 0x10a37f },
            { label: 'LangGraph', color: '#ff6b6b', emissive: 0xff6b6b },
            { label: 'LangChain', color: '#c3e88d', emissive: 0xc3e88d },
            { label: 'Vector DBs', color: '#f77f00', emissive: 0xf77f00 },
        ],
    },
    {
        id: 'infra',
        label: 'Infrastructure',
        color: '#f97316',
        emissive: 0xf97316,
        orbitR: 9.8,
        speed: 0.1,
        tiltDeg: -10,
        size: 0.52,
        glowColor: 0xfb923c,
        moons: [
            { label: 'Docker', color: '#2496ed', emissive: 0x2496ed },
            { label: 'AWS', color: '#ff9900', emissive: 0xff9900 },
            { label: 'Vercel', color: '#ffffff', emissive: 0xffffff },
            { label: 'Cloudflare', color: '#f48120', emissive: 0xf48120 },
        ],
    },
] as const;

const MOON_ORBIT_R = 1.25;
const MOON_SIZE = 0.18;
const MOON_SPEED_MULT = 3.5;

/* ─── tiny helper: glow sprite ───────────────────────────────────── */
function makeGlowSprite(color: number, scale: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    const c = new THREE.Color(color);
    const hex = `#${c.getHexString()}`;
    grad.addColorStop(0, `${hex}cc`);
    grad.addColorStop(0.4, `${hex}66`);
    grad.addColorStop(1, `${hex}00`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(scale, scale, 1);
    return sprite;
}

/* ─── orbit ring ─────────────────────────────────────────────────── */
function makeOrbitRing(radius: number, tiltDeg: number, color: number): THREE.Mesh {
    const geo = new THREE.TorusGeometry(radius, 0.012, 8, 128);
    const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.18,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    // we'll apply tilt at parent group level
    return mesh;
}

export const TechSolarSystem3D: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const labelsRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -999, y: -999 });
    const hoveredRef = useRef<number>(-1); // planet index, -1 = none

    useEffect(() => {
        const mount = mountRef.current;
        const labelsDiv = labelsRef.current;
        if (!mount || !labelsDiv) return;

        /* ── renderer ─────────────────────────────────────────────── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.offsetWidth, mount.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = false;
        mount.appendChild(renderer.domElement);

        /* ── scene / camera ───────────────────────────────────────── */
        const scene = new THREE.Scene();
        const W = () => mount.offsetWidth;
        const H = () => mount.offsetHeight;
        const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 200);
        camera.position.set(0, 5, 17);
        camera.lookAt(0, 0, 0);

        // camera lerp target
        const camTarget = new THREE.Vector3(0, 5, 17);
        const lookTarget = new THREE.Vector3(0, 0, 0);
        const curLook = new THREE.Vector3(0, 0, 0);

        /* ── lights ───────────────────────────────────────────────── */
        scene.add(new THREE.AmbientLight(0x111133, 2));
        const centerLight = new THREE.PointLight(0x3b82f6, 4, 25);
        scene.add(centerLight);

        /* ── center sphere (NavHigh) ──────────────────────────────── */
        const centerGeo = new THREE.SphereGeometry(0.9, 32, 32);
        const centerMat = new THREE.MeshStandardMaterial({
            color: 0x1d4ed8,
            emissive: 0x3b82f6,
            emissiveIntensity: 1.2,
            roughness: 0.15,
            metalness: 0.9,
        });
        const centerSphere = new THREE.Mesh(centerGeo, centerMat);
        scene.add(centerSphere);
        scene.add(makeGlowSprite(0x3b82f6, 5));

        /* ── star field ───────────────────────────────────────────── */
        const starCount = 3000;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const r = 30 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPos[i * 3 + 2] = r * Math.cos(phi);
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0x8888ff, size: 0.08, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(starGeo, starMat));

        /* ── planets + moons ──────────────────────────────────────── */
        interface PlanetData {
            orbitGroup: THREE.Group;
            mesh: THREE.Mesh;
            light: THREE.PointLight;
            glow: THREE.Sprite;
            moons: {
                mesh: THREE.Mesh;
                labelEl: HTMLDivElement;
                moonIdx: number;
            }[];
            labelEl: HTMLDivElement;
            planetIdx: number;
        }

        const planetDatas: PlanetData[] = [];
        const raycasterTargets: THREE.Mesh[] = [];

        // angles (mutated each frame)
        const angles = PLANETS.map(() => Math.random() * Math.PI * 2);
        const moonAngles = PLANETS.map((p) => p.moons.map((_, j) => (j * Math.PI) / 2));

        PLANETS.forEach((cfg, pi) => {
            /* orbit tilt group */
            const orbitGroup = new THREE.Group();
            orbitGroup.rotation.z = THREE.MathUtils.degToRad(cfg.tiltDeg);
            scene.add(orbitGroup);

            /* orbit ring */
            const ring = makeOrbitRing(cfg.orbitR, cfg.tiltDeg, cfg.emissive);
            orbitGroup.add(ring);

            /* planet mesh */
            const geo = new THREE.SphereGeometry(cfg.size, 24, 24);
            const mat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(cfg.color),
                emissive: new THREE.Color(cfg.color),
                emissiveIntensity: 0.5,
                roughness: 0.3,
                metalness: 0.7,
            });
            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh); // added to scene not orbitGroup so world pos is easy
            raycasterTargets.push(mesh);

            const light = new THREE.PointLight(cfg.emissive, 1.5, 5);
            mesh.add(light);

            const glow = makeGlowSprite(cfg.glowColor, 2.2);
            mesh.add(glow);

            /* planet HTML label */
            const pLabel = document.createElement('div');
            pLabel.style.cssText = [
                'position:absolute',
                'pointer-events:none',
                'transform:translate(-50%,-130%)',
                `color:${cfg.color}`,
                'font-size:11px',
                'font-weight:700',
                'letter-spacing:0.15em',
                'text-transform:uppercase',
                'opacity:0',
                'transition:opacity 0.4s',
                `text-shadow:0 0 12px ${cfg.color}`,
                'white-space:nowrap',
            ].join(';');
            pLabel.textContent = cfg.label;
            labelsDiv.appendChild(pLabel);

            /* moons */
            const moonArr: PlanetData['moons'] = [];
            cfg.moons.forEach((mcfg, mi) => {
                const mGeo = new THREE.SphereGeometry(MOON_SIZE, 12, 12);
                const mMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(mcfg.color),
                    emissive: new THREE.Color(mcfg.color),
                    emissiveIntensity: 0.7,
                    roughness: 0.4,
                    metalness: 0.5,
                });
                const mMesh = new THREE.Mesh(mGeo, mMat);
                scene.add(mMesh);

                const mLabel = document.createElement('div');
                mLabel.style.cssText = [
                    'position:absolute',
                    'pointer-events:none',
                    'transform:translate(-50%,-120%)',
                    `color:${mcfg.color}`,
                    'font-size:9px',
                    'font-weight:600',
                    'letter-spacing:0.1em',
                    'opacity:0',
                    'transition:opacity 0.3s',
                    'white-space:nowrap',
                ].join(';');
                mLabel.textContent = mcfg.label;
                labelsDiv.appendChild(mLabel);

                moonArr.push({ mesh: mMesh, labelEl: mLabel, moonIdx: mi });
            });

            planetDatas.push({ orbitGroup, mesh, light, glow, moons: moonArr, labelEl: pLabel, planetIdx: pi });
        });

        /* ── raycaster ────────────────────────────────────────────── */
        const raycaster = new THREE.Raycaster();
        const mouse2D = new THREE.Vector2();

        /* ── animation loop ───────────────────────────────────────── */
        const clock = new THREE.Clock();
        let raf: number;

        const projectToScreen = (worldPos: THREE.Vector3) => {
            const v = worldPos.clone().project(camera);
            return {
                x: ((v.x + 1) / 2) * W(),
                y: ((-v.y + 1) / 2) * H(),
                visible: v.z < 1,
            };
        };

        const animate = () => {
            raf = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);
            const t = clock.elapsedTime;

            /* center sphere pulse */
            const pulse = 1 + 0.04 * Math.sin(t * 2.1);
            centerSphere.scale.setScalar(pulse);
            centerLight.intensity = 3.5 + 1.5 * Math.sin(t * 1.8);

            /* raycaster */
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            let newHovered = -1;
            if (mx !== -999) {
                mouse2D.set((mx / W()) * 2 - 1, -(my / H()) * 2 + 1);
                raycaster.setFromCamera(mouse2D, camera);
                const hits = raycaster.intersectObjects(raycasterTargets);
                if (hits.length > 0) {
                    newHovered = raycasterTargets.indexOf(hits[0].object as THREE.Mesh);
                }
            }
            hoveredRef.current = newHovered;

            /* update planets & moons */
            planetDatas.forEach((pd, pi) => {
                const cfg = PLANETS[pi];
                angles[pi] += cfg.speed * dt;
                const a = angles[pi];
                const tiltRad = THREE.MathUtils.degToRad(cfg.tiltDeg);

                // orbit position (tilted in XY plane)
                const px = Math.cos(a) * cfg.orbitR;
                const pz = Math.sin(a) * cfg.orbitR;
                const py = Math.sin(a) * cfg.orbitR * Math.sin(tiltRad);

                pd.mesh.position.set(px, py, pz);
                pd.mesh.rotation.y += dt * 0.4;

                const isHovered = newHovered === pi;
                const anyHovered = newHovered !== -1;

                // emissive intensity
                const targetEmissive = isHovered ? 1.2 : anyHovered ? 0.15 : 0.5;
                const mat = pd.mesh.material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.08;

                // glow scale
                const targetGlow = isHovered ? 3.5 : anyHovered ? 1.2 : 2.2;
                pd.glow.scale.lerp(new THREE.Vector3(targetGlow, targetGlow, 1), 0.1);

                // orbit ring opacity
                const ringMat = (pd.orbitGroup.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
                ringMat.opacity += ((isHovered ? 0.4 : anyHovered ? 0.06 : 0.18) - ringMat.opacity) * 0.1;

                /* moons */
                pd.moons.forEach(({ mesh: mMesh, labelEl: mLabel, moonIdx: mi }) => {
                    moonAngles[pi][mi] += cfg.speed * MOON_SPEED_MULT * dt;
                    const ma = moonAngles[pi][mi];
                    const mr = isHovered ? MOON_ORBIT_R * 1.5 : MOON_ORBIT_R;
                    mMesh.position.set(px + Math.cos(ma) * mr, py + Math.sin(ma * 0.5) * 0.35, pz + Math.sin(ma) * mr);
                    (mMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = isHovered
                        ? 1.0
                        : anyHovered
                          ? 0.2
                          : 0.5;

                    /* moon label */
                    const mScreen = projectToScreen(mMesh.position);
                    if (mScreen.visible) {
                        mLabel.style.left = `${mScreen.x}px`;
                        mLabel.style.top = `${mScreen.y}px`;
                        mLabel.style.opacity = isHovered ? '0.9' : '0';
                    } else {
                        mLabel.style.opacity = '0';
                    }
                });

                /* planet label */
                const pScreen = projectToScreen(pd.mesh.position);
                if (pScreen.visible) {
                    pd.labelEl.style.left = `${pScreen.x}px`;
                    pd.labelEl.style.top = `${pScreen.y}px`;
                    pd.labelEl.style.opacity = anyHovered ? (isHovered ? '1' : '0.2') : '0.75';
                } else {
                    pd.labelEl.style.opacity = '0';
                }
            });

            /* camera lerp */
            if (newHovered !== -1) {
                const pd = planetDatas[newHovered];
                const planetPos = pd.mesh.position;
                camTarget.set(planetPos.x * 0.45, planetPos.y * 0.45 + 3, planetPos.z * 0.45 + 9);
                lookTarget.set(planetPos.x * 0.3, planetPos.y * 0.3, planetPos.z * 0.3);
            } else {
                camTarget.set(0, 5, 17);
                lookTarget.set(0, 0, 0);
            }
            camera.position.lerp(camTarget, 0.04);
            curLook.lerp(lookTarget, 0.04);
            camera.lookAt(curLook);

            /* slow system rotation */
            scene.rotation.y += dt * 0.02;

            renderer.render(scene, camera);
        };

        animate();

        /* ── mouse tracking ───────────────────────────────────────── */
        const onMouseMove = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onMouseLeave = () => {
            mouseRef.current = { x: -999, y: -999 };
        };
        mount.addEventListener('mousemove', onMouseMove);
        mount.addEventListener('mouseleave', onMouseLeave);

        /* ── resize ───────────────────────────────────────────────── */
        const onResize = () => {
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
            renderer.setSize(W(), H());
        };
        window.addEventListener('resize', onResize);

        /* ── cleanup ──────────────────────────────────────────────── */
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            mount.removeEventListener('mousemove', onMouseMove);
            mount.removeEventListener('mouseleave', onMouseLeave);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            labelsDiv.innerHTML = '';
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#020208] overflow-hidden" style={{ height: '100vh' }}>
            {/* 3-D canvas */}
            <div ref={mountRef} className="absolute inset-0" />

            {/* HTML labels injected imperatively */}
            <div ref={labelsRef} className="absolute inset-0 pointer-events-none z-20" />

            {/* top-left editorial header */}
            <div className="absolute top-14 left-8 md:left-14 z-30 pointer-events-none max-w-sm">
                <span className="inline-flex items-center gap-2 text-blue-400/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-4">
                    <span className="block w-5 h-px bg-blue-400/40" />
                    Tech Ecosystem
                </span>
                <h2
                    className="text-white text-4xl md:text-5xl font-bold tracking-[-0.04em] leading-[0.92]"
                    style={{
                        textShadow: '0 0 40px rgba(59,130,246,0.3)',
                    }}
                >
                    A living{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #a78bfa, #3b82f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        system.
                    </span>
                </h2>
            </div>

            {/* bottom instruction */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
                <p className="text-white/25 text-xs tracking-[0.2em] uppercase">
                    Hover a planet to explore its technology
                </p>
            </div>

            {/* edge fades */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030308] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none z-10" />
        </section>
    );
};
