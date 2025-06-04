import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial;">
      <h2>Angular Debug Component</h2>
      
      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0;">
        <strong>Environment:</strong><br>
        Production: {{ environment.production }}<br>
        API URL: "{{ environment.apiUrl }}"<br>
        Window Location: {{ windowLocation }}
      </div>

      <div style="background: #e8f4fd; padding: 10px; margin: 10px 0;">
        <strong>Constructed URLs:</strong><br>
        Weather URL: {{ constructedWeatherUrl }}<br>
        Test URL: {{ constructedTestUrl }}
      </div>

      <button (click)="testHttpClient()" style="margin: 5px; padding: 10px;">Test HttpClient</button>
      <button (click)="testNativeFetch()" style="margin: 5px; padding: 10px;">Test Native Fetch</button>
      <button (click)="clearResults()" style="margin: 5px; padding: 10px;">Clear</button>

      <div id="results">
        <div *ngFor="let result of results" 
             [ngClass]="result.success ? 'success' : 'error'"
             style="margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
          <strong>{{ result.timestamp }}:</strong> {{ result.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success { background-color: #d4edda; }
    .error { background-color: #f8d7da; }
  `]
})
export class DebugComponent {
  private http = inject(HttpClient);
  
  environment = environment;
  windowLocation = window.location.href;
  constructedWeatherUrl = '';
  constructedTestUrl = '';
  results: Array<{timestamp: string, message: string, success: boolean}> = [];

  constructor() {
    // Construct URLs the same way the service does
    this.constructedWeatherUrl = environment.apiUrl ? 
      `${environment.apiUrl}/api/weather?city=London` : 
      `/api/weather?city=London`;
    
    this.constructedTestUrl = environment.apiUrl ? 
      `${environment.apiUrl}/api/test` : 
      `/api/test`;
  }

  log(message: string, success: boolean = true) {
    this.results.push({
      timestamp: new Date().toLocaleTimeString(),
      message,
      success
    });
  }

  clearResults() {
    this.results = [];
  }

  testHttpClient() {
    this.log(`Testing HttpClient with URL: ${this.constructedTestUrl}`);
    
    this.http.get(this.constructedTestUrl).subscribe({
      next: (data) => {
        this.log(`HttpClient SUCCESS: ${JSON.stringify(data).substring(0, 200)}...`, true);
      },
      error: (error) => {
        this.log(`HttpClient ERROR: Status ${error.status}, Message: ${error.message}`, false);
        this.log(`Error details: ${JSON.stringify(error).substring(0, 300)}...`, false);
      }
    });
  }

  async testNativeFetch() {
    this.log(`Testing Native Fetch with URL: ${this.constructedTestUrl}`);
    
    try {
      const response = await fetch(this.constructedTestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      this.log(`Fetch Response: Status ${response.status}`, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        this.log(`Fetch SUCCESS: ${JSON.stringify(data).substring(0, 200)}...`, true);
      } else {
        this.log(`Fetch HTTP ERROR: ${response.status} ${response.statusText}`, false);
      }
    } catch (error: any) {
      this.log(`Fetch EXCEPTION: ${error.name} - ${error.message}`, false);
    }
  }
}
