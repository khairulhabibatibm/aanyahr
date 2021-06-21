import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-allowance-deduction-view',
  templateUrl: './allowance-deduction-view.component.html',
  styleUrls: ['./allowance-deduction-view.component.css']
})
export class AllowanceDeductionViewComponent implements OnInit {
  isLoading: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = [];
  constructor(private ratesManagementService: PayrollRatesManagementService, private router: Router,
    private userManagementService: UserManagementService, private tenantMasterService: TenantMasterService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };
    this.ratesManagementService.adView(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: item.date_created,
        recurring_code: item.recurring_code,
        recurring_name: item.recurring_name,
        taxable: item.taxable,
        recurring_id: item.recurring_id,
      }))
      this.isLoading = false;
      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewAD(e) {
    this.router.navigate(["/layout/administration/allowance-deduction-detail", e]);
  }
}
