import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // تحديد الفترة الزمنية
    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // جلب الإحصائيات الأساسية
    const [
      totalRequests,
      completedRequests,
      pendingRequests,
      totalRevenue,
      totalEmployees,
      activeEmployees
    ] = await Promise.all([
      prisma.request.count(),
      prisma.request.count({ where: { status: 'COMPLETED' } }),
      prisma.request.count({ where: { status: 'PENDING' } }),
      prisma.payment.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.employee.count(),
      prisma.employee.count({ where: { isActive: true } })
    ]);

    // جلب الإيرادات الشهرية
    let monthlyRevenue: any[] = [];
    try {
      monthlyRevenue = await prisma.payment.groupBy({
        by: ['createdAt'],
        where: {
          paymentStatus: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      } as any);
    } catch (error) {
      console.error('خطأ في جلب الإيرادات الشهرية:', error);
    }

    // جلب الطلبات حسب الحالة
    let requestsByStatus: any[] = [];
    try {
      requestsByStatus = await prisma.payment.groupBy({
        by: ['paymentStatus'],
        _count: true
      } as any);
    } catch (error) {
      console.error('خطأ في جلب الطلبات حسب الحالة:', error);
    }

    // جلب الطلبات حسب القسم (من الموظفين المسؤولين)
    let requestsByDepartment = [];
    try {
      requestsByDepartment = await prisma.request.groupBy({
        by: ['assignedToId'],
        where: { assignedToId: { not: null } },
        _count: { id: true }
      });
    } catch (error) {
      console.log('لا توجد طلبات مسندة في قاعدة البيانات');
      requestsByDepartment = [];
    }

    // جلب أفضل الموظفين
    let topEmployees: any[] = [];
    try {
      topEmployees = await prisma.employee.findMany({
        where: {
          isActive: true
        },
        include: {
          _count: {
            select: {
              assignedRequests: true
            }
          }
        },
        orderBy: {
          assignedRequests: {
            _count: 'desc'
          }
        },
        take: 5
      });
    } catch (error) {
      console.error('خطأ في جلب أفضل الموظفين:', error);
    }

    // تنسيق البيانات
    const formattedStats = {
      totalRequests,
      completedRequests,
      pendingRequests,
      totalRevenue: totalRevenue._sum.amount ? Number(totalRevenue._sum.amount) : 0,
      totalEmployees,
      activeEmployees,
      completionRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0,
      averageRevenue: totalRequests > 0 ? Math.round((totalRevenue._sum.amount ? Number(totalRevenue._sum.amount) : 0) / totalRequests) : 0,
      
      monthlyRevenue: monthlyRevenue.map((item: any) => ({
        month: item.createdAt.toISOString().slice(0, 7), // YYYY-MM
        amount: Number(item._sum.amount || 0)
      })),
      
      requestsByStatus: requestsByStatus.map((item: any) => ({
        status: item.paymentStatus === 'COMPLETED' ? 'مكتمل' :
                item.paymentStatus === 'IN_PROGRESS' ? 'قيد المعالجة' :
                item.paymentStatus === 'PENDING' ? 'معلق' :
                item.paymentStatus === 'CANCELLED' ? 'ملغي' : 'مكتمل',
        count: item._count.id
      })),
      
      topEmployees: topEmployees.map((employee: any) => ({
        name: `${employee.firstName} ${employee.lastName}`,
        requests: employee._count.assignedRequests || 0,
        revenue: 0 // سيتم حساب الإيرادات لاحقاً إذا لزم الأمر
      }))
    };

    return NextResponse.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب الإحصائيات',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
