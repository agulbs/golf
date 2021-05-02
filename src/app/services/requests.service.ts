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

  public joinGame(game) {
    let params = {
      url: "/game/join",
      data: {
        joinGame: {
          session: game.session,
          username: this.state.getUsername(),
          date: game.date
        }
      }
    }

    this.postRequest(params).subscribe((res) => {
      this.getGameSettings();
    }, (err) => { console.log(err) })


  }

  public leaveGame(game) {
    let params = {
      url: "/game/join",
      data: {
        leaveGame: {
          session: game.session,
          username: this.state.getUsername(),
          date: game.date
        }
      }
    }

    this.deleteRequest(params).subscribe((res) => {
      this.getGameSettings();
    });


  }




  // public getGameSettings() {
  //   return this.getRequest("/game/settings").pipe(map(
  //     (res) => {
  //       this.state.setGameSettings(res);
  //       return res;
  //     }
  //   ));
  //
  // }

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
