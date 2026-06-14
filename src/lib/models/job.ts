import mongoose, { Document, Schema } from 'mongoose';

export interface IJob {
    title: string;
    description: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    requirements: string[];
    isActive: boolean;
    createdAt: Date;
}

export interface IJobDocument extends IJob, Document {}

const JobSchema = new Schema<IJobDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Full-time' },
    experience: { type: String, required: true },
    requirements: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Job = (mongoose.models && mongoose.models.Job) || mongoose.model<IJobDocument>('Job', JobSchema);
