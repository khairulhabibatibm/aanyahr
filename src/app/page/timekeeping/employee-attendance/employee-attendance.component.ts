import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  attendanceList = []
  employeeList = []
  attendanceForm: FormGroup
  editForm: FormGroup
  pipe = new DatePipe('en-US')
  dfPopDate: any
  dfPopTime: any
  dtPopDate: any
  dtPopTime: any
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
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private modalService: NgbModal, private attendanceManagementService: AttendanceManagementService,
    private fb: FormBuilder, private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      processing: true,
    };
    this.attendanceForm = this.fb.group({
      dateFrom: this.startDate,
      dateTo: this.endDate,
      selectedEmployee: null,
      missingLogs: false,
    })
    this.editForm = this.fb.group({
      index: 0,
      scheduleIn: '',
      scheduleOut: '',
      timeIn: '',
      timeOut: '',
    })
    this.userManagementService.employeeSupervisor(false, 0).subscribe(data => {
      this.employeeList = merge([{ "encrypt_employee_id": 0, "display_name": "All" }], data)
      this.isLoading = false
      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  search() {
    this.isSearch = true
    const dateFrom = this.pipe.transform(this.attendanceForm.get("dateFrom").value.year + "/" + this.attendanceForm.get("dateFrom").value.month + "/" + this.attendanceForm.get("dateFrom").value.day + "", 'MM/dd/yyyy')
    const dateTo = this.pipe.transform(this.attendanceForm.get("dateTo").value.year + "/" + this.attendanceForm.get("dateTo").value.month + "/" + this.attendanceForm.get("dateTo").value.day + "", 'MM/dd/yyyy')
    let selectedEmployee = this.attendanceForm.get("selectedEmployee").value
    if (selectedEmployee === null) {
      selectedEmployee = "0"
    }
    const missingLogs = this.attendanceForm.get("missingLogs").value
    this.attendanceManagementService.logView(dateFrom, dateTo, selectedEmployee, missingLogs, false).subscribe(data => {
      this.attendanceList = data
      console.log(data)
      this.rerender()
      this.isSearch = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.isSearch = false
      })
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear().draw();
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  openLogModal(content, e) {
    this.editForm.setValue({
      index: e,
      scheduleIn: this.attendanceList[e].sked_in,
      scheduleOut: this.attendanceList[e].sked_out,
      timeIn: this.attendanceList[e].time_in === "" ? this.attendanceList[e].sked_in : this.attendanceList[e].time_in,
      timeOut: this.attendanceList[e].time_out === "" ? this.attendanceList[e].sked_out : this.attendanceList[e].time_out,
    });
    this.modalService.open(content)
  }

  setDateFrom() {
    let date: any
    let time: any
    if (this.dfPopDate === null || this.dfPopDate === undefined) {
      date = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.dfPopDate.year + "/" + this.dfPopDate.month + "/" + this.dfPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.dfPopTime, 'hh:mm a') === null || this.pipe.transform(this.dfPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.dfPopTime, 'hh:mm a')
    }
    this.editForm.get("timeIn").setValue(date + " " + time)
  }

  setDateTo() {
    let date: any
    let time: any
    if (this.dtPopDate === null || this.dtPopDate === undefined) {
      date = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
    }
    else {
      date = this.pipe.transform(this.dtPopDate.year + "/" + this.dtPopDate.month + "/" + this.dtPopDate.day + "", 'MM/dd/yyyy')
    }

    if (this.pipe.transform(this.dtPopTime, 'hh:mm a') === null || this.pipe.transform(this.dtPopTime, 'hh:mm a') === undefined) {
      time = this.pipe.transform(this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + " " + "00:00", 'MM/dd/yyyy hh:mm a'), 'hh:mm a')
    }
    else {
      time = this.pipe.transform(this.dtPopTime, 'hh:mm a')
    }
    this.editForm.get("timeOut").setValue(date + " " + time)
  }

  updateAttendance() {
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
            let selected = this.attendanceList[this.editForm.get("index").value]
            var obj = {
              employee_id: selected.encrypt_employee_id,
              date: selected.date,
              time_in: this.editForm.get("timeIn").value,
              time_out: this.editForm.get("timeOut").value,
              sked_time_in: selected.sked_in,
              sked_time_out: selected.sked_out,
              series_code: sessionStorage.getItem('sc'),
              created_by: sessionStorage.getItem('u'),
            }
            this.attendanceManagementService.updateAttendance(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                this.modalService.dismissAll()
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.search()
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
