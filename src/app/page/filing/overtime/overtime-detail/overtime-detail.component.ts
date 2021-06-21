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
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
@Component({
  selector: 'app-overtime-detail',
  templateUrl: './overtime-detail.component.html',
  styleUrls: ['./overtime-detail.component.css']
})
export class OvertimeDetailComponent implements OnInit {
  private uri = environment.exportFile;
  overtimeForm: FormGroup
  isLoading: boolean = true
  isView: boolean = false
  isCancel: boolean = false
  isSubmit: boolean = false
  errCancelReason: boolean = false
  errOTType: boolean
  errReason: boolean
  dfPopDate: any
  dfPopTime: any
  dtPopDate: any
  dtPopTime: any
  bdfPopDate: any
  bdfPopTime: any
  bdtPopDate: any
  bdtPopTime: any
  fileList: any
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  pipe = new DatePipe('en-US');
  otList = []
  id: string
  transactionID = ""
  remarks: string = ""
  documents = []
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  @ViewChild('cancelModal') viewModal: ElementRef
  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private route: ActivatedRoute, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.overtimeForm = this.fb.group({
      dateFrom: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'),
      dateTo: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'),
      dateBreakFrom: ({ value: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), disabled: true }),
      dateBreakTo: ({ value: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), disabled: true }),
      selectedOTType: null,
      reason: '',
      allowBreak: false,
      overtime_code: '',
    })
    if (this.parentDetail !== undefined) {
      this.isDashboard = true
      this.isView = this.parentDetail["view"]
      if (this.parentDetail["dashboardId"] !== 0) {
        this.id = this.parentDetail["dashboardId"]
      }
      else {
        this.id = ""
        this.overtimeForm.get("dateFrom").setValue(this.pipe.transform(this.parentDetail["dashboardDate"] + " " + "00:00", 'MM/dd/yyyy hh:mm a'))
        this.overtimeForm.get("dateTo").setValue(this.pipe.transform(this.parentDetail["dashboardDate"] + " " + "00:00", 'MM/dd/yyyy hh:mm a'))
      }
    }
    this.tenantMasterService.dropdownList("52,").subscribe(data => {
      this.otList = data
      this.resetError(false)
      if (this.id !== "") {
        this.isCancel = true
        this.isSubmit = true
        this.filingManagementService.overtimeView(this.id, this.fileType).subscribe(data => {   
          this.transactionID = data[0].overtime_id
          this.overtimeForm.setValue({
            overtime_code: data[0].overtime_code,
            allowBreak: data[0].with_break,
            reason: data[0].description,
            selectedOTType: data[0].overtime_type_id,
            dateBreakFrom: this.pipe.transform(data[0].break_in, 'MM/dd/yyyy hh:mm a'),
            dateBreakTo: this.pipe.transform(data[0].break_out, 'MM/dd/yyyy hh:mm a'),
            dateFrom: this.pipe.transform(data[0].date_from, 'MM/dd/yyyy hh:mm a'),
            dateTo: this.pipe.transform(data[0].date_to, 'MM/dd/yyyy hh:mm a'),
          });

          this.fileManagerService.viewFile(36, this.id, this.fileType).subscribe(file => {
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

  setBreak() {
    if (!this.overtimeForm.get("allowBreak").value) {
      this.overtimeForm.get("dateBreakFrom").disable()
      this.overtimeForm.get("dateBreakTo").disable()
    }
    else {
      this.overtimeForm.get("dateBreakFrom").enable()
      this.overtimeForm.get("dateBreakTo").enable()
    }
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
    this.overtimeForm.get("dateFrom").setValue(date + " " + time)
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
    this.overtimeForm.get("dateTo").setValue(date + " " + time)
  }

  setBreakDateFrom() {
    let date: any
    let time: any
    if (this.bdfPopDate === null || this.bdfPopDate === undefined) {
      date = this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.bdfPopDate.year + "/" + this.bdfPopDate.month + "/" + this.bdfPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.bdfPopTime, 'hh:mm a') === null || this.pipe.transform(this.bdfPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.bdfPopTime, 'hh:mm a')
    }
    this.overtimeForm.get("dateBreakFrom").setValue(date + " " + time)
  }

  setBreakDateTo() {
    let date: any
    let time: any
    debugger
    if (this.bdtPopDate === null || this.bdtPopDate === undefined) {
      date = this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.bdtPopDate.year + "/" + this.bdtPopDate.month + "/" + this.bdtPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.bdtPopTime, 'hh:mm a') === null || this.pipe.transform(this.bdtPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.bdtPopTime, 'hh:mm a')
    }
    this.overtimeForm.get("dateBreakTo").setValue(date + " " + time)
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
    if (this.overtimeForm.get('selectedOTType').value === "" || this.overtimeForm.get('selectedOTType').value === null) {
      flag = false;
      this.errOTType = true;
    }
    if (this.overtimeForm.get('reason').value === "" || this.overtimeForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    return flag
  }

  resetError(e) {
    this.errOTType = e;
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
                overtime_id: this.id,
                overtime_code: this.overtimeForm.get("overtime_code").value,
                overtime_type_id: this.overtimeForm.get("selectedOTType").value,
                date_from: this.overtimeForm.get("dateFrom").value,
                date_to: this.overtimeForm.get("dateTo").value,
                with_break: this.overtimeForm.get("allowBreak").value,
                break_in: this.overtimeForm.get("dateBreakFrom").value,
                break_out: this.overtimeForm.get("dateBreakTo").value,
                description: this.overtimeForm.get("reason").value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
              }

              this.filingManagementService.overtimeIU(obj).subscribe(data => {
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
                      this.fileManagerService.uploadFile(formData, data.code, 36, data.id).subscribe(file => {
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
                module_id: 36,
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
