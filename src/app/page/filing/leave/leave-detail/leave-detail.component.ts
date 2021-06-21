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
import { LeaveManagementService } from '../../../../services/LeaveManagementService/leaveManagement.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css']
})
export class LeaveDetailComponent implements OnInit {
  private uri = environment.exportFile;
  leaveForm: FormGroup
  isLoading: boolean = true
  isView: boolean = false
  errleaveType: boolean
  errReason: boolean
  isCancel: boolean = false
  isSubmit: boolean = false
  errCancelReason: boolean = false
  dateFrom: any
  id: string
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  leaveList = []
  documents = []
  fileList = []
  pipe = new DatePipe('en-US');
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  remarks: string = ""
  transactionID = ""
  @ViewChild('cancelModal') viewModal: ElementRef
  constructor(private leaveManagementService: LeaveManagementService, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private fb: FormBuilder, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.leaveForm = this.fb.group({
      leave_code: '',
      selectedLeaveType: null,
      balance: { value: 0, disabled: true },
      withPay: true,
      halfday: false,
      dateFrom: this.dateToday,
      dateTo: this.dateToday,
      reason: '',
    })
    if (this.parentDetail !== undefined) {
      this.isDashboard = true
      if (this.parentDetail["dashboardId"] !== 0) {
        this.id = this.parentDetail["dashboardId"]
      }
      else {
        this.id = ""
        this.leaveForm.get("dateFrom").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
        this.leaveForm.get("dateTo").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
      }
    }
    this.resetError(false)
    this.leaveManagementService.employeeLeave("0", sessionStorage.getItem('u')).subscribe(data => {
      this.leaveList = data
      if (this.id !== "") {
        this.isCancel = true
        this.isSubmit = true
        this.filingManagementService.leaveView(this.id, this.fileType).subscribe(data => {          
          this.transactionID = data[0].leave_id
          this.leaveForm.setValue({
            leave_code: data[0].leave_code,
            selectedLeaveType: data[0].leave_type_id,
            balance: this.leaveList.filter(x => x.leave_type_id === data[0].leave_type_id)[0].leave_balance,
            withPay: data[0].is_paid,
            halfday: data[0].is_half_day,
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
            reason: data[0].description,
          });

          this.fileManagerService.viewFile(34, this.id, this.fileType).subscribe(file => {

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
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  selectLeave() {
    this.leaveForm.get("balance").setValue(this.leaveList.filter(x => x.leave_type_id === this.leaveForm.get("selectedLeaveType").value)[0].leave_balance)
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
    this.resetError(false)
    var flag = true
    if (this.leaveForm.get('selectedLeaveType').value === "" || this.leaveForm.get('selectedLeaveType').value === null) {
      flag = false;
      this.errleaveType = true;
    }
    if (this.leaveForm.get('reason').value === "" || this.leaveForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    return flag
  }

  resetError(e) {
    this.errleaveType = e;
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
                leave_id: this.id,
                leave_code: this.leaveForm.get("leave_code").value,
                leave_type_id: this.leaveForm.get("selectedLeaveType").value,
                date_from: this.pipe.transform(this.leaveForm.get("dateFrom").value.year + "/" + this.leaveForm.get("dateFrom").value.month + "/" + this.leaveForm.get("dateFrom").value.day + "", 'MM/dd/yyyy'),
                date_to: this.pipe.transform(this.leaveForm.get("dateTo").value.year + "/" + this.leaveForm.get("dateTo").value.month + "/" + this.leaveForm.get("dateTo").value.day + "", 'MM/dd/yyyy'),
                is_half_day: this.leaveForm.get("halfday").value,
                is_paid: this.leaveForm.get("withPay").value,
                description: this.leaveForm.get("reason").value,
                with_attachment: this.fileList.length + this.documents.length > 0 ? true : false,
                employee_id: sessionStorage.getItem('u'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
                created_by: sessionStorage.getItem('u'),
              }
              this.filingManagementService.leaveIU(obj).subscribe(data => {
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
                      this.fileManagerService.uploadFile(formData, data.code, 34, data.id).subscribe(file => {
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
                module_id: 34,
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
