import ProductService from './ProductService.js';
import PaymentService from './PaymentService.js';

class OrderService {
  constructor() {
    this.productService = new ProductService();
    this.paymentService = new PaymentService();
  }

  async createOrder(productId, quantity) {
    let productData = this.cache[productId];
    if (!productData) {
      productData = await this.productService.getProduct(productId);
      this.cache[productId] = productData;
    }
    const totalPrice = productData.price * quantity;
    const paymentResult = await this.paymentService.processPayment(productId, totalPrice);
    return {
      productId,
      quantity,
      totalPrice,
      paymentStatus: paymentResult.status,
      transactionId: paymentResult.transactionId,
    };
  }
}

export default OrderService;
