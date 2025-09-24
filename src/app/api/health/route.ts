import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // اختبار الاتصال بقاعدة البيانات
    console.log('Testing database connection...');
    const dbTest = await prisma.$queryRaw`SELECT NOW() as current_time`;
    const dbTime = (dbTest as any)[0]?.current_time;
    const dbResponseTime = Date.now() - startTime;
    
    console.log('Database connection successful');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        time: dbTime,
        responseTime: `${dbResponseTime}ms`,
        url: process.env.DATABASE_URL ? 'configured' : 'missing'
      },
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: errorMessage,
          url: process.env.DATABASE_URL ? 'configured' : 'missing'
        },
        environment: process.env.NODE_ENV || 'development',
        vercel: {
          region: process.env.VERCEL_REGION || 'unknown',
          url: process.env.VERCEL_URL || 'unknown'
        }
      },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
