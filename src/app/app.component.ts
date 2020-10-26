import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as netlifyIdentity from 'netlify-identity-widget';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface SharedFile {
  id: string;
  title: string;
  description: string;
  canComment: boolean;
  showCommentForm: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // FUNCTIONS_URI = 'http://localhost:9000';
  FUNCTIONS_URI = '/.netlify/functions';

  files: SharedFile[] = [];
  user: { name: string; email: string };
  loading: boolean;
  addingComment: boolean;
  error: string;
  commentForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: [''],
    });
  }

  login() {
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user) => {
      netlifyIdentity.close();
      this.setUser(user);
    });
  }

  logout() {
    netlifyIdentity.logout();
  }

  fetchSharedFiles() {
    const URI = `${this.FUNCTIONS_URI}/shared`;

    this.loading = true;
    this.error = null;
    this.http
      .post(URI, { email: this.user.email })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => {
          this.files = res as SharedFile[];
        },
        (err) => {
          console.error(err);
          this.error = 'Could not load files';
        }
      );
  }

  addComment(file: SharedFile) {
    const msg = `${this.user.email}: ${this.commentForm.value.comment}`;
    const URI = `${this.FUNCTIONS_URI}/notice`;
    this.addingComment = true;
    this.error = null;
    this.http
      .post(URI, { objectId: file.id, msg: msg })
      .pipe(finalize(() => (this.addingComment = false)))
      .subscribe(
        (res) => {
          file.showCommentForm = false;
        },
        (err) => {
          console.error(err);
          this.error = 'Could not add notice';
        }
      );
  }

  downloadFile(id: string) {
    const URI = `${this.FUNCTIONS_URI}/download`;
    this.http.post(URI, { objectId: id }).subscribe();
  }

  private setUser(userData: any) {
    this.user = userData
      ? {
          name: userData.user_metadata.full_name,
          email: userData.email,
        }
      : null;
    if (this.user) {
      this.fetchSharedFiles();
    } else {
      this.files = [];
    }
  }

  ngOnInit() {
    netlifyIdentity.on('init', (user) => this.setUser(user));
    netlifyIdentity.on('logout', () => (this.user = null));
    netlifyIdentity.init();
  }
}
