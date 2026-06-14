import type { Options } from 'ky';
import type {
    Application,
    Course,
    CreateCourseInput,
    SubmitApplicationInput,
    UpdateApplicationStatusInput,
} from './types';
import { http } from '@/lib/@http';

export const getCourses = async (options?: Options) => {
    const response = await http.get('api/courses', options);
    return response.json<Course[]>();
};

export const getAdminCourses = async (options?: Options) => {
    const response = await http.get('api/courses?includeInactive=true', options);
    return response.json<Course[]>();
};

export const saveCourse = async (data: CreateCourseInput, options?: Options) => {
    const response = await http.post<Course>('api/courses', {
        ...options,
        json: data,
    });
    return response.json<Course>();
};

export const deleteCourse = async (id: string, options?: Options) => {
    const response = await http.delete(`api/courses?id=${id}`, options);
    return response.json<{ message: string }>();
};

export const getApplications = async (options?: Options) => {
    const response = await http.get('api/applications', options);
    return response.json<Application[]>();
};

export const submitApplication = async (data: SubmitApplicationInput, options?: Options) => {
    const response = await http.post<Application>('api/applications', {
        ...options,
        json: data,
    });
    return response.json<Application>();
};

export const updateApplicationStatus = async (
    { id, status, notes }: UpdateApplicationStatusInput,
    options?: Options
) => {
    const response = await http.patch<Application>(`api/applications/${id}`, {
        ...options,
        json: { status, notes },
    });
    return response.json<Application>();
};
