'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { Loader2, Lock, Mail } from 'lucide-react';
import { JWT_AUTH_TOKEN_COOKIE_NAME, JWT_COOKIE_OPTIONS, JWT_REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Artificial delay for premium look & feel
        await new Promise((resolve) => {
            return setTimeout(resolve, 800);
        });

        // Hardcoded check
        if (email.trim() === 'admin@navhigh.com' && password === 'password123') {
            try {
                // Generate a valid mock JWT token
                const base64url = (str: string) => {
                    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                };
                const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
                const payload = base64url(
                    JSON.stringify({
                        sub: 'admin',
                        email: 'admin@navhigh.com',
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, // 7 days expiration
                    })
                );
                const signature = 'mock_signature';
                const token = `${header}.${payload}.${signature}`;

                // Set Auth cookies
                setCookie(JWT_AUTH_TOKEN_COOKIE_NAME, token, JWT_COOKIE_OPTIONS);
                setCookie(JWT_REFRESH_TOKEN_COOKIE_NAME, 'mock_refresh_token', JWT_COOKIE_OPTIONS);

                // Redirect
                router.push(from);
                router.refresh();
            } catch (err: any) {
                setError('Authentication failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Invalid email or password.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b13] flex flex-col justify-center items-center px-4 font-sans tracking-[-0.01em] text-slate-200">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-3xl opacity-10"
                    style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
                />
            </div>

            <div className="relative w-full max-w-md bg-slate-950 border border-slate-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden z-10 p-8">
                <div className="text-center mb-8">
                    <span className="text-[10px] text-blue-500 bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        NavHigh Admin Portal
                    </span>
                    <h2 className="text-white text-2xl font-bold tracking-tight mt-4">Sign in to Dashboard</h2>
                    <p className="text-slate-500 text-xs mt-1">
                        Use the secure hardcoded credentials to manage internship cohorts.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-semibold text-slate-400 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    return setEmail(e.target.value);
                                }}
                                disabled={isLoading}
                                placeholder="admin@navhigh.com"
                                className="w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block font-semibold text-slate-400 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    return setPassword(e.target.value);
                                }}
                                disabled={isLoading}
                                placeholder="••••••••"
                                className="w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-900 text-center">
                    <span className="text-[10px] text-slate-600 block">Hardcoded Admin Credentials:</span>
                    <code className="text-[9px] text-slate-400 mt-1 block">admin@navhigh.com / password123</code>
                </div>
            </div>
        </div>
    );
}
