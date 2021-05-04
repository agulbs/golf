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
  public joinedPlayers;

  constructor(private requests: RequestsService, private state: StateService) {
    this.state._session.subscribe(session => {
      if ('error' in session) {
        this.sessionFlag = false;
        this.courses = this.state.getCourses();
      } else {
        this.courses = this.state.getCourses();
        this.sessionFlag = true;
        this.session = session.session;
        this.date = session.date;
        this.course = session.course;
        this.teams = session.teams;
        this.joinedPlayers = this.state.getJoinedPlayers();
      }
    });
  }

  ngOnInit(): void {

  }

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
    this.requests.deleteGame(this.session, this.date);
  }

  public calculateScores() {
    let course = {};
    let courseOrder = {};
    let matchSummary = [];
    Object.keys(this.courses).forEach(k => {
      console.log(this.course, this.courses[k]['name'])
      if (this.courses[k]['name'] === this.course) {
        course = this.courses[k]
      }
    })

    Object.keys(course).forEach(order => {
      if (order.substring(0, 4) == "hole") {
        courseOrder[course[order]] = parseInt(order.substring(4, order.length));
      }
    });

    let compared = {};
    this.joinedPlayers.forEach(playerOne => {

      this.joinedPlayers.forEach(playerTwo => {
        let cmp = playerOne.username + "." + playerTwo.username;
        let cmp2 = playerTwo.username + "." + playerOne.username;
        if (!(cmp in compared) && !(cmp2 in compared) && (playerTwo.username != playerOne.username)) {
          compared[cmp] = 0;
          compared[cmp2] = 0;

          let hcps = Math.abs(playerOne.handicap - playerTwo.handicap);
          let hcpHoles = []
          for (let i = 1; i <= hcps; i++) {
            hcpHoles.push(courseOrder[i])
          }

          var scores = [
            playerOne.scores.split(','),
            playerTwo.scores.split(',')
          ];

          if (playerOne.handicap > playerTwo.handicap) {
            hcpHoles.forEach(h => {
              var o = parseInt(scores[0][h - 1]);
              scores[0][h - 1] = o - 1;
            })
          } else {
            hcpHoles.forEach(h => {
              var o = parseInt(scores[1][h - 1]);
              scores[1][h - 1] = o - 1;
            })
          }

          var summary = {
            front: {},
            back: {},
            overall: {}
          };

          summary.front[playerOne.username] = 0;
          summary.front[playerTwo.username] = 0;
          summary.back[playerOne.username] = 0;
          summary.back[playerTwo.username] = 0;

          for (var i = 0; i < 9; i++) {
            if (parseInt(scores[0][i]) < parseInt(scores[1][i])) {
              summary.front[playerOne.username] += 1;
            }

            if (parseInt(scores[0][i]) > parseInt(scores[1][i])) {
              summary.front[playerTwo.username] += 1;
            }

            if (parseInt(scores[0][i + 9]) < parseInt(scores[1][i + 9])) {
              summary.back[playerOne.username] += 1;
            }

            if (parseInt(scores[0][i + 9]) > parseInt(scores[1][i + 9])) {
              summary.back[playerTwo.username] += 1;
            }
          }

          summary.overall[playerOne.username] = summary.front[playerOne.username] + summary.back[playerOne.username];
          summary.overall[playerTwo.username] = summary.front[playerTwo.username] + summary.back[playerTwo.username];
          summary['scores'] = {
            front: [scores[0].slice(0, 9), scores[1].slice(0, 9)],
            back: [scores[0].slice(9, scores[0].length), scores[1].slice(9, scores[1].length)],
            all: [scores[0], scores[1]],
            hcp: [playerOne.handicap, playerTwo.handicap]
          }

          matchSummary.push(summary)
        }

      });
    })

    console.log(matchSummary)
    var csvExport = [];
    matchSummary.forEach(s => {
      var header = ["Holes", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, "Handicap"]
      var expt: any = [
        header,
      ];

      let users = Object.keys(s.front);
      for (var i = 0; i < users.length; i++) {
        var score = s.scores.all[i].map(Number)
        let arr = [[users[i], ...score]]
        arr.push(s.scores.hcp[i])
        expt.push(arr)
      }

      expt.push([""])
      expt.push(["", "", users[0], users[1]])
      expt.push(["", "Front", s.front[users[0]], s.front[users[1]]])
      expt.push(["", "Back", s.back[users[0]], s.back[users[1]]])
      expt.push(["", "Overall", s.overall[users[0]], s.overall[users[1]]])
      csvExport.push(expt)
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvExport.forEach(cexp => {
      cexp.forEach(c => {
        let row = c.join(",");
        csvContent += row + "\r\n";
      });

      csvContent += "\r\n"
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);

    link.click();
  }

}
