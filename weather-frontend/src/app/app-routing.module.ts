import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Weather } from './weather/weather';

const routes: Routes = [
  { path: '', redirectTo: 'weather', pathMatch: 'full' },  // Redirect root to /weather
  { path: 'weather', component: Weather },        // Your weather page route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
