import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FilingManagementService } from 'src/app/services/FilingManagementService/filingManagement.service';

@Component({
  selector: 'app-request-coe-view',
  templateUrl: './request-coe-view.component.html',
  styleUrls: ['./request-coe-view.component.css']
})
export class RequestCoeViewComponent implements OnInit {
  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = []
  pipe = new DatePipe('en-US');
  constructor(private router: Router, private filingManagementService: FilingManagementService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0, 'desc']
    };

    this.filingManagementService.coeView(0).subscribe(data => {
      this.table = data.map(item => ({
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
        coe_code: item.coe_code,
        purpose: item.purpose,
        reason: item.reason,
        status: item.status,
        with_pay: item.with_pay,
        encrypted_coe_id: item.encrypted_coe_id,
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

  viewCoE(e) {
    this.router.navigate(["/layout/filing/request-coe-detail", e]);
  }

}
