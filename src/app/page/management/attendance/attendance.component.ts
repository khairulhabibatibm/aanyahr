import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  isLoading: boolean = true
  isSearch: boolean = false
  attendanceList = []
  employeeList = []
  attendanceForm: FormGroup
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
  constructor(private attendanceManagementService: AttendanceManagementService,
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
    this.userManagementService.employeeSupervisor(true, 0).subscribe(data => {
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

  search(){
    this.isSearch = true
    const dateFrom = this.pipe.transform(this.attendanceForm.get("dateFrom").value.year + "/" + this.attendanceForm.get("dateFrom").value.month + "/" + this.attendanceForm.get("dateFrom").value.day + "", 'MM/dd/yyyy')
    const dateTo = this.pipe.transform(this.attendanceForm.get("dateTo").value.year + "/" + this.attendanceForm.get("dateTo").value.month + "/" + this.attendanceForm.get("dateTo").value.day + "", 'MM/dd/yyyy')
    const selectedEmployee = this.attendanceForm.get("selectedEmployee").value
    const missingLogs = this.attendanceForm.get("missingLogs").value
    this.attendanceManagementService.logView(dateFrom, dateTo, selectedEmployee, missingLogs, true).subscribe(data => {
      this.attendanceList = data
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
}
