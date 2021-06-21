import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'jquery';
import Swal from 'sweetalert2';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { HolidayManagementService } from '../../../../services/HolidayManagementService/holidayManagement.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-holiday-detail',
  templateUrl: './holiday-detail.component.html',
  styleUrls: ['./holiday-detail.component.css']
})
export class HolidayDetailComponent implements OnInit {
  holidayID: string = "0"
  isLoading: boolean = true;
  holidayForm: FormGroup;
  headerForm: FormGroup;
  errHolidayName: boolean;
  errHolidayType: boolean;
  errMonth: boolean;
  errDay: boolean;
  errYear: boolean;
  errName: boolean;
  errBranch: boolean;
  errDescription: boolean;
  errHolidayList: boolean;
  pipe = new DatePipe('en-US');
  date: Date;
  branch = [];
  allBranch = [];
  holidayType = [];
  holidayList = [];

  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private branchManagementService: BranchManagementService, private holidayManagementService: HolidayManagementService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.holidayID = this.route.snapshot.paramMap.get('id');
    this.headerForm = this.fb.group({
      name: [''],
      selectedBranch: [null],
      description: [''],
    });
    this.holidayForm = this.fb.group({
      holidayName: [''],
      selectedHolidayType: [null],
      holidayTypeDesc: [''],
      selectedDate: [''],
    });
    this.pageLoad(false);
    this.tenantMasterService.dropdownList(19).subscribe(data => {
      this.holidayType = data

      this.branchManagementService.branchList().subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.allBranch.push(data[i]['branch_id'])
        }
        this.branch = merge([{ "branch_id": 0, "branch_name": "All" }], data);

        if (this.holidayID !== "") {
          this.holidayManagementService.branchList(this.holidayID).subscribe(branchData => {
            let selectedBranch = []
            for (var i = 0; i < branchData.length; i++) {
              selectedBranch.push(branchData[i]['branch_id'])
            }

            this.holidayManagementService.holidayList(this.holidayID).subscribe(data => {
              this.headerForm.setValue({
                name: data[0]['holiday_header_name'],
                selectedBranch: selectedBranch,
                description: data[0]['holiday_description'],
              });

              this.holidayManagementService.detailList(this.holidayID).subscribe(data => {
                this.holidayList = data.map(item => ({
                  holiday_name: item.holiday_name,
                  holiday_type_id: item.holiday_type_id,
                  holidayTypeDesc: item.description,
                  holiday_date: this.pipe.transform(item.holiday_date, 'MM/dd/yyyy'),
                }))
                this.isLoading = false;
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                })
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
              })
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        else {
          this.holidayID = "0";
          this.isLoading = false;
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  selectAll() {
    let selected = this.headerForm.get('selectedBranch').value
    var flag = false
    for (var i = 0; i < selected.length; i++) {
      if (selected[i] === 0) {
        flag = true
      }
    }
    if (flag) {
      this.headerForm.controls['selectedBranch'].setValue(this.allBranch)
    }
  }

  onDateSelect(e) {
    let year = e.year;
    let month = e.month <= 9 ? '0' + e.month : e.month;
    let day = e.day <= 9 ? '0' + e.day : e.day;
    let finalDate = month + "/" + day + "/" + year;
  }

  removeHoliday(e) {
    this.holidayList.splice(e, 1);
  }

  addHoliday() {
    let flag = this.validateHoliday()
    if (flag) {
      var selectedHolidayType = this.holidayType.filter(x => x.id === this.holidayForm.get('selectedHolidayType').value)[0]
      this.holidayList.push({
        holiday_name: this.holidayForm.get('holidayName').value,
        holiday_type_id: selectedHolidayType['id'],
        holidayTypeDesc: selectedHolidayType['description'],
        holiday_date: this.pipe.transform(this.holidayForm.get('selectedDate').value.year + "/" + this.holidayForm.get('selectedDate').value.month + "/" + this.holidayForm.get('selectedDate').value.day + "", 'MM/dd/yyyy'),
      })
      this.holidayForm.reset()
    }
  }

  validateHoliday() {
    this.pageLoad(false);
    let flag = true;
    if (this.holidayForm.get('holidayName').value == "" || this.holidayForm.get('holidayName').value == null) {
      flag = false
      this.errHolidayName = true;
    }
    if (this.holidayForm.get('selectedHolidayType').value == "" || this.holidayForm.get('selectedHolidayType').value == null) {
      flag = false
      this.errHolidayType = true;
    }
    return flag
  }

  pageLoad(hidden) {
    this.errHolidayName = hidden;
    this.errHolidayType = hidden;
    this.errMonth = hidden;
    this.errDay = hidden;
    this.errYear = hidden;
    this.errName = hidden;
    this.errBranch = hidden;
    this.errDescription = hidden;
    this.errHolidayList = hidden;
  }

  submit() {
    let flag = this.submitValidation()
    if (flag) {
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
              var obj = {}
              let list = [];
              for (var i = 0; i < this.headerForm.get('selectedBranch').value.length; i++) {
                list.push({
                  branch_id: this.headerForm.get('selectedBranch').value[i],
                })
              }
              obj = {
                holiday_id: this.holidayID,
                holiday_code: '',
                holiday_header_name: this.headerForm.get('name').value,
                holiday_description: this.headerForm.get('description').value,
                active: true,
                series_code: sessionStorage.getItem('sc'),
                created_by: sessionStorage.getItem('u'),
                Detail: this.holidayList,
                Branch: list
              }
              console.log(JSON.stringify(obj))
              this.holidayManagementService.HolidayIU(obj).subscribe(data => {
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

  submitValidation() {
    this.pageLoad(false);
    let flag = true;
    if (this.headerForm.get('name').value == "" || this.headerForm.get('name').value == null) {
      flag = false
      this.errName = true;
    }
    if (this.headerForm.get('description').value == "" || this.headerForm.get('description').value == null) {
      flag = false
      this.errDescription = true;
    }
    if (this.holidayList.length <= 0) {
      flag = false
      this.errHolidayList = true;
    }
    if (this.headerForm.get('selectedBranch').value == "" || this.headerForm.get('selectedBranch').value == null) {
      flag = false
      this.errBranch = true;
    }
    return flag;
  }
}
