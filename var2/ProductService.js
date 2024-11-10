import axios from 'axios';

class ProductService {
  async getProduct(productId) {
    const response = await axios.get(`https://api.example.com/products/${productId}`);
    return response.data;
  }
}

export default ProductService;
