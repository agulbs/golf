import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public permissions = {
    admin: 0,
    captain: 0,
    chief: 0,
    player: 0,
  }

  constructor(private state: StateService) {
    this.permissions = this.state.user['permissions']
  }

  ngOnInit(): void {
  }

}
