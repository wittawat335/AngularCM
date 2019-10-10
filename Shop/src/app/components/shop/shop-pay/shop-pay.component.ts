import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-pay',
  templateUrl: './shop-pay.component.html',
  styleUrls: ['./shop-pay.component.css']
})
export class ShopPayComponent implements OnInit {

  // tslint:disable-next-line:ban-types
  @Input() orderPayment: String;
  @Input() totalPayment: number;
  @Output() paymentSccuess = new EventEmitter<void>();

  givenNumber = '0.00';

  constructor(private restService: RestApiService) {

  }

  ngOnInit(): void {

  }

  public get mChange(): number {
    const cash = Number(this.givenNumber.replace(/,/g, ''));
    const result = cash - this.totalPayment;
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }

  public get isPaidEnough() {
    if (Number(this.givenNumber) >= this.totalPayment) {
      return true;
    }
    return false;
  }

  onClickExact() {
    this.givenNumber = String(this.totalPayment);
  }

  onClickGiven(addGiven: number) {
    this.givenNumber = String(Number(this.givenNumber) + addGiven);
  }

  onClickReset() {
    this.givenNumber = '0.00';
  }

  onClickSubmit() {

    this.paymentSccuess.emit();
    console.log(this.orderPayment);

    // const transaction = new Transaction();
    // transaction.total = this.totalPayment;
    // transaction.paid = Number(this.givenNumber);
    // transaction.change = Number(this.givenNumber) - this.totalPayment;
    // transaction.paymentType = 'cash';
    // transaction.paymentDetail = 'full';
    // transaction.sellerId = 'sr0001';
    // transaction.buyerId = 'by0000';
    // transaction.orderList = JSON.stringify(this.orderPayment);

    // this.restService.addTransaction(transaction).subscribe(
    //   data => {
    //     this.submitPayments.emit(); // emit event of shop.component.html
    //     Swal.fire({
    //       position: 'center',
    //       type: 'success',
    //       title: data.message,
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //   },
    //   error => {
    //     console.log(JSON.stringify(error));
    //     alert(error.error.message);
    //   }
    // );
  }

}
