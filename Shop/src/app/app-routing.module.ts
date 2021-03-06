import { OrderComponent } from './components/order/order.component';
import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authen/login/login.component';
import { RegisterComponent } from './components/authen/register/register.component';
import { StockHomeComponent } from './components/stock/stock-home/stock-home.component';
import { StockCreateComponent } from './components/stock/stock-create/stock-create.component';
import { StockEditComponent } from './components/stock/stock-edit/stock-edit.component';
import { CancelFormGuard } from './auth/cancel-form.guard';
import { ShopHomeComponent } from './components/shop/shop-home/shop-home.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'stock', component: StockHomeComponent , canActivate: [AuthGuard]},
  { path: 'stock/create', component: StockCreateComponent, canDeactivate: [CancelFormGuard] },
  { path: 'stock/:id', component: StockEditComponent, canDeactivate: [CancelFormGuard] },
  { path: 'shop', component: ShopHomeComponent,  canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent,  canActivate: [AuthGuard] },
  // { path: 'transaction', component: TransactionHomeComponent, canActivate: [AuthenGuard] },
  // { path: 'transaction/detail/:id', component: TransactionDetailComponent },
  // { path: 'report', component: ReportComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }  // for page not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
