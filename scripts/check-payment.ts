import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPayment() {
  try {
    console.log('Checking payment for order RF70...');
    
    // Check payments table
    const payments = await prisma.payment.findMany({
      where: {
        transactionId: 'RF70'
      },
      include: {
        request: {
          include: {
            user: true
          }
        }
      }
    });
    
    console.log('Payments found:', payments.length);
    payments.forEach(payment => {
      console.log('Payment ID:', payment.id);
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
    
    // Check requests table
    const requests = await prisma.request.findMany({
      where: {
        id: {
          in: payments.map(p => p.requestId)
        }
      }
    });
    
    console.log('Requests found:', requests.length);
    requests.forEach(request => {
      console.log('Request ID:', request.id);
      console.log('Purpose:', request.purpose);
      console.log('Status:', request.status);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking payment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPayment();
