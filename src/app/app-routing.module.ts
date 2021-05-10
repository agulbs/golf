import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component"
import { GameComponent } from "./components/game/game.component"
import { MatchesComponent } from "./components/matches/matches.component"
import { TeamsComponent } from "./components/teams/teams.component"
import { AdminComponent } from "./components/admin/admin.component"
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: "", component: LoginComponent, pathMatch: 'full' },
  { path: "game", component: GameComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: "matches", component: MatchesComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: "teams", component: TeamsComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: "admin", component: AdminComponent, pathMatch: 'full', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
