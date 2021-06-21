import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';
import { DataUploadManagementService } from '../../../../services/DataUploadManagementService/dataUploadManagement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeCategoryManagementService } from '../../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import Swal from 'sweetalert2';
import { DatePipe, DecimalPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { LeaveManagementService } from '../../../../services/LeaveManagementService/leaveManagement.service';
import { AttendanceManagementService } from '../../../../services/AttendanceManagementService/attendanceManagement.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  image = environment.exportUrl
  employeeForm: FormGroup;
  isLoading = true;
  defaultNavActiveId = 1;
  id: string;
  pipe = new DatePipe('en-US');
  salutation = [];
  suffix = [];
  gender = [];
  nationality = [];
  civilstatus = [];
  bloodtype = [];
  religion = [];
  branch = [];
  employeestatus = [];
  occupation = [];
  supervisor = [];
  department = [];
  costcenter = [];
  category = [];
  division = [];
  payrolltype = [];
  bank = [];
  confidential = [];
  adjList = []
  leaveList = []
  scheduleList = []
  province = []
  region = []
  presentCity = []
  permanentCity = []
  country = []
  dropdown = []
  fileName: any;
  errSalutation = false;
  errDisplayName = false;
  errFirstName = false;
  errMiddleName = false;
  errLastName = false;
  errNickname = false;
  errGender = false;
  errNationality = false;
  errBirthday = false;
  errBirthplace = false;
  errCivilstatus = false;
  errReligion = false;
  errMobile = false;
  errEmail = false;
  errPresentAddress = false;
  errPermanentAddress = false;
  errBiometrics = false;
  errEmployeeCode = false;
  errBranch = false;
  errEmployeeStatus = false;
  errOccupation = false;
  errDepartment = false;
  errDateHired = false;
  errCategory = false;
  errPayrollType = false;
  errMonthlyRate = false;
  errSemiMonthlyRate = false;
  errFactorRate = false;
  errDailyRate = false;
  errHourlyRate = false;
  errBank = false;
  errBankAccount = false;
  errConfidential = false;
  errSSS = false;
  errPagibig = false;
  errPhilhealth = false;
  errTIN = false;
  errValidEmail = false
  errValidCompany = false
  isSearch = false
  errPresentZipCode = false
  errPresentRegion = false
  errPresentProvince = false
  errPresentCity = false
  errPresentCountry = false
  errPermanentZipCode = false
  errPermanentRegion = false
  errPermanentProvince = false
  errPermanentCity = false
  errPermanentCountry = false
  display_name: string
  img_path: string
  startDate = {
    day: new Date(sessionStorage.getItem('s')).getDate(),
    month: new Date(sessionStorage.getItem('s')).getMonth() + 1,
    year: new Date(sessionStorage.getItem('s')).getFullYear()
  }
  endDate = {
    day: new Date(sessionStorage.getItem('e')).getDate(),
    month: new Date(sessionStorage.getItem('e')).getMonth() + 1,
    year: new Date(sessionStorage.getItem('e')).getFullYear()
  }
  constructor(private router: Router, private route: ActivatedRoute, private tenantDefault: TenantDefaultService,
    private tenantMasterService: TenantMasterService, private branchManagement: BranchManagementService,
    private userManagement: UserManagementService, private fb: FormBuilder, private readonly changeDetectorRef: ChangeDetectorRef,
    private employeeCategory: EmployeeCategoryManagementService, private dataUploadManagementService: DataUploadManagementService,
    private payrollRatesManagementService: PayrollRatesManagementService, private leaveManagementService: LeaveManagementService,
    private attendanceManagementService: AttendanceManagementService, private numeral: DecimalPipe) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.employeeForm = this.fb.group({
      userName: '',
      userHash: '',
      image_path: '',
      old_image_path: '',
      selectedSalutation: null,
      displayName: '',
      firstName: [''],
      middleName: [''],
      lastName: [''],
      selectedSuffix: null,
      nickname: [''],
      selectedGender: null,
      selectedNationality: null,
      selectedDate: [''],
      birthplace: [''],
      selectedCivilStatus: null,
      height: 0,
      weight: 0,
      selectedBloodType: null,
      selectedReligion: null,
      mobile: [''],
      phone: [''],
      office: [''],
      personalemail: [''],
      companyemail: [''],
      alternatenumber: [''],
      presentZipCode: [''],
      presentUnit: [''],
      presentBuilding: [''],
      presentStreet: [''],
      presentBarangay: [''],
      presentSelectedRegion: null,
      presentSelectedProvince: null,
      presentSelectedCity: null,
      presentSelectedCountry: null,
      permanentZipCode: [''],
      permanentUnit: [''],
      permanentBuilding: [''],
      permanentStreet: [''],
      permanentBarangay: [''],
      permanentSelectedRegion: null,
      permanentSelectedProvince: null,
      permanentSelectedCity: null,
      permanentSelectedCountry: null,
      biometricsID: [''],
      employeeID: [''],
      selectedBranch: null,
      selectedEmployeeStatus: null,
      selectedOccupation: null,
      selectedSupervisor: null,
      selectedDepartment: null,
      dateHired: [''],
      regularizationDate: [''],
      selectedCostCenter: null,
      selectedCategory: null,
      selectedDivision: null,
      selectedPayrollType: null,
      monthlyRate: '0.00',
      semiMonthlyRate: '0.00',
      factorRate: '0.00',
      dailyRate: '0.00',
      hourlyRate: '0.00',
      sssNumber: [''],
      pagibigNumber: [''],
      philhealthNumber: [''],
      tinNumber: [''],
      selectedBank: null,
      bankAccount: [''],
      selectedConfidential: null,
      dateFrom: this.startDate,
      dateTo: this.endDate,
    });

    this.tenantDefault.dropdownTList("29, 30, 31, 33, 34, 35, 37, 38, 39, 40, 2,").subscribe(data => {
      this.salutation = data.filter(x => x.type_id === 29)
      this.suffix = data.filter(x => x.type_id === 30)
      this.gender = data.filter(x => x.type_id === 31)
      this.civilstatus = data.filter(x => x.type_id === 33)
      this.bloodtype = data.filter(x => x.type_id === 34)
      this.religion = data.filter(x => x.type_id === 35);
      this.occupation = data.filter(x => x.type_id === 37);
      this.department = data.filter(x => x.type_id === 38);
      this.costcenter = data.filter(x => x.type_id === 39);
      this.division = data.filter(x => x.type_id === 40);
      this.bank = data.filter(x => x.type_id === 2)

      this.tenantMasterService.dropdownList("32, 36, 41, 42, 10, 61, 3,").subscribe(data => {
        this.nationality = data.filter(x => x.type_id === 32)
        this.employeestatus = data.filter(x => x.type_id === 36)
        this.payrolltype = data.filter(x => x.type_id === 41)
        this.confidential = data.filter(x => x.type_id === 42)
        this.region = data.filter(x => x.type_id === 10)
        this.province = data.filter(x => x.type_id === 61)
        this.country = data.filter(x => x.type_id === 3)

        this.branchManagement.branchList().subscribe(data => {
          this.branch = data

          this.userManagement.employeeView("0").subscribe(employee => {
            this.supervisor = employee.filter(x => x.active === true)

            this.tenantDefault.seriesNext(17).subscribe(data => {
              this.employeeForm.get('employeeID').setValue(data[0]['series_code']);

              this.employeeCategory.categoryList(0).subscribe(data => {
                this.category = data

                this.tenantMasterService.dropdownEntitlement().subscribe(data => {
                  this.dropdown = data

                  if (this.id !== "") {

                    let selected = employee.filter(x => x.encrypt_employee_id === this.id)[0]
                    this.presentCity = [];
                    selected.pre_region_id === 0 ? null : this.presentCity = this.dropdown.filter(x => x.id === selected.pre_region_id)
                    this.permanentCity = [];
                    selected.per_region_id === 0 ? null : this.permanentCity = this.dropdown.filter(x => x.id === selected.per_region_id)
                    this.employeeForm.setValue({
                      image_path: "",
                      userName: selected.user_name,
                      userHash: selected.decrypted_user_hash,
                      old_image_path: selected.old_image_path,
                      selectedSalutation: selected.salutation_id,
                      displayName: selected.display_name,
                      firstName: selected.first_name,
                      middleName: selected.middle_name,
                      lastName: selected.last_name,
                      selectedSuffix: selected.suffix_id === 0 ? null : selected.suffix_id,
                      nickname: selected.nick_name,
                      selectedGender: selected.gender_id === 0 ? null : selected.gender_id,
                      selectedNationality: selected.nationality_id === 0 ? null : selected.nationality_id,
                      selectedDate: {
                        day: new Date(selected.birthday).getDate(),
                        month: new Date(selected.birthday).getMonth() + 1,
                        year: new Date(selected.birthday).getFullYear()
                      },
                      birthplace: selected.birth_place,
                      selectedCivilStatus: selected.civil_status_id === 0 ? null : selected.civil_status_id,
                      height: selected.height,
                      weight: selected.weight,
                      selectedBloodType: selected.blood_type_id === 0 ? null : selected.blood_type_id,
                      selectedReligion: selected.religion_id === 0 ? null : selected.religion_id,
                      mobile: selected.mobile,
                      phone: selected.phone,
                      office: selected.office,
                      personalemail: selected.personal_email_address,
                      companyemail: selected.email_address,
                      alternatenumber: selected.alternate_number,
                      presentZipCode: selected.pre_zipcode,
                      presentUnit: selected.pre_unit_floor,
                      presentBuilding: selected.pre_building,
                      presentStreet: selected.pre_street,
                      presentBarangay: selected.pre_barangay,
                      presentSelectedRegion: selected.pre_region_id === 0 ? null : selected.pre_region_id,
                      presentSelectedProvince: selected.pre_province_id === 0 ? null : selected.pre_province_id,
                      presentSelectedCity: selected.pre_city_id === 0 ? null : selected.pre_city_id,
                      presentSelectedCountry: selected.pre_country_id === 0 ? null : selected.pre_country_id,
                      permanentZipCode: selected.per_zipcode,
                      permanentUnit: selected.per_unit_floor,
                      permanentBuilding: selected.per_building,
                      permanentStreet: selected.per_street,
                      permanentBarangay: selected.per_barangay,
                      permanentSelectedRegion: selected.per_region_id === 0 ? null : selected.per_region_id,
                      permanentSelectedProvince: selected.per_province_id === 0 ? null : selected.per_province_id,
                      permanentSelectedCity: selected.per_city_id === 0 ? null : selected.per_city_id,
                      permanentSelectedCountry: selected.per_country_id === 0 ? null : selected.per_country_id,
                      biometricsID: selected.bio_id,
                      employeeID: selected.employee_code,
                      selectedBranch: selected.branch_id === 0 ? null : selected.branch_id,
                      selectedEmployeeStatus: selected.employee_status_id === 0 ? null : selected.employee_status_id,
                      selectedOccupation: selected.occupation_id === 0 ? null : selected.occupation_id,
                      selectedSupervisor: selected.supervisor_id === 0 ? null : selected.supervisor_id,
                      selectedDepartment: selected.department_id === 0 ? null : selected.department_id,
                      dateHired: {
                        day: new Date(selected.date_hired).getDate(),
                        month: new Date(selected.date_hired).getMonth() + 1,
                        year: new Date(selected.date_hired).getFullYear()
                      },
                      regularizationDate: selected.date_regularized === "" ? null : {
                        day: new Date(selected.date_regularized).getDate(),
                        month: new Date(selected.date_regularized).getMonth() + 1,
                        year: new Date(selected.date_regularized).getFullYear()
                      },
                      selectedCostCenter: selected.cost_center_id === 0 ? null : selected.cost_center_id,
                      selectedCategory: selected.category_id === 0 ? null : selected.category_id,
                      selectedDivision: selected.division_id === 0 ? null : selected.division_id,
                      selectedPayrollType: selected.payroll_type_id === 0 ? null : selected.payroll_type_id,
                      monthlyRate: this.numeral.transform(selected.monthly_rate, '1.2-2'),
                      semiMonthlyRate: this.numeral.transform(selected.semi_monthly_rate, '1.2-2'),
                      factorRate: this.numeral.transform(selected.factor_rate, '1.2-2'),
                      dailyRate: this.numeral.transform(selected.daily_rate, '1.2-2'),
                      hourlyRate: this.numeral.transform(selected.hourly_rate, '1.2-2'),
                      sssNumber: selected.sss,
                      pagibigNumber: selected.pagibig,
                      tinNumber: selected.tin,
                      philhealthNumber: selected.philhealth,
                      selectedBank: selected.bank_id === 0 ? null : selected.bank_id,
                      bankAccount: selected.bank_account,
                      selectedConfidential: selected.confidentiality_id === 0 ? null : selected.confidentiality_id,
                      dateFrom: this.startDate,
                      dateTo: this.endDate,
                    });
                    this.display_name = selected.display_name
                    this.img_path = this.image + "\\" + selected.image_path

                    this.payrollRatesManagementService.viewRecurring(this.id).subscribe(data => {
                      this.adjList = data

                      this.leaveManagementService.employeeLeave("0", this.id).subscribe(data => {
                        this.leaveList = data
                        const start = this.pipe.transform(this.employeeForm.get('dateFrom').value.year + "/" + this.employeeForm.get('dateFrom').value.month + "/" + this.employeeForm.get('dateFrom').value.day + "", 'MM/dd/yyyy')
                        const end = this.pipe.transform(this.employeeForm.get('dateTo').value.year + "/" + this.employeeForm.get('dateTo').value.month + "/" + this.employeeForm.get('dateTo').value.day + "", 'MM/dd/yyyy')
                        this.attendanceManagementService.employeeSchedule(start, end, this.id).subscribe(data => {
                          this.scheduleList = data
                          this.isLoading = false;
                        },
                          (error: HttpErrorResponse) => {
                            console.log(error.error);
                          })
                      },
                        (error: HttpErrorResponse) => {
                          console.log(error.error);
                        })

                    },
                      (error: HttpErrorResponse) => {
                        console.log(error.error);
                      })
                  }
                  else {
                    this.id = "0"
                    this.display_name = "Your Name"
                    this.img_path = this.image + "\\" + "Default\\Image\\default.png";
                    this.isLoading = false;
                  }
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                  });
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                })
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
              })
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  selectPresentRegion() {
    this.employeeForm.get('presentSelectedCity').reset();
    this.presentCity = [];
    this.presentCity = this.dropdown.filter(x => x.id === this.employeeForm.get('presentSelectedRegion').value)
  }

  selectPermanentRegion() {
    this.employeeForm.get('permanentSelectedCity').reset();
    this.permanentCity = [];
    this.permanentCity = this.dropdown.filter(x => x.id === this.employeeForm.get('permanentSelectedRegion').value)
  }

  handleFileInput(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute('value', fileName)
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        this.employeeForm.patchValue({
          image_path: event.target.files[0].name
        });
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.img_path = event.target.result as string;
        }
        this.fileName = event.target.files
      }
    }
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click();
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.employeeForm.patchValue({
        image_path: event.target.files[0].name
      });
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.img_path = event.target.result as string;
      }
      this.fileName = event.target.files
    }
  }

  search() {
    this.isSearch = true
    const start = this.pipe.transform(this.employeeForm.get('dateFrom').value.year + "/" + this.employeeForm.get('dateFrom').value.month + "/" + this.employeeForm.get('dateFrom').value.day + "", 'MM/dd/yyyy')
    const end = this.pipe.transform(this.employeeForm.get('dateTo').value.year + "/" + this.employeeForm.get('dateTo').value.month + "/" + this.employeeForm.get('dateTo').value.day + "", 'MM/dd/yyyy')
    this.attendanceManagementService.employeeSchedule(start, end, this.id).subscribe(data => {
      this.scheduleList = data
      this.isSearch = false;
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  resetError(e) {
    this.errSalutation = e;
    this.errDisplayName = e;
    this.errFirstName = e;
    this.errMiddleName = e;
    this.errLastName = e;
    this.errNickname = e;
    this.errGender = e;
    this.errNationality = e;
    this.errBirthday = e;
    this.errBirthplace = e;
    this.errCivilstatus = e;
    this.errReligion = e;
    this.errMobile = e;
    this.errEmail = e;
    this.errValidEmail = e;
    this.errValidCompany = e;
    this.errPresentAddress = e;
    this.errPermanentAddress = e;
    this.errBiometrics = e;
    this.errEmployeeCode = e;
    this.errBranch = e;
    this.errEmployeeStatus = e;
    this.errOccupation = e;
    this.errDepartment = e;
    this.errDateHired = e;
    this.errCategory = e;
    this.errPayrollType = e;
    this.errMonthlyRate = e;
    this.errSemiMonthlyRate = e;
    this.errFactorRate = e;
    this.errDailyRate = e;
    this.errHourlyRate = e;
    this.errBank = e;
    this.errBankAccount = e;
    this.errConfidential = e;
    this.errSSS = e;
    this.errPagibig = e;
    this.errPhilhealth = e;
    this.errTIN = e;
  }

  onChange() {
    setTimeout(() => {
      debugger
      if (this.employeeForm.get('displayName').value === null || this.employeeForm.get('displayName').value === "") {
        this.display_name = 'Your Name'
      }
      else {
        this.display_name = this.employeeForm.get('displayName').value
      }
    }, 100);
  }

  onChangeName() {
    var display = "";
    var first = this.employeeForm.get('firstName').value === null || this.employeeForm.get('firstName').value === "" ? "" : this.employeeForm.get('firstName').value
    var middle = this.employeeForm.get('middleName').value === null || this.employeeForm.get('middleName').value === "" ? "" : this.employeeForm.get('middleName').value
    var last = this.employeeForm.get('lastName').value === null || this.employeeForm.get('lastName').value === "" ? "" : this.employeeForm.get('lastName').value
    if (first !== "" && middle !== "" && last !== "") {
      display = last[0].toUpperCase() + last.slice(1) + ", " + first[0].toUpperCase() + first.slice(1) + " " + middle.substring(0, 1)[0].toUpperCase() + middle.substring(0, 1).slice(1) + "."
      this.display_name = display
      this.employeeForm.get('displayName').setValue(display)
    }
  }

  selectedDateHired() {
    let flag = true
    if (this.employeeForm.get('dateHired').value === "" || this.employeeForm.get('dateHired').value === null) {
      flag = false;
    }
    if(flag){
      let d = new Date(this.pipe.transform(this.employeeForm.get('dateHired').value.year + "/" + this.employeeForm.get('dateHired').value.month + "/" + this.employeeForm.get('dateHired').value.day + "", 'MM/dd/yyyy'))
      d.setMonth(d.getMonth() + 6);
      const newDate = {
        day: new Date(d).getDate(),
        month: new Date(d).getMonth() + 1,
        year: new Date(d).getFullYear()
      }
      this.employeeForm.get('regularizationDate').setValue(newDate)
    }
    
  }

  validation() {
    let flag = true
    this.resetError(false)
    let active = 1
    // if (this.employeeForm.get('selectedSalutation').value === "" || this.employeeForm.get('selectedSalutation').value === null) {
    //   flag = false;
    //   this.errSalutation = true;
    // }
    if (this.employeeForm.get('displayName').value === "" || this.employeeForm.get('displayName').value === null) {
      flag = false;
      this.errDisplayName = true;
    }
    if (this.employeeForm.get('firstName').value === "" || this.employeeForm.get('firstName').value === null) {
      flag = false;
      this.errFirstName = true;
    }
    // if (this.employeeForm.get('middleName').value === "" || this.employeeForm.get('middleName').value === null) {
    //   flag = false;
    //   this.errMiddleName = true;
    // }
    if (this.employeeForm.get('lastName').value === "" || this.employeeForm.get('lastName').value === null) {
      flag = false;
      this.errLastName = true;
    }
    if (this.employeeForm.get('nickname').value === "" || this.employeeForm.get('nickname').value === null) {
      flag = false;
      this.errNickname = true;
    }
    if (this.employeeForm.get('selectedGender').value === "" || this.employeeForm.get('selectedGender').value === null) {
      flag = false;
      this.errGender = true;
    }
    if (this.employeeForm.get('selectedNationality').value === "" || this.employeeForm.get('selectedNationality').value === null) {
      flag = false;
      this.errNationality = true;
    }
    if (this.employeeForm.get('selectedDate').value === "" || this.employeeForm.get('selectedDate').value === null) {
      flag = false;
      this.errBirthday = true;
    }
    if (this.employeeForm.get('birthplace').value === "" || this.employeeForm.get('birthplace').value === null) {
      flag = false;
      this.errBirthplace = true;
    }
    if (this.employeeForm.get('selectedCivilStatus').value === "" || this.employeeForm.get('selectedCivilStatus').value === null) {
      flag = false;
      this.errCivilstatus = true;
    }
    // if (this.employeeForm.get('selectedReligion').value === "" || this.employeeForm.get('selectedReligion').value === null) {
    //   flag = false;
    //   this.errReligion = true;
    // }
    if (this.employeeForm.get('mobile').value === "" || this.employeeForm.get('mobile').value === null) {
      flag = false;
      this.errMobile = true;
    }
    if (this.employeeForm.get('personalemail').value !== "" && this.employeeForm.get('personalemail').value !== null) {
      const ret = this.emailIsValid(this.employeeForm.get('personalemail').value)
      if (!ret) {
        flag = false
        this.errValidEmail = true
      }
    }
    if (this.employeeForm.get('companyemail').value === "" || this.employeeForm.get('companyemail').value === null) {
      flag = false;
      this.errEmail = true;
    }
    else {
      const ret = this.emailIsValid(this.employeeForm.get('companyemail').value)
      if (!ret) {
        flag = false
        this.errValidCompany = true
      }
    }
    if (this.employeeForm.get('companyemail').value === "" || this.employeeForm.get('companyemail').value === null) {
      flag = false;
      this.errEmail = true;
    }
    if (flag === true) {
      active = 2
      if (this.employeeForm.get('biometricsID').value === "" || this.employeeForm.get('biometricsID').value === null) {
        flag = false;
        this.errBiometrics = true;
      }
      if (this.employeeForm.get('employeeID').value === "" || this.employeeForm.get('employeeID').value === null) {
        flag = false;
        this.errEmployeeCode = true;
      }
      if (this.employeeForm.get('selectedBranch').value === "" || this.employeeForm.get('selectedBranch').value === null) {
        flag = false;
        this.errBranch = true;
      }
      if (this.employeeForm.get('selectedEmployeeStatus').value === "" || this.employeeForm.get('selectedEmployeeStatus').value === null) {
        flag = false;
        this.errEmployeeStatus = true;
      }
      if (this.employeeForm.get('selectedOccupation').value === "" || this.employeeForm.get('selectedOccupation').value === null) {
        flag = false;
        this.errOccupation = true;
      }
      if (this.employeeForm.get('selectedDepartment').value === "" || this.employeeForm.get('selectedDepartment').value === null) {
        flag = false;
        this.errDepartment = true;
      }
      if (this.employeeForm.get('dateHired').value === "" || this.employeeForm.get('dateHired').value === null) {
        flag = false;
        this.errDateHired = true;
      }
      if (this.employeeForm.get('selectedCategory').value === "" || this.employeeForm.get('selectedCategory').value === null) {
        flag = false;
        this.errCategory = true;
      }
    }
    if (flag === true) {
      active = 3
      if (this.employeeForm.get('selectedPayrollType').value === "" || this.employeeForm.get('selectedPayrollType').value === null) {
        flag = false;
        this.errPayrollType = true;
      }
      if (this.employeeForm.get('monthlyRate').value === "" || this.employeeForm.get('monthlyRate').value === null) {
        flag = false;
        this.errMonthlyRate = true;
      }
      if (this.employeeForm.get('semiMonthlyRate').value === "" || this.employeeForm.get('semiMonthlyRate').value === null) {
        flag = false;
        this.errSemiMonthlyRate = true;
      }
      if (this.employeeForm.get('factorRate').value === "" || this.employeeForm.get('factorRate').value === null) {
        flag = false;
        this.errFactorRate = true;
      }
      if (this.employeeForm.get('dailyRate').value === "" || this.employeeForm.get('dailyRate').value === null) {
        flag = false;
        this.errDailyRate = true;
      }
      if (this.employeeForm.get('hourlyRate').value === "" || this.employeeForm.get('hourlyRate').value === null) {
        flag = false;
        this.errHourlyRate = true;
      }
      if (this.employeeForm.get('selectedBank').value === "" || this.employeeForm.get('selectedBank').value === null) {
        flag = false;
        this.errBank = true;
      }
      if (this.employeeForm.get('sssNumber').value === "" || this.employeeForm.get('sssNumber').value === null) {
        flag = false;
        this.errSSS = true;
      }
      if (this.employeeForm.get('pagibigNumber').value === "" || this.employeeForm.get('pagibigNumber').value === null) {
        flag = false;
        this.errPagibig = true;
      }
      if (this.employeeForm.get('philhealthNumber').value === "" || this.employeeForm.get('philhealthNumber').value === null) {
        flag = false;
        this.errPhilhealth = true;
      }
      if (this.employeeForm.get('tinNumber').value === "" || this.employeeForm.get('tinNumber').value === null) {
        flag = false;
        this.errTIN = true;
      }
      if (this.employeeForm.get('bankAccount').value === "" || this.employeeForm.get('bankAccount').value === null) {
        flag = false;
        this.errBankAccount = true;
      }
      if (this.employeeForm.get('selectedConfidential').value === "" || this.employeeForm.get('selectedConfidential').value === null) {
        flag = false;
        this.errConfidential = true;
      }
    }
    if (flag == false) {
      this.defaultNavActiveId = active
    }
    return flag
  }

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }


  sameAddress(e) {
    if (e.target.checked) {
      this.employeeForm.get('permanentSelectedCity').reset();
      this.permanentCity = [];
      this.permanentCity = this.dropdown.filter(x => x.id === this.employeeForm.get('presentSelectedRegion').value)

      this.employeeForm.get('permanentUnit').setValue(this.employeeForm.get('presentUnit').value)
      this.employeeForm.get('permanentBuilding').setValue(this.employeeForm.get('presentBuilding').value)
      this.employeeForm.get('permanentStreet').setValue(this.employeeForm.get('presentStreet').value)
      this.employeeForm.get('permanentBarangay').setValue(this.employeeForm.get('presentBarangay').value)
      this.employeeForm.get('permanentSelectedProvince').setValue(this.employeeForm.get('presentSelectedProvince').value)
      this.employeeForm.get('permanentSelectedCity').setValue(this.employeeForm.get('presentSelectedCity').value)
      this.employeeForm.get('permanentSelectedRegion').setValue(this.employeeForm.get('presentSelectedRegion').value)
      this.employeeForm.get('permanentSelectedCountry').setValue(this.employeeForm.get('presentSelectedCountry').value)
      this.employeeForm.get('permanentZipCode').setValue(this.employeeForm.get('presentZipCode').value)
    }
    else {
      this.employeeForm.get('permanentUnit').setValue("")
      this.employeeForm.get('permanentBuilding').setValue("")
      this.employeeForm.get('permanentStreet').setValue("")
      this.employeeForm.get('permanentBarangay').setValue("")
      this.employeeForm.get('permanentSelectedProvince').setValue(null)
      this.employeeForm.get('permanentSelectedCity').setValue(null)
      this.employeeForm.get('permanentSelectedRegion').setValue(null)
      this.employeeForm.get('permanentSelectedCountry').setValue(null)
      this.employeeForm.get('permanentZipCode').setValue("")
    }
  }

  submit(i) {
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
                employee_id: 0,
                encrypt_employee_id: this.id,
                display_name: this.employeeForm.get('displayName').value,
                employee_code: this.employeeForm.get('employeeID').value,
                user_name: this.employeeForm.get('userName').value,
                user_hash: this.employeeForm.get('userHash').value,
                image_path: this.employeeForm.get('image_path').value,
                old_image_path: this.employeeForm.get('old_image_path').value,
                salutation_id: this.employeeForm.get('selectedSalutation').value,
                first_name: this.employeeForm.get('firstName').value,
                middle_name: this.employeeForm.get('middleName').value,
                last_name: this.employeeForm.get('lastName').value,
                suffix_id: this.employeeForm.get('selectedSuffix').value === null ? 0 : this.employeeForm.get('selectedSuffix').value,
                nick_name: this.employeeForm.get('nickname').value,
                gender_id: this.employeeForm.get('selectedGender').value,
                nationality_id: this.employeeForm.get('selectedNationality').value,
                birthday: this.pipe.transform(this.employeeForm.get('selectedDate').value.year + "/" + this.employeeForm.get('selectedDate').value.month + "/" + this.employeeForm.get('selectedDate').value.day + "", 'MM/dd/yyyy'),
                birth_place: this.employeeForm.get('birthplace').value,
                civil_status_id: this.employeeForm.get('selectedCivilStatus').value,
                height: this.employeeForm.get('height').value,
                weight: this.employeeForm.get('weight').value,
                blood_type_id: this.employeeForm.get('selectedBloodType').value === null ? 0 : this.employeeForm.get('selectedBloodType').value,
                religion_id: this.employeeForm.get('selectedReligion').value === null ? 0 : this.employeeForm.get('selectedReligion').value,
                mobile: this.employeeForm.get('mobile').value,
                phone: this.employeeForm.get('phone').value,
                office: this.employeeForm.get('office').value,
                email_address: this.employeeForm.get('companyemail').value,
                personal_email_address: this.employeeForm.get('personalemail').value,
                alternate_number: this.employeeForm.get('alternatenumber').value,
                pre_unit_floor: this.employeeForm.get('presentUnit').value,
                pre_building: this.employeeForm.get('presentBuilding').value,
                pre_street: this.employeeForm.get('presentStreet').value,
                pre_barangay: this.employeeForm.get('presentBarangay').value,
                pre_province_id: this.employeeForm.get('presentSelectedProvince').value === null ? 0 : this.employeeForm.get('presentSelectedProvince').value,
                pre_city_id: this.employeeForm.get('presentSelectedCity').value === null ? 0 : this.employeeForm.get('presentSelectedCity').value,
                pre_region_id: this.employeeForm.get('presentSelectedRegion').value === null ? 0 : this.employeeForm.get('presentSelectedRegion').value,
                pre_country_id: this.employeeForm.get('presentSelectedCountry').value === null ? 0 : this.employeeForm.get('presentSelectedCountry').value,
                pre_zipcode: this.employeeForm.get('presentZipCode').value,
                per_unit_floor: this.employeeForm.get('permanentUnit').value,
                per_building: this.employeeForm.get('permanentBuilding').value,
                per_street: this.employeeForm.get('permanentStreet').value,
                per_barangay: this.employeeForm.get('permanentBarangay').value,
                per_province_id: this.employeeForm.get('permanentSelectedProvince').value === null ? 0 : this.employeeForm.get('permanentSelectedProvince').value,
                per_city_id: this.employeeForm.get('permanentSelectedCity').value === null ? 0 : this.employeeForm.get('permanentSelectedCity').value,
                per_region_id: this.employeeForm.get('permanentSelectedRegion').value === null ? 0 : this.employeeForm.get('permanentSelectedRegion').value,
                per_country_id: this.employeeForm.get('permanentSelectedCountry').value === null ? 0 : this.employeeForm.get('permanentSelectedCountry').value,
                per_zipcode: this.employeeForm.get('permanentZipCode').value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
                EIRequest: {
                  bio_id: this.employeeForm.get('biometricsID').value,
                  branch_id: this.employeeForm.get('selectedBranch').value,
                  employee_status_id: this.employeeForm.get('selectedEmployeeStatus').value,
                  occupation_id: this.employeeForm.get('selectedOccupation').value,
                  supervisor_id: this.employeeForm.get('selectedSupervisor').value === null ? "0" : this.employeeForm.get('selectedSupervisor').value,
                  department_id: this.employeeForm.get('selectedDepartment').value,
                  date_hired: this.pipe.transform(this.employeeForm.get('dateHired').value.year + "/" + this.employeeForm.get('dateHired').value.month + "/" + this.employeeForm.get('dateHired').value.day + "", 'MM/dd/yyyy'),
                  date_regularized: this.employeeForm.get('regularizationDate').value === null || this.employeeForm.get('regularizationDate').value === "" ? "" : this.pipe.transform(this.employeeForm.get('regularizationDate').value.year + "/" + this.employeeForm.get('regularizationDate').value.month + "/" + this.employeeForm.get('regularizationDate').value.day + "", 'MM/dd/yyyy'),
                  cost_center_id: this.employeeForm.get('selectedCostCenter').value === null ? 0 : this.employeeForm.get('selectedCostCenter').value,
                  category_id: this.employeeForm.get('selectedCategory').value,
                  division_id: this.employeeForm.get('selectedDivision').value === null ? 0 : this.employeeForm.get('selectedDivision').value,
                  payroll_type_id: this.employeeForm.get('selectedPayrollType').value,
                  monthly_rate: parseFloat(this.employeeForm.get('monthlyRate').value.replace(",", "")),
                  semi_monthly_rate: parseFloat(this.employeeForm.get('semiMonthlyRate').value.replace(",", "")),
                  factor_rate: parseFloat(this.employeeForm.get('factorRate').value.replace(",", "")),
                  daily_rate: parseFloat(this.employeeForm.get('dailyRate').value.replace(",", "")),
                  hourly_rate: parseFloat(this.employeeForm.get('hourlyRate').value.replace(",", "")),
                  bank_id: this.employeeForm.get('selectedBank').value,
                  bank_account: this.employeeForm.get('bankAccount').value,
                  sss: this.employeeForm.get('sssNumber').value,
                  pagibig: this.employeeForm.get('pagibigNumber').value,
                  philhealth: this.employeeForm.get('philhealthNumber').value,
                  tin: this.employeeForm.get('tinNumber').value,
                  confidentiality_id: this.employeeForm.get('selectedConfidential').value === null ? 0 : this.employeeForm.get('selectedConfidential').value,
                }
              }
              this.userManagement.employeeIU(obj).subscribe(data => {
                if (data.employee_id === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                  this.dataUploadManagementService.uploadImage(this.fileName, data.employee_code, "17").subscribe(data => {
                    if (data[0].response == 0) {
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
}
