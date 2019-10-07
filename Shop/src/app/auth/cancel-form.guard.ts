import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CancelFormGuard implements CanDeactivate<any> {
  constructor( private readonly location: Location,private readonly router: Router){}

  // tslint:disable-next-line:max-line-length
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // Logic
    if (!component.mIsSubmitted) {
     // mIsSubmitted is status submit of StockCreateComponent, StockEditComponent
     // Fix wrong route history error
     const currentUrlTree = this.router.createUrlTree([], currentRoute);
     const currentUrl = currentUrlTree.toString();
     this.location.go(currentUrl);
     return window.confirm('Are you sure?');
   }
    return true;
   }

}
