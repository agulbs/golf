import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public settings;
  public nogame;
  public course;
  public player = {
    // frontSideBet: '',
    // backSideBet: '',
    // handicap: ''
  };
  public handicap;
  public frontSideBet;
  public playerReady;
  public err = "";

  constructor(private requests: RequestsService, private state: StateService) {
    this.state.gameSettings.subscribe(settings => {
      console.log(settings)
      this.settings = settings;

      if ('gameSettings' in settings) {
        if ('session' in settings['gameSettings']) {
          if ('error' in settings['gameSettings']['session']) {
            this.nogame = true;
          } else {
            this.nogame = false;
            this.course = settings.gameSettings['session']['course'];

            var username = this.state.user['userInfo']['username'];
            settings.gameSettings.joinedPlayers.players.forEach(player => {
              if (player['username'] == username) {
                this.player = player;
              }
            });

            this.state.player = this.player;

            if (this.player['frontSideBet'] == null || this.player['backSideBet'] == null || this.player['handicap'] == null) {
              this.playerReady = false;
            } else {
              this.playerReady = true;
            }
          }
        }
      }
    })
  }

  ngOnInit(): void { }

  public submitBets() {
    if (typeof (this.handicap) === "undefined" || this.handicap == null || typeof (this.frontSideBet) === "undefined" || this.frontSideBet == null) {
      this.err = "Please make sure you have filled out all required fields.";
      return false;
    }

    this.err = "";

    this.requests.updateBets(this.handicap, this.frontSideBet, this.settings.gameSettings['session']['session']);
  }


}
