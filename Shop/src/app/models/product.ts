interface ProductResponse {
    result: Product[];
    message: string;
  }

class Product {
  productId: number;
  name: string;
  image: string;
  stock: number;
  price: number;
  createDate: string;
  }

interface ResponseProduct {
    result: Product;
    message: string;
  }

interface ResponseOutOfStock {
    out_of_stock_product: number;
    message: string;
  }



