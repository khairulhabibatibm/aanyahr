import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PayrollManagementService } from '../../../../services/PayrollManagementService/payrollManagement.service';

@Component({
  selector: 'app-payroll-generation-view',
  templateUrl: './payroll-generation-view.component.html',
  styleUrls: ['./payroll-generation-view.component.css']
})
export class PayrollGenerationViewComponent implements OnInit {
  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = []
  pipe = new DatePipe('en-US');
  constructor(private payrollManagementService: PayrollManagementService, private router: Router) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0, 'desc']
    };

    this.payrollManagementService.headerView(0).subscribe(data => {
      this.table = data
      this.isLoading = false;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewPayroll(e) {
    this.router.navigate(["/layout/payroll/payroll-generation-detail", e]);
  }

}
