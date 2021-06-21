import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArrDropdown } from '../../models/arrDropdown';

@Injectable()
export class MasterTemplateService {
    private uri = environment.apiUrl + "MasterTemplateService/";
    constructor(private http: HttpClient) { }
    
    dropdownList(id): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('dropdowntype_id', id);
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_view_all", {params: params});
    }

    dropdownEntitlement(): Observable<ArrDropdown[]> {
        let params = new HttpParams();
        params = params.append('dropdowntype_id', "0");
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_view_entitlement", {params: params});
    }

}
