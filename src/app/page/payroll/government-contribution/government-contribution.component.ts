import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountManagementService } from '../../../services/AccountManagementService/accountManagement.service';
import { BranchManagementService } from '../../../services/BranchManagementService/branchManagement.service';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import Swal from 'sweetalert2';
import { PayrollRatesManagementService } from '../../../services/PayrollRatesManagementService/payrollRatesManagement.service';

@Component({
  selector: 'app-government-contribution',
  templateUrl: './government-contribution.component.html',
  styleUrls: ['./government-contribution.component.css']
})
export class GovernmentContributionComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  governmentForm: FormGroup
  governmentList = []
  tagType = []
  nameList = []
  timingList = []
  branch = []
  company = []
  department = []
  employee = []
  table = []
  errGovernmentType: boolean
  errTypeType: boolean
  errName: boolean
  errTiming: boolean
  errAmount: boolean
  constructor(private branchManagementService: BranchManagementService, private accountManagementService: AccountManagementService,
    private tenantDefaultService: TenantDefaultService, private userManagementService: UserManagementService, private tenantMasterService: TenantMasterService,
    private fb: FormBuilder, private payrollRatesManagementService: PayrollRatesManagementService) { }

  ngOnInit() {
    this.governmentForm = this.fb.group({
      selectedGovernmentType: null,
      selectedEmployee: null,
      selectedTagType: null,
      selectedTiming: null,
      amount: null,
    })
    this.tenantMasterService.dropdownList("50, 60, 28,").subscribe(data => {
      this.tagType = data.filter(x => x.type_id === 50)
      this.timingList = data.filter(x => x.type_id === 60)
      this.governmentList = data.filter(x => x.type_id === 28)
      this.isLoading = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
   
  }

  onChange() {
    this.resetError(false)
    this.nameList = []
    this.governmentForm.get("selectedEmployee").setValue(null)
    switch (this.governmentForm.get("selectedTagType").value) {
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

  resetError(e){
    this.errGovernmentType = e
    this.errTypeType = e
    this.errName = e
    this.errTiming = e
    this.errAmount = e
  }

  delete(e){
    this.table.splice(e, 1);
  }

  search(){
    if(this.validation()){
      this.userManagementService.governmentView(
        this.governmentForm.value.selectedGovernmentType,
        this.governmentForm.value.amount,
        this.governmentForm.value.selectedTiming,
        this.governmentForm.value.selectedTagType,
        this.governmentForm.value.selectedEmployee).subscribe(data => {
        this.table = data
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  validation(){
    this.resetError(false)
    let flag = true
    if (this.governmentForm.get('selectedGovernmentType').value === "" || this.governmentForm.get('selectedGovernmentType').value === null) {
      flag = false;
      this.errGovernmentType = true;
    }
    if (this.governmentForm.get('selectedTagType').value === "" || this.governmentForm.get('selectedTagType').value === null) {
      flag = false;
      this.errTypeType = true;
    }
    if (this.governmentForm.get('selectedEmployee').value === "" || this.governmentForm.get('selectedEmployee').value === null) {
      flag = false;
      this.errName = true;
    }
    if (this.governmentForm.get('selectedTiming').value === "" || this.governmentForm.get('selectedTiming').value === null) {
      flag = false;
      this.errTiming = true;
    }
    if (this.governmentForm.get('amount').value === "" || this.governmentForm.get('amount').value === null) {
      flag = false;
      this.errAmount = true;
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
              payroll_contribution_id: "0",         
              employee_id: item.employee_id,
              government_type_id: item.government_type_id,
              timing_id: item.timing_id,  
              amount: item.amount,     
              taxable: item.taxable_id,    
              created_by: sessionStorage.getItem('u'),
              active: true,
              series_code: sessionStorage.getItem('sc'),
            }))
            this.payrollRatesManagementService.governmentI(obj).subscribe(data => {          
              if (data === 0) {
                Swal.fire("Failed!", data.description, "error");
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
