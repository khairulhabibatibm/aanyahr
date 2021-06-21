import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { PayrollRatesManagementService } from '../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-payroll-rates',
  templateUrl: './payroll-rates.component.html',
  styleUrls: ['./payroll-rates.component.css']
})
export class PayrollRatesComponent implements OnInit {
  isLoading: boolean = true
  rateForm: FormGroup
  groupList = []
  defaultList = [];
  rateList = [];
  constructor(private tenantDefaultService: TenantDefaultService, private tenantMasterService: TenantMasterService,
    private fb: FormBuilder, private rateManagementService: PayrollRatesManagementService) { }

  ngOnInit() {
    this.rateForm = this.fb.group({
      selectedRateGroup: null,
    })
    this.tenantDefaultService.dropdownTList("25,").subscribe(data => {
      this.groupList = data.filter(x => x.type_id === 25);

      this.tenantMasterService.rateList().subscribe(data => {
        this.defaultList = data
        this.rateList = data
        this.isLoading = false;
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  changeRate(i, e) {
    this.rateList[i].rates = Number(e.target.value).toFixed(4)
    e.value = Number(e.target.value).toFixed(4)
  }

  selectGroup() {
    let selected = this.rateForm.get('selectedRateGroup').value
    this.rateManagementService.rateView(selected).subscribe(data => {
      if (data.length > 0) {
        this.rateList = data

        let temp = []
        for (var i = 0; i < data.length; i++) {
          var selected = this.defaultList.filter(x => x.payroll_rates_id === data[i].payroll_rate_id)[0]
          temp.push({
            rate_group_id: data[i].rate_group_id,
            payroll_rate_id: data[i].payroll_rate_id,
            description: selected.description,
            rates: data[i].rates,
            created_by: sessionStorage.getItem('u'),
            series_code: sessionStorage.getItem('sc'),
          })
        }
        this.rateList = temp
      }
      else {
        let temp = []
        for (var i = 0; i < this.defaultList.length; i++) {
          temp.push({
            rate_group_id: this.rateForm.get('selectedRateGroup').value,
            payroll_rate_id: this.defaultList[i].payroll_rates_id,
            description: this.defaultList[i].description,
            rates: this.defaultList[i].rates,
            created_by: sessionStorage.getItem('u'),
            series_code: sessionStorage.getItem('sc'),
          })
        }
        this.rateList = temp
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
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
            this.rateManagementService.rateIU(this.rateList).subscribe(data => {
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
