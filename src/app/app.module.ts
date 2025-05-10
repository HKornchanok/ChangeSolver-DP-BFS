import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SupabaseService } from './services/supabase.service';

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    ColorPaletteComponent,
    MainPageComponent,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  providers: [SupabaseService],
})
export class AppModule {}
