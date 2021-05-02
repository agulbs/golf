import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public joinGameFlag;
  public game: Object;
  public player: Object;


  constructor(private requests: RequestsService, private state: StateService) {
    this.state._session.subscribe(session => {
      if ('error' in session) {
        this.joinGameFlag = false;
      } else {
        this.joinGameFlag = true;
        this.game = session;
        this.player = this.state.getPlayer();
        console.log(this.player)
      }
    });
  }

  ngOnInit(): void {
    this.requests.getGameSettings();
  }

  public joinGame() {
    this.requests.joinGame(this.game);
  }

  public leaveGame() {
    this.requests.leaveGame(this.game);
  }

}
