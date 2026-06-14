import type { UseMutationOptions } from '@tanstack/react-query';
import type { BaseErrorData } from '@/lib/@http';
import type {
    Application,
    Course,
    CreateCourseInput,
    SubmitApplicationInput,
    UpdateApplicationStatusInput,
} from './types';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeyFactory } from '@/services/@queryKeyFactory';
import {
    deleteCourse,
    getAdminCourses,
    getApplications,
    getCourses,
    saveCourse,
    submitApplication,
    updateApplicationStatus,
} from './api';

const coursesQueryKey = queryKeyFactory('courses');

export const getCoursesQueryOptions = () => {
    return queryOptions({
        queryKey: coursesQueryKey('getCourses'),
        queryFn({ signal }) {
            return getCourses({ signal });
        },
    });
};

export const getAdminCoursesQueryOptions = () => {
    return queryOptions({
        queryKey: coursesQueryKey('getAdminCourses'),
        queryFn({ signal }) {
            return getAdminCourses({ signal });
        },
    });
};

export const saveCourseMutationOptions = (
    options?: Omit<UseMutationOptions<Course, BaseErrorData, CreateCourseInput, unknown>, 'mutationKey' | 'mutationFn'>
) => {
    return mutationOptions({
        ...options,
        mutationKey: coursesQueryKey('saveCourse'),
        mutationFn(data) {
            return saveCourse(data);
        },
    });
};

export const deleteCourseMutationOptions = (
    options?: Omit<
        UseMutationOptions<{ message: string }, BaseErrorData, string, unknown>,
        'mutationKey' | 'mutationFn'
    >
) => {
    return mutationOptions({
        ...options,
        mutationKey: coursesQueryKey('deleteCourse'),
        mutationFn(id) {
            return deleteCourse(id);
        },
    });
};

export const getApplicationsQueryOptions = () => {
    return queryOptions({
        queryKey: coursesQueryKey('getApplications'),
        queryFn({ signal }) {
            return getApplications({ signal });
        },
    });
};

export const submitApplicationMutationOptions = (
    options?: Omit<
        UseMutationOptions<Application, BaseErrorData, SubmitApplicationInput, unknown>,
        'mutationKey' | 'mutationFn'
    >
) => {
    return mutationOptions({
        ...options,
        mutationKey: coursesQueryKey('submitApplication'),
        mutationFn(data) {
            return submitApplication(data);
        },
    });
};

export const updateApplicationStatusMutationOptions = (
    options?: Omit<
        UseMutationOptions<Application, BaseErrorData, UpdateApplicationStatusInput, unknown>,
        'mutationKey' | 'mutationFn'
    >
) => {
    return mutationOptions({
        ...options,
        mutationKey: coursesQueryKey('updateApplicationStatus'),
        mutationFn(data) {
            return updateApplicationStatus(data);
        },
    });
};
