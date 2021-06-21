import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import { PermissionManagementService } from '../../../services/PermissionManagementService/permissionManagement.service';
import { ReportManagementService } from '../../../services/ReportManagementService/reportManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import { ChildReportComponent } from '../child-report/child-report.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reportList = []
  headerList = []
  employeeList= []
  isLoading: boolean = true
  isSearch: boolean = false
  isReport: boolean = false
  errReports: boolean = false
  selectedReport: number
  reportForm: FormGroup
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
  pipe = new DatePipe('en-US');
  @ViewChild('appChild') childReport: any
  constructor(private permissionManagementService: PermissionManagementService, private reportManagementService: ReportManagementService, 
    private fb: FormBuilder, private userManagementService: UserManagementService) { }

  ngOnInit() {
    
    this.reportForm = this.fb.group({
      reportID: null,
      dateFrom: this.startDate,
      dateTo: this.endDate,
      selectedEmployee: null,
    })

    this.permissionManagementService.reportAccess(sessionStorage.getItem('al')).subscribe(data => {
      this.reportList = data

      this.userManagementService.employeeView(0).subscribe(data => {
        this.employeeList = merge([{ "encrypt_employee_id": 0, "display_name": "All" }], data)
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

  onChange() {
    this.headerList = []
    this.isReport = false
    this.reportManagementService.reportHeader(this.reportForm.get("reportID").value).subscribe(data => {
      for (var i = 0; i < data.filter(x => x.is_view === true).length; i++) {
        this.headerList.push({
          data: data[i]['columns'],
           sTitle: data[i]['colname'],
        })
      }
      this.isReport = true
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  search(){
    var flag = true
    this.errReports = false;
    let employeeID = 0
    if (this.reportForm.get('reportID').value === "" || this.reportForm.get('reportID').value === null) {
      flag = false;
      this.errReports = true;
    }
    if (this.reportForm.get('selectedEmployee').value === "" || this.reportForm.get('selectedEmployee').value === null) {
      employeeID = 0
    }
    else{
      employeeID = this.reportForm.get('selectedEmployee').value
    }
    if(flag){
     
      this.isSearch = true
      this.reportManagementService.reportView(
        this.reportForm.get("reportID").value, 
        this.pipe.transform(this.reportForm.get('dateFrom').value.year + "/" + this.reportForm.get('dateFrom').value.month + "/" + this.reportForm.get('dateFrom').value.day + "", 'MM/dd/yyyy'), 
        this.pipe.transform(this.reportForm.get('dateTo').value.year + "/" + this.reportForm.get('dateTo').value.month + "/" + this.reportForm.get('dateTo').value.day + "", 'MM/dd/yyyy'), 
        employeeID).subscribe(data => {
        this.childReport.searchReport(JSON.parse(data.toString()));
        this.isSearch = false
     },
       (error: HttpErrorResponse) => {
         console.log(error.error);
       })
    }
  }
}
