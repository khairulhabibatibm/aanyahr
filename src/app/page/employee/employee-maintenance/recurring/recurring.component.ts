import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AccountManagementService } from '../../../../services/AccountManagementService/accountManagement.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.css']
})
export class RecurringComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  errType: boolean
  errAdjustment: boolean
  errTiming: boolean
  errAmount: boolean
  errTagType: boolean
  errName: boolean
  typeList = []
  tagType = []
  nameList = []
  timingList = []
  adjList = []
  branch = []
  company = []
  department = []
  employee = []
  table = []
  recurringForm: FormGroup
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;


  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private payrollRatesManagementService: PayrollRatesManagementService, private userManagementService: UserManagementService,
    private branchManagementService: BranchManagementService, private accountManagementService: AccountManagementService,
    private tenantDefaultService: TenantDefaultService) { }

  ngOnInit() {
    this.recurringForm = this.fb.group({
      selectedType: null,
      selectedAdjustment: null,
      selectedTiming: null,
      amount: 0,
      selectedTagType: null,
      selectedEmployee: null,
    })
    this.resetError(false)
    this.tenantMasterService.dropdownList(0).subscribe(data => {
      this.typeList = data.filter(x => x.type_id === 26)

      this.tenantMasterService.dropdownList("50").subscribe(data => {
        this.tagType = data
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

  modelChangeFn() {
    this.resetError(false)
    this.adjList = []
    this.timingList = []
    this.recurringForm.get("selectedAdjustment").setValue(null)
    this.recurringForm.get("selectedTiming").setValue(null)
    const id = this.recurringForm.get("selectedType").value === 57 ? 56 : 57
    this.payrollRatesManagementService.viewAD(this.recurringForm.get("selectedType").value).subscribe(data => {
      this.adjList = data

      this.tenantMasterService.dropdownList(id).subscribe(data => {
        this.timingList = data
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
    this.resetError(false)
    this.nameList = []
    this.recurringForm.get("selectedEmployee").setValue(null)
    switch (this.recurringForm.get("selectedTagType").value) {
      case 102:
        if (this.branch.length > 0) {
          this.nameList = this.branch
        }
        else {
          this.branchManagementService.branchList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.branch.push({
                id: data[i].encrypted_branch_id,
                description: data[i].branch_name,
              })
            }
            this.nameList = this.branch
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 103:
        if (this.company.length > 0) {
          this.nameList = this.company
        }
        else {
          this.accountManagementService.companyView().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.company.push({
                id: data[i].companyID,
                description: data[i].companyName,
              })
            }
            this.nameList = this.company
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 90:
        if (this.department.length > 0) {
          this.nameList = this.department
        }
        else {
          this.tenantDefaultService.dropdownTList("38").subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.department.push({
                id: data[i].encrypted_id,
                description: data[i].description,
              })
            }
            this.nameList = this.department
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 89:
        if (this.employee.length > 0) {
          this.nameList = this.employee
        }
        else {
          this.userManagementService.employeeList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.employee.push({
                id: data[i].encrypt_employee_id,
                description: data[i].display_name,
              })
            }
            this.nameList = this.employee
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
    }
  }

  resetError(e) {
    this.errType = e
    this.errAdjustment = e
    this.errTiming = e
    this.errAmount = e
    this.errTagType = e
    this.errName = e
  }

  validation() {
    this.resetError(false)
    let flag = true
    if (this.recurringForm.get('selectedType').value === "" || this.recurringForm.get('selectedType').value === null) {
      flag = false;
      this.errType = true;
    }
    if (this.recurringForm.get('selectedAdjustment').value === "" || this.recurringForm.get('selectedAdjustment').value === null) {
      flag = false;
      this.errAdjustment = true;
    }
    if (this.recurringForm.get('selectedTiming').value === "" || this.recurringForm.get('selectedTiming').value === null) {
      flag = false;
      this.errTiming = true;
    }
    if (this.recurringForm.get('amount').value === "" || this.recurringForm.get('amount').value === null) {
      flag = false;
      this.errAmount = true;
    }
    if (this.recurringForm.get('selectedTagType').value === "" || this.recurringForm.get('selectedTagType').value === null) {
      flag = false;
      this.errTagType = true;
    }
    if (this.recurringForm.get('selectedEmployee').value === "" || this.recurringForm.get('selectedEmployee').value === null) {
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
      this.userManagementService.recurringView(
        this.recurringForm.value.selectedType,
        this.recurringForm.value.selectedAdjustment,
        this.recurringForm.value.selectedTiming,
        this.recurringForm.value.amount,
        this.recurringForm.value.selectedTagType,
        this.recurringForm.value.selectedEmployee
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
              payroll_recurring_id: "0",
              employee_id: item.employee_id,
              amount: item.amount,
              timing_id: item.timing_id,
              adjustment_type_id: item.adjustment_type_id,
              adjustment_id: item.adjustment_id,
              taxable: item.taxable_id,
              minimum_hour: item.minimum_hour,
              maximum_hour: item.maximum_hour,
              created_by: sessionStorage.getItem('u'),
              active: true,
              series_code: sessionStorage.getItem('sc'),
            }))
            this.payrollRatesManagementService.recurringI(obj).subscribe(data => {
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

}
