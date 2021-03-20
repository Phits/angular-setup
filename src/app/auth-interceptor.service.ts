import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('Request on the way', req);
        console.log('Request Url', req.url);
        const modifyRequest = req.clone({headers: req.headers.append('Auth', 'xyz')})

        // return next.handle(req);
        return next.handle(modifyRequest).pipe(tap(event => {
            console.log('Event ', event)
            if (event.type === HttpEventType.Response) {
                console.log('Response arrived, body data ', event.body);
            }
        }));
    }
}

