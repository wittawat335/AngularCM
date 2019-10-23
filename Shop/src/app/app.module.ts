import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/authen/register/register.component';
import { LoginComponent } from './components/authen/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StockHomeComponent } from './components/stock/stock-home/stock-home.component';
import { StockCreateComponent } from './components/stock/stock-create/stock-create.component';
import { StockEditComponent } from './components/stock/stock-edit/stock-edit.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ImagePipe } from './pipe/image.pipe';
import { ShopHomeComponent } from './components/shop/shop-home/shop-home.component';
import { ShopPayComponent } from './components/shop/shop-pay/shop-pay.component';
import { CustomPipe } from './pipe/custom.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { OrderComponent } from './components/order/order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog'; // Dialog

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    StockHomeComponent,
    StockCreateComponent,
    StockEditComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ImagePipe,
    ShopHomeComponent,
    ShopPayComponent,
    CustomPipe,
    OrderComponent,
    OrderListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule, // dialog
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      progressBar: true
    }) // ToastrModule added
  ],
  entryComponents:[OrderListComponent],  // components ที่จะให้เป็น modal
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
