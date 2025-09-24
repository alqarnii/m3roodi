import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRequest70() {
  try {
    console.log('Checking Request ID 70...');
    
    const request = await prisma.request.findUnique({
      where: { id: 70 },
      include: {
        user: true,
        payments: true
      }
    });
    
    if (request) {
      console.log('Request found:');
      console.log('ID:', request.id);
      console.log('Purpose:', request.purpose);
      console.log('Status:', request.status);
      console.log('Created:', request.createdAt);
      console.log('User:', request.user ? `${request.user.firstName} ${request.user.lastName} (${request.user.email})` : 'No user');
      console.log('Payments count:', request.payments.length);
      
      if (request.payments.length > 0) {
        request.payments.forEach(payment => {
          console.log('Payment:', payment);
        });
      } else {
        console.log('No payments found for this request');
      }
    } else {
      console.log('Request 70 not found');
    }
    
  } catch (error) {
    console.error('Error checking request:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRequest70();
