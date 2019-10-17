import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private restService: RestApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem(environment.keyLocalAuthenInfo) != null) {
      this.router.navigateByUrl('/stock');
    }
  }

  onClickSubmit(loginForm) {
    console.log(loginForm.value);
    this.restService.login(loginForm.value).subscribe(
      result => {
        console.log(result);
        localStorage.setItem(
          environment.keyLocalAuthenInfo,
          JSON.stringify(result.token)
        );
        this.toastr.success(result.message);
        this.router.navigate(['stock']);
      },
      err => {
        if (err.status === 400) {
          this.toastr.error('username invalid');
        } else {
          console.log(err);
        }
      }
    );
  }
}
