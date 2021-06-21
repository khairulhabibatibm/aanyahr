import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilingManagementService } from 'src/app/services/FilingManagementService/filingManagement.service';
import { TenantMasterService } from 'src/app/services/TenantMasterService/tenantMaster.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-coe-detail',
  templateUrl: './request-coe-detail.component.html',
  styleUrls: ['./request-coe-detail.component.css']
})
export class RequestCoeDetailComponent implements OnInit {
  isLoading: boolean = true
  isCancel: boolean = false
  isSubmit: boolean = false
  isView: boolean = false
  isLink: boolean = false
  errPurpose: boolean = false
  errReason: boolean = false
  purpose = []
  coeForm: FormGroup
  id: string
  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private route: ActivatedRoute, private filingManagementService: FilingManagementService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.coeForm = this.fb.group({
      coeCode: '',
      reason: '',
      withpay: false,
      selectedPurpose: null,
    });

    this.tenantMasterService.dropdownList("63").subscribe(data => {
      this.purpose = data
      if (this.id !== "") {
        this.filingManagementService.coeView(this.id).subscribe(data => {
          this.isLink = data[0].approved_bit
          this.coeForm.setValue({
            coeCode: data[0].coe_code,
            reason: data[0].reason,
            withpay: data[0].with_pay,
            selectedPurpose: data[0].purpose_id,
          });

          this.isSubmit = true
          this.isLoading = false
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })

      }
      else {
        this.id = "0"
        this.isSubmit = true
        this.isLoading = false
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      });

  }

  cancel() {

  }

  validation() {
    let flag = true
    this.errPurpose = false
    this.errReason = false
    if (this.coeForm.get('reason').value === "" || this.coeForm.get('reason').value === null) {
      flag = false;
      this.errReason = true;
    }
    if (this.coeForm.get('selectedPurpose').value === "" || this.coeForm.get('selectedPurpose').value === null) {
      flag = false;
      this.errPurpose = true;
    }
    return flag
  }

  submit() {
    if (this.validation()) {
      debugger
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
                coe_id: this.id,
                coe_code: this.coeForm.value.coeCode,
                reason: this.coeForm.value.reason,
                purpose_id: this.coeForm.value.selectedPurpose,
                coe_path: "",
                active: true,
                created_by: sessionStorage.getItem('u'),
                series_code: sessionStorage.getItem('sc'),
                approval_level_id: sessionStorage.getItem('apl'),
              }
              this.filingManagementService.coeIU(obj).subscribe(data => {
                if (data.id === 0) {
                  Swal.fire("Failed!", data.description, "error");
                }
                else {
                  Swal.fire("Ok!", data.description, "success");
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
