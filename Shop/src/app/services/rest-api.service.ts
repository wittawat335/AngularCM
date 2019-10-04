import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { environment } from 'src/environments/environment';


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

  getOutOfStock(): Observable<ResponseOutOfStock> {
    return this.http.get<ResponseOutOfStock>(this.outOfStockURL);
  }

}
