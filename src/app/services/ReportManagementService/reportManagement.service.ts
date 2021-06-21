import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReportManagementService {
    private uri = environment.apiUrl + "ReportManagement/";

    constructor(private http: HttpClient) { }

    reportHeader(i): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('dropdown_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "report_header", {params: params});
    }

    reportView(i, df, dt, e): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('employee_id', e);
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('dropdown_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        console.log(params)
        return this.http.get<any[]>(this.uri + "report_view", {params: params});
    }

}
