export interface Course {
    _id: string;
    title: string;
    description: string;
    duration: string;
    stipend: string;
    requirements: string[];
    topics: string[];
    isActive: boolean;
    createdAt: string;
}

export interface Application {
    _id: string;
    courseId?: string;
    courseTitle?: string;
    positionTitle?: string;
    type: 'internship' | 'job';
    fullName: string;
    email: string;
    phone: string;
    resumeTextOrLink: string;
    notes?: string;
    status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
    appliedAt: string;
}

export interface CreateCourseInput {
    id?: string;
    title: string;
    description: string;
    duration: string;
    stipend: string;
    requirements: string[];
    topics: string[];
    isActive?: boolean;
}

export interface SubmitApplicationInput {
    courseId?: string;
    positionTitle?: string;
    type: 'internship' | 'job';
    fullName: string;
    email: string;
    phone: string;
    resumeTextOrLink: string;
    notes?: string;
}

export interface UpdateApplicationStatusInput {
    id: string;
    status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
    notes?: string;
}
