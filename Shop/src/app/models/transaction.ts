import { OrderItem } from './order-item';
export class Transaction {
    total: number;
    paid: number;
    change; number;
    paymentType: string;
    paymentDetail: string;
    sellerId: string;
    buyerId: string;
    orderItem: OrderItem[];
}


