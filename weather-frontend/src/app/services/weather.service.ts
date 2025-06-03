import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    sys: {
        country: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getWeather(city: string): Observable<WeatherData> {
        return this.http.get<WeatherData>(`${this.apiUrl}/weather?city=${city}`);
    }

    // You can add more API methods here:
    // getForecast(city: string): Observable<ForecastData> {
    //   return this.http.get<ForecastData>(`${this.apiUrl}/forecast?city=${city}`);
    // }
}
