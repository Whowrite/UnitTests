class PaymentService {
    async processPayment(orderId, amount) {
      console.log(`Processing payment for Order ID: ${orderId}, Amount: ${amount}`);
      return { status: 'success', transactionId: `txn-${Math.random().toString(36).substring(2)}` };
    }
  }
  
  export default PaymentService;
  