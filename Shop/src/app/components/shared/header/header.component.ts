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

  constructor(private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  onLogout(){
    localStorage.removeItem(environment.keyLocalAuthenInfo);
    this.toastr.success('LogOut Successfully');
    this.router.navigate(['/auth/login']);
  }

}
