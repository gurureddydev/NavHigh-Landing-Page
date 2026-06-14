import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/lib/models/job';

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const filter = includeInactive ? {} : { isActive: true };
        const jobs = await Job.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(jobs);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, title, description, department, location, type, experience, requirements, isActive } = body;

        if (id) {
            // Update
            const updatedJob = await Job.findByIdAndUpdate(
                id,
                { title, description, department, location, type, experience, requirements, isActive },
                { new: true, runValidators: true }
            );
            if (!updatedJob) {
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }
            return NextResponse.json(updatedJob);
        } else {
            // Create
            if (!title || !description || !department || !experience) {
                return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }
            const newJob = new Job({
                title,
                description,
                department,
                location: location || 'Remote',
                type: type || 'Full-time',
                experience,
                requirements: requirements || [],
                isActive: isActive !== undefined ? isActive : true,
            });
            await newJob.save();
            return NextResponse.json(newJob, { status: 201 });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to save job';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete job';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
