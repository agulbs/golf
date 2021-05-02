import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component"
import { GameComponent } from "./components/game/game.component"
import { MatchesComponent } from "./components/matches/matches.component"

const routes: Routes = [
  { path: "", component: LoginComponent, pathMatch: 'full' },
  { path: "game", component: GameComponent, pathMatch: 'full' },
  { path: "matches", component: MatchesComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
