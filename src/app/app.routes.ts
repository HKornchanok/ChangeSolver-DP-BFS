import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: MainPageComponent,
      },
      {
        path: 'color-palette',
        component: ColorPaletteComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
