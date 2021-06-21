import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.css']
})
export class BranchDetailComponent implements OnInit {
  id: string;
  branchForm: FormGroup;
  isLoading = true;
  errbranchName = false;
  errselectedIndustry = false;
  errselectedBank = false;
  errbankAccount = false;
  errBranchZipCode = false;
  errBranchProvince = false;
  errBranchRegion = false;
  errBranchCity = false;
  errBranchCountry = false;
  errSSS = false;
  errPhilhealth = false;
  errTIN = false;
  errPagibig = false;
  errRDO = false;
  errBranch = false;
  errBranchList = false;
  errValidEmail = false
  branchCity = [];
  industry = [];
  bank = [];
  pCity = [];
  country = [];
  rdoOffice = [];
  rdoBranch = [];
  pRegion = [];
  region = [];
  phone = [];
  email = [];
  phoneList = [];
  emailList = [];
  province = [];
  ipList = [];
  dropdown = [];
  branchDetail = [];
  constructor(private fb: FormBuilder, private tenantDefault: TenantDefaultService, private tenantMasterService: TenantMasterService, private route: ActivatedRoute, private branchService: BranchManagementService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.branchForm = this.fb.group({
      branchID: [0],
      branchName: [''],
      selectedIndustry: [null],
      selectedBank: [null],
      bankAccount: [''],
      zipCode: [''],
      unit: [''],
      building: [''],
      street: [''],
      barangay: [''],
      selectedProvince: [null],
      sss: [''],
      philhealth: [''],
      tin: [''],
      pagibig: [''],
      selectedCity: [null],
      selectedRegion: [null],
      selectedBranchCountry: [null],
      selectedRdoOffice: [null],
      selectedRdoBranch: [null],
      selectedPRegion: [null],
      selectedPCity: [null],
      selectedPCode: [''],
      selectedPhone: [null],
      phoneNumber: [''],
      selectedEmail: [null],
      emailAddress: [''],
      ipAddress: [''],
      createdBy: [sessionStorage.getItem('user')],
    })

    this.tenantDefault.dropdownTList("1, 2, 11, 12,").subscribe(data => {
      this.industry = data.filter(x => x.type_id === 1)
      this.bank = data.filter(x => x.type_id === 2)
      this.phone = data.filter(x => x.type_id === 11)
      this.email = data.filter(x => x.type_id === 12)

      this.tenantMasterService.dropdownList(0).subscribe(data => {
        this.country = data.filter(x => x.type_id === 3)
        this.rdoOffice = data.filter(x => x.type_id === 4)
        this.rdoBranch = data.filter(x => x.type_id === 5)
        this.pRegion = data.filter(x => x.type_id === 6)
        this.region = data.filter(x => x.type_id === 10)
        this.province = data.filter(x => x.type_id === 61)

        this.tenantMasterService.dropdownEntitlement().subscribe(data => {
          this.dropdown = data

          if (this.id !== "") {
            this.branchService.branchView(this.id).subscribe(data => {
              this.branchDetail = data[0];
              this.branchCity = [];
              if (this.branchDetail['selectedRegion'] !== 0) {
                this.branchCity = this.dropdown.filter(x => x.id === this.branchDetail['selectedRegion'])
              }

              this.pCity = [];
              if (this.branchDetail['selectedPRegion'] !== 0) {
                this.pCity = this.dropdown.filter(x => x.id === this.branchDetail['selectedPRegion'] && x.id_to === 0)
              }

              this.branchForm.setValue({
                branchID: this.branchDetail['branch_id'],
                branchName: this.branchDetail['branchName'],
                selectedIndustry: this.branchDetail['selectedIndustry'],
                selectedBank: this.branchDetail['selectedBank'],
                bankAccount: this.branchDetail['bankAccount'],
                zipCode: this.branchDetail['zipCode'],
                unit: this.branchDetail['unit'],
                building: this.branchDetail['building'],
                street: this.branchDetail['street'],
                barangay: this.branchDetail['barangay'],
                selectedProvince: this.branchDetail['province'],
                sss: this.branchDetail['sss'],
                philhealth: this.branchDetail['philhealth'],
                tin: this.branchDetail['tin'],
                pagibig: this.branchDetail['pagibig'],
                selectedCity: this.branchDetail['selectedCity'],
                selectedRegion: this.branchDetail['selectedRegion'],
                selectedBranchCountry: this.branchDetail['selectedBranchCountry'],
                selectedRdoOffice: this.branchDetail['selectedRdoOffice'],
                selectedRdoBranch: this.branchDetail['selectedRdoBranch'],
                selectedPRegion: this.branchDetail['selectedPRegion'],
                selectedPCity: this.branchDetail['selectedPCity'],
                selectedPCode: this.branchDetail['selectedPCode'],
                selectedPhone: [null],
                phoneNumber: [''],
                selectedEmail: [null],
                emailAddress: [''],
                ipAddress: [''],
                createdBy: [sessionStorage.getItem('user')],
              });
              this.branchService.contactList(this.id).subscribe(data => {
                let obj = []
                for (var i = 0; i < data.length; i++) {
                  obj.push({
                    id: data[i]['id'],
                    description: this.phone.filter(x => x.id == data[i]['id'])[0]['description'],
                    number: data[i]['number'],
                  })
                }
                this.phoneList = obj;
              })
              this.branchService.emailList(this.id).subscribe(data => {
                let obj = []
                for (var i = 0; i < data.length; i++) {
                  obj.push({
                    id: data[i]['id'],
                    description: this.email.filter(x => x.id == data[i]['id'])[0]['description'],
                    email_address: data[i]['email_address'],
                  })
                }
                this.emailList = obj;
              })
              this.branchService.ipList(this.id).subscribe(data => {
                this.ipList = data;
              })
              this.isLoading = false;
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
              })
          }
          else {
            this.id = "0";
            this.isLoading = false;
          }
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
      })
  }

  selectBranchRegion() {
    this.branchForm.get('selectedCity').reset();
    this.branchCity = [];
    this.branchCity = this.dropdown.filter(x => x.id === this.branchForm.get('selectedRegion').value)
  }

  selectRdoOffice() {
    this.branchForm.get('selectedRdoBranch').reset();
    this.branchForm.get('selectedRdoBranch').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedRdoOffice').value)[0]['to_id']);
  }

  selectRdoBranch() {
    this.branchForm.get('selectedRdoOffice').reset();
    this.branchForm.get('selectedRdoOffice').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedRdoBranch').value)[0]['to_id']);
  }

  selectPBranch() {
    this.branchForm.get('selectedPCity').reset();
    this.pCity = [];
    this.pCity = this.dropdown.filter(x => x.id === this.branchForm.get('selectedPRegion').value && x.id_to === 0)
  }

  selectPCity() {
    this.branchForm.get('selectedPCode').reset();
    this.branchForm.get('selectedPCode').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedPRegion').value && x.id_to === this.branchForm.get('selectedPCity').value)[0]['to_description']);
  }

  addPhone(e) {
    let ret = true
    if (this.branchForm.get('phoneNumber').value === "" || this.branchForm.get('phoneNumber').value === null) {
      ret = false
    }
    if (this.branchForm.get('selectedPhone').value === "" || this.branchForm.get('selectedPhone').value === null) {
      ret = false
    }

    if (ret) {
      let selected = this.phone.filter(x => x.id === this.branchForm.get('selectedPhone').value)[0];
      let obj = {
        id: selected.id,
        description: selected.description,
        number: this.branchForm.get('phoneNumber').value
      }
      this.phoneList.push(obj);
      this.branchForm.get('selectedPhone').reset();
      this.branchForm.get('phoneNumber').reset();
    }
  }

  removePhone(e) {
    this.phoneList.splice(e, 1);
  }

  addEmail(e) {
    let ret = true
    if (this.branchForm.get('emailAddress').value !== "" && this.branchForm.get('emailAddress').value !== null) {
      ret = this.emailIsValid(this.branchForm.get('emailAddress').value)
      this.errValidEmail = true
    }
    if (ret) {
      this.errValidEmail = false
      let selected = this.email.filter(x => x.id === this.branchForm.get('selectedEmail').value)[0];
      let obj = {
        id: selected.id,
        description: selected.description,
        email_address: this.branchForm.get('emailAddress').value
      }
      this.emailList.push(obj);
      this.branchForm.get('selectedEmail').reset();
      this.branchForm.get('emailAddress').reset();
    }
  }

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  removeEmail(e) {
    this.emailList.splice(e, 1);
  }

  addIP(e) {
    let obj = {
      description: this.branchForm.get('ipAddress').value
    }
    this.ipList.push(obj);
    this.branchForm.get('ipAddress').reset();
  }

  removeIP(e) {
    this.ipList.splice(e, 1);
  }

  validation() {
    let ret = true
    if (this.branchForm.get('branchName').value === "") {
      ret = false;
      this.errbranchName = true;
    }
    else {
      this.errbranchName = false;
    }
    if (this.branchForm.get('selectedIndustry').value === "" || this.branchForm.get('selectedIndustry').value === null) {
      ret = false;
      this.errselectedIndustry = true;
    }
    else {
      this.errselectedIndustry = false;
    }
    if (this.branchForm.get('selectedBank').value === "" || this.branchForm.get('selectedBank').value === null) {
      ret = false;
      this.errselectedBank = true;
    }
    else {
      this.errselectedBank = false;
    }
    if (this.branchForm.get('bankAccount').value === "") {
      ret = false;
      this.errbankAccount = true;
    }
    else {
      this.errbankAccount = false;
    }
    if (this.branchForm.get('zipCode').value === "") {
      ret = false;
      this.errBranchZipCode = true;
    }
    else {
      this.errBranchZipCode = false;
    }
    if (this.branchForm.get('selectedProvince').value === "" || this.branchForm.get('selectedProvince').value === null) {
      ret = false;
      this.errBranchProvince = true;
    }
    else {
      this.errBranchProvince = false;
    }
    if (this.branchForm.get('selectedRegion').value === "" || this.branchForm.get('selectedRegion').value === null) {
      ret = false;
      this.errBranchRegion = true;
    }
    else {
      this.errBranchRegion = false;
    }
    if (this.branchForm.get('selectedCity').value === "" || this.branchForm.get('selectedCity').value === null) {
      ret = false;
      this.errBranchCity = true;
    }
    else {
      this.errBranchCity = false;
    }
    if (this.branchForm.get('selectedBranchCountry').value === "" || this.branchForm.get('selectedBranchCountry').value === null) {
      ret = false;
      this.errBranchCountry = true;
    }
    else {
      this.errBranchCountry = false;
    }
    if (this.branchForm.get('sss').value === "") {
      ret = false;
      this.errSSS = true;
    }
    else {
      this.errSSS = false;
    }
    if (this.branchForm.get('philhealth').value === "") {
      ret = false;
      this.errPhilhealth = true;
    }
    else {
      this.errPhilhealth = false;
    }
    if (this.branchForm.get('tin').value === "") {
      ret = false;
      this.errTIN = true;
    }
    else {
      this.errTIN = false;
    }
    if (this.branchForm.get('pagibig').value === "") {
      ret = false;
      this.errPagibig = true;
    }
    else {
      this.errPagibig = false;
    }
    if (this.branchForm.get('selectedRdoOffice').value === "" || this.branchForm.get('selectedRdoOffice').value === null) {
      ret = false;
      this.errRDO = true;
    }
    else {
      this.errRDO = false;
    }
    if (this.branchForm.get('selectedRdoBranch').value === "" || this.branchForm.get('selectedRdoBranch').value === null) {
      ret = false;
      this.errRDO = true;
    }
    else {
      this.errRDO = false;
    }
    if (this.branchForm.get('selectedPRegion').value === "" || this.branchForm.get('selectedPRegion').value === null) {
      ret = false;
      this.errBranch = true;
    }
    else {
      this.errBranch = false;
    }
    if (this.branchForm.get('selectedPCity').value === "" || this.branchForm.get('selectedPCity').value === null) {
      ret = false;
      this.errBranch = true;
    }
    else {
      this.errBranch = false;
    }
    return ret;
  }

  submit() {
    let flag = this.validation()
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
              var obj = {
                branchID: this.id,
                branchName: this.branchForm.get('branchName').value,
                branch_series_code: "0",
                selectedIndustry: this.branchForm.get('selectedIndustry').value,
                selectedBank: this.branchForm.get('selectedBank').value,
                bankAccount: this.branchForm.get('bankAccount').value,
                zipCode: this.branchForm.get('zipCode').value,
                unit: this.branchForm.get('unit').value,
                building: this.branchForm.get('building').value,
                street: this.branchForm.get('street').value,
                barangay: this.branchForm.get('barangay').value,
                province: this.branchForm.get('selectedProvince').value,
                sss: this.branchForm.get('sss').value,
                philhealth: this.branchForm.get('philhealth').value,
                tin: this.branchForm.get('tin').value,
                pagibig: this.branchForm.get('pagibig').value,
                selectedCity: this.branchForm.get('selectedCity').value,
                selectedRegion: this.branchForm.get('selectedRegion').value,
                selectedBranchCountry: this.branchForm.get('selectedBranchCountry').value,
                selectedRdoOffice: this.branchForm.get('selectedRdoOffice').value,
                selectedRdoBranch: this.branchForm.get('selectedRdoBranch').value,
                selectedPRegion: this.branchForm.get('selectedPRegion').value,
                selectedPCity: this.branchForm.get('selectedPCity').value,
                selectedPCode: this.branchForm.get('selectedPCode').value,
                createdBy: sessionStorage.getItem('u'),
                contact_IU: this.phoneList,
                email_IU: this.emailList,
                iP_IU: this.ipList,
                company_series_code: sessionStorage.getItem('sc'),
                company_id: sessionStorage.getItem('ci'),
                created_by: sessionStorage.getItem('u'),
              }
              this.branchService.branchIU(obj).subscribe(data => {
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
