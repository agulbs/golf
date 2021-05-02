import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  public sessionFlag;
  public session: Object = {};
  public courses: Object = {};
  public date: String;
  public course: Number;
  public teams: Number;
  public createGameErr = false;

  constructor(private requests: RequestsService, private state: StateService) {
    this.state._session.subscribe(session => {
      if ('error' in session) {
        this.sessionFlag = false;
        this.courses = this.state.getCourses();
      } else {
        this.sessionFlag = true;
        this.session = session.session;
        this.date = session.date;
        this.course = session.course;
        this.teams = session.teams;
      }
    });
  }

  ngOnInit(): void { }

  public generateSessionNumber() {
    let result: String = '';
    let characters: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < characters.length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  public createGame() {
    if (typeof (this.teams) === "object" || typeof (this.teams) === "undefined" || typeof (this.course) === "undefined") {
      this.createGameErr = true;
      return false;
    }

    this.createGameErr = false;

    let date = new Date();
    date.setHours(date.getHours() - 4);

    let game = {
      session: this.generateSessionNumber(),
      date: date.toISOString().slice(0, 10),
      course: this.course,
      teams: this.teams,
    }

    this.requests.createGame(game);
  }

  public deleteGame() {
    this.requests.deleteGame(this.session, this.date)
    // (this.session, this.);
  }

}
