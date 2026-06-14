'use client';

import type { Application, SubmitApplicationInput } from '@/services/courses/types';
import type { Job } from '@/services/jobs/types';
import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    Globe,
    Loader2,
    Mail,
    MessageSquare,
    Phone,
    User,
    X,
} from 'lucide-react';
import { submitApplication } from '@/services/courses/api';
import { getJobsQueryOptions } from '@/services/jobs/queries';

// Dynamic fetching replaces hardcoded OPEN_JOBS list

const CareersModule: React.FC = () => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        resumeTextOrLink: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: jobs = [], isLoading, isError } = useQuery(getJobsQueryOptions());

    const { mutate: submitApp, isPending } = useMutation<Application, Error, SubmitApplicationInput>({
        mutationFn: (data) => {
            return submitApplication(data);
        },
        onSuccess: () => {
            setShowSuccess(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                resumeTextOrLink: '',
                notes: '',
            });
            setFormErrors({});
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedJob(null);
            }, 3000);
        },
        onError: (error) => {
            setFormErrors({ submit: error.message || 'Failed to submit application. Please try again.' });
        },
    });

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{8,15}$/.test(formData.phone.trim())) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (!formData.resumeTextOrLink.trim()) {
            errors.resumeTextOrLink = 'Resume link or professional overview is required';
        }
        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) return;
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        submitApp({
            type: 'job',
            positionTitle: selectedJob.title,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            resumeTextOrLink: formData.resumeTextOrLink,
            notes: formData.notes,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return { ...prev, [name]: value };
        });
        if (formErrors[name]) {
            setFormErrors((prev) => {
                return { ...prev, [name]: '' };
            });
        }
    };

    const renderJobsContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Loading open positions...</p>
                </div>
            );
        }
        if (isError) {
            return (
                <div className="text-center py-16 rounded-3xl border border-slate-900 bg-slate-950/20 p-8 max-w-xl mx-auto">
                    <p className="text-red-500 text-sm font-medium">Failed to load open positions.</p>
                    <p className="text-slate-500 text-xs mt-1">Please try refreshing the page or contact support.</p>
                </div>
            );
        }
        if (jobs.length === 0) {
            return (
                <div className="text-center py-20 rounded-3xl border border-slate-900 bg-slate-950/20 p-8 max-w-xl mx-auto">
                    <Briefcase className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                    <p className="text-white text-lg font-bold">No active openings right now</p>
                    <p className="text-slate-500 text-sm mt-1">
                        We don&apos;t have any open full-time positions at the moment, but feel free to check back soon.
                    </p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => {
                    return (
                        <div
                            key={job._id}
                            className="bg-slate-950/50 border border-slate-900 rounded-3xl p-7 md:p-8 flex flex-col justify-between hover:border-blue-500/20 hover:shadow-[0_12px_40px_rgba(59,130,246,0.04)] transition-all duration-500 min-h-[360px]"
                        >
                            <div>
                                {/* Metadata tags */}
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-900/40">
                                        <Globe className="w-3 h-3" />
                                        {job.location}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-400 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-900/40">
                                        <Briefcase className="w-3 h-3" />
                                        {job.type}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-full border border-slate-800/60">
                                        <Clock className="w-3 h-3" />
                                        {job.experience}
                                    </span>
                                </div>

                                {/* Job Title */}
                                <h3 className="text-white text-xl font-bold tracking-tight">{job.title}</h3>
                                <span className="text-[10px] text-slate-500 font-semibold block mt-1 uppercase">
                                    {job.department}
                                </span>

                                {/* Description */}
                                <p className="text-slate-400 text-xs mt-4 leading-relaxed">{job.description}</p>

                                {/* Core Requirements */}
                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="mt-5">
                                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider block mb-2">
                                            Key Requirements
                                        </span>
                                        <ul className="space-y-1.5">
                                            {job.requirements.slice(0, 2).map((req, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 text-[11px] text-slate-400"
                                                    >
                                                        <span className="text-blue-500 mt-0.5">•</span>
                                                        <span>{req}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-900/60">
                                <button
                                    onClick={() => {
                                        return setSelectedJob(job);
                                    }}
                                    className="w-full bg-slate-900 hover:bg-blue-600 border border-slate-850 hover:border-transparent text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    Apply for Role
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#070b13] text-slate-200 font-sans tracking-[-0.015em] overflow-x-hidden relative">
            {/* Ambient gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/6 left-1/3 w-[600px] h-[400px] rounded-full blur-3xl opacity-10"
                    style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
                />
                <div
                    className="absolute top-1/2 right-1/4 w-[500px] h-[350px] rounded-full blur-3xl opacity-10"
                    style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }}
                />
            </div>

            {/* Header */}
            <header className="relative border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md px-6 md:px-14 py-4 flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <span className="font-bold text-base tracking-tight text-white block">NavHigh</span>
                        <span className="text-[10px] text-slate-500 tracking-wider uppercase">Careers Portal</span>
                    </div>
                </div>

                <Link
                    href="/"
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Home
                </Link>
            </header>

            <main className="relative max-w-6xl mx-auto px-6 py-20 z-10">
                {/* Hero section */}
                <div className="mb-20 text-center max-w-2xl mx-auto">
                    <span className="text-[10px] text-blue-500 bg-blue-950/40 border border-blue-900/30 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        Join Our Team
                    </span>
                    <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight mt-6 leading-[1.05]">
                        Build what <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            moves business.
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                        We build high-performance products and scale systems. We are looking for engineers, designers,
                        and architects who take deep pride in craft and performance.
                    </p>
                </div>

                {/* Open positions header */}
                <div className="border-b border-slate-900 pb-5 mb-8 flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold tracking-tight">Open Positions</h2>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-900/80 border border-slate-800/60 px-3 py-1 rounded-full">
                        {jobs.length} Active Openings
                    </span>
                </div>

                {/* Job openings grid */}
                {renderJobsContent()}
            </main>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!isPending) setSelectedJob(null);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        {/* Modal container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-xl bg-slate-950 border border-slate-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden z-10"
                        >
                            {showSuccess ? (
                                <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', damping: 15 }}
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                                    </motion.div>
                                    <h3 className="text-white text-2xl font-bold tracking-tight">Application Sent!</h3>
                                    <p className="text-slate-500 text-xs max-w-xs mt-2 leading-relaxed">
                                        Thank you for applying for the <strong>{selectedJob.title}</strong> role. Our
                                        recruiting team will review your profile and respond soon.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Close Button */}
                                    <button
                                        onClick={() => {
                                            return setSelectedJob(null);
                                        }}
                                        disabled={isPending}
                                        className="absolute top-5 right-5 text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-full transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Content */}
                                    <div className="p-6 md:p-8 text-xs">
                                        <div className="mb-6">
                                            <span className="text-[9px] text-blue-500 bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                Application Form
                                            </span>
                                            <h3 className="text-white text-lg font-bold mt-2">{selectedJob.title}</h3>
                                            <p className="text-slate-500 text-[10px] mt-0.5">
                                                {selectedJob.department} · {selectedJob.location} · {selectedJob.type}
                                            </p>
                                        </div>

                                        {formErrors.submit && (
                                            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/30 text-red-400 rounded-xl font-medium">
                                                {formErrors.submit}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Name */}
                                            <div>
                                                <label
                                                    htmlFor="fullName"
                                                    className="block font-semibold text-slate-400 mb-1.5"
                                                >
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                        <User className="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        disabled={isPending}
                                                        placeholder="Sarah Chen"
                                                        className={`w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                            formErrors.fullName
                                                                ? 'border-red-500 focus:ring-red-500/50'
                                                                : 'border-slate-800 focus:border-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {formErrors.fullName && (
                                                    <span className="text-red-400 text-[10px] mt-1 block font-medium">
                                                        {formErrors.fullName}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Email and Phone Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="email"
                                                        className="block font-semibold text-slate-400 mb-1.5"
                                                    >
                                                        Email Address *
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                            <Mail className="w-4 h-4" />
                                                        </span>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            disabled={isPending}
                                                            placeholder="sarah@example.com"
                                                            className={`w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                                formErrors.email
                                                                    ? 'border-red-500 focus:ring-red-500/50'
                                                                    : 'border-slate-800 focus:border-blue-500'
                                                            }`}
                                                        />
                                                    </div>
                                                    {formErrors.email && (
                                                        <span className="text-red-400 text-[10px] mt-1 block font-medium">
                                                            {formErrors.email}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="phone"
                                                        className="block font-semibold text-slate-400 mb-1.5"
                                                    >
                                                        Phone Number *
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                            <Phone className="w-4 h-4" />
                                                        </span>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            disabled={isPending}
                                                            placeholder="+1 (555) 000-0000"
                                                            className={`w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                                formErrors.phone
                                                                    ? 'border-red-500 focus:ring-red-500/50'
                                                                    : 'border-slate-800 focus:border-blue-500'
                                                            }`}
                                                        />
                                                    </div>
                                                    {formErrors.phone && (
                                                        <span className="text-red-400 text-[10px] mt-1 block font-medium">
                                                            {formErrors.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Resume */}
                                            <div>
                                                <label
                                                    htmlFor="resumeTextOrLink"
                                                    className="block font-semibold text-slate-400 mb-1.5"
                                                >
                                                    Resume URL or Background Info *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3 text-slate-500">
                                                        <FileText className="w-4 h-4" />
                                                    </span>
                                                    <textarea
                                                        id="resumeTextOrLink"
                                                        name="resumeTextOrLink"
                                                        value={formData.resumeTextOrLink}
                                                        onChange={handleInputChange}
                                                        disabled={isPending}
                                                        placeholder="Provide a link to your resume (Drive, GitHub, Notion) or type a brief summary of your projects and work history..."
                                                        rows={3}
                                                        className={`w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none ${
                                                            formErrors.resumeTextOrLink
                                                                ? 'border-red-500 focus:ring-red-500/50'
                                                                : 'border-slate-800 focus:border-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {formErrors.resumeTextOrLink && (
                                                    <span className="text-red-400 text-[10px] mt-1 block font-medium">
                                                        {formErrors.resumeTextOrLink}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label
                                                    htmlFor="notes"
                                                    className="block font-semibold text-slate-400 mb-1.5"
                                                >
                                                    Cover Note / Details (Optional)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3 text-slate-500">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </span>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleInputChange}
                                                        disabled={isPending}
                                                        placeholder="Why do you want to join NavHigh?"
                                                        rows={2}
                                                        className="w-full text-xs pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="pt-4 flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() => {
                                                        return setSelectedJob(null);
                                                    }}
                                                    className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isPending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        'Submit Application'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareersModule;
