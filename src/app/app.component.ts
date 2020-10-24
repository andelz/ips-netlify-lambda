import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as netlifyIdentity from 'netlify-identity-widget';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

user;
  constructor(private http: HttpClient) {    
  }

  login() {
    netlifyIdentity.init();
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user) => {
     this.user = user;
      console.log(user);
    });
  }

  lambda() {
    const URI = '/.netlify/functions/shared';
    // const URI = 'http://localhost:9000/shared';
    this.http
      .post(URI, { email: 'andel.schulz@gmail.com' })
      .subscribe((res) => console.log(res));
  }
}
