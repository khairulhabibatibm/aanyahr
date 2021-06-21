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
  selector: 'app-offset-detail',
  templateUrl: './offset-detail.component.html',
  styleUrls: ['./offset-detail.component.css']
})
export class OffsetDetailComponent implements OnInit {
  private uri = environment.exportFile;
  isLoading: boolean = true
  errCancelReason: boolean = false
  isCancel: boolean = false
  isSubmit: boolean = false
  offsetForm: FormGroup
  overtimeForm: FormGroup
  id: string
  errReason: boolean
  errOffsetHour: boolean
  errOffsetText: string
  documents = []
  fileList = []
  otList = []
  selectedOT = []
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  @ViewChild('overtimeModal') overtimeModal: ElementRef
  @ViewChild('cancelModal') viewModal: ElementRef
  pipe = new DatePipe('en-US');
  @Output() isSuccess: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() parentDetail: any[];
  @Input() fileType: number = 0
  isDashboard: boolean = false
  isView: boolean = false
  remarks: string = ""
  transactionID = ""
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private filingManagementService: FilingManagementService,
    private fileManagerService: FileManagerService, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.offsetForm = this.fb.group({
      reason: '',
      offsetDate: this.dateToday,
      offsetHour: { value: 0, disabled: true },
      offset_code: '',
    })
    if (this.parentDetail !== undefined) {
      this.isDashboard = true
      this.isView = this.parentDetail["view"]
      if (this.parentDetail["dashboardId"] !== 0) {
        this.id = this.parentDetail["dashboardId"]
      }
      else {
        this.id = ""
        this.offsetForm.get("offsetDate").setValue({
          year: new Date(this.parentDetail["dashboardDate"]).getFullYear(),
          month: new Date(this.parentDetail["dashboardDate"]).getMonth() + 1,
          day: new Date(this.parentDetail["dashboardDate"]).getDate(),
        })
      }
    }
    this.overtimeForm = this.fb.group({
      overtimeID: 0,
      overtimeCode: '',
      balance: 0,
      dateFrom: '',
      dateTo: '',
      overtimeHour: 0,
      offsetUsed: 0,
      offsetHour: 0,
    })
    if (this.id !== "") {
      this.isCancel = true
      this.isSubmit = true
      this.filingManagementService.offsetDetailView(this.id, this.fileType).subscribe(data => {
        this.otList = data

        this.filingManagementService.offsetView(this.id, this.fileType).subscribe(data => {          
          this.transactionID = data[0].offset_id
          this.offsetForm.setValue({
            reason: data[0].reason,
            offsetDate: {
              year: new Date(data[0].date).getFullYear(),
              month: new Date(data[0].date).getMonth() + 1,
              day: new Date(data[0].date).getDate(),
            },
            offsetHour: data[0].offset_hour,
            offset_code: data[0].offset_code,
          });

          this.fileManagerService.viewFile(37, this.id, this.fileType).subscribe(file => {
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
      this.filingManagementService.offsetDetailView(this.id, this.fileType).subscribe(data => {
        this.otList = data
        this.isLoading = false
        this.isCancel = false
        this.isSubmit = true
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  editOvertime(e) {
    this.selectedOT = this.otList.filter(x => x.overtime_id === e)[0]
    this.modalService.open(this.overtimeModal, { size: 'xs' })
    this.overtimeForm.setValue({
      overtimeID: this.selectedOT["overtime_id"],
      overtimeCode: this.selectedOT["overtime_code"],
      balance: this.selectedOT["balance_hour"],
      dateFrom: this.selectedOT["date_from"],
      dateTo: this.selectedOT["date_to"],
      overtimeHour: this.selectedOT["overtime_hour"],
      offsetHour: this.selectedOT["offset_used"],
      offsetUsed: this.selectedOT["offset_hour"],
    });

  }

  setOffset() {
    this.errOffsetHour = false
    this.errOffsetText = ""
    var overtime = Number(this.overtimeForm.get("overtimeHour").value);
    var offsetUsed = Number(this.overtimeForm.get("offsetHour").value);
    var offset = Number(this.overtimeForm.get("offsetUsed").value);
    if (this.overtimeForm.get("offsetUsed").value === "" || this.overtimeForm.get("offsetUsed").value === null) {
      this.errOffsetHour = true
      this.errOffsetText = "Please input number"
    }
    else {
      if ((overtime - (offsetUsed + offset)) < 0) {
        this.errOffsetHour = true
        this.errOffsetText = "Insufficient overtime minutes"
      }
      else if ((offsetUsed + offset) > overtime) {
        this.errOffsetHour = true
        this.errOffsetText = "Insufficient overtime minutes"
      }
    }
  }

  updateOvertime() {
    if (!this.errOffsetHour) {
      const index = this.otList.findIndex((x) => x.overtime_id === this.overtimeForm.get("overtimeID").value);
      this.otList[index].offset_hour = this.overtimeForm.get("offsetUsed").value
      const elmCount = this.otList.filter(x => x.offset_hour > 0)
      let balance = 0
      for (var i = 0; i < elmCount.length; i++) {
        balance = balance + Number(elmCount[i].offset_hour)
      }
      this.offsetForm.get("offsetHour").setValue(balance)
      this.modalService.dismissAll()
    }
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
    if (this.offsetForm.get('reason').value === "" || this.offsetForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    else {
      this.errReason = false;
    }
    return flag
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
              const elmCount = this.otList.filter(x => x.offset_hour > 0)
              for (var i = 0; i < elmCount.length; i++) {
                detail.push({
                  overtime_id: elmCount[i].overtime_id,
                  offset_hour: elmCount[i].offset_hour,
                })
              }
              var obj = {
                offset_id: this.id,
                offset_code: this.offsetForm.get("offset_code").value,
                reason: this.offsetForm.get("reason").value,
                offset_hour: this.offsetForm.get("offsetHour").value,
                date: this.pipe.transform(this.offsetForm.get("offsetDate").value.year + "/" + this.offsetForm.get("offsetDate").value.month + "/" + this.offsetForm.get("offsetDate").value.day + "", 'MM/dd/yyyy'),
                created_by: sessionStorage.getItem('u'),
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                category_id: sessionStorage.getItem('cat'),
                OffsetDetail: detail
              }
              this.filingManagementService.offsetIU(obj).subscribe(data => {
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
                      this.fileManagerService.uploadFile(formData, data.code, 37, data.id).subscribe(file => {
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
                module_id: 37,
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
