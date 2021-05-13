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
  };

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
        if (player['captain'] == username) {
          if (player['scores'] != null) {
            player['scores'] = player['scores'].split(',');
          }
          this.teammates.push(player);
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

  public viewPlayerScorecard(player) {
    this.player = player;
  }



}
