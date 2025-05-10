import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';

@NgModule({
  declarations: [

  ],
  imports: [
    AppComponent,
    ColorPaletteComponent,
    MainPageComponent,
    BrowserModule,
    RouterModule.forRoot(routes)    
  ]
})
export class AppModule { } 