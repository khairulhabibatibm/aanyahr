import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class LogService {
    private uri = environment.apiUrl + "LogService/";
    constructor(private http: HttpClient) { }
    
    logList(r, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('row', r);
        params = params.append('index', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "system_fetch_view", {params: params});
    }

    logView(df, dt, t): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('module_id', "0");
        params = params.append('transaction_type_id', t);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "system_log_view", {params: params});
    }

}
