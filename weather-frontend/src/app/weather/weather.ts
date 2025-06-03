import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherData } from '../services/weather.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit {
  private http = inject(HttpClient);

  city: string = 'Tunis';
  weatherData: WeatherData | null = null;
  loading: boolean = false;
  error: string = '';
  getWeather() {
    this.loading = true;
    this.error = ''; this.http.get<WeatherData>(`${environment.apiUrl}/api/weather?city=${this.city}`)
      .subscribe({
        next: (data: WeatherData) => {
          this.weatherData = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to fetch weather data';
          this.loading = false;
          console.error(err);
        }
      });
  }

  ngOnInit() {
    this.getWeather();
  }
}
