import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private user: Object;
  private tokens: Object;
  private permissions: Object;
  private session: Object;
  private courses: Object;
  private players: Object;
  private player: Object;
  private joined: Object;
  private teams: Array<any>;

  public _session = new BehaviorSubject<any>({});
  public _permissions = new BehaviorSubject<any>({});
  public _upermissions = new BehaviorSubject<any>({});

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
    // return 'captain'
  }

  public setGameSettings(settings) {
    this.session = settings.gameSettings.session;
    this.courses = settings.courses.all;
    this.players = settings.players['all'];

    settings.players['all'].forEach((player) => {
      if (player.username == this.user['username']) {
        // if (player.username == 'captain') {
        this.player = player;
      }
    })

    if ('error' in settings.gameSettings.session) {
      this.joined = {};
    }
    else {
      this.teams = settings.gameSettings.createadTeams.teams;
      this.joined = settings.gameSettings.joinedPlayers.players;
      Object.keys(this.joined).forEach(p => {
        if (this.joined[p].username == this.user['username']) {
          // if (this.joined[p].username == 'captain') {
          this.player['joined'] = true;
          for (var k in this.joined[p]) {
            if (!(k in this.player)) {
              this.player[k] = this.joined[p][k];
            }
          }
        }
      })
    }

    console.log(this.player)

    this._session.next(this.session);
  }

  public setUserPerms(permissions) {
    this._upermissions.next(permissions);
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

  public getPlayers() {
    return this.players;
  }

  public getTeams() {
    return this.teams;
    console.log(this.teams)
  }

  public setSession() { }
  public setCourses() { }
  public checkPerms() { }

}
