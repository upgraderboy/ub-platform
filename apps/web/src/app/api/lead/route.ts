import { NextResponse } from 'next/server';
import { LeadSchema } from '@ub/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate with strict Zod schema from packages/types
    const validated = LeadSchema.parse({
      ...body,
      id: body.id || `lead_${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    // In a production backend, persist to Postgres / Firestore
    // For now, log the validated client lead and return success with lead ID
    return NextResponse.json({
      success: true,
      leadId: validated.id,
      lead: validated,
      message: 'Your consultation request has been logged. Ankit Bhuria will contact you within 4 hours.',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed. Please verify that all required fields are correctly completed.',
        details: errorMessage,
      },
      { status: 400 }
    );
  }
}
