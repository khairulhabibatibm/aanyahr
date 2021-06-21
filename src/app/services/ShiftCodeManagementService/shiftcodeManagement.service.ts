import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ShiftcodeManagementService {
    private uri = environment.apiUrl + "ScheduleManagement/";

    constructor(private http: HttpClient) { }

    shiftView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('shift_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "shift_code_view_sel", {params: params});
    }

    shiftList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('shift_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "shift_code_view", {params: params});
    }

    shiftIU(param): Observable<any> {
        return this.http.post(this.uri + "shift_code_in_up", param);
    }

    shiftPerDayView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('shift_per_day_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "shift_code_per_day_view_sel", {params: params});
    }

    shiftDetailPerDayView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('shift_per_day_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "shift_code_per_day_detail_view_sel", {params: params});
    }

    shiftDetailIU(param): Observable<any> {
        return this.http.post(this.uri + "shift_code_per_day_in", param);
    }
}
