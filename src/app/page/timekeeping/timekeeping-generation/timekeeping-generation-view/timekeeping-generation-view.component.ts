import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TimekeepingManagementService } from '../../../../services/TimekeepingManagementService/timekeepingManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-timekeeping-generation-view',
  templateUrl: './timekeeping-generation-view.component.html',
  styleUrls: ['./timekeeping-generation-view.component.css']
})
export class TimekeepingGenerationViewComponent implements OnInit {
  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = []
  pipe = new DatePipe('en-US');
  constructor(private userManagementService: UserManagementService, private timekeepingManagementService: TimekeepingManagementService,
    private router: Router) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0, 'desc']
    };

    this.timekeepingManagementService.timekeepingView(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        status: item.status,
        createdBy: item.created_by,
        createdDesc: item.created_by_name,
        dateCreated: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
        timekeepingCode: item.timekeeping_header_code,
        dateFrom: this.pipe.transform(item.date_from, 'MM/dd/yyyy'),
        dateTo: this.pipe.transform(item.date_to, 'MM/dd/yyyy'),
        payrollType: item.payroll_type,
        month: item.month,
        cutoff: item.cutoff,
        confidentiality: item.confidentiality,
        branch: item.branch,
        category: item.category,
        generatedCount: item.tk_count,
        encrypttimekeepingId: item.encrypt_timekeeping_header_id,
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


  viewTimekeeping(e) {
    this.router.navigate(["/layout/timekeeping/timekeeping-generation-detail", e]);
  }

}
