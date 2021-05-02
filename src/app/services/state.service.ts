import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private user: Object;
  // private user = {
  //   "first": "player",
  //   "last": "player",
  //   "username": "player",
  //   "nick": "player"
  // };
  private tokens: Object;
  private permissions: Object;
  private session: Object;
  private courses: Object;
  private players: Object;
  private player: Object;
  private joined: Object;

  public _session = new BehaviorSubject<any>({});
  public _permissions = new BehaviorSubject<any>({});

  constructor() { }

  public setUser(user) {
    console.log(user)
    this.user = user.userInfo;
    this.tokens = user.tokens;
    this.permissions = user.permissions;

    this._permissions.next(this.permissions);
  }

  public getUser() {
    return this.user;
  }

  public getUsername() {
    return this.user['username'];
  }

  public setGameSettings(settings) {
    this.session = settings.gameSettings.session;
    this.courses = settings.courses.all;
    this.players = settings.players['all'];

    settings.players['all'].forEach((player) => {
      if (player.username == this.user['username']) {
        this.player = player;
      }
    })

    if ('error' in settings.gameSettings.session) {
      this.joined = {};
    }
    else {
      this.joined = settings.gameSettings.joinedPlayers.players;
      Object.keys(this.joined).forEach(p => {
        if (this.joined[p].username == this.user['username']) {
          this.player['joined'] = true;
          for (var k in this.joined[p]) {
            if (!(k in this.player)) {
              this.player[k] = this.joined[p][k];
            }
          }
        }
      })
    }

    this._session.next(this.session);
  }

  public getSession() {
    return this.session;
  }

  public getCourses() {
    return this.courses;
  }

  public getPlayer() {
    return this.player;
  }

  public setSession() { }
  public setCourses() { }
  public checkPerms() { }

}
