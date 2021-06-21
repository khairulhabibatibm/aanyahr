import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class TimekeepingManagementService {
    private uri = environment.apiUrl + "TimekeepingManagement/";
    constructor(private http: HttpClient) { }

    timekeepingView(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_header_view_sel", {params: params});
    }

    generationView(i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_generation_view", {params: params});
    }

    generatedView(i, tk): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('timekeeping_id', tk);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_view_sel", {params: params});
    }

    generatedDetailView(i, tk): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('timekeeping_id', tk);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_detail_view_sel", {params: params});
    }

    cutoffView(ci, mi): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('cutoff_id', ci);
        params = params.append('month_id', mi);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_cutoff_view", {params: params});
    }
    
    finalView(i, e, df, dt): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('employee_id', e);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_final_view_sel", {params: params});
    }

    employeeTimekeeping(e, df, dt): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('employee_id', e);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_generation_employee", {params: params});
    }

    payrollTKView(i){
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('timekeeping_header_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_header_view", {params: params});
    }

    timekeepingIU(param): Observable<any> {
        return this.http.post(this.uri + "timekeeping_header_in_up", param);
    }

    generationIU(param): Observable<any> {
        return this.http.post(this.uri + "timekeeping_in_up", param);
    }

}
