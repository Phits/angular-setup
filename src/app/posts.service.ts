import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  // Example of subscribing in service
  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request are only sent when you subscribe
    this.http
      .post<{ name: string }>(
        'https://angular-setup-3899e-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
          console.log(error.message);
        }
      );
  }

  // Example is returning in service and subscribing in component
  // Need to know when subscribe for loading indicator
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-setup-3899e-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://angular-setup-3899e-default-rtdb.firebaseio.com/posts.json'
    );
  }
}
