import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';

@Component({
  selector: 'app-loans-view',
  templateUrl: './loans-view.component.html',
  styleUrls: ['./loans-view.component.css']
})
export class LoansViewComponent implements OnInit {
  isLoading: boolean = true
  table = []
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private payrollRatesManagementService: PayrollRatesManagementService, private router: Router) { }

  ngOnInit() {
    this.payrollRatesManagementService.loansView(0).subscribe(data => {
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

  viewLoan(e) {
    this.router.navigate(["/layout/payroll/loans-detail", e]);
  }

}
