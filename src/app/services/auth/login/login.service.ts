import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LoginService {

private uri = environment.apiUrl + "AccountManagement/AuthenticateLogin";
constructor(private http: HttpClient) { }

  authenticateUser(param): Observable<any> {
    return this.http.post(this.uri, param);
  }

  saveToken(req) {
    sessionStorage.setItem('token', req['token'])
    sessionStorage.setItem('u', req['id'])
    sessionStorage.setItem('sc', req['series_code'])
    sessionStorage.setItem('al', req['access_level_id'])
    sessionStorage.setItem('apl', req['approval_level_id'])
    sessionStorage.setItem('cat', req['category_id'])
    sessionStorage.setItem('ci', req['company_id'])
    sessionStorage.setItem('ap', req['approver'])
    sessionStorage.setItem('s', req['start'])
    sessionStorage.setItem('e', req['end'])
    sessionStorage.setItem('dn', req['display_name'])
    sessionStorage.setItem('ip', req['image_path'])
    sessionStorage.setItem('cn', req['company_name'])
  }

  getToken() {
    return sessionStorage.getItem('token')
  }

  isAuthenticated() {
    if (this.getToken()) {
      return true
    }
    return false
  }
}
