import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private restService: RestApiService, private router: Router) { }

  ngOnInit() {
   
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
        this.router.navigate(['stock']);
      }
    );
  }

}
