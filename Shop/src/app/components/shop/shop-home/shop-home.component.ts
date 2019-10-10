import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ProductForm } from 'src/app/models/product-view-model';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.css']
})
export class ShopHomeComponent implements OnInit {

  constructor(private restService: RestApiService) { }

  mProductArray = new Array<Product>();
  mOrderArray = new Array<ProductForm>();
  mTotalPrice = 0;
  mIsPaymentShow = false;

  ngOnInit() {
    this.feedData();
  }

  feedData(){
    this.restService.getProducts().subscribe(
      data => {
        // console.log(JSON.stringify(data.result));
        this.mProductArray = data.result;
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  isSelectedItem(item: ProductForm) {
    return this.mOrderArray.indexOf(item) === -1 ? false : true;
  }

  onClickAddOrder(item: ProductForm) {
    const foundIndex = this.mOrderArray.indexOf(item);

    if (foundIndex === -1) {
      item.Qty = 1;
      this.mOrderArray.unshift(item);
    } else {
      item.Qty++;
    }
    this.countSumPrice();
  }

  countSumPrice() {
    this.mTotalPrice = 0;
    for (const item of this.mOrderArray) {
      this.mTotalPrice += item.Price * item.Qty;
    }
  }

  onClickRemoveOrder(item: ProductForm) {
    this.mOrderArray.splice(this.mOrderArray.indexOf(item), 1);
    this.countSumPrice();
  }

  onClickPayment() {
    if (this.mTotalPrice > 0) {
      this.mIsPaymentShow = !this.mIsPaymentShow;
    } else {
      alert('At least single order is requied!');
    }
  }

  clear(){
    this.mIsPaymentShow = false;
    this.mOrderArray = new Array<ProductForm>();
    this.mProductArray = new Array<Product>();
    this.mTotalPrice = 0;
    this.feedData();
  }

}
