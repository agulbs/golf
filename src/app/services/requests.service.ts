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
  // private url: String = "http://castlefin.com/golf";
  private url: String = "http://127.0.0.1:5000";
  constructor(private http: HttpClient, private router: Router, private state: StateService) { }

  public login(user) {

    let params = {
      url: "/user/login",
      data: {
        loginUser: user
      }
    };

    this.postRequest(params).subscribe((res) => {
      if (!('data' in res)) {
        alert('There was an error logging in. please check your username & password.')
      }
      else {
        this.getGameSettings();
        this.state.user = res['data'];
        this.router.navigateByUrl("game");
      }
    })

  }

  public getGameSettings() {
    this.getRequest("/game/settings").subscribe(res => {
      this.state.gameSettings.next(res);
    })
  }

  public startRound(round) {
    let params = {
      url: "/game/round",
      data: {
        startRound: round
      }
    };

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })
  }

  public endRound(session) {
    let params = {
      url: "/game/close",
      data: {
        closeGame: { session: session }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })
  }

  public updateBets(handicap, bet, session) {
    var params = {
      url: "/game/bets",
      data: {
        "updateBets": {
          handicap: handicap,
          frontSideBet: bet,
          backSideBet: bet,
          username: this.state.user['userInfo']['username'],
          session: session
        }
      }
    }

    console.log(params)

    this.postRequest(params).subscribe(res => {
      this.getGameSettings();
    })
  }

  public updateScores(scores, player) {
    let params = {
      url: "/game/scores",
      data: {
        "updateScores": {
          scores: scores,
          username: player.username,
          session: player.session,
        }
      }
    };

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
      alert('Your Scores have been updated.')
    });
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
}
