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
    this.state._session.subscribe(session => {
      setTimeout(() => {
        if ('error' in session) {
        } else {
          this.player = this.state.getPlayer();
          this.player['session'] = session.session;
          let courses = this.state.getCourses();

          Object.keys(courses).forEach(k => {
            if (session.course == courses[k].name) {
              this.course = courses[k];
            }
          })

          Object.keys(this.course).forEach(hcp => {
            // console.log(hcp.substring(0, 4))
            if (hcp.substring(0, 4) == "hole") {
              this.handicaps.push(this.course[hcp])
            }
          });

          console.log(this.handicaps)
          if (this.player['scores']) {
            this.scores = this.player['scores'].split(',');
          }

        }
      }, 1);
    });
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

    this.requests.updateScores(score, this.player);
  }

  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  public calculateScores() {
    let front = this.getScore(0, 9);
    let back = this.getScore(9, 18);

    console.log(front[0], front[1], front[0] - front[1], front[0] - 32);
    console.log(back[0], back[1], back[0] - back[1])
  }

  public getScore(start, end) {
    let playerSum = 0;
    let courseSum = 0;
    for (start; start < end; start++) {
      if (this.scores[start] == null || this.scores[start] == "") {
        return false;
      }

      playerSum += parseInt(this.scores[start]);
      courseSum += this.handicaps[start];
    }

    return [playerSum, courseSum];
  }

}