import type { Options } from 'ky';
import type { CreateJobInput, Job } from './types';
import { http } from '@/lib/@http';

export const getJobs = async (options?: Options) => {
    const response = await http.get('api/jobs', options);
    return response.json<Job[]>();
};

export const getAdminJobs = async (options?: Options) => {
    const response = await http.get('api/jobs?includeInactive=true', options);
    return response.json<Job[]>();
};

export const saveJob = async (data: CreateJobInput, options?: Options) => {
    const response = await http.post<Job>('api/jobs', {
        ...options,
        json: data,
    });
    return response.json<Job>();
};

export const deleteJob = async (id: string, options?: Options) => {
    const response = await http.delete(`api/jobs?id=${id}`, options);
    return response.json<{ message: string }>();
};
