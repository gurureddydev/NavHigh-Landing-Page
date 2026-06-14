export interface Job {
    _id: string;
    title: string;
    description: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    requirements: string[];
    isActive: boolean;
    createdAt: string;
}

export interface CreateJobInput {
    id?: string;
    title: string;
    description: string;
    department: string;
    location?: string;
    type?: string;
    experience: string;
    requirements: string[];
    isActive?: boolean;
}
