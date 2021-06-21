import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FilingManagementService } from '../../../../services/FilingManagementService/filingManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-offset-view',
  templateUrl: './offset-view.component.html',
  styleUrls: ['./offset-view.component.css']
})
export class OffsetViewComponent implements OnInit {
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

    this.filingManagementService.offsetView(0, 0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
        offset_code: item.offset_code,
        reason: item.reason,
        status: item.status,
        date: this.pipe.transform(item.date, 'MM/dd/yyyy'),
        encrypted_offset_id: item.encrypted_offset_id,
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


  viewOffset(e) {
    this.router.navigate(["/layout/filing/offset-detail", e]);
  }

}
