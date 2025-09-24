import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecentPayments() {
  try {
    console.log('Checking recent payments...');
    
    // Check all payments
    const allPayments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        request: {
          include: {
            user: true
          }
        }
      }
    });
    
    console.log('Total payments found:', allPayments.length);
    allPayments.forEach(payment => {
      console.log('Payment ID:', payment.id);
      console.log('Transaction ID:', payment.transactionId);
      console.log('Status:', payment.paymentStatus);
      console.log('Amount:', payment.amount);
      console.log('Date:', payment.paymentDate);
      console.log('Request ID:', payment.requestId);
      if (payment.request) {
        console.log('Request Purpose:', payment.request.purpose);
        console.log('Request Status:', payment.request.status);
      }
      console.log('---');
    });
    
    // Check all requests
    const allRequests = await prisma.request.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    console.log('Total requests found:', allRequests.length);
    allRequests.forEach(request => {
      console.log('Request ID:', request.id);
      console.log('Purpose:', request.purpose);
      console.log('Status:', request.status);
      console.log('Created:', request.createdAt);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPayments();
