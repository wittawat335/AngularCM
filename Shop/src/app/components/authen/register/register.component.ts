import { RestApiService } from './../../../services/rest-api.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  position = ['Cashier', 'Admin'];

  constructor(private restService: RestApiService, private location: Location,private toastr: ToastrService) { }

  ngOnInit() {
  }

  onClickSubmit(regiterForm) {
    console.log(regiterForm.value);
    this.restService.regsiter(regiterForm.value).subscribe(
      data => {
        console.log(data.result);
        if (data.result === 'ok') {
          this.toastr.success(data.message);
          this.location.back();
        }
      }
    );
  }

}
