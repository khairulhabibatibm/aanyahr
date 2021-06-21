import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RegisterService {

private register = environment.apiUrl + "AccountManagement/Registration";
private verify = environment.apiUrl + "AccountManagement/Verification";
private create = environment.apiUrl + "AccountManagement/CompanyBranchIU";

  constructor(private http: HttpClient) { }

  registerUser(param): Observable<any> {
    return this.http.post(this.register, param);
  }

  verifyUser(param): Observable<any>{
    return this.http.post(this.verify, param);
  }

  tenantCreate(param): Observable<any> {
    return this.http.post(this.create, param);
  }
}
