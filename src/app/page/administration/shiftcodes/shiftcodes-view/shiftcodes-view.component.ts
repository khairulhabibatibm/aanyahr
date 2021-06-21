import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-shiftcodes-view',
  templateUrl: './shiftcodes-view.component.html',
  styleUrls: ['./shiftcodes-view.component.css']
})
export class ShiftcodesViewComponent implements OnInit {
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

    this.shiftcodeManagementService.shiftView(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: item.date_created,
        shift_code: item.shift_code,
        shift_name: item.shift_name,
        time_in: item.time_in,
        time_out: item.time_out,
        shift_id: item.shift_id,
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
    this.router.navigate(["/layout/administration/shiftcodes-detail", e]);
  }

}
