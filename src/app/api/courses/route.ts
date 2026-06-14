import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Course } from '@/lib/models/course';

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const filter = includeInactive ? {} : { isActive: true };
        const courses = await Course.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(courses);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch courses';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, title, description, duration, stipend, requirements, topics, isActive } = body;

        if (id) {
            // Update
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                { title, description, duration, stipend, requirements, topics, isActive },
                { new: true, runValidators: true }
            );
            if (!updatedCourse) {
                return NextResponse.json({ error: 'Course not found' }, { status: 404 });
            }
            return NextResponse.json(updatedCourse);
        } else {
            // Create
            if (!title || !description || !duration || !stipend) {
                return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }
            const newCourse = new Course({
                title,
                description,
                duration,
                stipend,
                requirements: requirements || [],
                topics: topics || [],
                isActive: isActive !== undefined ? isActive : true,
            });
            await newCourse.save();
            return NextResponse.json(newCourse, { status: 201 });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to save course';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete course';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
