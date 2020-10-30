import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as netlifyIdentity from 'netlify-identity-widget';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReadMode } from 'ngx-file-helpers';

export interface SharedFile {
  id: string;
  title: string;
  description: string;
  contentID: string;
  contentFilename: string;
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
  fileReadMode = ReadMode.arrayBuffer;

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

  downloadFile(file: SharedFile) {
    const URI = `${this.FUNCTIONS_URI}/download?id=${file.id}&name=${file.contentFilename}`;
    // this.download(URI, file.contentFilename);
    this.http.get(URI, { responseType: 'blob' }).subscribe((res: any) => {
      const a = document.createElement('a');
      // a.href = window.URL.createObjectURL(new Blob([res]))
      a.setAttribute('href', window.URL.createObjectURL(res));
      // a.setAttribute('href', window.URL.createObjectURL(new Blob([new Uint8Array(res)])));
      a.style.display = 'none';
      a.setAttribute('download', file.contentFilename || 'download');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  uploadFile(file: SharedFile, e) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', e.underlyingFile.type)
    this.http.post(`${this.FUNCTIONS_URI}/upload?id=${file.id}&filename=${e.underlyingFile.name}`, 
    e.underlyingFile, {
      headers: headers
    }).subscribe()
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
