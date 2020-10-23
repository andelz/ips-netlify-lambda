import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  lambda() {
    // const URI = '/.netlify/functions/getshares';
    const URI = 'http://localhost:9000/getshares';
    this.http.get(URI).subscribe(res => console.log(res))
  }
}
