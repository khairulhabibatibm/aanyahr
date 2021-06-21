import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import Swal from 'sweetalert2';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-allowance-deduction-detail',
  templateUrl: './allowance-deduction-detail.component.html',
  styleUrls: ['./allowance-deduction-detail.component.css']
})
export class AllowanceDeductionDetailComponent implements OnInit {
  isLoading: boolean = true;
  recID: string;
  adForm: FormGroup;
  selectedType: number;
  selectedDeductionType: number;
  selectedGovernmentType: number;
  isType: boolean = true;
  moduleType = [];
  deductionType = [];
  governmentType = [];
  errName = false;
  errType = false;
  errMinimum = false;
  errDeductionType = false;
  errMaximum = false;
  errGovernment = false;
  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private rateManagementService: PayrollRatesManagementService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.recID = this.route.snapshot.paramMap.get('id');
    this.adForm = this.fb.group({
      name: [''],
      selectedModuleType: 57,
      active: true,
      minimumHour: [0],
      maximumHour: [0],
      taxable: false,
    })
    this.tenantMasterService.dropdownList(0).subscribe(data => {
      this.moduleType = data.filter(x => x.type_id === 26)
      this.deductionType = data.filter(x => x.type_id === 27)
      this.governmentType = data.filter(x => x.type_id === 28)

      if (this.recID != "") {
        this.rateManagementService.adView(this.recID).subscribe(data => {
          this.adForm = this.fb.group({
            name: data[0].recurring_name,
            selectedModuleType: data[0].recurring_type,
            active: data[0].active,
            minimumHour: data[0].minimum_hour,
            maximumHour: data[0].maximum_hour,
            taxable: data[0].taxable,
          })
          this.modelChangeFn(data[0].recurring_type)
          this.isLoading = false;
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
      }
      else {
        this.isLoading = false;
        this.recID = "0";
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  modelChangeFn(e) {
    this.toggleError(false)
    if (e === 57) {
      this.isType = true;
    }
    else {
      this.isType = false;
    }
  }

  toggleError(e) {
    this.errName = e
    this.errType = e;
    this.errMinimum = e;
    this.errDeductionType = e;
    this.errMaximum = e;
    this.errGovernment = e;
  }

  validation() {
    var flag = true
    this.toggleError(false)
    if (this.adForm.get('name').value === "" || this.adForm.get('name').value === null) {
      flag = false;
      this.errName = true;
    }
    if (this.adForm.get('selectedModuleType').value === "" || this.adForm.get('selectedModuleType').value === null) {
      flag = false;
      this.errType = true;
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
              if (this.adForm.get('selectedModuleType').value !== 57) {
                this.adForm.get('minimumHour').setValue(0)
                this.adForm.get('maximumHour').setValue(0)
              }
              var obj = {
                recurring_id: this.recID,
                recurring_name: this.adForm.get('name').value,
                recurring_type: this.adForm.get('selectedModuleType').value,
                minimum_hour: this.adForm.get('minimumHour').value,
                maximum_hour: this.adForm.get('maximumHour').value,
                taxable: this.adForm.get('taxable').value,
                created_by: sessionStorage.getItem('u'),
                active: this.adForm.get('active').value,
                series_code: sessionStorage.getItem('sc'),
              }
              this.rateManagementService.adIU(obj).subscribe(data => {
                if (data.branchID === 0) {
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
