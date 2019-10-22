import { RestApiService } from 'src/app/services/rest-api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  user: string;

  constructor(private router: Router, private toastr: ToastrService,private service: RestApiService) { }

  ngOnInit() {
    this.user = 'Admin';
    this.getUser();
  }

  getUser(){
    this.service.getUser().subscribe(res => this.user = res.result);
  }

  onLogout(){
    localStorage.removeItem(environment.keyLocalAuthenInfo);
    this.toastr.success('LogOut Successfully');
    this.router.navigate(['/auth/login']);
  }

}
