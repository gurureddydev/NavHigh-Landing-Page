import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/lib/models/application';
import { Course } from '@/lib/models/course';

export async function GET() {
    try {
        await connectToDatabase();
        const applications = await Application.find({}).sort({ appliedAt: -1 });
        return NextResponse.json(applications);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch applications';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { type = 'internship', courseId, positionTitle, fullName, email, phone, resumeTextOrLink, notes } = body;

        if (!fullName || !email || !phone || !resumeTextOrLink) {
            return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
        }

        if (type === 'job') {
            if (!positionTitle) {
                return NextResponse.json({ error: 'Missing position title' }, { status: 400 });
            }

            const newApplication = new Application({
                type: 'job',
                positionTitle,
                fullName,
                email,
                phone,
                resumeTextOrLink,
                notes,
            });

            await newApplication.save();
            return NextResponse.json(newApplication, { status: 201 });
        } else {
            // Default to internship
            if (!courseId) {
                return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
            }

            // Verify that the course exists
            const course = await Course.findById(courseId);
            if (!course) {
                return NextResponse.json({ error: 'Selected program not found' }, { status: 404 });
            }

            const newApplication = new Application({
                type: 'internship',
                courseId,
                courseTitle: course.title,
                fullName,
                email,
                phone,
                resumeTextOrLink,
                notes,
            });

            await newApplication.save();
            return NextResponse.json(newApplication, { status: 201 });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to submit application';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
