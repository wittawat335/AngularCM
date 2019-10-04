import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stock-home',
  templateUrl: './stock-home.component.html',
  styleUrls: ['./stock-home.component.css']
})
export class StockHomeComponent implements OnInit {

  mProductArray = new Array<Product>();

  outOfStock = 0;

  searchTextChanged = new Subject<string>();


  constructor(private restService: RestApiService, private router: Router) { }

  ngOnInit() {

    this.restService.getOutOfStock().subscribe(
      data => {
        this.outOfStock = data.out_of_stock_product;
      },
      error => {
        console.log('product error: ' + JSON.stringify(error));
      }
    );
  }

}
