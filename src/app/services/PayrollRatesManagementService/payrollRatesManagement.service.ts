import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class PayrollRatesManagementService {
    private uri = environment.apiUrl + "PayrollSetupManagement/";
    constructor(private http: HttpClient) { }
    
    rateView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('rate_group_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_rates_detail_view_sel", {params: params});
    }

    sssView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('contribution_group_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "sss_table_view_sel", {params: params});
    }

    pagibigView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('contribution_group_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "pagibig_table_view_sel", {params: params});
    }

    philhealthView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('contribution_group_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "philhealth_table_view_sel", {params: params});
    }

    adView(id): Observable<any[]> {   
        let params = new HttpParams();
        params = params.append('recurring_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "recurring_view_sel", {params: params});
    }

    taxView(id, type): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('contribution_group_id', id);
        params = params.append('payroll_type_id', type);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "tax_table_view_sel", {params: params});
    }

    viewAD(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('recurring_type', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "recurring_view", {params: params});
    }

    viewRecurring(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('employee_id', id);
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_recurring_view", {params: params});
    }

    rateIU(param): Observable<any> {
        return this.http.post(this.uri + "payroll_rates_in", param);
    }

    loansView(id): Observable<any[]> {   
        let params = new HttpParams();
        params = params.append('loan_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "loan_view_sel", {params: params});
    }

    computeLoan(id, am, ls, t, ti): Observable<any[]> {   
        let params = new HttpParams();
        params = params.append('loan_id', id);
        params = params.append('total_amount', am);
        params = params.append('loan_start', ls);
        params = params.append('terms', t);
        params = params.append('timing_id', ti);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "loan_load", {params: params});
    }

    loansDetailView(id): Observable<any[]> {   
        let params = new HttpParams();
        params = params.append('loan_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "loan_detail_view", {params: params});
    }

    governmentView(id): Observable<any[]> {   
        let params = new HttpParams();
        params = params.append('employee_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_contribution_view", {params: params});
    }

    sssIU(param): Observable<any> {
        return this.http.post(this.uri + "sss_table_in", param);
    }

    pagibigIU(param): Observable<any> {
        return this.http.post(this.uri + "pagibig_table_in", param);
    }

    philhealthIU(param): Observable<any> {
        return this.http.post(this.uri + "philhealth_table_in", param);
    }

    taxIU(param): Observable<any> {
        return this.http.post(this.uri + "tax_table_in", param);
    }

    adIU(param): Observable<any> {
        return this.http.post(this.uri + "recurring_in_up", param);
    }

    recurringI(param): Observable<any> {
        return this.http.post(this.uri + "payroll_recurring_in", param);
    }

    loanIU(param): Observable<any> {
        return this.http.post(this.uri + "loan_in_up", param);
    }

    governmentI(param): Observable<any> {
        return this.http.post(this.uri + "payroll_contribution_in", param);
    }
}
