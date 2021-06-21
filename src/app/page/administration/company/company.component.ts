import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { AccountManagementService } from '../../../services/AccountManagementService/accountManagement.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DataUploadManagementService } from '../../../services/DataUploadManagementService/dataUploadManagement.service';
import { merge } from 'jquery';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  image = environment.exportUrl
  isLoading: boolean = true;
  viewForm = [];
  companyForm: FormGroup
  companyCity = [];
  region = [];
  province = [];
  dropdown = [];
  country = [];
  tkBasis = [];
  errCompanyName = false;
  errCompanyCode = false;
  errZipCode = false;
  errProvince = false;
  errCity = false;
  errRegion = false;
  errCountry = false;
  fileName: any;
  url = "";
  constructor(private fb: FormBuilder, private accountManagementService: AccountManagementService,
    private tenantMasterService: TenantMasterService, private dataUploadManagementService: DataUploadManagementService) { }

  ngOnInit() {
    this.companyForm = this.fb.group({
      companyID: 0,
      companyName: '',
      companyCode: '',
      seriesCode: '',
      selectedCompanyCountry: [null],
      img: '',
      old_img: '',
      zipCode: '',
      unit: '',
      building: '',
      street: '',
      barangay: '',
      province: '',
      tk_gen_ref: null,
      selectedCity: null,
      selectedRegion: null,
      is_email: false,
      createdBy: sessionStorage.getItem('u'),
    });
    this.tenantMasterService.dropdownList("3, 10, 61, 62,").subscribe(data => {
      this.country = data.filter(x => x.type_id === 3)
      this.region = data.filter(x => x.type_id === 10)
      this.province = data.filter(x => x.type_id === 61)
      this.tkBasis = merge([{ "id": 0, "description": "Default" }], data.filter(x => x.type_id === 62));

      this.tenantMasterService.dropdownEntitlement().subscribe(data => {
        this.dropdown = data

        this.accountManagementService.companyView().subscribe(data => {
          this.viewForm = data[0]
          this.companyCity = [];
          if (this.viewForm['selectedRegion'] !== 0) {
            this.companyCity = this.dropdown.filter(x => x.id === this.viewForm['selectedRegion'])
          }
          this.companyForm.setValue({
            companyID: this.viewForm['companyID'],
            companyName: this.viewForm['companyName'],
            companyCode: this.viewForm['companyCode'],
            seriesCode: this.viewForm['series_code'],
            selectedCompanyCountry: this.viewForm['selectedCompanyCountry'],
            img: "",
            old_img: this.viewForm['old_img'],
            zipCode: this.viewForm['zipCode'],
            unit: this.viewForm['unit'],
            building: this.viewForm['building'],
            street: this.viewForm['street'],
            barangay: this.viewForm['barangay'],
            province: this.viewForm['province'],
            selectedCity: this.viewForm['selectedCity'],
            selectedRegion: this.viewForm['selectedRegion'],
            tk_gen_ref: this.viewForm['tk_gen_ref_id'],
            is_email: this.viewForm['is_email'],
            createdBy: sessionStorage.getItem('u'),
          });
          this.url = this.image + this.viewForm['img']
          this.isLoading = false;
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          });
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        });
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      });
  }

  selectRegion() {
    this.companyForm.get('selectedCity').reset();
    this.companyCity = [];
    this.companyCity = this.dropdown.filter(x => x.id === this.companyForm.get('selectedRegion').value)
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click();
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.companyForm.patchValue({
        img: event.target.files[0].name
      });
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.url = event.target.result as string;
      }
      this.fileName = event.target.files
    }
  }

  handleFileInput(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute('value', fileName)
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        this.companyForm.patchValue({
          img: event.target.files[0].name
        });
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.url = event.target.result as string;
        }
        this.fileName = event.target.files
      }
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
            this.accountManagementService.tenantUpdate(this.companyForm.value).subscribe(data => {
              if (data.companyID === "0") {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.dataUploadManagementService.companyImage(this.fileName, "code", "5").subscribe(data => {
                  if (data.response == 0) {
                    Swal.fire("Failed!", "Image Upload failed!", "error");
                  }
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                    Swal.fire("Failed!", "Image Upload failed!", "error");
                  });
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
