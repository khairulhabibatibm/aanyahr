import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {
  employeeForm: FormGroup
  isLoading: boolean = true
  constructor(private fb: FormBuilder, private tenantDefault: TenantDefaultService,
    private tenantMasterService: TenantMasterService, private userManagement: UserManagementService) { }

  ngOnInit() {
    // this.employeeForm = this.fb.group({
    //   selectedSalutation: '',
    //   displayName: '',
    //   firstName: [''],
    //   middleName: [''],
    //   lastName: [''],
    //   selectedSuffix: '',
    //   nickname: [''],
    //   selectedGender: '',
    //   selectedNationality: '',
    //   selectedDate: [''],
    //   birthplace: [''],
    //   selectedCivilStatus: '',
    //   height: [''],
    //   weight: [''],
    //   selectedBloodType: '',
    //   selectedReligion: '',
    //   mobile: [''],
    //   phone: [''],
    //   office: [''],
    //   personalemail: [''],
    //   companyemail: [''],
    //   alternatenumber: [''],
    //   presentaddress: [''],
    //   permamentaddress: [''],
    // });
    
    // this.tenantDefault.dropdownTList("29, 30, 31, 33, 34, 35, 37, 38, 39, 40, 2,").subscribe(data => {
    //   console.log(data)
    //   // this.salutation = data.filter(x => x.type_id === 29)
    //   // this.suffix = data.filter(x => x.type_id === 30)
    //   // this.gender = data.filter(x => x.type_id === 31)
    //   // this.civilstatus = data.filter(x => x.type_id === 33)
    //   // this.bloodtype = data.filter(x => x.type_id === 34)
    //   // this.religion = data.filter(x => x.type_id === 35);

    //   this.tenantMasterService.dropdownList("32, 36, 41, 42,").subscribe(data => {
    //     //this.nationality = data.filter(x => x.type_id === 32)

    //     this.userManagement.employeeView(sessionStorage.getItem('u')).subscribe(employee => {
    //       console.log(employee[0])
    //       this.employeeForm.setValue({
    //         selectedSalutation: data.filter(x => x.id === employee["salutation_id"]),
    //         displayName: employee[0].display_name,
    //         firstName: employee[0].first_name,
    //         middleName: employee[0].middle_name,
    //         lastName: employee[0].last_name,
    //         selectedSuffix: 'aaaa',
    //         nickname: [''],
    //         selectedGender: '',
    //         selectedNationality: '',
    //         selectedDate: [''],
    //         birthplace: [''],
    //         selectedCivilStatus: '',
    //         height: [''],
    //         weight: [''],
    //         selectedBloodType: '',
    //         selectedReligion: '',
    //         mobile: [''],
    //         phone: [''],
    //         office: [''],
    //         personalemail: [''],
    //         companyemail: [''],
    //         alternatenumber: [''],
    //         presentaddress: [''],
    //         permamentaddress: [''],
    //       });
    //     },
    //       (error: HttpErrorResponse) => {
    //         console.log(error.error);
    //       })
    //   },
    //     (error: HttpErrorResponse) => {
    //       console.log(error.error);
    //     })
    // },
    //   (error: HttpErrorResponse) => {
    //     console.log(error.error);
    //   })
  }

}
