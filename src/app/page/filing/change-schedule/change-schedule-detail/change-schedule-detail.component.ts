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
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';

@Component({
  selector: 'app-change-schedule-detail',
  templateUrl: './change-schedule-detail.component.html',
  styleUrls: ['./change-schedule-detail.component.css']
})
export class ChangeScheduleDetailComponent implements OnInit {
  private uri = environment.exportFile;
  isLoading: boolean = true
  isSearch: boolean = false
  isView: boolean = false
  isCancel: boolean = false
  isSubmit: boolean = false
  errShiftCode: boolean
  errReason: boolean
  changeScheduleForm: FormGroup
  id: string
  shiftList = []
  documents = []
  fileList = []
  scheduleList = []
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  pipe = new DatePipe('en-US');
  transactionID = ""
  remarks: string = ""
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  errCancelReason: boolean = false
  @ViewChild('cancelModal') viewModal: ElementRef
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private modalService: NgbModal, private shiftcodeManagementService: ShiftcodeManagementService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.changeScheduleForm = this.fb.group({
      selectedShift: null,
      changeScheduleCode: '',
      reason: '',
      dateFrom: this.dateToday,
      dateTo: this.dateToday,
    })
    if (this.parentDetail !== undefined) {
      this.isDashboard = true
      this.isView = this.parentDetail["view"]
      if (this.parentDetail["dashboardId"] !== 0) {
        this.id = this.parentDetail["dashboardId"]
      }
      else {
        this.id = ""
        this.changeScheduleForm.get("dateFrom").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
        this.changeScheduleForm.get("dateTo").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
      }
    }
    this.resetError(false)
    this.shiftcodeManagementService.shiftList("0").subscribe(data => {
      this.shiftList = data

      if (this.id !== "") {
        this.isCancel = true
        this.isSubmit = true
        this.filingManagementService.changeScheduleView(this.id, this.fileType).subscribe(data => {
          this.transactionID = data[0].change_schedule_id
          this.changeScheduleForm.setValue({
            selectedShift: data[0].shift_id,
            changeScheduleCode: data[0].change_schedule_code,
            reason: data[0].reason,
            dateFrom: {
              year: new Date(data[0].date_from).getFullYear(),
              month: new Date(data[0].date_from).getMonth() + 1,
              day: new Date(data[0].date_from).getDate(),
            },
            dateTo: {
              year: new Date(data[0].date_to).getFullYear(),
              month: new Date(data[0].date_to).getMonth() + 1,
              day: new Date(data[0].date_to).getDate(),
            },
          });

          this.filingManagementService.changeScheduleDetailView(this.id, this.fileType).subscribe(schedule => {
            this.scheduleList = schedule

            this.fileManagerService.viewFile(32, this.id, this.fileType).subscribe(file => {
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

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  search() {
    this.isSearch = true
    const dateFrom = this.pipe.transform(this.changeScheduleForm.get("dateFrom").value.year + "/" + this.changeScheduleForm.get("dateFrom").value.month + "/" + this.changeScheduleForm.get("dateFrom").value.day + "", 'MM/dd/yyyy')
    const dateTo = this.pipe.transform(this.changeScheduleForm.get("dateTo").value.year + "/" + this.changeScheduleForm.get("dateTo").value.month + "/" + this.changeScheduleForm.get("dateTo").value.day + "", 'MM/dd/yyyy')
    this.filingManagementService.shiftList(this.changeScheduleForm.get("selectedShift").value, dateFrom, dateTo).subscribe(data => {
      this.scheduleList = data
      this.isSearch = false

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.isSearch = false;
      })

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

  deleteDocument(e) {
    this.documents.splice(e, 1);
  }

  validation() {
    var flag = true
    this.resetError(false)
    if (this.changeScheduleForm.get('selectedShift').value === "" || this.changeScheduleForm.get('selectedShift').value === null) {
      flag = false;
      this.errShiftCode = true;
    }
    if (this.changeScheduleForm.get('reason').value === "" || this.changeScheduleForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    return flag
  }

  resetError(e) {
    this.errShiftCode = e;
    this.errReason = e;
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
                change_schedule_id: this.id,
                change_schedule_code: this.changeScheduleForm.get("changeScheduleCode").value,
                shift_id: this.changeScheduleForm.get("selectedShift").value,
                reason: this.changeScheduleForm.get("reason").value,
                date_from: this.pipe.transform(this.changeScheduleForm.get("dateFrom").value.year + "/" + this.changeScheduleForm.get("dateFrom").value.month + "/" + this.changeScheduleForm.get("dateFrom").value.day + "", 'MM/dd/yyyy'),
                date_to: this.pipe.transform(this.changeScheduleForm.get("dateTo").value.year + "/" + this.changeScheduleForm.get("dateTo").value.month + "/" + this.changeScheduleForm.get("dateTo").value.day + "", 'MM/dd/yyyy'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
                created_by: sessionStorage.getItem('u'),
                employee_id: sessionStorage.getItem('u'),
              }
              this.filingManagementService.changeScheduleIU(obj).subscribe(data => {
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
                      this.fileManagerService.uploadFile(formData, data.code, 32, data.id).subscribe(file => {
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
                module_id: 32,
                transaction_id: this.transactionID + ",",
                remarks: this.remarks,       
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
