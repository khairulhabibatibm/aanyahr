import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { FileManagerService } from '../../../../services/FileManagerService/fileManager.service';
import { FilingManagementService } from '../../../../services/FilingManagementService/filingManagement.service';

@Component({
  selector: 'app-official-business-detail',
  templateUrl: './official-business-detail.component.html',
  styleUrls: ['./official-business-detail.component.css']
})
export class OfficialBusinessDetailComponent implements OnInit {
  private uri = environment.exportFile;
  fileList: any
  officialBusinessForm: FormGroup
  isLoading: boolean = true
  isView: boolean = false
  isCancel: boolean = false
  isSubmit: boolean = false
  errCancelReason: boolean = false
  dateFrom: string
  dateTo: string
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  dfPopTime: any
  dfPopDate: any
  dtPopTime: any
  dtPopDate: any
  pipe = new DatePipe('en-US');
  errCompany: boolean
  errLocation: boolean
  errReason: boolean
  id: string
  documents = []
  remarks: string = ""
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  transactionID = ""
  createdBy: number
  @ViewChild('cancelModal') viewModal: ElementRef
  constructor(private fb: FormBuilder, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.officialBusinessForm = this.fb.group({
      official_business_code: '',
      dateFrom: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'),
      dateTo: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'),
      company: '',
      location: '',
      reason: '',
    })
    if (this.parentDetail !== undefined) {
      this.isDashboard = true
      this.isView = this.parentDetail["view"]
      if (this.parentDetail["dashboardId"] !== 0) {
        this.id = this.parentDetail["dashboardId"]
      }
      else {
        this.id = ""
        this.officialBusinessForm.get("dateFrom").setValue(this.pipe.transform(this.parentDetail["dashboardDate"] + " " + "00:00", 'MM/dd/yyyy hh:mm a'))
        this.officialBusinessForm.get("dateTo").setValue(this.pipe.transform(this.parentDetail["dashboardDate"] + " " + "00:00", 'MM/dd/yyyy hh:mm a'))
      }
    }
    this.resetError(false)
    if (this.id !== "") {
      this.isCancel = true
      this.isSubmit = true
      this.filingManagementService.officialBusinessView(this.id, this.fileType).subscribe(data => {        
        this.transactionID = data[0].official_business_id
        this.createdBy = data[0].created_by
        this.officialBusinessForm.setValue({
          official_business_code: data[0].official_business_code,
          dateFrom: this.pipe.transform(data[0].date_from, 'MM/dd/yyyy hh:mm a'),
          dateTo: this.pipe.transform(data[0].date_to, 'MM/dd/yyyy hh:mm a'),
          company: data[0].company_to_visit,
          location: data[0].location,
          reason: data[0].description,
        });

        this.fileManagerService.viewFile(35, this.id, this.fileType).subscribe(file => {
          for (var i = 0; i < file.length; i++) {
            this.documents.push({
              created_by: file[i].created_by,
              date_created: file[i].date_created,
              file_name: file[i].file_name,
              file_path: file[i].file_path,
              file_type: file[i].file_type,
              file_class: file[i].file_class,
              module_id: file[i].module_id,
              transaction_id: file[i].transaction_id,
              url: this.uri + file[i].file_path,
            })
          }
          if(!data[0].active){
            this.isView = true
          }
          this.isLoading = false
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
    else {
      this.id = "0"
      this.isLoading = false
      this.isCancel = false
      this.isSubmit = true
    }
  }

  deleteDocument(e) {
    this.documents.splice(e, 1);
  }

  setDateFrom() {
    let date: any
    let time: any
    if (this.dfPopDate === null || this.dfPopDate === undefined) {
      date = this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.dfPopDate.year + "/" + this.dfPopDate.month + "/" + this.dfPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.dfPopTime, 'hh:mm a') === null || this.pipe.transform(this.dfPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.dfPopTime, 'hh:mm a')
    }
    this.dateFrom = date + " " + time
    this.officialBusinessForm.get("dateFrom").setValue(this.dateFrom)
  }

  setDateTo() {
    let date: any
    let time: any
    if (this.dtPopDate === null || this.dtPopDate === undefined) {
      date = this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.dtPopDate.year + "/" + this.dtPopDate.month + "/" + this.dtPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.dtPopTime, 'hh:mm a') === null || this.pipe.transform(this.dtPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.dtPopTime, 'hh:mm a')
    }
    this.dateTo = date + " " + time
    this.officialBusinessForm.get("dateTo").setValue(this.dateTo)
  }

  validation() {
    this.resetError(false)
    var flag = true
    if (this.officialBusinessForm.get('company').value === "" || this.officialBusinessForm.get('company').value === null) {
      flag = false;
      this.errCompany = true;
    }
    if (this.officialBusinessForm.get('location').value === "" || this.officialBusinessForm.get('location').value === null) {
      flag = false;
      this.errLocation = true;
    }
    if (this.officialBusinessForm.get('reason').value === "" || this.officialBusinessForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    return flag
  }

  resetError(e) {
    this.errCompany = e;
    this.errLocation = e;
    this.errReason = e;
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click();
    if (event.target.files && event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files);
      this.fileList = event.target.files
    }
  }

  uploadFile(event) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = ""
      for (var i = 0; i < event.target.files.length; i++) {
        fileName += event.target.files[i].name + " ";
      }
      element.setAttribute('value', fileName)
      this.fileList = event.target.files;
    }
    if (this.fileList.length === 0) {
      return;
    }
  }

  submit() {
    if (this.validation()) {
      Swal.fire({
        title: 'Are you sure?',
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
              var obj = {
                official_business_id: this.id,
                date_from: this.officialBusinessForm.get("dateFrom").value,
                official_business_code: this.officialBusinessForm.get("official_business_code").value,
                date_to: this.officialBusinessForm.get("dateTo").value,
                company_to_visit: this.officialBusinessForm.get("company").value,
                location: this.officialBusinessForm.get("location").value,
                description: this.officialBusinessForm.get("reason").value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
              }
              this.filingManagementService.officialBusinessIU(obj).subscribe(data => {
                if (data.id === 0) {
                  Swal.fire("Failed!", data.description, "error");
                }
                else {
                  var file = []
                  for (var i = 0; i < this.documents.length; i++) {
                    file.push({
                      created_by: sessionStorage.getItem('u'),
                      series_code: sessionStorage.getItem('sc'),
                      file_name: this.documents[i].file_name,
                      file_path: this.documents[i].file_path,
                      file_type: this.documents[i].file_type,
                      module_id: this.documents[i].module_id,
                      transaction_id: data.id,
                    })
                  }

                  this.fileManagerService.updateFile(file).subscribe(upFile => {
                    if (this.fileList !== undefined) {
                      let filesToUpload: File[] = this.fileList;
                      const formData = new FormData();
                      Array.from(filesToUpload).map((file, index) => {
                        return formData.append('formfile', file, file.name);
                      });
                      this.fileManagerService.uploadFile(formData, data.code, 35, data.id).subscribe(file => {
                        if (file === 0) {
                          Swal.fire("Failed!", "File Upload Failed", "error");
                        }
                        else {
                          Swal.fire("Ok!", data.description, "success");
                          if (this.isDashboard) {
                            this.isSuccess.emit(data);
                          }
                        }
                      },
                        (error: HttpErrorResponse) => {
                          console.log(error.error);
                          Swal.fire("Failed!", "Transaction failed!", "error");
                        });
                    }
                    else {
                      Swal.fire("Ok!", data.description, "success");
                      if (this.isDashboard) {
                        this.isSuccess.emit(data);
                      }
                    }
                  },
                    (error: HttpErrorResponse) => {
                      console.log(error.error);
                      Swal.fire("Failed!", "Transaction failed!", "error");
                    });
                }
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                  Swal.fire("Failed!", "Transaction failed!", "error");
                });
            },
          });
        }
      })
    }
  }

  cancel(){
    this.modalService.open(this.viewModal, { size: 'sm' })
  }

  cancelTransaction(){
    let flag = true
    if(flag){
      Swal.fire({
        title: 'Are you sure?',
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
              var obj = {   
                module_id: 35,
                transaction_id: this.transactionID + ",",
                remarks: this.remarks,       
                employee_id: this.createdBy,
                created_by: sessionStorage.getItem('u'),
                series_code: sessionStorage.getItem('sc'),
              }
              this.filingManagementService.cancel(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                  this.modalService.dismissAll()
                  this.isView = true
                }
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                  Swal.fire("Failed!", "Transaction failed!", "error");
                });
            },
          });
        }
      })
    }
  }
}
