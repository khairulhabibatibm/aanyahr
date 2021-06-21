import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AccountManagementService } from '../../../../services/AccountManagementService/accountManagement.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { LeaveManagementService } from '../../../../services/LeaveManagementService/leaveManagement.service';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-leave-entitlement',
  templateUrl: './leave-entitlement.component.html',
  styleUrls: ['./leave-entitlement.component.css']
})
export class LeaveEntitlementComponent implements OnInit, OnDestroy {
  leaveForm: FormGroup
  isLoading: boolean = true
  isSearch: boolean = false
  errLeaveType: boolean
  errTagType: boolean
  errName: boolean
  leave = []
  tagType = []
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

  constructor(private branchManagementService: BranchManagementService, private accountManagementService: AccountManagementService,
    private tenantDefaultService: TenantDefaultService, private userManagementService: UserManagementService,
    private fb: FormBuilder, private tenantMasterService: TenantMasterService, private leaveManagementService: LeaveManagementService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };
    this.leaveForm = this.fb.group({
      selectedLeaveType: null,
      selectedTagType: null,
      selectedName: null,
    })
    this.tenantMasterService.dropdownList("50").subscribe(data => {
      this.tagType = data

      this.leaveManagementService.leaveList("0").subscribe(data => {
        this.leave = data
        this.resetError(false)
        this.isLoading = false
        setTimeout(() => {
          this.dtTrigger.next();
        }, 100)
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
    this.leaveForm.get("selectedName").setValue(null)
    switch (this.leaveForm.get("selectedTagType").value) {
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

  resetError(e) {
    this.errLeaveType = e;
    this.errTagType = e;
    this.errName = e;
  }

  validation() {
    var flag = true
    this.resetError(false)
    if (this.leaveForm.get('selectedLeaveType').value === "" || this.leaveForm.get('selectedLeaveType').value === null) {
      flag = false;
      this.errLeaveType = true;
    }
    if (this.leaveForm.get('selectedTagType').value === "" || this.leaveForm.get('selectedTagType').value === null) {
      flag = false;
      this.errTagType = true;
    }
    if (this.leaveForm.get('selectedName').value === "" || this.leaveForm.get('selectedName').value === null) {
      flag = false;
      this.errName = true;
    }
    return flag
  }

  delete(index) {
    this.table.splice(index, 1);
    this.rerender();
  }

  search() {
    if (this.validation()) {
      this.isSearch = true
      const selected = this.leave.filter(x => x.encrypted_leave_type_id === this.leaveForm.get('selectedLeaveType').value)[0]
      this.userManagementService.leaveView(
        selected.encrypted_leave_type_id,
        selected.leave_type_code,
        selected.leave_name,
        selected.total_leaves,
        this.leaveForm.get('selectedTagType').value,
        this.leaveForm.get('selectedName').value,
        selected.gender_to_use,
      ).subscribe(data => {
        this.table = data
        this.rerender()
        this.isSearch = false
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.isSearch = false
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
              leave_type_id: item.encrypt_leave_type_id,
              employee_id: item.employee_id,
              created_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }))
            this.leaveManagementService.leaveI(obj).subscribe(data => {
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
