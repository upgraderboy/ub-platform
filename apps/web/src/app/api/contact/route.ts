import { NextResponse } from 'next/server';
import { ContactFormSchema } from '@ub/types';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validated = ContactFormSchema.parse(body);

    // In production, persist to Supabase / send notification email
    // For now, validate and return success
    return NextResponse.json({
      success: true,
      message:
        'Thank you for reaching out! Ankit will get back to you within 4 hours.',
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: 'Please check your form fields and try again.',
        details: errorMessage,
      },
      { status: 400 },
    );
  }
}
