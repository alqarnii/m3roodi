import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // This is a simple status check - in a real implementation,
    // you might want to check actual cron job status from your hosting provider
    const isRunning = true; // Assume it's running if the API is accessible
    const lastRun = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: {
        isRunning,
        lastRun,
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next 24 hours
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Error checking cron status:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في فحص حالة النظام'
    }, { status: 500 });
  }
}
