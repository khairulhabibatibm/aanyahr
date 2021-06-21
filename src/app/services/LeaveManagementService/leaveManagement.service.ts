import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class LeaveManagementService {

    private uri = environment.apiUrl + "LeaveManagement/";

    constructor(private http: HttpClient) { }

    leaveView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('leave_type_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "leave_type_view_sel", {params: params});
    }

    leaveList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('leave_type_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "leave_type_view", {params: params});
    }

    employeeLeave(id, e): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('leave_type_id', id);
        params = params.append("employee_id", e);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "leave_employee_view", {params: params});
    }

    leaveIU(param): Observable<any> {
        return this.http.post(this.uri + "leave_type_in_up", param);
    }

    leaveI(param): Observable<any> {
        return this.http.post(this.uri + "leave_entitlement_in", param);
    }

}
