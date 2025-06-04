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
  localTime: string = '';
  private searchTimeout: any;

  onSearchKeyup() {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Only search if we have at least 2 characters
    if (this.city && this.city.trim().length >= 2) {
      // Debounce the search by 800ms
      this.searchTimeout = setTimeout(() => {
        this.getWeather();
      }, 800);
    }
  }

  getWeather() {
    this.loading = true;
    this.error = '';

    this.weatherService.getWeather(this.city)
      .subscribe({
        next: (data: WeatherData) => {
          this.weatherData = data;
          this.updateLocalTime();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.friendlyMessage || 'Failed to fetch weather data';
          this.loading = false;
        }
      });
  }

  private updateLocalTime() {
    if (this.weatherData) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const localTime = new Date(utc + (this.weatherData.timezone * 1000));
      
      this.localTime = localTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  ngOnInit() {
    this.getWeather();
  }
}
