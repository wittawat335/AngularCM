import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderItems: OrderItem[];
  private hostURL = environment.baseAPIURL;
  private apiURL = `${this.hostURL}/api`;
  private transactionURL = `${this.apiURL}/Transaction`;

  constructor(private http: HttpClient) { }

  getOrderList() {
    return this.http.get(this.transactionURL).toPromise();
  }
}
