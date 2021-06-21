import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArrDropdown } from '../../models/arrDropdown';

@Injectable()
export class TenantMasterService {
    private uri = environment.apiUrl + "TenantMasterSetup/";
    constructor(private http: HttpClient) { }

    dropdownList(id): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        params = params.append('dropdowntype_id', id);
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_fix_view", {params: params});
    }

    dropdownEntitlement(): Observable<ArrDropdown[]> {
        let params = new HttpParams();
        params = params.append('dropdowntype_id', "0");
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_view_entitlement", {params: params});
    }

    dropdownFixType(): Observable<ArrDropdown[]> {
        let params = new HttpParams();
        params = params.append('active', "1");
        return this.http.get<ArrDropdown[]>(this.uri + "dropdown_type_view_fix", {params: params});
    }

    rateList(): Observable<ArrDropdown[]> {        
        let params = new HttpParams();
        return this.http.get<ArrDropdown[]>(this.uri + "payroll_rates_view", {params: params});
    }

    moduleView(): Observable<ArrDropdown[]> {
        let params = new HttpParams();
        params = params.append('module_type', "child");
        return this.http.get<ArrDropdown[]>(this.uri + "module_type_view", {params: params});
    }

    menuList(): Observable<any[]> {    
        let params = new HttpParams();
        params = params.append('created_by', sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "modules_view", {params: params});
    }

    moduleList(): Observable<any[]> {    
        return this.http.get<any[]>(this.uri + "modules_approval_view");
    }

    sssView(): Observable<any[]> {       
        return this.http.get<any[]>(this.uri + "sss_table_view");
    }

    pagibigView(): Observable<any[]> {        
        let params = new HttpParams();
        return this.http.get<any[]>(this.uri + "pagibig_table_view");
    }

    philhealthView(): Observable<any[]> {        
        return this.http.get<any[]>(this.uri + "philhealth_table_view");
    }
    
    taxView(type): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_type_id', type);
        return this.http.get<any[]>(this.uri + "tax_table_view", {params: params});
    }
}
