import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './routes/home/home.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { IconComponent } from './compontents/icon/icon.component';
import { PrimeModule } from './modules/prime/prime.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KeyboardComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
