import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function manualWebhook() {
  try {
    console.log('Manually triggering webhook for RF70...');
    
    // First, let's check if we can find the request
    const request = await prisma.request.findUnique({
      where: { id: 70 },
      include: { user: true }
    });
    
    if (!request) {
      console.log('Request 70 not found');
      return;
    }
    
    console.log('Request found:', request.purpose, 'for user:', request.user?.email);
    
    // Now let's manually call the webhook endpoint
    const webhookData = {
      status: 'CAPTURED',
      reference: { 
        transaction: 'RF70' 
      },
      metadata: {
        orderNumber: 'RF70',
        requestType: 'new_request',
        customerName: request.applicantName,
        customerEmail: request.user?.email || 'sara4ksa@gmail.com',
        purpose: request.purpose,
        recipient: request.recipient,
        applicantName: request.applicantName,
        phone: request.phone,
        idNumber: request.idNumber,
        attachments: request.attachments,
        voiceRecordingUrl: request.voiceRecordingUrl,
        description: request.description,
        existingRequestId: request.id.toString()
      }
    };
    
    console.log('Sending webhook data:', JSON.stringify(webhookData, null, 2));
    
    // Call the webhook endpoint
    const response = await fetch('http://localhost:3000/api/payment-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Webhook response:', result);
      
      // Check if payment was created
      setTimeout(async () => {
        const payment = await prisma.payment.findFirst({
          where: { transactionId: 'RF70' }
        });
        
        if (payment) {
          console.log('Payment created successfully:', payment);
        } else {
          console.log('No payment found after webhook');
        }
      }, 2000);
      
    } else {
      console.log('Webhook failed:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('Error in manual webhook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

manualWebhook();
