import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FilingManagementService } from '../../../../services/FilingManagementService/filingManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-overtime-view',
  templateUrl: './overtime-view.component.html',
  styleUrls: ['./overtime-view.component.css']
})
export class OvertimeViewComponent implements OnInit {
  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = []
  pipe = new DatePipe('en-US');
  constructor(private filingManagementService: FilingManagementService, private userManagementService: UserManagementService,
    private router: Router) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0, 'desc']
    };

    this.filingManagementService.overtimeView(0, 0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
        overtime_code: item.overtime_code,
        overtime_type: item.overtime_type,
        description: item.description,
        status: item.status,
        date_from: this.pipe.transform(item.date_from, 'MM/dd/yyyy'),
        date_to: this.pipe.transform(item.date_to, 'MM/dd/yyyy'),
        encrypted_overtime_id: item.encrypted_overtime_id,
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

  viewOT(e) {
    this.router.navigate(["/layout/filing/overtime-detail", e]);
  }

}
