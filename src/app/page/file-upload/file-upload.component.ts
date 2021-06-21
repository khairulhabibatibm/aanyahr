import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  private uri = environment.uploadUrl + "DataUploadManagement/";
  public progress: number = 0;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient, private handler: HttpBackend) { }

  ngOnInit() {
    this.http = new HttpClient(this.handler)
  }

  public uploadFile = (event: any) => {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute('value', fileName)
    }
    var files = event.target.files;
    if (files.length === 0) {
      return;
    }

    this.http = new HttpClient(this.handler)
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('formfile', fileToUpload, fileToUpload.name);
    this.http.post(this.uri + 'attendance_log_temp?series_code=' + sessionStorage.getItem('sc') + "&created_by=" + sessionStorage.getItem('u'), formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.onUploadFinished.emit(event.body);
        }
      });
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click();
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
