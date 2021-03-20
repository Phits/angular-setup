import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

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
        'add your own url',
        postData,
        {
          // Return full response, not just body
          observe: 'response'
        }
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
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        'add your own url',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params: searchParams,
          responseType: 'json' //defaults to json
        }
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
      'add your own url',
      {
        observe: 'events',
        responseType: 'text' // option json, text or blob
      }
    ).pipe(tap(events => {
      console.log(events);
      if (events.type === HttpEventType.Sent) {
        // ..
      }
      if (events.type === HttpEventType.Response) {
        console.log(events.body);
      }
    }));
  }
}
