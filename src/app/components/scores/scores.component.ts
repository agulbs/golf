import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  public scores = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
  public errMsg;
  public player;
  public course;
  public handicaps = [];

  constructor(private requests: RequestsService, private state: StateService) {
    this.state.gameSettings.subscribe(session => {
      this.player = this.state.player;
      this.player['session'] = session.gameSettings['session']['session'];
      let courses = session.courses['all'];
      Object.keys(courses).forEach(k => {
        if (session.gameSettings['session']['course'] == courses[k].name) {
          this.course = courses[k];
        }
      });

      Object.keys(this.course).forEach(hcp => {
        // console.log(hcp.substring(0, 4))
        if (hcp.substring(0, 4) == "hole") {
          this.handicaps.push(this.course[hcp])
        }
      });

      if (this.player['scores'] != null) {
        if (typeof (this.player['scores']) == 'string') {
          this.scores = this.player['scores'].split(',');
        }
        else {
          this.scores = this.player['scores'];
        }
      }

      console.log(this.player);
    })
  }

  ngOnInit(): void {
  }

  public updateScores() {
    var flag = true;
    this.scores.forEach(score => {
      if (score == null) {
        flag = false;
      }
    })

    if (!flag) {
      this.errMsg = "Please make sure all entered scores are a number."
      return false;
    }

    this.errMsg = "";
    let score = this.scores.join(',');

    this.requests.updateScores(score, this.player, true);
  }

  public trackByIndex(index: number, obj: any): any {
    return index;
  }

}
