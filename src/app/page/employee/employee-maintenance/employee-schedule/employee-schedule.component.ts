import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AccountManagementService } from '../../../../services/AccountManagementService/accountManagement.service';
import { AttendanceManagementService } from '../../../../services/AttendanceManagementService/attendanceManagement.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.css']
})
export class EmployeeScheduleComponent implements OnInit, OnDestroy {
  scheduleForm: FormGroup
  isLoading: boolean = true
  isSearch: boolean = false
  errShiftCode: boolean
  errDateFrom: boolean
  errDateTo: boolean
  errTagType: boolean
  errName: boolean
  selectedTagType: number
  selectedName: number
  pipe = new DatePipe('en-US');
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  tagType = []
  shift = []
  name = []
  branch = []
  company = []
  department = []
  employee = []
  table = []
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  constructor(private tenantMasterService: TenantMasterService, private shiftManagementService: ShiftcodeManagementService,
    private branchManagementService: BranchManagementService, private accountManagementService: AccountManagementService,
    private tenantDefaultService: TenantDefaultService, private userManagementService: UserManagementService,
    private fb: FormBuilder, private attendanceManagementService: AttendanceManagementService) { }

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
    this.tenantMasterService.dropdownList("50").subscribe(data => {
      this.tagType = data

      this.shiftManagementService.shiftList("0").subscribe(data => {
        this.shift = data
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

  onChange() {
    this.name = []
    this.scheduleForm.get("selectedName").setValue(null)
    switch (this.scheduleForm.get("selectedTagType").value) {
      case 102:
        if (this.branch.length > 0) {
          this.name = this.branch
        }
        else {
          this.branchManagementService.branchList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.branch.push({
                id: data[i].encrypted_branch_id,
                description: data[i].branch_name,
              })
            }
            this.name = this.branch

          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 103:
        if (this.company.length > 0) {
          this.name = this.company
        }
        else {
          this.accountManagementService.companyView().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.company.push({
                id: data[i].companyID,
                description: data[i].companyName,
              })
            }
            this.name = this.company

          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 90:
        if (this.department.length > 0) {
          this.name = this.department
        }
        else {
          this.tenantDefaultService.dropdownTList("38").subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.department.push({
                id: data[i].encrypted_id,
                description: data[i].description,
              })
            }
            this.name = this.department

          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 89:
        if (this.employee.length > 0) {
          this.name = this.employee
        }
        else {
          this.userManagementService.employeeList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.employee.push({
                id: data[i].encrypt_employee_id,
                description: data[i].display_name,
              })
            }
            this.name = this.employee

          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
    }
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
    if (this.scheduleForm.get('selectedTagType').value === "" || this.scheduleForm.get('selectedTagType').value === null) {
      flag = false;
      this.errTagType = true;
    }
    if (this.scheduleForm.get('selectedName').value === "" || this.scheduleForm.get('selectedName').value === null) {
      flag = false;
      this.errName = true;
    }
    return flag
  }

  resetError(e) {
    this.errShiftCode = e;
    this.errDateFrom = e;
    this.errDateTo = e;
    this.errTagType = e;
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
        this.scheduleForm.get('selectedTagType').value,
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.clear().draw(); 
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  delete(index) {
    this.table.splice(index, 1);
    this.rerender();
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
            const selected = this.shift.filter(x => x.int_shift_id === this.scheduleForm.get('selectedShiftCode').value)[0]
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
              shift_code_type: selected.shift_code_type
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
