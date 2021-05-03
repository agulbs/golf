import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private url: String = "http://castlefin.com/golf";

  constructor(private http: HttpClient, private router: Router, private state: StateService) { }

  public login(user) {

    let params = {
      url: "/user/login",
      data: {
        loginUser: user
      }
    };

    this.postRequest(params).subscribe((res) => {
      this.state.setUser(res['data']);
      this.router.navigateByUrl("game");
    })

  }

  public getGameSettings() {
    this.getRequest("/game/settings").subscribe((res) => {
      this.state.setGameSettings(res);
    })
  }

  public createGame(gameData) {
    let params = {
      url: "/game/setup",
      data: {
        startNewGame: gameData,
        verifyRole: {
          user: this.state.getUsername()
        }
      }
    };

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })

  }

  public deleteGame(session, date) {
    let params = {
      url: "/game/setup",
      data: {
        deleteGame: { session: session, date: date },
        verifyRole: {
          // user: "chief"
          user: this.state.getUsername()
        }
      }
    }

    this.deleteRequest(params).subscribe((res) => {
      this.getGameSettings();
    });
  }

  public joinGame(game, player, handicap, bet, team) {
    let params = {
      url: "/game/join",
      data: {
        joinGame: {
          session: game.session,
          username: player.username,
          date: game.date
        }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.joinTeam(team, player.username, game, handicap, bet)
    }, (err) => { console.log(err) })
  }

  public leaveGame(game, player) {
    let params = {
      url: "/game/join",
      data: {
        leaveGame: {
          session: game.session,
          username: player.username,
          date: game.date
        }
      }
    }

    this.deleteRequest(params).subscribe((res) => {
      this.getGameSettings();
    });
  }

  public createTeam(name, session) {
    let params = {
      url: "/game/teams",
      data: {
        "createTeam": {
          session: session.session,
          name: name,
          captain: this.state.getUsername(),
          date: session.date,
        }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })
  }

  public joinTeam(team, username, game, handicap, bet) {
    var params = {
      url: "/game/teams",
      data: {
        "joinTeam": {
          team: team,
          username: username,
          date: game.date
        }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.submitBets(handicap, bet, username, game)
    }, (err) => { console.log(err) })

  }

  public submitBets(handicap, bet, username, game) {
    var params = {
      url: "/game/bets",
      data: {
        "updateBets": {
          handicap: handicap,
          frontSideBet: bet,
          backSideBet: bet,
          username: username,
          session: game.session
        }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })
  }

  public deleteTeam(team) {
    let params = {
      url: "/game/teams",
      data: [{
        "deleteTeam": {
          session: team.session,
          name: team.name
        }
      }, {
        "removeMembers": {
          session: team.session,
          team: team.name
        }
      }]
    }

    this.deleteRequest(params).subscribe((res) => {
      this.getGameSettings();
    });

    console.log(params)
  }


  private getRequest(url) {
    return this.http.get(this.url + url);
  }

  private postRequest(params) {
    return this.http.post(this.url + params.url, params.data);
  }

  private deleteRequest(params) {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
      body: params.data,
    };

    return this.http.delete(this.url + params.url, options);
  }


  // private get(params) {
  //   return this.http.get(this.url + params.url);
  // }
  //
  // private post(params) {
  //
  // }
}
