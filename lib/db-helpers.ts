import { prisma } from './prisma';
import type { 
  User, 
  Request, 
  Payment, 
  Modification, 
  FollowUp,
  RequestStatus,
  PaymentMethod,
  PaymentStatus,
  ModificationStatus,
  FollowUpStatus
} from '@prisma/client';

// أنواع البيانات
export type { 
  User, 
  Request, 
  Payment, 
  Modification, 
  FollowUp,
  RequestStatus,
  PaymentMethod,
  PaymentStatus,
  ModificationStatus,
  FollowUpStatus
};

// دوال المستخدمين
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  return await prisma.user.create({
    data: userData
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserById(id: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      requests: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
  try {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  } catch {
    return null;
  }
}

export async function getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
  return await prisma.user.findMany({
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' }
  });
}

// دوال الطلبات
export async function createRequest(requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>): Promise<Request> {
  return await prisma.request.create({
    data: requestData
  });
}

export async function getRequestById(id: number): Promise<Request | null> {
  return await prisma.request.findUnique({
    where: { id },
    include: {
      user: true,
      payments: true,
      modifications: true,
      followUps: true
    }
  });
}

export async function getRequestsByUserId(userId: number): Promise<Request[]> {
  return await prisma.request.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      payments: true,
      modifications: true
    }
  });
}

export async function updateRequestStatus(id: number, status: RequestStatus): Promise<Request | null> {
  try {
    return await prisma.request.update({
      where: { id },
      data: { status }
    });
  } catch {
    return null;
  }
}

export async function getAllRequests(limit: number = 50, offset: number = 0): Promise<Request[]> {
  return await prisma.request.findMany({
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      payments: true
    }
  });
}

export async function getRequestsByStatus(status: RequestStatus, limit: number = 50): Promise<Request[]> {
  return await prisma.request.findMany({
    where: { status },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true
    }
  });
}

// دوال المدفوعات
export async function createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
  return await prisma.payment.create({
    data: paymentData
  });
}

export async function updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment | null> {
  try {
    return await prisma.payment.update({
      where: { id },
      data: { 
        paymentStatus: status,
        paymentDate: status === 'COMPLETED' ? new Date() : null
      }
    });
  } catch {
    return null;
  }
}

export async function getPaymentByRequestId(requestId: number): Promise<Payment | null> {
  return await prisma.payment.findFirst({
    where: { requestId }
  });
}

export async function getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
  return await prisma.payment.findMany({
    where: { paymentStatus: status },
    include: {
      request: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// دوال التعديلات
export async function createModification(modificationData: Omit<Modification, 'id' | 'requestedAt'>): Promise<Modification> {
  return await prisma.modification.create({
    data: modificationData
  });
}

export async function getModificationsByRequestId(requestId: number): Promise<Modification[]> {
  return await prisma.modification.findMany({
    where: { requestId },
    orderBy: { requestedAt: 'desc' }
  });
}

export async function updateModificationStatus(id: number, status: ModificationStatus): Promise<Modification | null> {
  try {
    return await prisma.modification.update({
      where: { id },
      data: { 
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });
  } catch {
    return null;
  }
}

// دوال متابعة المعاملات
export async function createFollowUp(followUpData: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'>): Promise<FollowUp> {
  return await prisma.followUp.create({
    data: followUpData
  });
}

export async function updateFollowUpVisitCount(id: number): Promise<FollowUp | null> {
  try {
    return await prisma.followUp.update({
      where: { id },
      data: {
        visitCount: {
          increment: 1
        }
      }
    });
  } catch {
    return null;
  }
}

export async function getFollowUpsByRequestId(requestId: number): Promise<FollowUp[]> {
  return await prisma.followUp.findMany({
    where: { requestId },
    orderBy: { createdAt: 'desc' }
  });
}

// دوال إحصائيات
export async function getDashboardStats() {
  const [
    totalUsers,
    totalRequests,
    pendingRequests,
    completedRequests,
    totalRevenue,
    totalPayments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.request.count(),
    prisma.request.count({ where: { status: 'PENDING' } }),
    prisma.request.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { amount: true }
    }),
    prisma.payment.count({ where: { paymentStatus: 'COMPLETED' } })
  ]);

  return {
    total_users: totalUsers,
    total_requests: totalRequests,
    pending_requests: pendingRequests,
    completed_requests: completedRequests,
    total_revenue: totalRevenue._sum.amount || 0,
    total_payments: totalPayments
  };
}

// دالة لإنشاء طلب كامل مع المستخدم
export async function createCompleteRequest(
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  requestData: Omit<Request, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ user: User; request: Request }> {
  return await prisma.$transaction(async (tx) => {
    // إنشاء المستخدم
    const user = await tx.user.create({
      data: userData
    });

    // إنشاء الطلب
    const request = await tx.request.create({
      data: {
        ...requestData,
        userId: user.id
      }
    });

    return { user, request };
  });
}

// دالة للبحث في الطلبات
export async function searchRequests(query: string, limit: number = 20): Promise<Request[]> {
  return await prisma.request.findMany({
    where: {
      OR: [
        { purpose: { contains: query, mode: 'insensitive' } },
        { recipient: { contains: query, mode: 'insensitive' } },
        { applicantName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true
    }
  });
}

// دالة لحذف طلب (مع جميع البيانات المرتبطة)
export async function deleteRequest(id: number): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      // حذف المدفوعات
      await tx.payment.deleteMany({
        where: { requestId: id }
      });

      // حذف التعديلات
      await tx.modification.deleteMany({
        where: { requestId: id }
      });

      // حذف متابعات المعاملات
      await tx.followUp.deleteMany({
        where: { requestId: id }
      });

      // حذف الطلب
      await tx.request.delete({
        where: { id }
      });
    });

    return true;
  } catch {
    return false;
  }
}
