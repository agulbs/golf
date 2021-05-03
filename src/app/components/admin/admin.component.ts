import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public players: Object;
  public player: Object = {
    "first": "",
    "last": "",
    "username": "",
    "nick": "",
  };

  public newUser = {
    first: "",
    last: "",
    username: "",
    nick: "",
    password: "password",
    admin: false,
    chief: false,
    captain: false,
    player: false
  };

  public errMsg;

  constructor(private requests: RequestsService, private state: StateService) {
    this.state._upermissions.subscribe(players => {
      this.players = players
    })
  }

  ngOnInit(): void {
    this.requests.getUserPerms()
  }

  public setPlayer(player) {
    console.log(player)
    this.player = player;
  }

  public updatePerms() {
    console.log(this.player)
    this.requests.updatePerms(this.player);
  }

  public createUser() {
    var errFlag = false;
    Object.keys(this.newUser).forEach(k => {
      if (this.newUser[k].length == 0) {
        this.errMsg = "Please make sure you've filled out all fields.";
        errFlag = true;
        console.log(k)
      }
    })

    if (errFlag) {
      return false;
    }

    this.errMsg = "";

    this.requests.createUser(this.newUser);
  }

}
