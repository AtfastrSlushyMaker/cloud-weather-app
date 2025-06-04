import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WeatherService, WeatherData } from '../services/weather.service';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit {
  private weatherService = inject(WeatherService);
  city: string = 'Tunis';
  weatherData: WeatherData | null = null;
  loading: boolean = false;
  error: string = '';

  getWeather() {
    this.loading = true;
    this.error = '';

    this.weatherService.getWeather(this.city)
      .subscribe({
        next: (data: WeatherData) => {
          this.weatherData = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.friendlyMessage || 'Failed to fetch weather data';
          this.loading = false;
        }
      });
  }

  ngOnInit() {
    this.getWeather();
  }
}
