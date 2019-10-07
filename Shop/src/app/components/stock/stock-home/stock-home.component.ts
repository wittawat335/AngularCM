import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';

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
    // this.searchTextChanged.pipe(
    //   debounceTime(1000)
    // ).subscribe(term => this.onSearch(term));

    // Product
    this.feedData();

    // OutOfStock
    this.restService.getOutOfStock().subscribe(
      data => {
        this.outOfStock = data.out_of_stock_product;
      },
      error => {
        console.log('product error: ' + JSON.stringify(error));
      }
    );
  }
  feedData() {
    this.restService.getProducts().subscribe(
      data => {
        console.log(data.result.length);
        this.mProductArray = data.result;
      },
      error => {
        console.log('product error: ' + JSON.stringify(error));
      }
    );
  }
  // onSearch(keyword: any): void {

  //   if (keyword === '') {
  //     this.feedData();
  //     return;
  //   }

  //   this.restService.searchProducts(keyword).subscribe(
  //     data => {
  //       // console.log(data);
  //       this.mProductArray = data.result;   // without Observable

  //       // this.mProductArray = of(data.result);   // Observable
  //     },
  //     error => {
  //       console.log(JSON.stringify(error));
  //     }
  //   );
  // }

  // onDeleteProduct(id: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then(async result => {
  //     this.restService.deleteProduct(id).subscribe(
  //       data => {
  //         this.feedData();
  //       },
  //       error => {
  //         alert(error);
  //       }
  //     );
  //   });
  // }

  


  // public onEditProduct(id: number) {
  //   this.router.navigate([`stock/${id}`]);
  // }

}
