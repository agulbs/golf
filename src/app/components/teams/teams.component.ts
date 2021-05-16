import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public settings;
  public noteams;
  public team;
  public captain;
  public teammates = [];
  public player = {
    username: '',
    scores: '',
    handicap: '',
    backSideBet: '',
    frontSideBet: '',
    sessin: '',
  };

  public loadedPlayers = {};

  constructor(private requests: RequestsService, private state: StateService) {
    this.state.gameSettings.subscribe(settings => {
      this.settings = settings;

      if ('error' in settings.gameSettings.session) {
        this.noteams = true;
      } else {
        this.noteams = false;
      }

      var username = this.state.user['userInfo']['username'];

      settings.gameSettings.joinedPlayers.players.forEach(player => {
        if (player['username'] in this.loadedPlayers) {

        } else {
          if (player['captain'] == username) {
            this.loadedPlayers[player['username']] = 1;
            if (player['scores'] != null) {
              if (typeof (player['scores']) == 'string') {
                player['scores'] = player['scores'].split(',');
              }
              else {
                player['scores'] = player['scores'];
              }
            }
            this.teammates.push(player);
          }
        }

        if (player['username'] == username) {
          this.captain = player;
        }
      });

      console.log(this.teammates)
    })
  }

  ngOnInit(): void {

  }

  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  public viewPlayerScorecard(player) {
    this.player = player;
  }

  public overrideScoresBets(player) {
    player['session'] = this.settings.gameSettings.session['session'];
    this.requests.updateBets(player.username, player.handicap, player.frontSideBet, player.session);

    this.player['scores'] = player['scores'].join(',');
    setTimeout(() => {
      this.requests.updateScores(this.player['scores'], this.player, false);
    }, 1000);
  }
}
