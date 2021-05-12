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
  public captainTeam = [];
  public createGameErr = false;
  public players;
  public joinedPlayers;

  constructor(private requests: RequestsService, private state: StateService) {
    this.state._session.subscribe(session => {
      console.log(session)
      if ('error' in session) {
        this.sessionFlag = false;
        this.courses = this.state.getCourses();
      } else {
        this.courses = this.state.getCourses();
        this.players = this.state.getPlayers();
        console.log(this.players)
        this.sessionFlag = true;
        this.session = session.session;
        this.date = session.date;
        this.course = session.course;
        this.teams = session.teams;
        for (var i = 0; i < this.teams; i++) {
          this.captainTeam.push({ captain: '', name: '' })
        }
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

  public closeGame() {
    this.requests.closeGame(this.session);
  }

  public calculateScores() {
    if (this.joinedPlayers.length == 0) {
      return false;
    }
    try {
      // console.log(this.joinedPlayers)
      let course = {};
      let courseOrder = {};
      let matchSummary = [];
      Object.keys(this.courses).forEach(k => {
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

      var payouts = {
        headers: ["Players"],
        data: []
      };

      this.joinedPlayers.forEach(playerOne => {
        payouts.headers.push(playerOne.username);
        var pdata = [playerOne.username];

        this.joinedPlayers.forEach(playerTwo => {
          if (playerOne.username == playerTwo.username) {
            pdata.push("N/A");
          } else if (playerOne.team == playerTwo.team) {
            pdata.push(playerOne.team);
          } else {
            var p1bet = playerOne.frontSideBet;
            var p2bet = playerTwo.frontSideBet;
            var bet = p1bet;

            if (p1bet > p2bet) {
              bet = p2bet;
            }

            if (p1bet < p2bet) {
              bet = p1bet;
            }

            let hcps = Math.abs(playerOne.handicap - playerTwo.handicap);
            let hcpHoles = []
            for (let i = 1; i <= hcps; i++) {
              hcpHoles.push(courseOrder[i])
            }

            var rawScores = [playerOne.scores.split(','), playerTwo.scores.split(',')];
            var scores = [playerOne.scores.split(','), playerTwo.scores.split(',')];

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

            var p1front = 0;
            var p2front = 0;
            var p1back = 0;
            var p2back = 0;

            for (var i = 0; i < 9; i++) {
              if (parseInt(scores[0][i]) < parseInt(scores[1][i])) {
                p1front += 1;
              }

              if (parseInt(scores[0][i]) > parseInt(scores[1][i])) {
                p2front += 1;
              }

              if (parseInt(scores[0][i + 9]) < parseInt(scores[1][i + 9])) {
                p1back += 1;
              }

              if (parseInt(scores[0][i + 9]) > parseInt(scores[1][i + 9])) {
                p2back += 1;
              }
            }

            var p = 0;

            if (p1front > p2front) {
              p += bet;
            } else if (p1front < p2front) {
              p -= bet;
            }

            if (p1back > p2back) {
              p += bet;
            } else if (p1back < p2back) {
              p -= bet;
            }

            if ((p1front + p1back) > (p2front + p2back)) {
              p += bet + bet;
            } else if ((p1front + p1back) < (p2front + p2back)) {
              p -= bet + bet;
            }

            p *= -1;

            pdata.push(`$${p}`)

          }
        })
        payouts.data.push(pdata)
      });

      console.log(payouts)

      this.joinedPlayers.forEach(playerOne => {

        this.joinedPlayers.forEach(playerTwo => {
          let cmp = playerOne.username + "." + playerTwo.username;
          let cmp2 = playerTwo.username + "." + playerOne.username;
          if (!(cmp in compared) && !(cmp2 in compared) && (playerTwo.username != playerOne.username) && (playerTwo.team != playerOne.team)) {
            compared[cmp] = 0;
            compared[cmp2] = 0;

            let hcps = Math.abs(playerOne.handicap - playerTwo.handicap);
            let hcpHoles = []
            for (let i = 1; i <= hcps; i++) {
              hcpHoles.push(courseOrder[i])
            }

            var rawScores = [playerOne.scores.split(','), playerTwo.scores.split(',')];
            var scores = [playerOne.scores.split(','), playerTwo.scores.split(',')];

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
              raw: [rawScores[0], rawScores[1]],
              hcp: [playerOne.handicap, playerTwo.handicap]
            }
            matchSummary.push(summary)

          }

        });
      })



      var totals = ["Totals"]
      var cols = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'
      ];

      for (var i = 1; i <= payouts.data.length; i++) {
        totals.push(`=DOLLAR(SUM(${cols[i]}2:${cols[i]}${payouts.data.length + 1}))`)
      }
      var csvExport = [
        [payouts.headers, ...payouts.data], [totals]
      ];

      matchSummary.forEach(s => {
        var header = ["Hole", "Handicap", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        var expt: any = [
          header,
        ];

        let users = Object.keys(s.front);
        for (var i = 0; i < users.length; i++) {
          var score = s.scores.all[i].map(Number);
          expt.push([[users[i], s.scores.hcp[i], ...score]]);
        }

        expt.push([""]);
        expt.push(["", "", users[0], users[1]]);
        expt.push(["", "Front", s.front[users[0]], s.front[users[1]]]);
        expt.push(["", "Back", s.back[users[0]], s.back[users[1]]]);
        expt.push(["", "Overall", s.overall[users[0]], s.overall[users[1]]]);
        csvExport.push(expt);
      });



      let csvContent = "data:text/csv;charset=utf-8,";
      csvExport.forEach(cexp => {
        cexp.forEach(c => {
          let row = c.join(",");
          csvContent += row + "\r\n";
        });

        csvContent += "\r\n";
      });



      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "scorecards.csv");
      document.body.appendChild(link);

      link.click();

      // console.log(matchSummary)
    } catch (error) {
      alert(error)
    }

  }

}
