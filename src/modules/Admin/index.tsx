'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Edit3,
    FileText,
    IndianRupee,
    ListFilter,
    Loader2,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import {
    deleteCourseMutationOptions,
    getAdminCoursesQueryOptions,
    getApplicationsQueryOptions,
    saveCourseMutationOptions,
    updateApplicationStatusMutationOptions,
} from '@/services/courses/queries';
import { Application, Course } from '@/services/courses/types';
import { deleteJobMutationOptions, getAdminJobsQueryOptions, saveJobMutationOptions } from '@/services/jobs/queries';
import { Job } from '@/services/jobs/types';

const AdminModule: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'applications' | 'courses' | 'careers'>('applications');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Selected items for modal/drawer views
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [showJobForm, setShowJobForm] = useState(false);

    // Form states for courses
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        duration: '',
        stipend: '',
        requirements: [] as string[],
        topics: [] as string[],
        isActive: true,
    });
    const [newRequirement, setNewRequirement] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [courseErrors, setCourseErrors] = useState<Record<string, string>>({});

    // Form states for jobs
    const [jobForm, setJobForm] = useState({
        title: '',
        description: '',
        department: '',
        location: 'Remote',
        type: 'Full-time',
        experience: '',
        requirements: [] as string[],
        isActive: true,
    });
    const [newJobRequirement, setNewJobRequirement] = useState('');
    const [jobErrors, setJobErrors] = useState<Record<string, string>>({});

    // Fetch queries
    const { data: courses = [], isLoading: isLoadingCourses } = useQuery(getAdminCoursesQueryOptions());
    const { data: applications = [], isLoading: isLoadingApps } = useQuery(getApplicationsQueryOptions());
    const { data: jobs = [], isLoading: isLoadingJobs } = useQuery(getAdminJobsQueryOptions());

    // Mutations
    const { mutate: saveCourseMutate, isPending: isSavingCourse } = useMutation(
        saveCourseMutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                setEditingCourse(null);
                setShowCourseForm(false);
                resetCourseForm();
            },
            onError: (err) => {
                setCourseErrors({ submit: err.message || 'Failed to save course.' });
            },
        })
    );

    const { mutate: deleteCourseMutate } = useMutation(
        deleteCourseMutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
            },
        })
    );

    const { mutate: updateStatusMutate, isPending: isUpdatingStatus } = useMutation(
        updateApplicationStatusMutationOptions({
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['courses'] }); // Invalidate all cached queries
                setSelectedApplication(data);
            },
        })
    );

    // Job Mutations
    const { mutate: saveJobMutate, isPending: isSavingJob } = useMutation(
        saveJobMutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['jobs'] });
                setEditingJob(null);
                setShowJobForm(false);
                resetJobForm();
            },
            onError: (err) => {
                setJobErrors({ submit: err.message || 'Failed to save job.' });
            },
        })
    );

    const { mutate: deleteJobMutate } = useMutation(
        deleteJobMutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['jobs'] });
            },
        })
    );

    // Filter calculations
    const filteredApplications = applications.filter((app) => {
        const courseTitleText = app.type === 'job' ? app.positionTitle || '' : app.courseTitle || '';
        const matchesSearch =
            app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            courseTitleText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalSubmissions: applications.length,
        pendingReviews: applications.filter((a) => {
            return a.status === 'Pending';
        }).length,
        activeCourses: courses.filter((c) => {
            return c.isActive;
        }).length,
        shortlisted: applications.filter((a) => {
            return a.status === 'Shortlisted';
        }).length,
    };

    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setCourseForm((prev) => {
                return {
                    ...prev,
                    requirements: [...prev.requirements, newRequirement.trim()],
                };
            });
            setNewRequirement('');
        }
    };

    const handleRemoveRequirement = (index: number) => {
        setCourseForm((prev) => {
            return {
                ...prev,
                requirements: prev.requirements.filter((_, i) => {
                    return i !== index;
                }),
            };
        });
    };

    const handleAddTopic = () => {
        if (newTopic.trim()) {
            setCourseForm((prev) => {
                return {
                    ...prev,
                    topics: [...prev.topics, newTopic.trim()],
                };
            });
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (index: number) => {
        setCourseForm((prev) => {
            return {
                ...prev,
                topics: prev.topics.filter((_, i) => {
                    return i !== index;
                }),
            };
        });
    };

    const resetCourseForm = () => {
        setCourseForm({
            title: '',
            description: '',
            duration: '',
            stipend: '',
            requirements: [],
            topics: [],
            isActive: true,
        });
        setNewRequirement('');
        setNewTopic('');
        setCourseErrors({});
    };

    const handleOpenCreateForm = () => {
        setEditingCourse(null);
        resetCourseForm();
        setShowCourseForm(true);
    };

    const handleOpenEditForm = (course: Course) => {
        setEditingCourse(course);
        setCourseForm({
            title: course.title,
            description: course.description,
            duration: course.duration,
            stipend: course.stipend,
            requirements: course.requirements || [],
            topics: course.topics || [],
            isActive: course.isActive,
        });
        setCourseErrors({});
        setShowCourseForm(true);
    };

    const handleCourseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!courseForm.title.trim()) errors.title = 'Title is required';
        if (!courseForm.description.trim()) errors.description = 'Description is required';
        if (!courseForm.duration.trim()) errors.duration = 'Duration is required';
        if (!courseForm.stipend.trim()) errors.stipend = 'Stipend is required';

        if (Object.keys(errors).length > 0) {
            setCourseErrors(errors);
            return;
        }

        saveCourseMutate({
            id: editingCourse?._id,
            ...courseForm,
        });
    };

    const handleToggleCourseStatus = (course: Course) => {
        saveCourseMutate({
            id: course._id,
            title: course.title,
            description: course.description,
            duration: course.duration,
            stipend: course.stipend,
            requirements: course.requirements,
            topics: course.topics,
            isActive: !course.isActive,
        });
    };

    // Job handler functions
    const handleAddJobRequirement = () => {
        if (newJobRequirement.trim()) {
            setJobForm((prev) => {
                return {
                    ...prev,
                    requirements: [...prev.requirements, newJobRequirement.trim()],
                };
            });
            setNewJobRequirement('');
        }
    };

    const handleRemoveJobRequirement = (index: number) => {
        setJobForm((prev) => {
            return {
                ...prev,
                requirements: prev.requirements.filter((_, i) => {
                    return i !== index;
                }),
            };
        });
    };

    const resetJobForm = () => {
        setJobForm({
            title: '',
            description: '',
            department: '',
            location: 'Remote',
            type: 'Full-time',
            experience: '',
            requirements: [],
            isActive: true,
        });
        setNewJobRequirement('');
        setJobErrors({});
    };

    const handleOpenCreateJobForm = () => {
        setEditingJob(null);
        resetJobForm();
        setShowJobForm(true);
    };

    const handleOpenEditJobForm = (job: Job) => {
        setEditingJob(job);
        setJobForm({
            title: job.title,
            description: job.description,
            department: job.department,
            location: job.location || 'Remote',
            type: job.type || 'Full-time',
            experience: job.experience,
            requirements: job.requirements || [],
            isActive: job.isActive,
        });
        setJobErrors({});
        setShowJobForm(true);
    };

    const handleJobSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!jobForm.title.trim()) errors.title = 'Title is required';
        if (!jobForm.description.trim()) errors.description = 'Description is required';
        if (!jobForm.department.trim()) errors.department = 'Department is required';
        if (!jobForm.experience.trim()) errors.experience = 'Experience is required';

        if (Object.keys(errors).length > 0) {
            setJobErrors(errors);
            return;
        }

        saveJobMutate({
            id: editingJob?._id,
            ...jobForm,
        });
    };

    const handleToggleJobStatus = (job: Job) => {
        saveJobMutate({
            id: job._id,
            title: job.title,
            description: job.description,
            department: job.department,
            location: job.location,
            type: job.type,
            experience: job.experience,
            requirements: job.requirements,
            isActive: !job.isActive,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-950/40 text-amber-400 border border-amber-800/30';
            case 'Reviewed':
                return 'bg-blue-950/40 text-blue-400 border border-blue-800/30';
            case 'Shortlisted':
                return 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30';
            case 'Rejected':
                return 'bg-rose-950/40 text-rose-400 border border-rose-800/30';
            default:
                return 'bg-slate-900/40 text-slate-400 border border-slate-800/30';
        }
    };

    const renderApplicationsContent = () => {
        if (isLoadingApps) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-500">Loading submissions...</span>
                </div>
            );
        }
        if (filteredApplications.length === 0) {
            return (
                <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-2xl p-8">
                    <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <h3 className="text-slate-300 font-bold text-sm">No applications found</h3>
                    <p className="text-slate-500 text-xs mt-1">No profiles match the filter options.</p>
                </div>
            );
        }
        return (
            <div className="bg-slate-950/45 border border-slate-900 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-semibold bg-slate-950/60">
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Program / Position</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Applied At</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60">
                            {filteredApplications.map((app) => {
                                return (
                                    <tr key={app._id} className="hover:bg-slate-900/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{app.fullName}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-slate-200">
                                                    {app.type === 'job' ? app.positionTitle : app.courseTitle}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center w-max px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                                        app.type === 'job'
                                                            ? 'bg-purple-950/45 text-purple-400 border border-purple-900/30'
                                                            : 'bg-blue-950/45 text-blue-400 border border-blue-900/30'
                                                    }`}
                                                >
                                                    {app.type === 'job' ? 'Job Application' : 'Training Program'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-400">{app.phone}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(
                                                    app.status
                                                )}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    return setSelectedApplication(app);
                                                }}
                                                className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
                                            >
                                                Review Profile
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderCoursesContent = () => {
        if (isLoadingCourses) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-500">Loading courses...</span>
                </div>
            );
        }
        if (courses.length === 0) {
            return (
                <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-2xl p-8">
                    <Briefcase className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <h3 className="text-slate-300 font-bold text-sm">No courses defined</h3>
                    <p className="text-slate-500 text-xs mt-1">
                        Create an internship cohort to display it on the landing page.
                    </p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                    return (
                        <div
                            key={course._id}
                            className="bg-slate-950/45 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between min-h-[260px]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                                            course.isActive
                                                ? 'bg-blue-950/50 text-blue-400 border border-blue-900/30'
                                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                                        }`}
                                    >
                                        {course.isActive ? 'Active' : 'Draft'}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                return handleOpenEditForm(course);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-900 transition-colors"
                                            aria-label="Edit course"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                // eslint-disable-next-line no-alert
                                                if (confirm('Are you sure you want to delete this program?')) {
                                                    deleteCourseMutate(course._id);
                                                }
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-900 transition-colors"
                                            aria-label="Delete course"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <h4 className="text-white font-bold text-sm leading-tight mb-2">{course.title}</h4>
                                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                                    {course.description}
                                </p>
                            </div>

                            <div className="border-t border-slate-900/60 pt-4 mt-auto">
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-600" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3 text-slate-600" />
                                        <span>{course.stipend}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-medium">Cohort Status</span>
                                    <button
                                        onClick={() => {
                                            return handleToggleCourseStatus(course);
                                        }}
                                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                            course.isActive
                                                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                                        }`}
                                    >
                                        {course.isActive ? 'Deactivate' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCareersContent = () => {
        if (isLoadingJobs) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-500">Loading careers...</span>
                </div>
            );
        }
        if (jobs.length === 0) {
            return (
                <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-2xl p-8">
                    <Briefcase className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <h3 className="text-slate-300 font-bold text-sm">No job postings defined</h3>
                    <p className="text-slate-500 text-xs mt-1">
                        Create a job posting to display it on the careers page.
                    </p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => {
                    return (
                        <div
                            key={job._id}
                            className="bg-slate-950/45 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between min-h-[260px]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                                            job.isActive
                                                ? 'bg-blue-950/50 text-blue-400 border border-blue-900/30'
                                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                                        }`}
                                    >
                                        {job.isActive ? 'Active' : 'Draft'}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                return handleOpenEditJobForm(job);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-900 transition-colors"
                                            aria-label="Edit job"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                // eslint-disable-next-line no-alert
                                                if (confirm('Are you sure you want to delete this job posting?')) {
                                                    deleteJobMutate(job._id);
                                                }
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-900 transition-colors"
                                            aria-label="Delete job"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <h4 className="text-white font-bold text-sm leading-tight mb-2">{job.title}</h4>
                                <p className="text-slate-500 text-[10px] uppercase font-semibold mb-2">
                                    {job.department} · {job.location} · {job.type}
                                </p>
                                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                                    {job.description}
                                </p>
                            </div>

                            <div className="border-t border-slate-900/60 pt-4 mt-auto">
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-600" />
                                        <span>{job.experience}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-medium">Posting Status</span>
                                    <button
                                        onClick={() => {
                                            return handleToggleJobStatus(job);
                                        }}
                                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                            job.isActive
                                                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                                        }`}
                                    >
                                        {job.isActive ? 'Deactivate' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans tracking-[-0.01em]">
            {/* NavHigh Admin Header */}
            <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <span className="font-bold text-base tracking-tight text-white block">NavHigh Admin</span>
                        <span className="text-[10px] text-slate-500 tracking-wider uppercase">
                            Internship Control Desk
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            return (window.location.href = '/');
                        }}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                        Visit Website
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Submissions</span>
                            <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-white leading-none">{stats.totalSubmissions}</div>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reviews</span>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-bold text-white leading-none">{stats.pendingReviews}</div>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Active Programs</span>
                            <Briefcase className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold text-white leading-none">{stats.activeCourses}</div>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Shortlisted Candidates
                            </span>
                            <UserCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold text-white leading-none">{stats.shortlisted}</div>
                    </div>
                </div>

                {/* Dashboard navigation tabs */}
                <div className="flex items-center border-b border-slate-900 mb-6 gap-2">
                    <button
                        onClick={() => {
                            return setActiveTab('applications');
                        }}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors relative ${
                            activeTab === 'applications'
                                ? 'text-blue-400 border-blue-500'
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                    >
                        Submissions
                    </button>
                    <button
                        onClick={() => {
                            return setActiveTab('courses');
                        }}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors relative ${
                            activeTab === 'courses'
                                ? 'text-blue-400 border-blue-500'
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                    >
                        Internship Courses
                    </button>
                    <button
                        onClick={() => {
                            return setActiveTab('careers');
                        }}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors relative ${
                            activeTab === 'careers'
                                ? 'text-blue-400 border-blue-500'
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                    >
                        Careers
                    </button>
                </div>

                {/* Applications Panel */}
                {activeTab === 'applications' && (
                    <div>
                        {/* Filters toolbar */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
                            <div className="relative w-full sm:w-80">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Search className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search applicants or courses..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        return setSearchQuery(e.target.value);
                                    }}
                                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-900 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <ListFilter className="w-4 h-4 text-slate-500" />
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            return setStatusFilter(e.target.value);
                                        }}
                                        className="appearance-none bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Shortlisted">Shortlisted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Applicants Table */}
                        {renderApplicationsContent()}
                    </div>
                )}

                {/* Courses Panel */}
                {activeTab === 'courses' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white font-bold text-base tracking-tight">Active Programs</h3>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    Manage internship cohorts listed on the landing page.
                                </p>
                            </div>
                            <button
                                onClick={handleOpenCreateForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" />
                                Add Program
                            </button>
                        </div>

                        {renderCoursesContent()}
                    </div>
                )}

                {/* Careers Panel */}
                {activeTab === 'careers' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white font-bold text-base tracking-tight">Open Job Postings</h3>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    Manage open full-time positions listed on the careers page.
                                </p>
                            </div>
                            <button
                                onClick={handleOpenCreateJobForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" />
                                Add Job Posting
                            </button>
                        </div>

                        {renderCareersContent()}
                    </div>
                )}
            </div>

            {/* Application Review Drawer Modal */}
            <AnimatePresence>
                {selectedApplication && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                return setSelectedApplication(null);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden z-10 p-6 md:p-8 text-xs text-slate-300"
                        >
                            <button
                                onClick={() => {
                                    return setSelectedApplication(null);
                                }}
                                className="absolute top-5 right-5 text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <span
                                    className={`inline-flex px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${getStatusColor(selectedApplication.status)}`}
                                >
                                    {selectedApplication.status}
                                </span>
                                <h3 className="text-white text-xl font-bold mt-2">{selectedApplication.fullName}</h3>
                                <p className="text-slate-500 mt-1">
                                    Applied for{' '}
                                    <strong>
                                        {selectedApplication.type === 'job'
                                            ? selectedApplication.positionTitle
                                            : selectedApplication.courseTitle}
                                    </strong>{' '}
                                    on {new Date(selectedApplication.appliedAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-900/40 rounded-2xl border border-slate-900">
                                <div>
                                    <span className="text-[10px] text-slate-500 block mb-0.5">Email Address</span>
                                    <span className="text-slate-200 font-semibold">{selectedApplication.email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block mb-0.5">Phone Number</span>
                                    <span className="text-slate-200 font-semibold">{selectedApplication.phone}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    Resume / Profile Info
                                </h4>
                                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-900 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {selectedApplication.resumeTextOrLink}
                                </div>
                            </div>

                            {selectedApplication.notes && (
                                <div className="mb-6">
                                    <h4 className="text-white font-bold text-sm mb-2">Notes from Candidate</h4>
                                    <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-900/60 leading-relaxed text-slate-400">
                                        {selectedApplication.notes}
                                    </div>
                                </div>
                            )}

                            {/* Status and Action notes */}
                            <div className="border-t border-slate-900 pt-6">
                                <h4 className="text-white font-bold text-sm mb-3">Update Application Status</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Reviewed', 'Shortlisted', 'Rejected'].map((status) => {
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    updateStatusMutate({
                                                        id: selectedApplication._id,
                                                        status: status as
                                                            | 'Pending'
                                                            | 'Reviewed'
                                                            | 'Shortlisted'
                                                            | 'Rejected',
                                                    });
                                                }}
                                                disabled={isUpdatingStatus}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                                                    selectedApplication.status === status
                                                        ? 'bg-blue-600 text-white border-transparent'
                                                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                                                }`}
                                            >
                                                {status === 'Reviewed' && <Clock className="w-3.5 h-3.5" />}
                                                {status === 'Shortlisted' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {status === 'Rejected' && <X className="w-3.5 h-3.5" />}
                                                Mark as {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Course Edit/Create Modal Modal */}
            <AnimatePresence>
                {showCourseForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!isSavingCourse) setShowCourseForm(false);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden z-10"
                        >
                            <button
                                onClick={() => {
                                    return setShowCourseForm(false);
                                }}
                                disabled={isSavingCourse}
                                className="absolute top-5 right-5 text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6 md:p-8 max-h-[90dvh] overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-white text-lg font-bold">
                                        {editingCourse ? 'Edit Internship Program' : 'Create Internship Program'}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Define the requirements, outline the syllabus, and publish to the landing page.
                                    </p>
                                </div>

                                {courseErrors.submit && (
                                    <div className="mb-4 p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl font-medium">
                                        {courseErrors.submit}
                                    </div>
                                )}

                                <form onSubmit={handleCourseSubmit} className="space-y-4 text-xs">
                                    {/* Program Title */}
                                    <div>
                                        <label
                                            htmlFor="courseTitle"
                                            className="block font-semibold text-slate-400 mb-1.5"
                                        >
                                            Program Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="courseTitle"
                                            value={courseForm.title}
                                            onChange={(e) => {
                                                setCourseForm((p) => {
                                                    return { ...p, title: e.target.value };
                                                });
                                                if (courseErrors.title) {
                                                    setCourseErrors((p) => {
                                                        return { ...p, title: '' };
                                                    });
                                                }
                                            }}
                                            disabled={isSavingCourse}
                                            placeholder="e.g., Full Stack Engineering Internship"
                                            className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                courseErrors.title ? 'border-red-500' : 'border-slate-800'
                                            }`}
                                        />
                                        {courseErrors.title && (
                                            <span className="text-red-400 text-[10px] mt-1 block">
                                                {courseErrors.title}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label
                                            htmlFor="courseDesc"
                                            className="block font-semibold text-slate-400 mb-1.5"
                                        >
                                            Program Description *
                                        </label>
                                        <textarea
                                            id="courseDesc"
                                            value={courseForm.description}
                                            onChange={(e) => {
                                                setCourseForm((p) => {
                                                    return { ...p, description: e.target.value };
                                                });
                                                if (courseErrors.description) {
                                                    setCourseErrors((p) => {
                                                        return { ...p, description: '' };
                                                    });
                                                }
                                            }}
                                            disabled={isSavingCourse}
                                            placeholder="Outline the goals of this internship cohort..."
                                            rows={3}
                                            className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                                                courseErrors.description ? 'border-red-500' : 'border-slate-800'
                                            }`}
                                        />
                                        {courseErrors.description && (
                                            <span className="text-red-400 text-[10px] mt-1 block">
                                                {courseErrors.description}
                                            </span>
                                        )}
                                    </div>

                                    {/* Duration and Stipend Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="courseDuration"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Duration *
                                            </label>
                                            <input
                                                type="text"
                                                id="courseDuration"
                                                value={courseForm.duration}
                                                onChange={(e) => {
                                                    setCourseForm((p) => {
                                                        return { ...p, duration: e.target.value };
                                                    });
                                                    if (courseErrors.duration) {
                                                        setCourseErrors((p) => {
                                                            return { ...p, duration: '' };
                                                        });
                                                    }
                                                }}
                                                disabled={isSavingCourse}
                                                placeholder="e.g., 3 Months"
                                                className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                    courseErrors.duration ? 'border-red-500' : 'border-slate-800'
                                                }`}
                                            />
                                            {courseErrors.duration && (
                                                <span className="text-red-400 text-[10px] mt-1 block">
                                                    {courseErrors.duration}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="courseStipend"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Stipend *
                                            </label>
                                            <input
                                                type="text"
                                                id="courseStipend"
                                                value={courseForm.stipend}
                                                onChange={(e) => {
                                                    setCourseForm((p) => {
                                                        return { ...p, stipend: e.target.value };
                                                    });
                                                    if (courseErrors.stipend) {
                                                        setCourseErrors((p) => {
                                                            return { ...p, stipend: '' };
                                                        });
                                                    }
                                                }}
                                                disabled={isSavingCourse}
                                                placeholder="e.g., $500/month or Unpaid"
                                                className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                    courseErrors.stipend ? 'border-red-500' : 'border-slate-800'
                                                }`}
                                            />
                                            {courseErrors.stipend && (
                                                <span className="text-red-400 text-[10px] mt-1 block">
                                                    {courseErrors.stipend}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dynamic Syllabus Topics */}
                                    <div>
                                        <label className="block font-semibold text-slate-400 mb-1.5">
                                            Syllabus Outline / Topics
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newTopic}
                                                onChange={(e) => {
                                                    return setNewTopic(e.target.value);
                                                }}
                                                disabled={isSavingCourse}
                                                placeholder="e.g., Next.js 16 Server Components"
                                                className="w-full text-xs px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTopic}
                                                className="bg-slate-900 border border-slate-800 text-slate-300 px-3.5 rounded-lg font-bold hover:bg-slate-800 hover:text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-slate-900/30 border border-slate-900">
                                            {courseForm.topics.length === 0 ? (
                                                <span className="text-slate-650 italic text-[10px] p-1">
                                                    No topics added yet.
                                                </span>
                                            ) : (
                                                courseForm.topics.map((t, idx) => {
                                                    return (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-900/30"
                                                        >
                                                            {t}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    return handleRemoveTopic(idx);
                                                                }}
                                                                className="text-blue-400/50 hover:text-blue-200"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Dynamic Requirements */}
                                    <div>
                                        <label className="block font-semibold text-slate-400 mb-1.5">
                                            Requirements
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newRequirement}
                                                onChange={(e) => {
                                                    return setNewRequirement(e.target.value);
                                                }}
                                                disabled={isSavingCourse}
                                                placeholder="e.g., Basic JavaScript & React knowledge"
                                                className="w-full text-xs px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddRequirement}
                                                className="bg-slate-900 border border-slate-800 text-slate-300 px-3.5 rounded-lg font-bold hover:bg-slate-800 hover:text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/30 border border-slate-900 min-h-[30px]">
                                            {courseForm.requirements.length === 0 ? (
                                                <span className="text-slate-650 italic text-[10px] p-1">
                                                    No requirements added yet.
                                                </span>
                                            ) : (
                                                courseForm.requirements.map((req, idx) => {
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-900 text-slate-300"
                                                        >
                                                            <span>{req}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    return handleRemoveRequirement(idx);
                                                                }}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Publish Status Toggle */}
                                    <div className="flex items-center gap-3 py-2 bg-slate-900/20 rounded-xl p-3 border border-slate-900">
                                        <input
                                            type="checkbox"
                                            id="courseIsActive"
                                            checked={courseForm.isActive}
                                            onChange={(e) => {
                                                return setCourseForm((p) => {
                                                    return { ...p, isActive: e.target.checked };
                                                });
                                            }}
                                            disabled={isSavingCourse}
                                            className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500/50 bg-slate-900 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="courseIsActive"
                                            className="font-semibold text-slate-300 cursor-pointer"
                                        >
                                            Publish to Public landing page immediately
                                        </label>
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-900">
                                        <button
                                            type="button"
                                            disabled={isSavingCourse}
                                            onClick={() => {
                                                return setShowCourseForm(false);
                                            }}
                                            className="px-5 py-2.5 rounded-xl border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 font-semibold transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSavingCourse}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {isSavingCourse ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Program'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Job Edit/Create Modal */}
            <AnimatePresence>
                {showJobForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!isSavingJob) setShowJobForm(false);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden z-10"
                        >
                            <button
                                onClick={() => {
                                    return setShowJobForm(false);
                                }}
                                disabled={isSavingJob}
                                className="absolute top-5 right-5 text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6 md:p-8 max-h-[90dvh] overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-white text-lg font-bold">
                                        {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Define the open role details and publish to the careers page.
                                    </p>
                                </div>

                                {jobErrors.submit && (
                                    <div className="mb-4 p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl font-medium">
                                        {jobErrors.submit}
                                    </div>
                                )}

                                <form onSubmit={handleJobSubmit} className="space-y-4 text-xs">
                                    {/* Job Title */}
                                    <div>
                                        <label htmlFor="jobTitle" className="block font-semibold text-slate-400 mb-1.5">
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="jobTitle"
                                            value={jobForm.title}
                                            onChange={(e) => {
                                                setJobForm((p) => {
                                                    return { ...p, title: e.target.value };
                                                });
                                                if (jobErrors.title) {
                                                    setJobErrors((p) => {
                                                        return { ...p, title: '' };
                                                    });
                                                }
                                            }}
                                            disabled={isSavingJob}
                                            placeholder="e.g., Senior Full Stack Engineer"
                                            className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                jobErrors.title ? 'border-red-500' : 'border-slate-800'
                                            }`}
                                        />
                                        {jobErrors.title && (
                                            <span className="text-red-400 text-[10px] mt-1 block">
                                                {jobErrors.title}
                                            </span>
                                        )}
                                    </div>

                                    {/* Department & Experience */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="jobDepartment"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Department *
                                            </label>
                                            <input
                                                type="text"
                                                id="jobDepartment"
                                                value={jobForm.department}
                                                onChange={(e) => {
                                                    setJobForm((p) => {
                                                        return { ...p, department: e.target.value };
                                                    });
                                                    if (jobErrors.department) {
                                                        setJobErrors((p) => {
                                                            return { ...p, department: '' };
                                                        });
                                                    }
                                                }}
                                                disabled={isSavingJob}
                                                placeholder="e.g., Engineering or Design"
                                                className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                    jobErrors.department ? 'border-red-500' : 'border-slate-800'
                                                }`}
                                            />
                                            {jobErrors.department && (
                                                <span className="text-red-400 text-[10px] mt-1 block">
                                                    {jobErrors.department}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="jobExperience"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Experience Needed *
                                            </label>
                                            <input
                                                type="text"
                                                id="jobExperience"
                                                value={jobForm.experience}
                                                onChange={(e) => {
                                                    setJobForm((p) => {
                                                        return { ...p, experience: e.target.value };
                                                    });
                                                    if (jobErrors.experience) {
                                                        setJobErrors((p) => {
                                                            return { ...p, experience: '' };
                                                        });
                                                    }
                                                }}
                                                disabled={isSavingJob}
                                                placeholder="e.g., 3+ Years"
                                                className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${
                                                    jobErrors.experience ? 'border-red-500' : 'border-slate-800'
                                                }`}
                                            />
                                            {jobErrors.experience && (
                                                <span className="text-red-400 text-[10px] mt-1 block">
                                                    {jobErrors.experience}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location & Type */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="jobLocation"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Location *
                                            </label>
                                            <input
                                                type="text"
                                                id="jobLocation"
                                                value={jobForm.location}
                                                onChange={(e) => {
                                                    return setJobForm((p) => {
                                                        return { ...p, location: e.target.value };
                                                    });
                                                }}
                                                disabled={isSavingJob}
                                                placeholder="e.g., Remote"
                                                className="w-full text-xs px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="jobType"
                                                className="block font-semibold text-slate-400 mb-1.5"
                                            >
                                                Job Type *
                                            </label>
                                            <input
                                                type="text"
                                                id="jobType"
                                                value={jobForm.type}
                                                onChange={(e) => {
                                                    return setJobForm((p) => {
                                                        return { ...p, type: e.target.value };
                                                    });
                                                }}
                                                disabled={isSavingJob}
                                                placeholder="e.g., Full-time"
                                                className="w-full text-xs px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="jobDesc" className="block font-semibold text-slate-400 mb-1.5">
                                            Job Description *
                                        </label>
                                        <textarea
                                            id="jobDesc"
                                            value={jobForm.description}
                                            onChange={(e) => {
                                                setJobForm((p) => {
                                                    return { ...p, description: e.target.value };
                                                });
                                                if (jobErrors.description) {
                                                    setJobErrors((p) => {
                                                        return { ...p, description: '' };
                                                    });
                                                }
                                            }}
                                            disabled={isSavingJob}
                                            placeholder="Detail the expectations and responsibilities of this role..."
                                            rows={3}
                                            className={`w-full text-xs px-4 py-2.5 bg-slate-900 border rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                                                jobErrors.description ? 'border-red-500' : 'border-slate-800'
                                            }`}
                                        />
                                        {jobErrors.description && (
                                            <span className="text-red-400 text-[10px] mt-1 block">
                                                {jobErrors.description}
                                            </span>
                                        )}
                                    </div>

                                    {/* Dynamic Requirements */}
                                    <div>
                                        <label className="block font-semibold text-slate-400 mb-1.5">
                                            Requirements
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newJobRequirement}
                                                onChange={(e) => {
                                                    return setNewJobRequirement(e.target.value);
                                                }}
                                                disabled={isSavingJob}
                                                placeholder="e.g., Expertise in TypeScript, React, Next.js"
                                                className="w-full text-xs px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddJobRequirement}
                                                className="bg-slate-900 border border-slate-800 text-slate-300 px-3.5 rounded-lg font-bold hover:bg-slate-800 hover:text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/30 border border-slate-900 min-h-[30px]">
                                            {jobForm.requirements.length === 0 ? (
                                                <span className="text-slate-650 italic text-[10px] p-1">
                                                    No requirements added yet.
                                                </span>
                                            ) : (
                                                jobForm.requirements.map((req, idx) => {
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-900 text-slate-300"
                                                        >
                                                            <span>{req}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    return handleRemoveJobRequirement(idx);
                                                                }}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Publish Status Toggle */}
                                    <div className="flex items-center gap-3 py-2 bg-slate-900/20 rounded-xl p-3 border border-slate-900">
                                        <input
                                            type="checkbox"
                                            id="jobIsActive"
                                            checked={jobForm.isActive}
                                            onChange={(e) => {
                                                return setJobForm((p) => {
                                                    return { ...p, isActive: e.target.checked };
                                                });
                                            }}
                                            disabled={isSavingJob}
                                            className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500/50 bg-slate-900 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="jobIsActive"
                                            className="font-semibold text-slate-300 cursor-pointer"
                                        >
                                            Publish to Careers page immediately
                                        </label>
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-900">
                                        <button
                                            type="button"
                                            disabled={isSavingJob}
                                            onClick={() => {
                                                return setShowJobForm(false);
                                            }}
                                            className="px-5 py-2.5 rounded-xl border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 font-semibold transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSavingJob}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {isSavingJob ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Job'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminModule;
