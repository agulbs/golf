import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public name: String;
  public nameErr = false;
  public teams;
  public team;
  private session: Object;
  private username;
  public noGamesFlag = false;
  public createdTeam = false;

  constructor(private requests: RequestsService, private state: StateService) {
    setTimeout(() => {
      this.state._session.subscribe(session => {
        if ('error' in session) {
          this.noGamesFlag = true;
        } else {
          this.session = session;
          this.noGamesFlag = false;
          this.teams = this.state.getTeams();
          this.username = this.state.getUsername();

          if (this.teams.length == 0) {
            this.createdTeam = false;
          } else {

            this.teams.forEach(team => {
              if (team.captain == this.username) {
                this.createdTeam = true;
                this.team = team;
              }
            })
          }
        }
      });
    }, 500);
  }

  ngOnInit(): void {
    this.requests.getGameSettings()
  }

  public createTeam() {
    if (typeof (this.name) === "undefined") {
      this.nameErr = true;
      return false;
    }

    this.nameErr = false;

    this.requests.createTeam(this.name, this.session);
  }

  public deleteTeam() {
    this.requests.deleteTeam(this.team);
  }

}
