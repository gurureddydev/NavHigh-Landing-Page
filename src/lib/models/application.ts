import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication {
    courseId?: Types.ObjectId;
    courseTitle?: string;
    positionTitle?: string;
    type: 'internship' | 'job';
    fullName: string;
    email: string;
    phone: string;
    resumeTextOrLink: string;
    notes?: string;
    status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
    appliedAt: Date;
}

export interface IApplicationDocument extends IApplication, Document {}

const ApplicationSchema = new Schema<IApplicationDocument>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: false },
    courseTitle: { type: String, required: false },
    positionTitle: { type: String, required: false },
    type: {
        type: String,
        enum: ['internship', 'job'],
        default: 'internship',
        required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeTextOrLink: { type: String, required: true },
    notes: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
        default: 'Pending',
    },
    appliedAt: { type: Date, default: Date.now },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Application =
    (mongoose.models && mongoose.models.Application) ||
    mongoose.model<IApplicationDocument>('Application', ApplicationSchema);
