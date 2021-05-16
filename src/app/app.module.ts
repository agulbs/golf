import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TeamsComponent } from './components/teams/teams.component';
import { GameComponent } from './components/game/game.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ScoresComponent } from './components/scores/scores.component';
import { AdminComponent } from './components/admin/admin.component';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TeamsComponent,
    GameComponent,
    NavbarComponent,
    MatchesComponent,
    ScoresComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
