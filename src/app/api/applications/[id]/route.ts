import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/lib/models/application';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
    try {
        await connectToDatabase();
        const { id } = await context.params;
        const body = await request.json();
        const { status, notes } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        const updateData: { status: string; notes?: string } = { status };
        if (notes !== undefined) {
            updateData.notes = notes;
        }

        const updatedApplication = await Application.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json(updatedApplication);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update application';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
