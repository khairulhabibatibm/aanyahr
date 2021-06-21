import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DataUploadManagementService } from '../../../services/DataUploadManagementService/dataUploadManagement.service';
import { PermissionManagementService } from '../../../services/PermissionManagementService/permissionManagement.service';
import { HttpEventType, HttpClient, HttpBackend } from '@angular/common/http';
import Swal from 'sweetalert2';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import { FilingManagementService } from '../../../services/FilingManagementService/filingManagement.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  private uri = environment.exportUrl;
  isLoading: boolean = true
  showTable: boolean = true
  uploadList = []
  headerList = []
  tableOutput = []
  selectedOutput = []
  returnOutput = []
  progress: number = 0
  selectedData: number
  errorText: string
  _object = Object;
  constructor(private permissionManagementService: PermissionManagementService, private dataUploadManagementService: DataUploadManagementService,
    private http: HttpClient, private handler: HttpBackend, private tenantDefaultService: TenantDefaultService, private userManagementService: UserManagementService,
    private filingManagementService: FilingManagementService) { }

  ngOnInit() {
    this.http = new HttpClient(this.handler)
    this.permissionManagementService.dataUploadAccess(sessionStorage.getItem('al')).subscribe(data => {
      this.uploadList = data
      this.isLoading = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
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
    this.uploadFiles(files)
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

  onChange() {
    this.tableOutput = []
    this.headerList = []
    this.returnOutput = []
    this.dataUploadManagementService.uploadHeader(this.selectedData).subscribe(data => {
      this.tableOutput = data
      this.headerList = data
      this.showTable = true
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  exportTemplate() {
    const selected = this.uploadList.filter(x => x.data_upload_id === this.selectedData)[0]
    this.dataUploadManagementService.downloadTemplate(selected.export).subscribe(data => {
      window.location.href = this.uri + data['response']
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  uploadFiles(files) {
    this.errorText = ""
    debugger
    const selected = this.uploadList.filter(x => x.data_upload_id === this.selectedData)[0]
    this.http = new HttpClient(this.handler)
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('formfile', fileToUpload, fileToUpload.name);
    this.http.post(this.uri + selected.upload +
      "?created_by=" + sessionStorage.getItem('u') +
      "&dropdown_id=" + this.selectedData +
      "&series_code=" + sessionStorage.getItem('sc'), formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          Swal.fire("Ok!", "Upload successful!", "success");
          this.dataUploadManagementService.uploadDetail(this.selectedData).subscribe(data => {
            let temp = JSON.parse(data.toString())
            this.selectedOutput = JSON.parse(data.toString())
            for (var i = 0; i < this.tableOutput.length; i++) {
              let col = this.tableOutput[i].columns
              let isView = this.tableOutput[i].is_view
              if (col !== "with_error") {
                if (!isView) {
                  temp.forEach(function (x) { delete x[col] });
                }
              }
            }
            this.returnOutput = temp
            if (this.returnOutput.filter(x => x.with_error === 1).length > 0) {
              this.errorText = "There are " + this.returnOutput.filter(x => x.with_error === 1).length + " rows error on your file please review."
            }
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
      });
  }

  submit() {
    let title = "Are you sure?"
    if (this.returnOutput.filter(x => x.with_error === 1).length > 0) {
      title = "Are you sure sure you want to continue? There are " + this.returnOutput.filter(x => x.with_error === 1).length + " rows that will not be saved."
    }
    Swal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Please Wait !',
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading()
            const selected = this.uploadList.filter(x => x.data_upload_id === this.selectedData)[0]
            var obj = {
              series_code: sessionStorage.getItem('sc'),
              created_by: sessionStorage.getItem('u')
            }
            switch (selected.service) {
              case "TenantSetupManagement":
                this.tenantDefaultService.uploadIn(selected.save, obj).subscribe(data => {
                  if (data === 0) {
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  }
                  else {
                    Swal.fire("Ok!", "Transaction successful!", "success");
                  }
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  });
                break;
              case "UserManagement":
                this.userManagementService.uploadIn(selected.save, obj).subscribe(data => {
                  if (data === 0) {
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  }
                  else {
                    Swal.fire("Ok!", "Transaction successful!", "success");
                  }
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  });
                break;
              case "FilingManagement":
                this.filingManagementService.uploadIn(selected.save, obj).subscribe(data => {
                  if (data === 0) {
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  }
                  else {
                    Swal.fire("Ok!", "Transaction successful!", "success");
                  }
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  });
                break;
            }
          },
        });
      }
    })
  }
}
