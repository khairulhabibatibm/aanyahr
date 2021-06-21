import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class HolidayManagementService {
    private uri = environment.apiUrl + "HolidayManagement/";
    constructor(private http: HttpClient) { }

    holidayList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('holiday_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "holiday_view_sel", {params: params});
    }

    branchList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('holiday_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "holiday_branch_view", {params: params});
    }

    detailList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('holiday_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "holiday_detail_view", {params: params});
    }

    HolidayIU(param): Observable<any> {
        return this.http.post(this.uri + "HolidayIU", param);
    }
}
