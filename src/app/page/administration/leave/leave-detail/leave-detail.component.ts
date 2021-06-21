import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LeaveManagementService } from '../../../../services/LeaveManagementService/leaveManagement.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css']
})
export class LeaveDetailComponent implements OnInit {
  leaveForm: FormGroup;
  isLoading: boolean = true;
  LeaveID: string
  leavestart = []
  priority = []
  leaveType = []
  filedBy = []
  gender = []
  attachment = [{
    id: false,
    description: 'No'
  }, {
    id: true,
    description: 'Yes'
  }]
  errLeaveName = false
  errDescription = false
  errGender = false
  errAttachment = false
  errFiledBy = false
  errLeaveStart = false
  errTotalLeave = false
  errLeaveAccrued = false
  errAccruedCredits = false
  errLeavePerMonth = false
  errCreditsConvertible = false
  errTaxableCredits = false
  errNonTaxableCredits = false
  errPriorityConvert = false
  errLeaveBefore = false
  errLeaveAfter = false
  constructor(private fb: FormBuilder, private tenantMasterSetupService: TenantMasterService,
    private leaveManagementService: LeaveManagementService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.LeaveID = this.route.snapshot.paramMap.get('id');
    this.leaveForm = this.fb.group({
      leaveName: [''],
      leaveTypeCode: [''],
      description: [''],
      selectedGender: null,
      selectedAttachment: null,
      selectedFiledBy: null,
      selectedLeaveStart: null,
      totalLeaves: 0,
      selectedAccrued: null,
      accruedCredits: 0,
      leavePerMonth: 0,
      convertibleToCash: 0,
      taxableCredits: 0,
      nonTaxableCredits: 0,
      leaveBefore: 0,
      leaveAfter: 0,
      selectedPriority: null
    });
    this.tenantMasterSetupService.dropdownList(0).subscribe(data => {
      this.gender = data.filter(x => x.type_id === 43)
      this.filedBy = data.filter(x => x.type_id === 44)
      this.leavestart = data.filter(x => x.type_id === 45)
      this.leaveType = data.filter(x => x.type_id === 46)
      this.priority = data.filter(x => x.type_id === 47)

      if (this.LeaveID !== "") {
        this.leaveManagementService.leaveView(this.LeaveID).subscribe(data => {
          this.leaveForm = this.fb.group({
            leaveName: data[0].leave_name,
            leaveTypeCode: data[0].leave_type_code,
            description: data[0].description,
            selectedGender: data[0].gender_to_use,
            selectedAttachment: data[0].required_attachment,
            selectedFiledBy: data[0].filed_by,
            selectedLeaveStart: data[0].leave_start,
            totalLeaves: data[0].total_leaves,
            selectedAccrued: data[0].leave_accrued,
            accruedCredits: data[0].accrued_credits,
            leavePerMonth: data[0].leave_per_month,
            convertibleToCash: data[0].convertible_to_cash,
            taxableCredits: data[0].taxable_credits,
            nonTaxableCredits: data[0].non_taxable_credits,
            selectedPriority: data[0].priority_to_convert,
            leaveBefore: data[0].leave_before,
            leaveAfter: data[0].leave_after,
          });
          this.isLoading = false;
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
      }
      else {
        this.LeaveID = "0";
        this.isLoading = false;
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  validation() {
    var flag = true
    this.errLeaveName = false
    this.errDescription = false
    this.errGender = false
    this.errAttachment = false
    this.errFiledBy = false
    this.errLeaveStart = false
    this.errTotalLeave = false
    this.errLeaveAccrued = false
    this.errAccruedCredits = false
    this.errLeavePerMonth = false
    this.errCreditsConvertible = false
    this.errTaxableCredits = false
    this.errNonTaxableCredits = false
    this.errPriorityConvert = false
    if (this.leaveForm.get('leaveName').value === "" || this.leaveForm.get('leaveName').value === null) {
      flag = false;
      this.errLeaveName = true;
    }
    if (this.leaveForm.get('description').value === "" || this.leaveForm.get('description').value === null) {
      flag = false;
      this.errDescription = true;
    }
    if (this.leaveForm.get('selectedGender').value === "" || this.leaveForm.get('selectedGender').value === null) {
      flag = false;
      this.errGender = true;
    }
    if (this.leaveForm.get('selectedAttachment').value === "" || this.leaveForm.get('selectedAttachment').value === null) {
      flag = false;
      this.errAttachment = true;
    }
    if (this.leaveForm.get('selectedFiledBy').value === "" || this.leaveForm.get('selectedFiledBy').value === null) {
      flag = false;
      this.errFiledBy = true;
    }
    if (this.leaveForm.get('selectedLeaveStart').value === "" || this.leaveForm.get('selectedLeaveStart').value === null) {
      flag = false;
      this.errLeaveStart = true;
    }
    if (this.leaveForm.get('totalLeaves').value === "" || this.leaveForm.get('totalLeaves').value === null) {
      flag = false;
      this.errTotalLeave = true;
    }
    if (this.leaveForm.get('selectedAccrued').value === "" || this.leaveForm.get('selectedAccrued').value === null) {
      flag = false;
      this.errLeaveAccrued = true;
    }
    if (this.leaveForm.get('accruedCredits').value === "" || this.leaveForm.get('accruedCredits').value === null) {
      flag = false;
      this.errAccruedCredits = true;
    }
    if (this.leaveForm.get('leavePerMonth').value === "" || this.leaveForm.get('leavePerMonth').value === null) {
      flag = false;
      this.errLeavePerMonth = true;
    }
    if (this.leaveForm.get('convertibleToCash').value === "" || this.leaveForm.get('convertibleToCash').value === null) {
      flag = false;
      this.errCreditsConvertible = true;
    }
    if (this.leaveForm.get('taxableCredits').value === "" || this.leaveForm.get('taxableCredits').value === null) {
      flag = false;
      this.errTaxableCredits = true;
    }
    if (this.leaveForm.get('nonTaxableCredits').value === "" || this.leaveForm.get('nonTaxableCredits').value === null) {
      flag = false;
      this.errNonTaxableCredits = true;
    }
    if (this.leaveForm.get('selectedPriority').value === "" || this.leaveForm.get('selectedPriority').value === null) {
      flag = false;
      this.errPriorityConvert = true;
    }
    if (this.leaveForm.get('leaveBefore').value === "" || this.leaveForm.get('leaveBefore').value === null) {
      flag = false;
      this.errLeaveBefore = true;
    }
    if (this.leaveForm.get('leaveAfter').value === "" || this.leaveForm.get('leaveAfter').value === null) {
      flag = false;
      this.errLeaveAfter = true;
    }
    return flag
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
                leave_type_id: this.LeaveID,
                leave_name: this.leaveForm.get('leaveName').value,
                leave_type_code: this.leaveForm.get('leaveTypeCode').value,
                description: this.leaveForm.get('description').value,
                gender_to_use: this.leaveForm.get('selectedGender').value,
                required_attachment: this.leaveForm.get('selectedAttachment').value,
                filed_by: this.leaveForm.get('selectedFiledBy').value,
                leave_start: this.leaveForm.get('selectedLeaveStart').value,
                total_leaves: this.leaveForm.get('totalLeaves').value,
                leave_accrued: this.leaveForm.get('selectedAccrued').value,
                accrued_credits: this.leaveForm.get('accruedCredits').value,
                leave_per_month: this.leaveForm.get('leavePerMonth').value,
                convertible_to_cash: this.leaveForm.get('convertibleToCash').value,
                taxable_credits: this.leaveForm.get('taxableCredits').value,
                non_taxable_credits: this.leaveForm.get('nonTaxableCredits').value,
                priority_to_convert: this.leaveForm.get('selectedPriority').value,
                leave_before: this.leaveForm.get('leaveBefore').value,
                leave_after: this.leaveForm.get('leaveAfter').value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
              }
              this.leaveManagementService.leaveIU(obj).subscribe(data => {
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
