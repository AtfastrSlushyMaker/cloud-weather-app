import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, retry, catchError } from 'rxjs';
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
    private apiUrl = environment.apiUrl;    getWeather(city: string): Observable<WeatherData> {
        const url = this.apiUrl ? `${this.apiUrl}/api/weather?city=${city}` : `/api/weather?city=${city}`;
        
        const options = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }),
            withCredentials: false
        };
        
        return this.http.get<WeatherData>(url, options).pipe(
            timeout(15000), // 15 second timeout
            retry(2), // Retry twice on failure
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred';
                
                if (error.error instanceof ErrorEvent) {
                    // Client-side or network error
                    errorMessage = `Network error: ${error.error.message}`;
                } else if (error.status === 0) {
                    // Status 0 usually means network/CORS issue
                    errorMessage = 'Network connection failed. Please check your internet connection and try again.';
                } else {
                    // Backend returned an unsuccessful response code
                    errorMessage = error.error?.message || `Server error: ${error.status} ${error.statusText}`;
                }
                
                return throwError(() => ({ ...error, friendlyMessage: errorMessage }));
            })
        );
    }

    // Fallback method using native fetch for mobile compatibility
    private async fallbackFetch(city: string): Promise<WeatherData> {
        const url = this.apiUrl ? `${this.apiUrl}/api/weather?city=${city}` : `/api/weather?city=${city}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: 'same-origin',
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Enhanced method that tries HttpClient first, then falls back to native fetch
    getWeatherWithFallback(city: string): Observable<WeatherData> {
        return this.getWeather(city).pipe(
            catchError((error) => {
                console.log('HttpClient failed, trying native fetch fallback...', error);
                
                // If HttpClient fails (especially status 0), try native fetch
                if (error.status === 0 || error.error instanceof ErrorEvent) {
                    return new Observable<WeatherData>(observer => {
                        this.fallbackFetch(city)
                            .then(data => {
                                observer.next(data);
                                observer.complete();
                            })
                            .catch(fetchError => {
                                observer.error({
                                    ...error,
                                    friendlyMessage: `Both HttpClient and fetch failed. ${fetchError.message}`
                                });
                            });
                    });
                }
                
                // Re-throw original error if not a network issue
                return throwError(() => error);
            })
        );
    }

    // You can add more API methods here:
    // getForecast(city: string): Observable<ForecastData> {
    //   return this.http.get<ForecastData>(`${this.apiUrl}/forecast?city=${city}`);
    // }
}
