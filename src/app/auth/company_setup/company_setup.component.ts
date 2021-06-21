import { RegisterService } from './../../services/auth/register/register.service';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { MasterTemplateService } from '../../services/MasterTemplateService/masterTemplate.service';

@Component({
  selector: 'app-company_setup',
  templateUrl: './company_setup.component.html',
  styleUrls: ['./company_setup.component.scss']
})
export class Company_setupComponent implements OnInit {
  loader = true;
  isSuccess = false;
  companyForm: FormGroup;
  branchForm: FormGroup;
  errCompanyName = false;
  errCompanyCode = false;
  errZipCode = false;
  errProvince = false;
  errCity = false;
  errRegion = false;
  errCountry = false;

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
  Title = "Company Setup";
  url = "https://via.placeholder.com/200x150";
  branchList = [];
  dropdown = [];
  bank = [];
  industry = [];
  country = [];
  companyCity = [];
  branchCity = [];
  region = [];
  province = [];
  rdoOffice = [];
  rdoBranch = [];
  pRegion = [];
  pCity = [];
  phone = [];
  email = [];
  phoneList = [];
  emailList = [];
  ipList = [];
  param = [];
  submitText = "Submit"
  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  @ViewChild('closeModal') closeModal: ElementRef
  
  constructor(public fb: FormBuilder, private router: Router, private modalService: NgbModal, private masterTemplateService: MasterTemplateService, private registerService: RegisterService) { }

  ngOnInit(): void {
    this.masterTemplateService.dropdownList("1, 2, 3, 4, 5, 6, 10, 11, 12, 61,").subscribe(data => { 
      this.industry = data.filter(x => x.type_id === 1)
      this.bank = data.filter(x => x.type_id === 2)
      this.country = data.filter(x => x.type_id === 3)
      this.rdoOffice = data.filter(x => x.type_id === 4)
      this.rdoBranch = data.filter(x => x.type_id === 5)
      this.pRegion = data.filter(x => x.type_id === 6)
      this.region = data.filter(x => x.type_id === 10)
      this.phone = data.filter(x => x.type_id === 11)
      this.email = data.filter(x => x.type_id === 12)
      this.province = data.filter(x => x.type_id === 61)
    });
    this.masterTemplateService.dropdownEntitlement().subscribe(data => { 
      this.dropdown = data
    });
   
    this.companyForm = this.fb.group({
      companyID: ['0'],
      companyName: [''],
      companyCode: [''],
      selectedCompanyCountry: [null],
      img: [null],
      zipCode: [''],
      unit: [''],
      building: [''],
      street: [''],
      barangay: [''],
      selectedProvince: [null],
      selectedCity: [null],
      selectedRegion: [null],
      createdBy: sessionStorage.getItem('u'),
    });
    this.branchForm = this.fb.group({
      branchID: ['0'],
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
      createdBy: sessionStorage.getItem('u'),
    })
    this.loader = false;
  }

  selectRegion(){
    this.companyForm.get('selectedCity').reset();
    this.companyCity = [];
    this.companyCity = this.dropdown.filter(x => x.id === this.companyForm.get('selectedRegion').value)
  }

  selectBranchRegion(){
    this.branchForm.get('selectedCity').reset();
    this.branchCity = [];
    this.branchCity = this.dropdown.filter(x => x.id === this.branchForm.get('selectedRegion').value)
  }

  selectRdoOffice(){
    this.branchForm.get('selectedRdoBranch').reset();
    this.branchForm.get('selectedRdoBranch').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedRdoOffice').value)[0]['to_id']);
  }

  selectRdoBranch(){
    this.branchForm.get('selectedRdoOffice').reset();
    this.branchForm.get('selectedRdoOffice').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedRdoBranch').value)[0]['to_id']);
  }

  selectPBranch(){
    this.branchForm.get('selectedPCity').reset();
    this.pCity = [];
    this.pCity = this.dropdown.filter(x => x.id === this.branchForm.get('selectedPRegion').value && x.id_to === 0)
  }

  selectPCity(){
    this.branchForm.get('selectedPCode').reset();
    this.branchForm.get('selectedPCode').setValue(this.dropdown.filter(x => x.id === this.branchForm.get('selectedPRegion').value && x.id_to === this.branchForm.get('selectedPCity').value)[0]['to_description']);
  }

  addPhone(e){
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

  removePhone(e){
    this.phoneList.splice(e,1);
  }

  addEmail(e){
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

  removeEmail(e){
    this.emailList.splice(e,1);
  }

  addIP(e){
    let obj = {
      description: this.branchForm.get('ipAddress').value
    }
    this.ipList.push(obj);
    this.branchForm.get('ipAddress').reset();
  }

  removeIP(e){
    this.ipList.splice(e,1);
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
    }
  }

  handleFileInput(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute( 'value', fileName)
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        this.companyForm.patchValue({
          img: event.target.files[0].name
        });
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => { 
          this.url = event.target.result  as string;
        }
      }
    }
  }

  reLogin(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  openXlModal(content) {
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
    }).catch((res) => {});
  }

  validation(){
    let ret = true
    if(this.branchForm.get('branchName').value === ""){
      ret = false;
      this.errbranchName = true;
    }
    else{
      this.errbranchName = false;
    }
    if(this.branchForm.get('selectedIndustry').value === "" || this.branchForm.get('selectedIndustry').value === null){
      ret = false;
      this.errselectedIndustry = true;
    }
    else{
      this.errselectedIndustry = false;
    }
    if(this.branchForm.get('selectedBank').value === "" || this.branchForm.get('selectedBank').value === null){
      ret = false;
      this.errselectedBank = true;
    }
    else{
      this.errselectedBank = false;
    }
    if(this.branchForm.get('bankAccount').value === ""){
      ret = false;
      this.errbankAccount = true;
    }
    else{
      this.errbankAccount = false;
    }
    if(this.branchForm.get('zipCode').value === ""){
      ret = false;
      this.errBranchZipCode = true;
    }
    else{
      this.errBranchZipCode = false;
    }
    if(this.branchForm.get('selectedProvince').value === "" || this.branchForm.get('selectedProvince').value === null){
      ret = false;
      this.errBranchProvince = true;
    }
    else{
      this.errBranchProvince = false
    }
    if(this.branchForm.get('selectedRegion').value === "" || this.branchForm.get('selectedRegion').value === null){
      ret = false;
      this.errBranchRegion = true;
    }
    else{
      this.errBranchRegion = false;
    }
    if(this.branchForm.get('selectedCity').value === "" || this.branchForm.get('selectedCity').value === null){
      ret = false;
      this.errBranchCity = true;
    }
    else{
      this.errBranchCity = false;
    }
    if(this.branchForm.get('selectedBranchCountry').value === "" || this.branchForm.get('selectedBranchCountry').value === null){
      ret = false;
      this.errBranchCountry = true;
    }
    else{
      this.errBranchCountry = false;
    }
    if(this.branchForm.get('sss').value === ""){
      ret = false;
      this.errSSS = true;
    }
    else{
      this.errSSS = false;
    }
    if(this.branchForm.get('philhealth').value === ""){
      ret = false;
      this.errPhilhealth = true;
    }
    else{
      this.errPhilhealth = false;
    }
    if(this.branchForm.get('tin').value === ""){
      ret = false;
      this.errTIN = true;
    }
    else{
      this.errTIN = false;
    }
    if(this.branchForm.get('pagibig').value === ""){
      ret = false;
      this.errPagibig = true;
    }
    else{
      this.errPagibig = false;
    }
    if(this.branchForm.get('selectedRdoOffice').value === "" || this.branchForm.get('selectedRdoOffice').value === null){
      ret = false;
      this.errRDO = true;
    }
    else{
      this.errRDO = false;
    }
    if(this.branchForm.get('selectedRdoBranch').value === "" || this.branchForm.get('selectedRdoBranch').value === null){
      ret = false;
      this.errRDO = true;
    }
    else{
      this.errRDO = false;
    }
    if(this.branchForm.get('selectedPRegion').value === "" || this.branchForm.get('selectedPRegion').value === null){
      ret = false;
      this.errBranch = true;
    }
    else{
      this.errBranch = false;
    }
    if(this.branchForm.get('selectedPCity').value === "" || this.branchForm.get('selectedPCity').value === null){
      ret = false;
      this.errBranch = true;
    }
    else{
      this.errBranch = false;
    }
    return ret;
  }

  addBranch(){
    this.errBranchList = false;
    let flag = this.validation()
    if(flag){
      var obj = {
        branchID: "0",
        branchName: this.branchForm.get('branchName').value,
        selectedIndustry: this.branchForm.get('selectedIndustry').value,
        industry: this.industry.filter(x => x.id === this.branchForm.get('selectedIndustry').value)[0].description,
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
    }
    this.branchList.push(obj);
    this.param = [];
    this.param.push(
      {
        company_IU: this.companyForm.value,
        branch_IU: this.branchList
      }
    )
    this.modalService.dismissAll();
    this.branchForm.reset();
    this.phoneList = [];
    this.emailList = [];
    this.ipList = [];
    }
  }

  removeBranch(e){
    this.errBranchList = false;
    this.branchList.splice(e,1);
    this.param = [];
    this.param.push(
      {
        company_IU: this.companyForm.value,
        branch_IU: this.branchList
      }
    )
  }

  nextStep(step){
    let ret = true;
    if(step == 1){
      if(this.companyForm.get('companyName').value === ""){
        ret = false;
        this.errCompanyName = true;
      }
      else{
        this.errCompanyName = false;
      }
      if(this.companyForm.get('companyCode').value === ""){
        ret = false;
        this.errCompanyCode = true;
      }
      else{
        this.errCompanyCode = false;
      }
      if(this.companyForm.get('zipCode').value === ""){
        ret = false;
        this.errZipCode = true;
      }
      else{
        this.errZipCode = false;
      }
      if(this.companyForm.get('selectedProvince').value === "" || this.companyForm.get('selectedProvince').value === null){      
        ret = false;
        this.errProvince = true;
      }
      else{
        this.errProvince = false;
      }
      if(this.companyForm.get('selectedRegion').value === "" || this.companyForm.get('selectedRegion').value === null){
        ret = false;
        this.errRegion = true;
      }
      else{
        this.errRegion = false;
      }
      if(this.companyForm.get('selectedCity').value === "" || this.companyForm.get('selectedCity').value === null){
        ret = false;
        this.errCity = true;
      }
      else{
        this.errCity = false;
      }
      if(this.companyForm.get('selectedCompanyCountry').value === "" || this.companyForm.get('selectedCompanyCountry').value === null){
        ret = false;
        this.errCountry = true;
      }
      else{
        this.errCountry = false;
      }
      if(ret === true){
        this.wizardForm.goToNextStep();
        this.Title = "Branch Setup";
      }
    }
  }

  prevStep(){
    this.wizardForm.goToPreviousStep();
  }

  submit(e){
    if(this.isSuccess){
      this.wizardForm.goToNextStep();
    }
    else{
      if (Object.keys(this.branchList).length === 0) {
        this.errBranchList = true;
      }
      else{
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
                  console.log(JSON.stringify(this.param[0]))
                  this.registerService.tenantCreate(this.param[0]).subscribe(data => { 
                    Swal.close();
                    if(data.id === 1){
                      Swal.fire("Ok!", "Transaction successful!", "success");
                      this.wizardForm.goToNextStep();
                      this.Title = "Success";
                      this.isSuccess = true;
                      this.submitText = "Continue"
                    }
                    else{
                      Swal.fire("Failed!", "Transaction failed!", "error");  
                    }
                  });
              },
          });
          }
        })
     }  
    }
  }

  finishFunction() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
