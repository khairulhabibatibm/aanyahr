import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class FileManagerService {

    private uri = environment.uploadFile + "FileManager/";
    constructor(private http: HttpClient, private handler: HttpBackend) { }

    viewFile(m, t, ft): Observable<any[]> {        
        let params = new HttpParams();
        params = params.append('series_code', sessionStorage.getItem('sc'));
        params = params.append('module_id', m);
        params = params.append('transaction_id', t);
        params = params.append('file_type', ft);
        params = params.append('created_by', sessionStorage.getItem('u'));
        return this.http.get<any[]>(this.uri + "file_attachment_sel", {params: params});
    }

    updateFile(param): Observable<any> {
        return this.http.post(this.uri + "file_attachment_update", param);
    }

    uploadFile(formData, code, module, transaction): Observable<any> {
        this.http = new HttpClient(this.handler)
        return this.http.post(this.uri + "UploadAttachment?series_code=" + sessionStorage.getItem('sc') + "&created_by=" + sessionStorage.getItem('u') + "&code=" +  code + "&module_id=" + module + "&transaction_id=" + transaction, formData);
    }

}
