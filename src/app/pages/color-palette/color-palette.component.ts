import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ColorPaletteComponent {
  // Color palette data
  colors = {
    primary: {
      default: 'var(--primary)',
      light: 'var(--primary-light)',
      dark: 'var(--primary-dark)',
      gradient: 'linear-gradient(102deg, var(--primary-dark) 35.35%, var(--primary-light) 124.4%)',
    },
    secondary: {
      default: 'var(--secondary)',
      dark: 'var(--secondary-dark)',
    },
    text: {
      gray: 'var(--text-gray)',
      gray2: 'var(--text-gray2)',
      light: 'var(--text-light)',
      white: 'var(--text-white)',
    },
    basic: {
      black: 'var(--black)',
      white: 'var(--white)',
    },
  };

  // Typography data
  typography = {
    headings: [
      { name: 'Heading 1', class: 'text-h1', size: '36px' },
      { name: 'Heading 2', class: 'text-h2', size: '24px' },
      { name: 'Heading 3', class: 'text-h3', size: '20px' },
      { name: 'Heading 4', class: 'text-h4', size: '16px' },
    ],
    body: [
      { name: 'Body 1', class: 'text-b1', size: '20px' },
      { name: 'Body 2', class: 'text-b2', size: '16px' },
      { name: 'Body 3', class: 'text-b3', size: '14px' },
    ],
  };
}
