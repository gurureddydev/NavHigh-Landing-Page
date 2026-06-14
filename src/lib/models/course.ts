import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse {
    title: string;
    description: string;
    duration: string;
    stipend: string;
    requirements: string[];
    topics: string[];
    isActive: boolean;
    createdAt: Date;
}

export interface ICourseDocument extends ICourse, Document {}

const CourseSchema = new Schema<ICourseDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    stipend: { type: String, required: true },
    requirements: { type: [String], default: [] },
    topics: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Course =
    (mongoose.models && mongoose.models.Course) || mongoose.model<ICourseDocument>('Course', CourseSchema);
