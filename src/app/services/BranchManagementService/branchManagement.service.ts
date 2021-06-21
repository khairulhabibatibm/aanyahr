import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class BranchManagementService {
    private uri = environment.apiUrl + "BranchManagement/";
    constructor(private http: HttpClient) { }
    branchList(): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "branch_list", {params: params});
    }

    branchView(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('company_series_code', sessionStorage.getItem('sc'));
        params = params.append('company_id', sessionStorage.getItem('ci'));
        params = params.append('branch_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "branch_view", {params: params});
    }

    ipList(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('company_series_code', sessionStorage.getItem('sc'));
        params = params.append('company_id', sessionStorage.getItem('ci'));
        params = params.append('branch_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "branch_ip_view", {params: params});
    }

    contactList(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('company_series_code', sessionStorage.getItem('sc'));
        params = params.append('company_id', sessionStorage.getItem('ci'));
        params = params.append('branch_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "branch_contact_view", {params: params});
    }

    emailList(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('company_series_code', sessionStorage.getItem('sc'));
        params = params.append('company_id', sessionStorage.getItem('ci'));
        params = params.append('branch_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "branch_email_view", {params: params});
    }

    branchIU(param): Observable<any> {
        return this.http.post(this.uri + "BranchIU", param);
    }
}
