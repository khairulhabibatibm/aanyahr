import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable()
export class DataUploadManagementService {
    private uri = environment.uploadUrl + "DataUploadManagement/";
    constructor(private http: HttpClient, private handler: HttpBackend) {
        this.http = new HttpClient(this.handler)
     }

    templateAttendance(): Observable<any[]>{
        return this.http.get<any[]>(this.uri + "ExportAttendanceLog");
    }

    downloadTemplate(template): Observable<any[]>{
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + template, {params: params});
    }

    uploadHeader(m): Observable<any[]>{
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('dropdown_id', m);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "data_upload_header", {params: params});
    }

    uploadDetail(m): Observable<any[]>{
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('dropdown_id', m);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "data_upload_view", {params: params});
    }

    uploadImage(param, ec, m): Observable<any> {
        this.http = new HttpClient(this.handler)
        let fileToUpload = <File>param[0];
        const formData = new FormData();
        formData.append('formfile', fileToUpload, fileToUpload.name);
        return this.http.post(this.uri + "UploadImage?" + 
        "series_code=" + sessionStorage.getItem('sc') + 
        "&created_by=" + sessionStorage.getItem('u') +
        "&code=" + ec +
        "&module_id=" + m, formData);
    }

    companyImage(param, ec, m): Observable<any> {
        this.http = new HttpClient(this.handler)
        let fileToUpload = <File>param[0];
        const formData = new FormData();
        formData.append('formfile', fileToUpload, fileToUpload.name);
        return this.http.post(this.uri + "UploadImage?" + 
        "series_code=code" + 
        "&created_by=" + sessionStorage.getItem('u') +
        "&code=code" +
        "&module_id=" + m, formData);
    }

    dropdownI(param, d): Observable<any> {
        this.http = new HttpClient(this.handler)
        let fileToUpload = <File>param[0];
        const formData = new FormData();
        formData.append('formfile', fileToUpload, fileToUpload.name);
        return this.http.post(this.uri + "dropdown_upload?" + 
        "&created_by=" + sessionStorage.getItem('u') +
        "&dropdown_id=" + d + 
        "series_code=" + sessionStorage.getItem('sc'), formData);
    }
}
