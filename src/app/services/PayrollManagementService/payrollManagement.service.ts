import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class PayrollManagementService {
    private uri = environment.apiUrl + "PayrollManagement/";
    constructor(private http: HttpClient) { }

    headerView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_header_view_sel", {params: params});
    }

    adjustmentView(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_adjustment_view", {params: params});
    }

    payrollGeneration(id, ci, bi, cc, it, is, ip, iph): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('category_id', ci);
        params = params.append('branch_id', bi);
        params = params.append('confidential_id', cc);
        params = params.append('include_tax', it);
        params = params.append('include_sss', is);
        params = params.append('include_pagibig', ip);
        params = params.append('include_philhealth', iph);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_generation_view", {params: params});
    }

    tempDetailView(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('employee_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payslip_detail_temp_view", {params: params});
    }

    tempTimekeepingView(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('employee_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_final_temp_view_sel", {params: params});
    }

    payrollView(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('payroll_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_view_sel", {params: params});
    }

    payrollList(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('payroll_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payroll_view", {params: params});
    }

    payrollDetailView(id, i, p): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('payroll_id', i);
        params = params.append('payslip_id', p);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payslip_view", {params: params});
    }

    detailView(id, i, pi, si): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('employee_id', i);
        params = params.append('payroll_id', pi);
        params = params.append('payslip_id', si);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "payslip_detail_view", {params: params});
    }

    timekeepingView(id, i, pi, si, ti): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('employee_id', i);
        params = params.append('payroll_id', pi);
        params = params.append('payslip_id', si);
        params = params.append('timekeeping_header_id', ti);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "timekeeping_final_view_sel", {params: params});
    }

    postedView(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('posted_payslip_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "posted_payslip_view", {params: params});
    }

    postedDetailView(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('posted_payslip_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "posted_payslip_detail_view", {params: params});
    }

    postedTimekeepingView(id, i, e, th): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('posted_payslip_id', i);
        params = params.append('employee_id', e);
        params = params.append('timekeeping_header_id', th);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "posted_timekeeping_final_view_sel", {params: params});
    }

    payslipList(id): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('employee_id', id);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "posted_payslip_employee_view", {params: params});
    }
    
    payslipDetailList(id, i): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('payroll_header_id', id);
        params = params.append('posted_payslip_id', i);
        params = params.append("created_by", sessionStorage.getItem('u'));
        params = params.append('series_code', sessionStorage.getItem('sc'));
        return this.http.get<any[]>(this.uri + "posted_payslip_detail_employee_view", {params: params});
    }

    headerIU(param): Observable<any> {
        return this.http.post(this.uri + "payroll_header_in", param);
    }

    adjustmentIU(param): Observable<any> {
        return this.http.post(this.uri + "payroll_adjustment_in", param);
    }

    payrollI(param): Observable<any> {
        return this.http.post(this.uri + "payroll_in", param);
    }

    postPayroll(param): Observable<any> {
        return this.http.post(this.uri + "posted_payslip_in", param);
    }
}
