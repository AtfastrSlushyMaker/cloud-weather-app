import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, timeout, retry, catchError, throwError } from 'rxjs';
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
        const url = this.apiUrl ? `${this.apiUrl}/api/weather?city=${city}` : `/api/weather?city=${city}`;

        const options = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        };

        return this.http.get<WeatherData>(url, options).pipe(
            timeout(10000),
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred';

                if (error.status === 0) {
                    errorMessage = 'Network connection failed. Please check your internet connection.';
                } else if (error.status === 404) {
                    errorMessage = 'City not found. Please check the spelling and try again.';
                } else if (error.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
                } return throwError(() => ({ ...error, friendlyMessage: errorMessage }));
            })
        );
    }
}
