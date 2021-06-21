import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AccountManagementService {
    private uri = environment.apiUrl + "AccountManagement/";
    constructor(private http: HttpClient) { }
    companyView(): Observable<any[]>{
        let params = new HttpParams();
        params = params.append('company_id', sessionStorage.getItem('ci'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "company_view_sel", {params: params});
    }

    tenantUpdate(param): Observable<any> {
        return this.http.post(this.uri + "CompanyIU", param);
    }
}
