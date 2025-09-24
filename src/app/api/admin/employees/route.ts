import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};
    
    if (filter === 'active') {
      where.isActive = true;
    } else if (filter === 'inactive') {
      where.isActive = false;
    } else if (filter !== 'all') {
      where.role = filter;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }

    // جلب الموظفين مع إحصائيات الطلبات
    const [employees, totalCount] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          _count: {
            select: {
              assignedRequests: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.employee.count({ where })
    ]);

    // تنسيق البيانات للعرض
    const formattedEmployees = employees.map((employee: any) => ({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      idNumber: employee.idNumber,
      position: employee.position,
      department: employee.department,
      role: employee.role === 'ADMIN' ? 'مدير' : 
            employee.role === 'MANAGER' ? 'مدير' :
            employee.role === 'STAFF' ? 'موظف' : 'وكيل',
      isActive: employee.isActive,
      hireDate: employee.hireDate.toISOString().split('T')[0],
      salary: employee.salary ? Number(employee.salary) : null,
      createdAt: employee.createdAt.toISOString().split('T')[0],
      assignedRequests: employee._count.assignedRequests,
      username: employee.username || '',
      canAccessAdmin: employee.canAccessAdmin || false
    }));

    return NextResponse.json({
      success: true,
      data: formattedEmployees,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الموظفين:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب الموظفين',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      idNumber, 
      position, 
      department, 
      role = 'STAFF',
      salary,
      username,
      password,
      canAccessAdmin = false
    } = body;

    // التحقق من البيانات المطلوبة
    if (!firstName || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'الاسم واسم المستخدم وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار اسم المستخدم
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        username
      }
    });

    if (existingEmployee) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء موظف جديد
    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName: lastName || '',
        email: email || null,
        phone: phone || null,
        idNumber: idNumber || null,
        position: position || null,
        department: department || null,
        role: role === 'مدير' ? 'ADMIN' : 
              role === 'موظف' ? 'STAFF' : 'AGENT',
        salary: salary ? parseFloat(salary) : null,
        isActive: true,
        username,
        password,
        canAccessAdmin
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الموظف بنجاح',
      data: {
        id: newEmployee.id,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        position: newEmployee.position,
        department: newEmployee.department,
        role: newEmployee.role === 'ADMIN' ? 'مدير' : 
              newEmployee.role === 'STAFF' ? 'موظف' : 'وكيل',
        isActive: newEmployee.isActive,
        username: newEmployee.username,
        canAccessAdmin: newEmployee.canAccessAdmin
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء الموظف:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في إنشاء الموظف',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      employeeId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      position, 
      department, 
      role, 
      salary, 
      isActive 
    } = body;

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: 'معرف الموظف مطلوب' },
        { status: 400 }
      );
    }

    // تحديث بيانات الموظف
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        role: role === 'مدير' ? 'ADMIN' : 
              role === 'موظف' ? 'STAFF' : 'AGENT',
        salary: salary ? parseFloat(salary) : null,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الموظف بنجاح',
      data: {
        id: updatedEmployee.id,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        email: updatedEmployee.email,
        position: updatedEmployee.position,
        department: updatedEmployee.department,
        role: updatedEmployee.role === 'ADMIN' ? 'مدير' : 
              updatedEmployee.role === 'STAFF' ? 'موظف' : 'وكيل',
        isActive: updatedEmployee.isActive
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الموظف:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في تحديث الموظف',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('id');

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: 'معرف الموظف مطلوب' },
        { status: 400 }
      );
    }

    // حذف الموظف
    await prisma.employee.delete({
      where: { id: parseInt(employeeId) }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الموظف بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف الموظف:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في حذف الموظف',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
