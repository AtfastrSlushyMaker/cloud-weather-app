import { Routes } from '@angular/router';
import { Weather } from './weather/weather';
import { DebugComponent } from './debug/debug.component';

export const routes: Routes = [
    { path: '', redirectTo: '/weather', pathMatch: 'full' },
    { path: 'weather', component: Weather },
    { path: 'debug', component: DebugComponent },
    { path: '**', redirectTo: '/weather' }
];
