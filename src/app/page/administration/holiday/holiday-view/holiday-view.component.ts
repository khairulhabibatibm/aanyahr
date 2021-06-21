import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HolidayManagementService } from '../../../../services/HolidayManagementService/holidayManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-holiday-view',
  templateUrl: './holiday-view.component.html',
  styleUrls: ['./holiday-view.component.css']
})
export class HolidayViewComponent implements OnInit {
  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = [];
  constructor(private holidayManagementService: HolidayManagementService, private router: Router,
    private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };
    this.holidayManagementService.holidayList(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: item.date_created,
        holiday_code: item.holiday_code,
        holiday_description: item.holiday_description,
        holiday_header_name: item.holiday_header_name,
        holiday_id: item.holiday_id,
        holiday_id_encrypted: item.holiday_id_encrypted,
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

  viewHoliday(e) {
    this.router.navigate(["/layout/administration/holiday-detail", e]);
  }

}
