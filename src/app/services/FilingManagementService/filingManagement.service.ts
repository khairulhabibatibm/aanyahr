import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class FilingManagementService {
    private uri = environment.apiUrl + "FilingManagement/";
    constructor(private http: HttpClient, private handler: HttpBackend) { }

    officialBusinessView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('official_business_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "official_business_view_sel", {params: params});
    }

    overtimeView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('overtime_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "overtime_view_sel", {params: params});
    }

    leaveView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('leave_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "leave_view_sel", {params: params});
    }

    offsetView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('offset_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "offset_view_sel", {params: params});
    }

    offsetDetailView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('offset_id', i);
        params = params.append('file_type', ft);
        params = params.append('employee_id', sessionStorage.getItem('u'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "offset_detail_view", {params: params});
    }

    changeLogView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('change_log_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "change_log_view_sel", {params: params});
    }

    changeLogDetailView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('change_log_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "change_log_detail_view_sel", {params: params});
    }

    changeScheduleView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('change_schedule_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "change_schedule_view_sel", {params: params});
    }

    changeScheduleDetailView(i, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('change_schedule_id', i);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "change_schedule_detail_view", {params: params});
    }

    coeView(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('coe_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "coe_request_view_sel", {params: params});
    }

    shiftList(i, df, dt): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('shift_id', i);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('employee_id', sessionStorage.getItem('u'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "change_schedule_shift_view", {params: params});
    }

    dashboardView(i, a): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('approver', a);
        params = params.append('count', i);
        params = params.append('employee_id', sessionStorage.getItem('u'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "filing_dashboard_view", {params: params});
    }

    approvalHeaderView(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('module_id', i);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "filing_dashboard_view", {params: params});
    }

    renderView(i, df, dt): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('employee_id', i);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "overtime_render_view", {params: params});
    }
    
    officialBusinessIU(param): Observable<any> {
        return this.http.post(this.uri + "official_business_in_up", param);
    }

    overtimeIU(param): Observable<any> {
        return this.http.post(this.uri + "overtime_in_up", param);
    }

    leaveIU(param): Observable<any> {
        return this.http.post(this.uri + "leave_in_up", param);
    }

    offsetIU(param): Observable<any> {
        return this.http.post(this.uri + "offset_in_up", param);
    }

    changeLogIU(param): Observable<any> {
        return this.http.post(this.uri + "change_log_in_up", param);
    }

    changeScheduleIU(param): Observable<any> {
        return this.http.post(this.uri + "change_schedule_in_up", param);
    }

    approvalIU(param): Observable<any> {
        return this.http.post(this.uri + "transaction_approval_up", param);
    }

    coeIU(param): Observable<any> {
        return this.http.post(this.uri + "coe_request_in_up", param);
    }

    renderI(param): Observable<any> {
        return this.http.post(this.uri + "overtime_render_up", param);
    }

    uploadIn(service, param): Observable<any> {
        return this.http.post(this.uri + service, param);
    }

    cancel(param): Observable<any> {
        return this.http.post(this.uri + "transaction_cancel_up", param);
    }
}
