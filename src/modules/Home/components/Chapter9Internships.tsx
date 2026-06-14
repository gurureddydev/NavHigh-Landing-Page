'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Calendar, CheckCircle2, FileText, Loader2, Mail, MessageSquare, Phone, User, X } from 'lucide-react';
import { getCoursesQueryOptions, submitApplicationMutationOptions } from '@/services/courses/queries';
import { Course } from '@/services/courses/types';

export const Chapter9Internships: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        resumeTextOrLink: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: courses = [], isLoading, isError } = useQuery(getCoursesQueryOptions());

    const { mutate: submitApp, isPending } = useMutation(
        submitApplicationMutationOptions({
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
                    setSelectedCourse(null);
                }, 3000);
            },
            onError: (error) => {
                setFormErrors({ submit: error.message || 'Failed to submit application. Please try again.' });
            },
        })
    );

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setInView(true);
            },
            { threshold: 0.05 }
        );
        obs.observe(el);
        return () => {
            return obs.disconnect();
        };
    }, []);

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
            errors.resumeTextOrLink = 'Resume link or profile text is required';
        }
        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) return;
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        submitApp({
            type: 'internship',
            courseId: selectedCourse._id,
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

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-[#0F172A]/40 text-sm font-medium">Loading programs...</p>
                </div>
            );
        }
        if (isError) {
            return (
                <div className="text-center py-16 rounded-3xl border border-[#0F172A]/[0.08] bg-white p-8">
                    <p className="text-red-500 text-sm font-medium">Failed to load internship opportunities.</p>
                    <p className="text-[#0F172A]/40 text-xs mt-1">Please try refreshing the page or contact support.</p>
                </div>
            );
        }
        if (courses.length === 0) {
            return (
                <div className="text-center py-20 rounded-3xl border border-[#0F172A]/[0.08] bg-white p-8 max-w-xl mx-auto">
                    <Award className="w-10 h-10 text-[#0F172A]/20 mx-auto mb-4" />
                    <p className="text-[#0F172A] text-lg font-bold">No active programs right now</p>
                    <p className="text-[#0F172A]/40 text-sm mt-1">
                        We are not actively accepting applications at this moment. Check back soon for new cohorts!
                    </p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, i) => {
                    return (
                        <div
                            key={course._id}
                            className={`
                                group relative rounded-3xl border border-[#0F172A]/[0.07] bg-white p-7 md:p-8
                                hover:border-blue-400/30 hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)]
                                transition-all duration-500 flex flex-col justify-between min-h-[420px]
                                transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                            `}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            {/* Accent background on hover */}
                            <div
                                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,rgba(37,99,235,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100"
                                aria-hidden="true"
                            />

                            <div>
                                {/* Status badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                        <Calendar className="w-3 h-3" />
                                        {course.duration}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                        Remote Training
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-[#0F172A] text-xl font-bold tracking-[-0.02em] group-hover:text-blue-600 transition-colors duration-300">
                                    {course.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#0F172A]/50 text-sm mt-3 leading-relaxed">{course.description}</p>

                                {/* Syllabus outline */}
                                {course.topics && course.topics.length > 0 && (
                                    <div className="mt-5">
                                        <span className="text-[10px] text-[#0F172A]/35 font-bold tracking-wider uppercase block mb-2">
                                            Syllabus Outline
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {course.topics.map((topic) => {
                                                return (
                                                    <span
                                                        key={topic}
                                                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-[#0F172A]/60 border border-slate-100"
                                                    >
                                                        {topic}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements */}
                                {course.requirements && course.requirements.length > 0 && (
                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                        <span className="text-[10px] text-[#0F172A]/35 font-bold tracking-wider uppercase block mb-2.5">
                                            Requirements
                                        </span>
                                        <ul className="space-y-1.5">
                                            {course.requirements.map((req) => {
                                                return (
                                                    <li
                                                        key={req}
                                                        className="flex items-start gap-2 text-xs text-[#0F172A]/60"
                                                    >
                                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                                        <span>{req}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Action button */}
                            <div className="mt-8 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        return setSelectedCourse(course);
                                    }}
                                    className="w-full bg-[#0f172a] hover:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                                >
                                    Apply for Program
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section id="internships" ref={sectionRef} className="relative bg-[#FAFBFF] overflow-hidden py-32 md:py-40">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F5F7FA] to-transparent pointer-events-none" />

            {/* Radial glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none opacity-5"
                style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
                {/* Header */}
                <div
                    className={`mb-16 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <span className="inline-flex items-center gap-2 text-blue-600/60 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
                        <span className="block w-5 h-px bg-blue-500/40" />
                        09 — Opportunities
                    </span>
                    <h2 className="text-[#0F172A] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.92]">
                        Training internships. <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Learn by building.
                        </span>
                    </h2>
                    <p className="mt-5 text-[#0F172A]/50 text-base md:text-lg max-w-2xl leading-relaxed">
                        Work directly alongside senior engineers on real-world systems. Master full-stack application
                        development, AI integrations, and cloud scale.
                    </p>
                </div>

                {renderContent()}
            </div>

            {/* Glassmorphic Application Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!isPending) setSelectedCourse(null);
                            }}
                            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_32px_64px_rgba(15,23,42,0.18)] border border-[#0F172A]/[0.08] overflow-hidden z-10"
                        >
                            {/* Success State */}
                            {showSuccess ? (
                                <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', damping: 15 }}
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                                    </motion.div>
                                    <h3 className="text-[#0F172A] text-2xl font-bold tracking-tight">
                                        Application Sent!
                                    </h3>
                                    <p className="text-[#0F172A]/50 text-sm max-w-xs mt-2 leading-relaxed">
                                        Thank you for applying for the <strong>{selectedCourse.title}</strong>{' '}
                                        internship course. We will review your profile and respond soon.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Close button */}
                                    <button
                                        onClick={() => {
                                            return setSelectedCourse(null);
                                        }}
                                        disabled={isPending}
                                        className="absolute top-5 right-5 text-[#0F172A]/30 hover:text-[#0F172A] p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Content */}
                                    <div className="p-6 md:p-8">
                                        <div className="mb-6">
                                            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                Application Form
                                            </span>
                                            <h3 className="text-[#0F172A] text-xl font-bold tracking-tight mt-2">
                                                {selectedCourse.title}
                                            </h3>
                                            <p className="text-[#0F172A]/50 text-xs mt-1">
                                                Duration: {selectedCourse.duration} · Mode: 100% Remote
                                            </p>
                                        </div>

                                        {formErrors.submit && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                                                {formErrors.submit}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Full Name */}
                                            <div>
                                                <label
                                                    htmlFor="fullName"
                                                    className="block text-xs font-semibold text-[#0F172A]/70 mb-1.5"
                                                >
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/30">
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
                                                        className={`w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                            formErrors.fullName
                                                                ? 'border-red-400 focus:ring-red-400/50'
                                                                : 'border-slate-200 focus:border-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {formErrors.fullName && (
                                                    <span className="text-red-500 text-[10px] font-medium mt-1 block">
                                                        {formErrors.fullName}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Email and Phone Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-xs font-semibold text-[#0F172A]/70 mb-1.5"
                                                    >
                                                        Email Address *
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/30">
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
                                                            className={`w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                                formErrors.email
                                                                    ? 'border-red-400 focus:ring-red-400/50'
                                                                    : 'border-slate-200 focus:border-blue-500'
                                                            }`}
                                                        />
                                                    </div>
                                                    {formErrors.email && (
                                                        <span className="text-red-500 text-[10px] font-medium mt-1 block">
                                                            {formErrors.email}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="phone"
                                                        className="block text-xs font-semibold text-[#0F172A]/70 mb-1.5"
                                                    >
                                                        Phone Number *
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/30">
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
                                                            className={`w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                                                                formErrors.phone
                                                                    ? 'border-red-400 focus:ring-red-400/50'
                                                                    : 'border-slate-200 focus:border-blue-500'
                                                            }`}
                                                        />
                                                    </div>
                                                    {formErrors.phone && (
                                                        <span className="text-red-500 text-[10px] font-medium mt-1 block">
                                                            {formErrors.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Resume Link or Summary */}
                                            <div>
                                                <label
                                                    htmlFor="resumeTextOrLink"
                                                    className="block text-xs font-semibold text-[#0F172A]/70 mb-1.5"
                                                >
                                                    Resume URL or Background Info *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3 text-[#0F172A]/30">
                                                        <FileText className="w-4 h-4" />
                                                    </span>
                                                    <textarea
                                                        id="resumeTextOrLink"
                                                        name="resumeTextOrLink"
                                                        value={formData.resumeTextOrLink}
                                                        onChange={handleInputChange}
                                                        disabled={isPending}
                                                        placeholder="Provide a link to your resume (Drive, GitHub, Notion) or type a brief summary of your projects and experiences here..."
                                                        rows={3}
                                                        className={`w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none ${
                                                            formErrors.resumeTextOrLink
                                                                ? 'border-red-400 focus:ring-red-400/50'
                                                                : 'border-slate-200 focus:border-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {formErrors.resumeTextOrLink && (
                                                    <span className="text-red-500 text-[10px] font-medium mt-1 block">
                                                        {formErrors.resumeTextOrLink}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label
                                                    htmlFor="notes"
                                                    className="block text-xs font-semibold text-[#0F172A]/70 mb-1.5"
                                                >
                                                    Additional Notes (Optional)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3 text-[#0F172A]/30">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </span>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleInputChange}
                                                        disabled={isPending}
                                                        placeholder="Tell us what you want to achieve or any other details..."
                                                        rows={2}
                                                        className="w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-4 flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() => {
                                                        return setSelectedCourse(null);
                                                    }}
                                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-slate-50 text-xs font-semibold transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/10 active:scale-95 disabled:opacity-50"
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
        </section>
    );
};
