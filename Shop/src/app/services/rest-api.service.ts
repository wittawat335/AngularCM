import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private hostURL = environment.baseAPIURL;
  private apiURL = `${this.hostURL}/api`;
  // -----------------------------------------------------
  private loginURL = `${this.apiURL}/user/login`;
  private registerURL = `${this.apiURL}/user/register`;
  private productURL = `${this.apiURL}/product`;
  private productImageURL = `${this.apiURL}/product/images`;
  private outOfStockURL = `${this.productURL}/count/out_of_stock`;
  private transactionURL = `${this.apiURL}/transaction`;
  private userURL = `${this.apiURL}/user/GetUserByClaim`;
  orderTransaction: Transaction;

  constructor(private http: HttpClient) { }
  login(data): Observable<Login> {
    return this.http.post<Login>(this.loginURL, data, { headers: this.headers });
  }

  regsiter(data): Observable<Register> {
    return this.http.post<Register>(this.registerURL, data, { headers: this.headers });
  }

  isLoggedIn(): boolean {
    const authenInfo = JSON.parse(
      localStorage.getItem(environment.keyLocalAuthenInfo)
    );
    return authenInfo != null;
  }

  getUser(){
    return this.http.get<Login>(this.userURL);
  }

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.productURL);
  }

  getProductImage(name: string): Observable<Blob> {
    return this.http.get(`${this.productImageURL}/${name}`, { responseType : 'blob'});
  }

  getOutOfStock(): Observable<ResponseOutOfStock> {
    return this.http.get<ResponseOutOfStock>(this.outOfStockURL);
  }

  deleteProduct(id: number): Observable<ResponseProduct> {
    return this.http.delete<ResponseProduct>(`${this.productURL}/${id}`);
  }

  searchProducts(keyword: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.productURL}/search/name?keyword=${keyword}`);
  }


  getProduct(id: number): Observable<ResponseProduct> {
    return this.http.get<ResponseProduct>(`${this.productURL}/${id}`);
  }

  // form data
  editProduct(id: number, formData): Observable<ResponseProduct> {
    return this.http.put<ResponseProduct>(`${this.productURL}/${id}`, this.makeFormData(formData));
  }

  addProduct(formData): Observable<ResponseProduct> {
    return this.http.post<ResponseProduct>(`${this.productURL}`, this.makeFormData(formData));
  }
  makeFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append('name', product.Name);
    formData.append('price', product.Price.toString());
    formData.append('stock', product.Stock.toString());
    formData.append('upload_file', product.Image);
    return formData;
  }

  addTransaction(transaction) {
    return this.http.post(this.transactionURL, transaction);
  }

}
