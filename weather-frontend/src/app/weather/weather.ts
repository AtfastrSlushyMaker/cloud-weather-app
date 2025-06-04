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

    this.weatherService.getWeatherWithFallback(this.city)
      .subscribe({
        next: (data: WeatherData) => {
          this.weatherData = data;
          this.loading = false;
        }, error: (err: any) => {
          // Use the friendly error message from the service if available
          if (err.friendlyMessage) {
            this.error = err.friendlyMessage;
          } else if (err.status === 0) {
            this.error = 'Network error - please check your internet connection';
          } else if (err.status === 404) {
            this.error = 'Weather service not found - please try again later';
          } else if (err.status >= 500) {
            this.error = 'Server error - please try again later';
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else {
            this.error = 'Failed to fetch weather data';
          }

          this.loading = false;
        }
      });
  }

  ngOnInit() {
    this.getWeather();
  }
}
