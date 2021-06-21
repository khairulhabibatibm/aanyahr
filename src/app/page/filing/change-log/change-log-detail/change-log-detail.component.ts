import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilingManagementService } from '../../../../services/FilingManagementService/filingManagement.service';
import { ActivatedRoute } from '@angular/router';
import { FileManagerService } from '../../../../services/FileManagerService/fileManager.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { AttendanceManagementService } from '../../../../services/AttendanceManagementService/attendanceManagement.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-change-log-detail',
  templateUrl: './change-log-detail.component.html',
  styleUrls: ['./change-log-detail.component.css']
})
export class ChangeLogDetailComponent implements OnInit {
  private uri = environment.exportFile;
  isLoading: boolean = true
  isSearch: boolean = false
  errReason: boolean = false
  errAttendance: boolean = false
  errCancelReason: boolean = false
  isView: boolean = false
  changeLogForm: FormGroup
  attendanceForm: FormGroup
  isCancel: boolean = false
  isSubmit: boolean = false
  id: string
  dfPopDate: any
  dfPopTime: any
  dtPopDate: any
  dtPopTime: any
  documents = []
  fileList = []
  attendanceList = []
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  pipe = new DatePipe('en-US');
  @ViewChild('attendanceModal') attendanceModal: ElementRef
  private modalRef: NgbModalRef;
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  transactionID = ""
  remarks: string = ""
  @ViewChild('cancelModal') viewModal: ElementRef
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private modalService: NgbModal, private attendanceManagementService: AttendanceManagementService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.changeLogForm = this.fb.group({
      reason: '',
      changeLogCode: '',
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
        this.changeLogForm.get("dateFrom").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
        this.changeLogForm.get("dateTo").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
      }
    }
    this.attendanceForm = this.fb.group({
      index: 0,
      scheduleIn: '',
      scheduleOut: '',
      timeIn: '',
      timeOut: '',
    })
    if (this.id !== "") {
      this.isCancel = true
      this.isSubmit = true
      this.filingManagementService.changeLogView(this.id, this.fileType).subscribe(data => {
        this.transactionID = data[0].change_log_id
        this.changeLogForm.setValue({
          reason: data[0].reason,
          changeLogCode: data[0].change_log_code,
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

        this.filingManagementService.changeLogDetailView(this.id, this.fileType).subscribe(attendance => {
          this.attendanceList = attendance

          this.fileManagerService.viewFile(33, this.id, this.fileType).subscribe(file => {
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
  }

  ngAfterViewInit(): void {

  }

  search() {
    this.resetError(false)
    this.isSearch = true
    const dateFrom = this.pipe.transform(this.changeLogForm.get("dateFrom").value.year + "/" + this.changeLogForm.get("dateFrom").value.month + "/" + this.changeLogForm.get("dateFrom").value.day + "", 'MM/dd/yyyy');
    const dateTo = this.pipe.transform(this.changeLogForm.get("dateTo").value.year + "/" + this.changeLogForm.get("dateTo").value.month + "/" + this.changeLogForm.get("dateTo").value.day + "", 'MM/dd/yyyy');
    this.attendanceManagementService.changeLogAttendanceView(dateFrom, dateTo).subscribe(data => {
      this.attendanceList = data
      this.isSearch = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.isSearch = false;
      })
  }

  editAttendance(e) {
    this.modalRef = this.modalService.open(this.attendanceModal, { size: 'xs' })
    this.attendanceForm.setValue({
      index: e,
      scheduleIn: this.attendanceList[e].sked_time_in,
      scheduleOut: this.attendanceList[e].sked_time_out,
      timeIn: this.attendanceList[e].time_in === "" ? this.attendanceList[e].sked_time_in : this.attendanceList[e].time_in,
      timeOut: this.attendanceList[e].time_out === "" ? this.attendanceList[e].sked_time_out : this.attendanceList[e].time_out,
    });
  }

  updateAttendance() {
    const index = this.attendanceForm.get("index").value
    this.attendanceList[index].time_in = this.attendanceForm.get("timeIn").value
    this.attendanceList[index].time_out = this.attendanceForm.get("timeOut").value
    this.attendanceList[index].is_update = true
    if (this.attendanceList[index].time_in !== "" && this.attendanceList[index].time_out !== "") {
      this.attendanceList[index].remarks = "Present"
    }
    else {
      this.attendanceList[index].remarks = "Absent"
    }
    this.modalRef.close()
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
    this.attendanceForm.get("timeIn").setValue(date + " " + time)
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
    this.attendanceForm.get("timeOut").setValue(date + " " + time)
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
    if (this.changeLogForm.get('reason').value === "" || this.changeLogForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    if (this.attendanceList.filter(x => x.is_update === true).length <= 0) {
      flag = false
      this.errAttendance = true;
    }
    return flag
  }

  resetError(e) {
    this.errAttendance = e;
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
              var detail = []
              const elmCount = this.attendanceList.filter(x => x.is_update === true)
              for (var i = 0; i < elmCount.length; i++) {
                detail.push({
                  date: elmCount[i].date,
                  time_in: elmCount[i].time_in,
                  time_out: elmCount[i].time_out,
                  remarks: elmCount[i].remarks,
                })
              }
              var obj = {
                change_log_id: this.id,
                change_log_code: this.changeLogForm.get("changeLogCode").value,
                reason: this.changeLogForm.get("reason").value,
                date_from: this.pipe.transform(this.changeLogForm.get("dateFrom").value.year + "/" + this.changeLogForm.get("dateFrom").value.month + "/" + this.changeLogForm.get("dateFrom").value.day + "", 'MM/dd/yyyy'),
                date_to: this.pipe.transform(this.changeLogForm.get("dateTo").value.year + "/" + this.changeLogForm.get("dateTo").value.month + "/" + this.changeLogForm.get("dateTo").value.day + "", 'MM/dd/yyyy'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
                created_by: sessionStorage.getItem('u'),
                Detail: detail
              }
              this.filingManagementService.changeLogIU(obj).subscribe(data => {
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
                      this.fileManagerService.uploadFile(formData, data.code, 33, data.id).subscribe(file => {
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
                module_id: 33,
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
