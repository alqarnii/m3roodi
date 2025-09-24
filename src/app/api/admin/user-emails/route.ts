import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    // Get all users (with or without requests)
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        requests: {
          select: {
            id: true,
            purpose: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    // Get all requests (including those without user accounts)
    const allRequests = await prisma.request.findMany({
      select: {
        id: true,
        applicantName: true,
        phone: true,
        purpose: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format user emails
    const userEmails = allUsers.map(user => ({
      id: `user-${user.id}`,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone,
      type: 'user' as const,
      lastRequest: user.requests[0] ? {
        id: user.requests[0].id,
        purpose: user.requests[0].purpose,
        status: user.requests[0].status,
        createdAt: user.requests[0].createdAt
      } : null
    }));

    // Format request emails (excluding duplicates with users)
    const userEmailSet = new Set(allUsers.map(user => user.email));
    const requestEmails = allRequests
      .filter(request => request.user?.email && !userEmailSet.has(request.user.email))
      .map(request => ({
        id: `request-${request.id}`,
        email: request.user!.email,
        name: request.applicantName || 'غير محدد',
        phone: request.phone || '',
        type: 'request' as const,
        lastRequest: {
          id: request.id,
          purpose: request.purpose,
          status: request.status,
          createdAt: request.createdAt
        }
      }));

    // Combine and sort all emails
    const allEmails = [...userEmails, ...requestEmails].sort((a, b) => {
      // Sort by name if available, otherwise by email
      const nameA = a.name !== 'غير محدد' ? a.name : a.email;
      const nameB = b.name !== 'غير محدد' ? b.name : b.email;
      return nameA.localeCompare(nameB, 'ar');
    });

    return NextResponse.json({
      success: true,
      data: allEmails
    });

  } catch (error) {
    console.error('Error fetching user emails:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب قائمة البريد الإلكتروني'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
