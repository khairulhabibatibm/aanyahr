import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class PermissionManagementService {
    private uri = environment.apiUrl + "PermissionManagement/";
    constructor(private http: HttpClient) { }

    accessList(): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('access_level_id', sessionStorage.getItem('al'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "dynamic_menu_view", {params: params});
    }

    dataUploadList(id): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('access_level_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "data_upload_access_view", {params: params});
    }

    dataUploadAccess(id): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('access_level_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "data_upload_access_list_view", {params: params});
    }

    dataUploadIn(param): Observable<any> {
        return this.http.post(this.uri + "data_upload_access_in", param);
    }

    moduleList(id,): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('access_level_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "module_access_view", {params: params});
    }

    approvalModuleView(df, dt): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('date_from', df);
        params = params.append('date_to', dt);
        params = params.append('access_level_id', sessionStorage.getItem('al'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "approval_access_view", {params: params});
    }

    moduleIn(param): Observable<any> {
        return this.http.post(this.uri + "module_access_in", param);
    }

    reportList(id): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('access_level_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "report_access_view", {params: params});
    }

    reportAccess(id): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('access_level_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "report_access_list_view", {params: params});
    }

    reportIn(param): Observable<any> {
        return this.http.post(this.uri + "report_access_in", param);
    }
}
