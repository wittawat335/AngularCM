interface ProductResponse {
    result: Product[];
    message: string;
  }

class Product {
  ProductId: number;
  Name: string;
  Image: string;
  Stock: number;
  Price: number;
  CreateDate: string;
  }

interface ResponseProduct {
    result: Product;
    message: string;
  }

interface ResponseOutOfStock {
    out_of_stock_product: number;
    message: string;
  }



