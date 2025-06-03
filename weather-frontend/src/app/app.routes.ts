import { Routes } from '@angular/router';
import { Weather } from './weather/weather';

export const routes: Routes = [
    { path: '', redirectTo: '/weather', pathMatch: 'full' },
    { path: 'weather', component: Weather },
    { path: '**', redirectTo: '/weather' }
];
