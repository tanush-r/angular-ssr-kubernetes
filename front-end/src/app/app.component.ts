import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HttpClientModule], // Include HttpClientModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    console.log('Environment Configuration');
  }

  fetchData() {
    this.http.get('/api').subscribe(
      response => {
        console.log('API Response:', response);
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
}
