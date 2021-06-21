import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';

@Component({
  selector: 'app-shiftcodesperday-view',
  templateUrl: './shiftcodesperday-view.component.html',
  styleUrls: ['./shiftcodesperday-view.component.css']
})
export class ShiftcodesperdayViewComponent implements OnInit {
  isLoading: boolean = true;
  table = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private shiftcodeManagementService: ShiftcodeManagementService, private router: Router) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };

    this.shiftcodeManagementService.shiftPerDayView(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: item.date_created,
        shift_code: item.shift_per_day_code,
        shift_name: item.shift_name,
        status: item.status,
        shift_id: item.shift_per_day_id,
        description: item.description,
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

  viewShift(e) {
    this.router.navigate(["/layout/administration/shiftcodesperday-detail", e]);
  }

}
