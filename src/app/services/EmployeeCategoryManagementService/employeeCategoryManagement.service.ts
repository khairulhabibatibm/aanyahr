import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class EmployeeCategoryManagementService {
    private uri = environment.apiUrl + "EmployeeCategoryManagement/";
    constructor(private http: HttpClient) { }
    categoryList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('category_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_category_view", {params: params});
    }

    categoryView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('category_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "employee_category_view_sel", {params: params});
    }

    employeeCategoryIU(param): Observable<any> {
        return this.http.post(this.uri + "employee_category_in_up", param);
    }
}
