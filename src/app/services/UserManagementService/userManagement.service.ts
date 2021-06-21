import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserManagementService {
    private uri = environment.apiUrl + "UserManagement/";
    constructor(private http: HttpClient) { }

    employeeView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('employee_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_view_sel", {params: params});
    }
    
    employeeFetch(id, row, index): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('employee_id', id);
        params = params.append('row', row);
        params = params.append('index', index);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_fetch", {params: params});
    }

    employeeList(): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('employee_id', "0");
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_active_view", {params: params});
    }

    leaveView(li, ltc, ln, tl, tt, id, gu): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('leave_type_id', li);
        params = params.append('leave_type_code', ltc);
        params = params.append('leave_name', ln);
        params = params.append('total_leaves', tl);
        params = params.append('tag_type', tt);
        params = params.append('id', id);
        params = params.append('gender_to_use', gu);
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_leave_view", {params: params});
    }

    scheduleView(si, th, df, dt, tt, id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('shift_id', si);
        params = params.append('total_working_hours', th);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('tag_type', tt);
        params = params.append('id', id);
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_schedule_view", {params: params});
    }

    movementView(e, m, df, dt): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('movement_type', m);
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('employee_id', e);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_movement_sel", {params: params});
    }

    employeeSupervisor(is, e): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('employee_id', e);
        params = params.append('is_supervisor', is);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_supervisor_view", {params: params});
    }

    recurringView(ad, id, t, a, tt, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('adjustment_type_id', ad);
        params = params.append('adjustment_id', id);
        params = params.append('timing_id', t);
        params = params.append('amount', a);
        params = params.append('tag_type', tt);
        params = params.append('id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_recurring_view", {params: params});
    }

    governmentView(gt, a, ti, tt, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('government_type_id', gt);
        params = params.append('timing_id', ti);
        params = params.append('amount', a);
        params = params.append('tag_type', tt);
        params = params.append('id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_contribution_view", {params: params});
    }

    employeeAdjustment(id, ai, an, a, t, tt, i){
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('adjustment_type_id', ai);
        params = params.append('adjustment_name', an);
        params = params.append('amount', a);
        params = params.append('taxable', t);
        params = params.append('tag_type', tt);
        params = params.append('id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_adjustment_view", {params: params});
    }

    profileView(u): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('employee_id', u);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "employee_profile_view", {params: params});
    }

    employeeIU(param): Observable<any> {
        return this.http.post(this.uri + "employee_in_up", param);
    }

    credentialU(param): Observable<any> {
        return this.http.post(this.uri + "employee_profile_up", param);
    }

    uploadIn(service, param): Observable<any> {
        return this.http.post(this.uri + service, param);
    }

}
