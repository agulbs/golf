import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user = { username: "", password: "" };
  public missingFields: boolean = false;


  constructor(private requests: RequestsService) { }

  ngOnInit(): void {
  }

  public login() {
    for (var key in this.user) {
      if (this.user[key].length == 0) {
        this.missingFields = true;
        return false;
      }
    }

    this.missingFields = false;

    this.requests.login(this.user);
  }

}
