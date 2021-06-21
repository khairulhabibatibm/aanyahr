import { LoginService } from './../auth/login/login.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(public auth: LoginService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
      request = request.clone({
        setHeaders:{
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json',
        }
      })
      return next.handle(request);
    }

}
