import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArrDropdown } from '../../models/arrDropdown';

@Injectable()
export class TenantDefaultService {
    private uri = environment.apiUrl + "TenantDefaultSetup/";
    constructor(private http: HttpClient) { }

    dropdownTList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('dropdowntype_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_view", {params: params});
    }

    dropdownTAList(id): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('dropdowntype_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_view_all", {params: params});
    }

    approvalSequenceList(module, approval): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('modules', module);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('approval_level_id', approval);
        return this.http.get<ArrDropdown[]>(this.uri + "approval_sequence_module_view", {params: params});
    }

    seriesList(): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<ArrDropdown[]>(this.uri + "series_view", {params: params});
    }

    seriesNext(id): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('module_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<ArrDropdown[]>(this.uri + "series_view_next", {params: params});
    }

    approvalHeaderView(i): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('module_id', i);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "transaction_approval_header", {params: params});
    }

    approvalDetailView(s, i, df, dt): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('module_id', i);
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('series', s);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "transaction_approval_view", {params: params});
    }
    
    seriesU(param): Observable<any> {
        return this.http.post(this.uri + "series_up", param);
    }

    dropdownIU(param): Observable<any> {
        return this.http.post(this.uri + "DropdownIU", param);
    }

    approvalIU(param): Observable<any> {
        return this.http.post(this.uri + "approval_sequence_in", param);
    }

    uploadIn(service, param): Observable<any> {
        return this.http.post(this.uri + service, param);
    }
}
