import { OrderListComponent } from './../order-list/order-list.component';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderList;
  constructor(private service: OrderService,
              private dialog:MatDialog,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList(){
    this.service.getOrderList().then(res => this.orderList = res);
    console.log(this.orderList);
  }

  AddOrEditOrderItem(id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {id};

    this.dialog.open(OrderListComponent, dialogConfig);
  }

}
