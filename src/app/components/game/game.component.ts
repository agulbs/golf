import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public joinGameFlag;
  public joinTeamFlag;
  public scorecardFlag;
  public game: Object;
  public teams: Array<any>;
  public player: Object;
  public team: String;
  public handicap: Number;
  public frontbet: Number;
  public backbet: Number;
  public errMsg: String;


  constructor(private requests: RequestsService, private state: StateService) {
    // this.state._session.subscribe(session => {
    //   if ('error' in session) {
    //     this.joinGameFlag = false;
    //   } else {
    //     this.joinGameFlag = true;
    //     this.game = session;
    //     this.player = this.state.getPlayer();
    //     console.log(this.player)
    //   }
    // });

    this.state._session.subscribe(session => {
      setTimeout(() => {
        if ('error' in session) {
          this.joinGameFlag = false;
          this.joinTeamFlag = false;
        } else {
          this.joinGameFlag = true;

          this.teams = this.state.getTeams();
          if (this.teams.length == 0) {
            this.joinTeamFlag = false;
          } else {
            this.joinTeamFlag = true;
            this.game = session;
            this.player = this.state.getPlayer();
            if ('joined' in this.player) {
              this.scorecardFlag = true;
            }
          }
        }
      }, 1);
    });
  }

  ngOnInit(): void {
    this.requests.getGameSettings();
  }

  public joinGame() {
    if (typeof (this.handicap) === "undefined") {
      this.errMsg = "Please enter a handicap.";
      return false;
    }

    if (typeof (this.frontbet) === "undefined") {
      this.errMsg = "Please enter a front side bet.";
      return false;
    }

    if (typeof (this.team) === "undefined") {
      this.errMsg = "Please select a team.";
      return false;
    }

    this.errMsg = "";

    console.log(this.team)
    this.requests.joinGame(this.game, this.player, this.handicap, this.frontbet, this.team);
  }

  public leaveGame() {
    this.requests.leaveGame(this.game, this.player);
  }

}
