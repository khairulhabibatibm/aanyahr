import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MovingDirection, WizardComponent } from 'angular-archwizard';
import Swal from 'sweetalert2';
import { EmployeeCategoryManagementService } from '../../../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import { TenantDefaultService } from '../../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-employee-category-detail',
  templateUrl: './employee-category-detail.component.html',
  styleUrls: ['./employee-category-detail.component.css']
})
export class EmployeeCategoryDetailComponent implements OnInit {
  category_id: string
  categoryForm: FormGroup
  isLoading: boolean = true
  complete: boolean = true
  errCategoryName: boolean
  errAccessLevel: boolean
  errDescription: boolean
  errApprovalGroup: boolean
  errBeforeChangeSchedule: boolean
  errAfterChangeSchedule: boolean
  errBeforeChangeLog: boolean
  errAfterChangeLog: boolean
  errBeforeOfficialBusiness: boolean
  errAfterOfficialBusiness: boolean
  errBeforeOvertime: boolean
  errAfterOvertime: boolean
  errBeforeOffset: boolean
  errAfterOffset: boolean
  errHolidayBased: boolean
  errSSSBasis: boolean
  errPhilhealthBasis: boolean
  errPagibigBasis: boolean
  errPayrollRates: boolean
  errContributionRates: boolean
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  holidayBased = [];
  deductionBased = [];
  accessLevel = []
  approvalGroup = []
  payrollRates = []
  contributionRates = []
  constructor(private fb: FormBuilder, private tenantDefault: TenantDefaultService,
    private tenantMasterService: TenantMasterService, private employeeCategoryService: EmployeeCategoryManagementService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.category_id = this.route.snapshot.paramMap.get('id');
    this.categoryForm = this.fb.group({
      categoryCode: '',
      categoryName: '',
      selectedAccessLevel: null,
      textAccessLevel: '',
      description: '',
      selectedApprovalGroup: null,
      textApprovalGroup: '',
      beforeChangeSchedule: 0,
      afterChangeSchedule: 0,
      beforeChangeLog: 0,
      afterChangeLog: 0,
      beforeOfficialBusiness: 0,
      afterOfficialBusiness: 0,
      beforeOvertime: 0,
      afterOvertime: 0,
      beforeOffset: 0,
      afterOffset: 0,
      allowOvertime: true,
      selectedHolidayBased: null,
      textHolidayBased: '',
      enableTardiness: true,
      fixedSalary: false,
      basisSSS: null,
      payrollRates: null,
      textPayrollRates: '',
      contributionRates: null,
      textContributionRates: '',
      textBasisSSS: '',
      basisPhilhealth: null,
      textBasisPhilhealth: '',
      basisPagibig: null,
      textBasisPagibig: '',
    });
    this.tenantDefault.dropdownTList("14, 17, 25, 22,").subscribe(data => {
      this.accessLevel = data.filter(x => x.type_id === 14)
      this.approvalGroup = data.filter(x => x.type_id === 17)
      this.payrollRates = data.filter(x => x.type_id === 25)
      this.contributionRates = data.filter(x => x.type_id === 22)

      this.tenantMasterService.dropdownList("20, 21,").subscribe(data => {
        this.holidayBased = data.filter(x => x.type_id === 20)
        this.deductionBased = data.filter(x => x.type_id === 21)

        if (this.category_id !== "") {
          this.employeeCategoryService.categoryView(this.category_id).subscribe(data => {
            console.log(data)
            this.categoryForm.setValue({
              categoryName: data[0].category_name,
              categoryCode: data[0].category_code,
              selectedAccessLevel: data[0].access_level_id,
              textAccessLevel: data[0].access_level,
              description: data[0].category_description,
              selectedApprovalGroup: data[0].approval_level_id,
              textApprovalGroup:  data[0].approval_level,
              beforeChangeSchedule: data[0].change_schedule_before,
              afterChangeSchedule: data[0].change_schedule_after,
              beforeChangeLog: data[0].change_log_before,
              afterChangeLog: data[0].change_log_after,
              beforeOfficialBusiness: data[0].official_business_before,
              afterOfficialBusiness: data[0].official_business_after,
              beforeOvertime: data[0].overtime_before,
              afterOvertime: data[0].overtime_after,
              beforeOffset: data[0].offset_before,
              afterOffset: data[0].offset_after,
              allowOvertime: data[0].allow_overtime,
              selectedHolidayBased: data[0].holiday_based_id,
              textHolidayBased: data[0].holiday_based,
              enableTardiness: data[0].enable_tardiness,
              fixedSalary: data[0].fixed_salary,
              basisSSS: data[0].basis_sss_deduction_id,
              textBasisSSS: data[0].basis_sss_deduction,
              basisPhilhealth: data[0].basis_philhealth_deduction_id,
              textBasisPhilhealth: data[0].basis_philhealth_deduction,
              basisPagibig: data[0].basis_pagibig_deduction_id,
              textBasisPagibig: data[0].basis_pagibig_deduction,
              payrollRates: data[0].rate_group_id,
              textPayrollRates: data[0].rate_group,
              contributionRates: data[0].contribution_group_id,
              textContributionRates: data[0].contribution_group,
            })

            this.resetError(false)
            this.isLoading = false
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        else {
          this.category_id = "0";
          this.resetError(false)
          this.isLoading = false
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

  showDescription(e) {
    switch (e) {
      case 0:
        this.categoryForm.get('textAccessLevel').setValue(this.accessLevel.filter(x => x.id == this.categoryForm.get('selectedAccessLevel').value)[0]['description'])
        break;
      case 1:
        this.categoryForm.get('textApprovalGroup').setValue(this.approvalGroup.filter(x => x.id == this.categoryForm.get('selectedApprovalGroup').value)[0]['description'])
        break;
      case 2:
        this.categoryForm.get('textHolidayBased').setValue(this.holidayBased.filter(x => x.id == this.categoryForm.get('selectedHolidayBased').value)[0]['description'])
        break;
      case 3:
        this.categoryForm.get('textBasisSSS').setValue(this.deductionBased.filter(x => x.id == this.categoryForm.get('basisSSS').value)[0]['description'])
        break;
      case 4:
        this.categoryForm.get('textBasisPhilhealth').setValue(this.deductionBased.filter(x => x.id == this.categoryForm.get('basisPhilhealth').value)[0]['description'])
        break;
      case 5:
        this.categoryForm.get('textBasisPagibig').setValue(this.deductionBased.filter(x => x.id == this.categoryForm.get('basisPagibig').value)[0]['description'])
        break;
      case 6:
        this.categoryForm.get('textPayrollRates').setValue(this.payrollRates.filter(x => x.id == this.categoryForm.get('payrollRates').value)[0]['description'])
        break;
      case 7:
        this.categoryForm.get('textContributionRates').setValue(this.contributionRates.filter(x => x.id == this.categoryForm.get('contributionRates').value)[0]['description'])
        break;
    }
  }


  validation() {
    var flag = true
    var step = 0
    this.resetError(false)
    if (this.categoryForm.get('categoryName').value == "" || this.categoryForm.get('categoryName').value === null) {
      flag = false
      this.errCategoryName = true;
    }
    if (this.categoryForm.get('selectedAccessLevel').value === "" || this.categoryForm.get('selectedAccessLevel').value === null) {
      flag = false
      this.errAccessLevel = true;
    }
    if (this.categoryForm.get('description').value === "" || this.categoryForm.get('description').value === null) {
      flag = false
      this.errDescription = true;
    }
    if (this.categoryForm.get('selectedApprovalGroup').value === "" || this.categoryForm.get('selectedApprovalGroup').value === null) {
      flag = false
      this.errApprovalGroup = true;
    }
    if (flag === true) {
      step = 1
      if (this.categoryForm.get('beforeChangeSchedule').value === "" || this.categoryForm.get('beforeChangeSchedule').value === null) {
        flag = false
        this.errBeforeChangeSchedule = true;
      }
      if (this.categoryForm.get('afterChangeSchedule').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errAfterChangeSchedule = true;
      }
      if (this.categoryForm.get('beforeChangeLog').value === "" || this.categoryForm.get('beforeChangeSchedule').value === null) {
        flag = false
        this.errBeforeChangeLog = true;
      }
      if (this.categoryForm.get('afterChangeLog').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errAfterChangeLog = true;
      }
      if (this.categoryForm.get('beforeOfficialBusiness').value === "" || this.categoryForm.get('beforeChangeSchedule').value === null) {
        flag = false
        this.errBeforeOfficialBusiness = true;
      }
      if (this.categoryForm.get('beforeOvertime').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errBeforeOvertime = true;
      }
      if (this.categoryForm.get('afterOvertime').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errAfterOvertime = true;
      }
      if (this.categoryForm.get('beforeOffset').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errBeforeOffset = true;
      }
      if (this.categoryForm.get('afterOffset').value === "" || this.categoryForm.get('afterChangeSchedule').value === null) {
        flag = false
        this.errAfterOffset = true;
      }
      if (this.categoryForm.get('selectedHolidayBased').value === "" || this.categoryForm.get('selectedHolidayBased').value === null) {
        flag = false
        this.errHolidayBased = true;
      }
    }
    if (flag === true) {
      step = 2
      if (this.categoryForm.get('payrollRates').value === "" || this.categoryForm.get('payrollRates').value === null) {
        flag = false
        this.errPayrollRates = true;
      }
      if (this.categoryForm.get('contributionRates').value === "" || this.categoryForm.get('contributionRates').value === null) {
        flag = false
        this.errContributionRates = true;
      }
      if (this.categoryForm.get('basisSSS').value === "" || this.categoryForm.get('basisSSS').value === null) {
        flag = false
        this.errSSSBasis = true;
      }
      if (this.categoryForm.get('basisPhilhealth').value === "" || this.categoryForm.get('basisPhilhealth').value === null) {
        flag = false
        this.errPhilhealthBasis = true;
      }
      if (this.categoryForm.get('basisPagibig').value === "" || this.categoryForm.get('basisPagibig').value === null) {
        flag = false
        this.errPagibigBasis = true;
      }
    }
    if (flag != true) {
      this.wizard.goToStep(step);
    }
    else {
      return flag
    }
  }

  resetError(e) {
    this.errCategoryName = e;
    this.errCategoryName = e;
    this.errAccessLevel = e;
    this.errDescription = e;
    this.errApprovalGroup = e;
    this.errBeforeChangeSchedule = e;
    this.errAfterChangeSchedule = e;
    this.errBeforeChangeLog = e;
    this.errAfterChangeLog = e;
    this.errBeforeOfficialBusiness = e;
    this.errAfterOfficialBusiness = e;
    this.errBeforeOvertime = e;
    this.errAfterOvertime = e;
    this.errBeforeOffset = e;
    this.errAfterOffset = e;
    this.errHolidayBased = e;
    this.errSSSBasis = e;
    this.errPhilhealthBasis = e;
    this.errPagibigBasis = e;
    this.errPayrollRates = e;
    this.errContributionRates = e;
  }

  submit() {
    if (this.validation()) {
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
              var obj = {
                category_id: this.category_id,
                category_code: this.categoryForm.get('categoryName').value,
                category_name: this.categoryForm.get('categoryName').value,
                category_description: this.categoryForm.get('description').value,
                access_level_id: this.categoryForm.get('selectedAccessLevel').value,
                approval_level_id: this.categoryForm.get('selectedApprovalGroup').value,
                change_schedule_before: this.categoryForm.get('beforeChangeSchedule').value,
                change_schedule_after: this.categoryForm.get('afterChangeSchedule').value,
                change_log_before: this.categoryForm.get('beforeChangeLog').value,
                change_log_after: this.categoryForm.get('afterChangeLog').value,
                official_business_before: this.categoryForm.get('beforeOfficialBusiness').value,
                official_business_after: this.categoryForm.get('afterOfficialBusiness').value,
                overtime_before: this.categoryForm.get('beforeOvertime').value,
                overtime_after: this.categoryForm.get('afterOvertime').value,
                offset_before: this.categoryForm.get('beforeOffset').value,
                offset_after: this.categoryForm.get('afterOffset').value,
                allow_overtime: this.categoryForm.get('allowOvertime').value,
                holiday_based_id: this.categoryForm.get('selectedHolidayBased').value,
                enable_tardiness: this.categoryForm.get('enableTardiness').value,
                fixed_salary: this.categoryForm.get('fixedSalary').value,
                rate_group_id: this.categoryForm.get('payrollRates').value,
                contribution_group_id: this.categoryForm.get('contributionRates').value,
                basis_sss_deduction_id: this.categoryForm.get('basisSSS').value,
                basis_philhealth_deduction_id: this.categoryForm.get('basisPhilhealth').value,
                basis_pagibig_deduction_id: this.categoryForm.get('basisPagibig').value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
              }
              this.employeeCategoryService.employeeCategoryIU(obj).subscribe(data => {
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
}
