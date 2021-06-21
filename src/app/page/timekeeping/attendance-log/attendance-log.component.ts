import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import Swal from 'sweetalert2';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe, NumberSymbol } from '@angular/common';
import { DataUploadManagementService } from '../../../services/DataUploadManagementService/dataUploadManagement.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.component.html',
  styleUrls: ['./attendance-log.component.css']
})
export class AttendanceLogComponent implements OnInit {
  private uri = environment.exportUrl;
  pipe = new DatePipe('en-US');
  attendanceForm: FormGroup
  isLoading: boolean = true
  employeeList = []
  uploadedList = []
  attendanceList = []
  selectedType: number
  selectedIndex: number
  isSearch: boolean = false
  attendandeDateTime: any
  attendanceDate: any
  attendanceTime: any
  startDate = {
    day: new Date(sessionStorage.getItem('s')).getDate(),
    month: new Date(sessionStorage.getItem('s')).getMonth() + 1,
    year: new Date(sessionStorage.getItem('s')).getFullYear()
  }
  endDate = {
    day: new Date(sessionStorage.getItem('e')).getDate(),
    month: new Date(sessionStorage.getItem('e')).getMonth() + 1,
    year: new Date(sessionStorage.getItem('e')).getFullYear()
  }
  @ViewChild('uploadModal') uploadModal: ElementRef
  @ViewChild('attendanceModal') attendanceModal: ElementRef
  type = [{
    id: 0,
    description: 'In'
  }, {
    id: 1,
    description: 'Out'
  }]
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(private modalService: NgbModal, private userManagementService: UserManagementService,
    private fb: FormBuilder, private attendanceManagementService: AttendanceManagementService,
    private dataUploadManagementService: DataUploadManagementService) { }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };

    this.attendanceForm = this.fb.group({
      dateFrom: this.startDate,
      dateTo: this.endDate,
      selectedEmployee: null,
    })

    this.userManagementService.employeeList().subscribe(data => {
      this.employeeList = data

      this.isLoading = false
      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  public uploadFinished = (event) => {
    this.uploadedList = []
    for (var i = 0; i < event.length; i++) {
      var selected = this.employeeList.filter(x => x.bio_id == event[i].bio_id)[0]
      this.uploadedList.push({
        employeeCode: selected.employee_code,
        displayName: selected.display_name,
        logs: event[i].date_time,
        type: event[i].in_out === 0 ? "In" : "Out",
      })
    }
    $('#modalTable').DataTable({
      "data": this.uploadedList,
      "columns": [
        { "data": "employeeCode" },
        { "data": "displayName" },
        { "data": "logs" },
        { "data": "type" },
      ]
    });
  }

  exportTemplate() {
    this.dataUploadManagementService.templateAttendance().subscribe(data => {
      window.location.href = this.uri + data['response']

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  openLogModal(content, index) {
    this.attendanceDate = {
      day: new Date(this.attendanceList[index].logs).getDate(),
      month: new Date(this.attendanceList[index].logs).getMonth() + 1,
      year: new Date(this.attendanceList[index].logs).getFullYear()
    }
    this.attendandeDateTime = this.pipe.transform(this.attendanceDate.year + "/" + this.attendanceDate.month + "/" + this.attendanceDate.day + " " + new Date(this.attendanceList[index].logs).getHours() + ":" + new Date(this.attendanceList[index].logs).getMinutes(), 'MM/dd/yyyy hh:mm a')
    this.selectedIndex = index
    this.selectedType = this.attendanceList[index].inOut
    this.modalService.open(content)

  }

  submitAttendance() {
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
              bio_id: this.attendanceList[this.selectedIndex].bioId,
              date_time: this.attendanceList[this.selectedIndex].logs,
              in_out: this.attendanceList[this.selectedIndex].inOut,
              terminal_id: this.attendanceList[this.selectedIndex].terminalId,
              created_by: this.attendanceList[this.selectedIndex].createdBy,
              date_created: this.attendanceList[this.selectedIndex].dateCreated,
              date_time_new: this.attendandeDateTime,
              in_out_new: this.selectedType,
              created_by_new: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }
            this.attendanceManagementService.attendanceIU(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.modalService.dismissAll()
                this.search();
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

  deleteAttendance() {
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
              bio_id: this.attendanceList[this.selectedIndex].bioId,
              date_time: this.attendanceList[this.selectedIndex].logs,
              in_out: this.attendanceList[this.selectedIndex].inOut,
              terminal_id: this.attendanceList[this.selectedIndex].terminalId,
              created_by: this.attendanceList[this.selectedIndex].createdBy,
              date_created: this.attendanceList[this.selectedIndex].dateCreated,
              date_time_new: this.attendandeDateTime,
              in_out_new: this.selectedType,
              created_by_new: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }
            this.attendanceManagementService.attendanceD(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.modalService.dismissAll()
                this.search();
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

  setDateTime() {
    if (this.pipe.transform(this.attendanceTime, 'hh:mm a') !== null) {
      this.attendandeDateTime = this.pipe.transform(this.attendanceDate.year + "/" + this.attendanceDate.month + "/" + this.attendanceDate.day + "", 'MM/dd/yyyy') + " " + this.pipe.transform(this.attendanceTime, 'hh:mm a')
    }
  }

  openUploadModal() {
    this.modalService.open(this.uploadModal, { size: 'lg' })
  }

  search() {
    this.isSearch = true
    this.attendanceList = []
    this.attendanceManagementService.attendanceView(
      this.pipe.transform(this.attendanceForm.get('dateFrom').value.year + "/" + this.attendanceForm.get('dateFrom').value.month + "/" + this.attendanceForm.get('dateFrom').value.day + "", 'MM/dd/yyyy'),
      this.pipe.transform(this.attendanceForm.get('dateTo').value.year + "/" + this.attendanceForm.get('dateTo').value.month + "/" + this.attendanceForm.get('dateTo').value.day + "", 'MM/dd/yyyy'),
      this.attendanceForm.get("selectedEmployee").value === null ? "" : this.attendanceForm.get("selectedEmployee").value
    ).subscribe(data => {
      for (var i = 0; i < data.length; i++) {
        var selected = this.employeeList.filter(x => x.bio_id == data[i].bio_id)[0]
        this.attendanceList.push({
          bioId: selected.bio_id,
          employeeCode: selected.employee_code,
          displayName: selected.display_name,
          logs: data[i].date_time,
          type: data[i].in_out === 0 ? "In" : "Out",
          inOut: data[i].in_out,
          terminalId: data[i].terminal_id,
          dateCreated: data[i].date_created,
          createdBy: data[i].created_by,
        })
      }
      this.rerender()
      this.isSearch = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear().draw();
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  handleFileInput(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute('value', fileName)
    }
  }

  submitUpload() {
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
              created_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }
            this.attendanceManagementService.attendanceI(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.modalService.dismissAll()
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
