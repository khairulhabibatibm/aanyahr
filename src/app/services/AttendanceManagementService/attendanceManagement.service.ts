import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AttendanceManagementService {
    private uri = environment.apiUrl + "AttendanceManagement/";
    constructor(private http: HttpClient) { }

    scheduleView(id): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('shift_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_schedule_detail_view_sel", { params: params });
    }

    changeLogAttendanceView(df, dt): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('employee_id', sessionStorage.getItem('u'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_attendance_cl_view", { params: params });
    }

    attendanceView(df, dt, bi): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('bio_id', bi);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "attendance_log_sel", { params: params });
    }

    logView(df, dt, e, m, is): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('missing_logs_only', m);
        params = params.append('employee_id', e);
        params = params.append('is_supervisor', is);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_attendance_view", { params: params });
    }

    dashboardDateView(df, dt): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('employee_id', sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_attendance_dashboard_view", { params: params });
    }

    employeeSchedule(df, dt, i): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('employee_id', i);
        params = params.append('shift_id', "0");
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_schedule_view_sel", { params: params });
    }

    bundyI(param): Observable<any> {
        return this.http.post(this.uri + "attendance_log_in", param);
    }

    scheduleI(param): Observable<any> {
        return this.http.post(this.uri + "employee_schedule_detail_in", param);
    }

    attendanceI(param): Observable<any> {
        return this.http.post(this.uri + "attendance_log_temp_in", param);
    }

    attendanceIU(param): Observable<any> {
        return this.http.post(this.uri + "attendance_log_in_up", param);
    }

    attendanceD(param): Observable<any> {
        return this.http.post(this.uri + "attendance_log_deleted_in", param);
    }

    updateAttendance(param): Observable<any> {
        return this.http.post(this.uri + "employee_attendance_up", param);
    }
}
