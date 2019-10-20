import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RestApiService } from '../services/rest-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private restService: RestApiService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Logic
    if(localStorage.getItem(environment.keyLocalAuthenInfo) != null){
      if (this.restService.isLoggedIn()) {
        return true;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

}
