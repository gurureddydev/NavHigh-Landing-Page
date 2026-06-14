import type { UseMutationOptions } from '@tanstack/react-query';
import type { BaseErrorData } from '@/lib/@http';
import type { CreateJobInput, Job } from './types';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeyFactory } from '@/services/@queryKeyFactory';
import { deleteJob, getAdminJobs, getJobs, saveJob } from './api';

const jobsQueryKey = queryKeyFactory('jobs');

export const getJobsQueryOptions = () => {
    return queryOptions({
        queryKey: jobsQueryKey('getJobs'),
        queryFn({ signal }) {
            return getJobs({ signal });
        },
    });
};

export const getAdminJobsQueryOptions = () => {
    return queryOptions({
        queryKey: jobsQueryKey('getAdminJobs'),
        queryFn({ signal }) {
            return getAdminJobs({ signal });
        },
    });
};

export const saveJobMutationOptions = (
    options?: Omit<UseMutationOptions<Job, BaseErrorData, CreateJobInput, unknown>, 'mutationKey' | 'mutationFn'>
) => {
    return mutationOptions({
        ...options,
        mutationKey: jobsQueryKey('saveJob'),
        mutationFn(data) {
            return saveJob(data);
        },
    });
};

export const deleteJobMutationOptions = (
    options?: Omit<
        UseMutationOptions<{ message: string }, BaseErrorData, string, unknown>,
        'mutationKey' | 'mutationFn'
    >
) => {
    return mutationOptions({
        ...options,
        mutationKey: jobsQueryKey('deleteJob'),
        mutationFn(id) {
            return deleteJob(id);
        },
    });
};
