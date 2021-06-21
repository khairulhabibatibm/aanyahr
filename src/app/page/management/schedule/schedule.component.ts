import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';
import { ShiftcodeManagementService } from '../../../services/ShiftCodeManagementService/shiftcodeManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  scheduleForm: FormGroup
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  table = []
  shift = []
  name = []
  errShiftCode: boolean = false
  errDateFrom: boolean = false
  errDateTo: boolean = false
  errName: boolean = false
  pipe = new DatePipe('en-US');
  constructor(private fb: FormBuilder, private shiftManagementService: ShiftcodeManagementService, private userManagementService: UserManagementService,
    private attendanceManagementService: AttendanceManagementService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };

    this.scheduleForm = this.fb.group({
      selectedShiftCode: null,
      dateFrom: this.dateToday,
      dateTo: this.dateToday,
      selectedTagType: null,
      selectedName: null,
    })
    this.shiftManagementService.shiftList("0").subscribe(data => {
      this.shift = data
    
      this.userManagementService.employeeSupervisor(true, 0).subscribe(data => {
        this.name = merge([{ "encrypt_employee_id": 0, "display_name": "All" }], data)
        this.resetError(false)
        this.isLoading = false
        setTimeout(() => {
          this.dtTrigger.next();
        }, 100);
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  resetError(e) {
    this.errShiftCode = e;
    this.errDateFrom = e;
    this.errDateTo = e;
    this.errName = e;
  }

  search() {
    if (this.validation()) {
      this.isSearch = true
      const selected = this.shift.filter(x => x.int_shift_id === this.scheduleForm.get('selectedShiftCode').value)[0]
      this.userManagementService.scheduleView(
        selected.shift_id,
        selected.total_working_hours,
        this.pipe.transform(this.scheduleForm.get('dateFrom').value.year + "/" + this.scheduleForm.get('dateFrom').value.month + "/" + this.scheduleForm.get('dateFrom').value.day + "", 'MM/dd/yyyy'),
        this.pipe.transform(this.scheduleForm.get('dateTo').value.year + "/" + this.scheduleForm.get('dateTo').value.month + "/" + this.scheduleForm.get('dateTo').value.day + "", 'MM/dd/yyyy'),
        "0",
        this.scheduleForm.get('selectedName').value,
      ).subscribe(data => {
        this.table = data
        this.rerender()
        this.isSearch = false
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  delete(index) {
    this.table.splice(index, 1);
    this.rerender();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.clear().draw(); 
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  validation() {
    var flag = true
    this.resetError(false)
    if (this.scheduleForm.get('selectedShiftCode').value === "" || this.scheduleForm.get('selectedShiftCode').value === null) {
      flag = false;
      this.errShiftCode = true;
    }
    if (this.scheduleForm.get('dateFrom').value === "" || this.scheduleForm.get('dateFrom').value === null) {
      flag = false;
      this.errDateFrom = true;
    }
    if (this.scheduleForm.get('dateTo').value === "" || this.scheduleForm.get('dateTo').value === null) {
      flag = false;
      this.errDateTo = true;
    }
    if (this.scheduleForm.get('selectedName').value === "" || this.scheduleForm.get('selectedName').value === null) {
      flag = false;
      this.errName = true;
    }
    return flag
  }

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Please Wait !',
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading()
            var obj = this.table.map(item => ({
              shift_id: item.shift_id,
              encrypt_shift_id: item.encrypt_shift_id,
              employee_id: item.employee_id,
              date_from: item.date_from,
              date_to: item.date_to,
              grace_period: item.grace_period,
              shift_code: item.shift_code,
              shift_name: item.shift_name,
              description: item.description,
              is_flexi: item.is_flexi,
              time_in: item.time_in,
              time_out: item.time_out,
              time_out_days_cover: item.time_out_days_cover,
              total_working_hours: item.total_working_hours_decimal,
              half_day_in: item.half_day_in,
              half_day_in_days_cover: item.half_day_in_days_cover,
              half_day_out: item.half_day_out,
              half_day_out_days_cover: item.half_day_out_days_cover,
              night_dif_in: item.night_dif_in,
              night_dif_in_days_cover: item.night_dif_in_days_cover,
              night_dif_out: item.night_dif_out,
              night_dif_out_days_cover: item.night_dif_out_days_cover,
              first_break_in: item.first_break_in,
              first_break_in_days_cover: item.first_break_in_days_cover,
              first_break_out: item.first_break_out,
              first_break_out_days_cover: item.first_break_out_days_cover,
              second_break_in: item.second_break_in,
              second_break_in_days_cover: item.second_break_in_days_cover,
              second_break_out: item.second_break_out,
              second_break_out_days_cover: item.second_break_out_days_cover,
              third_break_in: item.third_break_in,
              third_break_in_days_cover: item.third_break_in_days_cover,
              third_break_out: item.third_break_out,
              third_break_out_days_cover: item.third_break_out_days_cover,
              created_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }))
            this.attendanceManagementService.scheduleI(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
              }
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
                Swal.fire("Failed!", "Transaction failed!", "error");
              });
          },
        });
      }
    })
  }

}
