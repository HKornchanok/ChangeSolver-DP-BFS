import { Routes } from '@angular/router';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';

export const routes: Routes = [
  { path: 'color-palette', component: ColorPaletteComponent },
  { path: '', redirectTo: '/color-palette', pathMatch: 'full' }
]; 