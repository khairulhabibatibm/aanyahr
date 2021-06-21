import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/LogService/log.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  dateFrom: any
  dateTo: any
  transactionType: number
  transactionList = []
  history = []
  pipe = new DatePipe('en-US');
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
  constructor(private tenantMasterService: TenantMasterService, private logService: LogService) { }

  ngOnInit() {
    this.dateFrom = this.startDate
    this.dateTo = this.endDate
    this.tenantMasterService.dropdownList("24").subscribe(data => {
      this.transactionList = data
      this.isLoading = false

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  search() {
    let transType: number
    if (this.transactionType === undefined || this.transactionType === null) {
      transType = 0
    }
    else {
      transType = this.transactionType
    }
    const start = this.pipe.transform(this.dateFrom.year + "/" + this.dateFrom.month + "/" + this.dateFrom.day + "", 'MM/dd/yyyy');
    const end = this.pipe.transform(this.dateTo.year + "/" + this.dateTo.month + "/" + this.dateTo.day + "", 'MM/dd/yyyy');
    this.logService.logView(start, end, transType).subscribe(data => {
      console.log(data)
      this.isSearch = false
      this.history = data
      this.isLoading = false

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }
}
