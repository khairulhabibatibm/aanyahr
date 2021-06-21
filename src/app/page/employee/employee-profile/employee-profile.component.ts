import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { BranchManagementService } from '../../../services/BranchManagementService/branchManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import { DataUploadManagementService } from '../../../services/DataUploadManagementService/dataUploadManagement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeCategoryManagementService } from '../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { PayrollRatesManagementService } from '../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { LeaveManagementService } from '../../../services/LeaveManagementService/leaveManagement.service';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent implements OnInit {
  image = environment.exportUrl
  scheduleList = []
  adjList = []
  leaveList = []
  employeeForm: FormGroup;
  isLoading = true;
  defaultNavActiveId = 1;
  pipe = new DatePipe('en-US');
  isSearch = false
  display_name: string
  img_path: string
  type: string = "password"
  errUsername: boolean = false
  errPassword: boolean = false
  strError = ""
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
  constructor(private fb: FormBuilder, private employeeCategory: EmployeeCategoryManagementService,
    private attendanceManagementService: AttendanceManagementService, private userManagement: UserManagementService,
    private payrollRatesManagementService: PayrollRatesManagementService, private leaveManagementService: LeaveManagementService) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      userName: '',
      userHash: '',
      selectedSalutation: '',
      displayName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      selectedSuffix: '',
      nickname: '',
      selectedGender: '',
      selectedNationality: '',
      selectedDate: '',
      birthplace: '',
      selectedCivilStatus: '',
      height: '',
      weight: '',
      selectedBloodType: '',
      selectedReligion: '',
      mobile: '',
      phone: '',
      office: '',
      personalemail: '',
      companyemail: '',
      alternatenumber: '',
      presentZipCode: '',
      presentUnit: '',
      presentBuilding: '',
      presentStreet: '',
      presentBarangay: '',
      presentRegion: '',
      presentProvince: '',
      presentCity: '',
      presentCountry: '',
      permanentZipCode: '',
      permanentUnit: '',
      permanentBuilding: '',
      permanentStreet: '',
      permanentBarangay: '',
      permanentRegion: '',
      permanentProvince: '',
      permanentCity: '',
      permanentCountry: '',
      biometricsID: '',
      employeeID: '',
      selectedBranch: '',
      selectedEmployeeStatus: '',
      selectedOccupation: '',
      selectedSupervisor: '',
      selectedDepartment: '',
      dateHired: '',
      regularizationDate: '',
      selectedPayrollType: '',
      monthlyRate: 0,
      semiMonthlyRate: 0,
      factorRate: 0,
      dailyRate: 0,
      hourlyRate: 0,
      sssNumber: '',
      pagibigNumber: '',
      philhealthNumber: '',
      tinNumber: '',
      selectedBank: '',
      bankAccount: '',
      dateFrom: this.startDate,
      dateTo: this.endDate,
    });
    this.userManagement.profileView(sessionStorage.getItem('u')).subscribe(data => {
      this.img_path = this.image + "\\" + data[0].image_path
      this.employeeForm.setValue({
        userName: data[0].user_name,
        userHash: data[0].decrypted_user_hash,
        selectedSalutation: data[0].salutation,
        displayName: data[0].display_name,
        firstName: data[0].first_name,
        middleName: data[0].middle_name,
        lastName: data[0].last_name,
        selectedSuffix: data[0].suffix,
        nickname: data[0].nick_name,
        selectedGender: data[0].gender,
        selectedNationality: data[0].nationality,
        selectedDate: this.pipe.transform(data[0].birthday, 'MM/dd/yyyy'),
        birthplace: data[0].birth_place,
        selectedCivilStatus: data[0].civil_status,
        height: data[0].height,
        weight: data[0].weight,
        selectedBloodType: data[0].blood_type,
        selectedReligion: data[0].religion,
        mobile: data[0].mobile,
        phone: data[0].phone,
        office: data[0].office,
        personalemail: data[0].personal_email_address,
        companyemail: data[0].email_address,
        alternatenumber: data[0].alternate_number,
        presentZipCode: data[0].pre_zipcode,
        presentUnit: data[0].pre_unit_floor,
        presentBuilding: data[0].pre_building,
        presentStreet: data[0].pre_street,
        presentBarangay: data[0].pre_barangay,
        presentRegion: data[0].pre_region,
        presentProvince: data[0].pre_province,
        presentCity: data[0].pre_city,
        presentCountry: data[0].pre_country,
        permanentZipCode: data[0].per_zipcode,
        permanentUnit: data[0].per_unit_floor,
        permanentBuilding: data[0].per_building,
        permanentStreet: data[0].per_street,
        permanentBarangay: data[0].per_barangay,
        permanentRegion: data[0].per_region,
        permanentProvince: data[0].per_province,
        permanentCity: data[0].per_city,
        permanentCountry: data[0].per_country,
        biometricsID: data[0].bio_id,
        employeeID: data[0].employee_code,
        selectedBranch: data[0].branch,
        selectedEmployeeStatus: data[0].employee_status,
        selectedOccupation: data[0].occupation,
        selectedSupervisor: data[0].supervisor,
        selectedDepartment: data[0].department,
        dateHired: data[0].date_hired,
        regularizationDate: data[0].date_regularized,
        selectedPayrollType: data[0].payroll_type,
        monthlyRate: data[0].monthly_rate,
        semiMonthlyRate: data[0].semi_monthly_rate,
        factorRate: data[0].factor_rate,
        dailyRate: data[0].daily_rate,
        hourlyRate: data[0].hourly_rate,
        sssNumber: data[0].sss,
        pagibigNumber: data[0].pagibig,
        tinNumber: data[0].tin,
        philhealthNumber: data[0].philhealth,
        selectedBank: data[0].bank,
        bankAccount: data[0].bank_account,
        dateFrom: this.startDate,
        dateTo: this.endDate,
      });

      this.payrollRatesManagementService.viewRecurring(sessionStorage.getItem('u')).subscribe(data => {
        this.adjList = data

        this.leaveManagementService.employeeLeave("0", sessionStorage.getItem('u')).subscribe(data => {
          this.leaveList = data
          const start = this.pipe.transform(this.employeeForm.get('dateFrom').value.year + "/" + this.employeeForm.get('dateFrom').value.month + "/" + this.employeeForm.get('dateFrom').value.day + "", 'MM/dd/yyyy')
          const end = this.pipe.transform(this.employeeForm.get('dateTo').value.year + "/" + this.employeeForm.get('dateTo').value.month + "/" + this.employeeForm.get('dateTo').value.day + "", 'MM/dd/yyyy')
          this.attendanceManagementService.employeeSchedule(start, end, sessionStorage.getItem('u')).subscribe(data => {
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
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  toggle() {
    if (this.type === "text") {
      this.type = "password";
    } else {
      this.type = "text"
    }
  }

  search() {
    this.isSearch = true
    const start = this.pipe.transform(this.employeeForm.get('dateFrom').value.year + "/" + this.employeeForm.get('dateFrom').value.month + "/" + this.employeeForm.get('dateFrom').value.day + "", 'MM/dd/yyyy')
    const end = this.pipe.transform(this.employeeForm.get('dateTo').value.year + "/" + this.employeeForm.get('dateTo').value.month + "/" + this.employeeForm.get('dateTo').value.day + "", 'MM/dd/yyyy')
    this.attendanceManagementService.employeeSchedule(start, end, sessionStorage.getItem('u')).subscribe(data => {
      this.scheduleList = data
      this.isSearch = false;
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  validation() {
    let flag = true
    this.errUsername = false
    this.errPassword = false
    this.strError = ""
    if (this.employeeForm.get('userName').value == "" || this.employeeForm.get('userName').value === null) {
      flag = false
      this.errUsername = true
    }
    if (this.employeeForm.get('userHash').value === "" || this.employeeForm.get('userHash').value === null) {
      flag = false
      this.errPassword = true
    }
    else {
      let variations = {
        digits: /\d/.test(this.employeeForm.get('userHash').value),
        lower: /[a-z]/.test(this.employeeForm.get('userHash').value),
        upper: /[A-Z]/.test(this.employeeForm.get('userHash').value),
        nonWords: /\W/.test(this.employeeForm.get('userHash').value),
      }
      if (!variations.digits) {
        this.strError = "Password needs to have atleast one number!"
        flag = false
      }
      if (!variations.upper) {
        this.strError = "Password needs to have atleast one upper case letter!"
        flag = false
      }
      if (this.employeeForm.get('userHash').value.length < 8) {
        this.strError = "Password needs to have a minimum of eight characters!"
        flag = false
      }
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
                employee_id: sessionStorage.getItem('u'),
                user_name: this.employeeForm.get('userName').value,
                user_hash: this.employeeForm.get('userHash').value,
                created_by: sessionStorage.getItem('u'),
                series_code: sessionStorage.getItem('sc'),
              }
              this.userManagement.credentialU(obj).subscribe(data => {
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
