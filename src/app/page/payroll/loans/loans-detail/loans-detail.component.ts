import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';
import Swal from 'sweetalert2';
import { PayrollRatesManagementService } from '../../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loans-detail',
  templateUrl: './loans-detail.component.html',
  styleUrls: ['./loans-detail.component.css']
})
export class LoansDetailComponent implements OnInit {
  loanForm: FormGroup
  updateForm: FormGroup
  isLoading: boolean = true
  loanType = []
  loanTiming = []
  employeeList = []
  table = []
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  pipe = new DatePipe('en-US');
  id: string
  errLoanType: boolean
  errLoanName: boolean
  errEmployee: boolean
  errTotalAmount: boolean
  errAmount: boolean
  errLoanDate: boolean
  errLoanStart: boolean
  errTerms: boolean
  errTiming: boolean
  index: number
  fAmount: number = 0
  fPaid: number = 0
  fBalance: number = 0
  constructor(private fb: FormBuilder, private tenantMasterService: TenantMasterService,
    private route: ActivatedRoute, private userManagementService: UserManagementService,
    private payrollRatesManagementService: PayrollRatesManagementService, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loanForm = this.fb.group({
      loanCode: '',
      selectedLoanType: null,
      loanName: '',
      selectedEmployee: null,
      totalLoanAmount: 0,
      loanDate: this.dateToday,
      loanStart: this.dateToday,
      terms: 0,
      selectedLoanTiming: null,
    })
    this.updateForm = this.fb.group({
      amount: 0,
      date: this.dateToday,
    })
    this.resetError(false)
    this.userManagementService.employeeList().subscribe(data => {
      this.employeeList = data

      this.tenantMasterService.dropdownList("58,59,").subscribe(data => {
        this.loanType = data.filter(x => x.type_id === 58)
        this.loanTiming = data.filter(x => x.type_id === 59)

        if (this.id !== "") {
          this.payrollRatesManagementService.loansView(this.id).subscribe(data => {
            this.loanForm.setValue({
              loanCode: data[0].loan_code,
              selectedLoanType: data[0].loan_type_id,
              loanName: data[0].loan_name,
              selectedEmployee: data[0].employee_id,
              totalLoanAmount: data[0].total_amount,
              loanDate: {
                year: new Date(data[0].loan_date).getFullYear(),
                month: new Date(data[0].loan_date).getMonth() + 1,
                day: new Date(data[0].loan_date).getDate(),
              },
              loanStart: {
                year: new Date(data[0].loan_start).getFullYear(),
                month: new Date(data[0].loan_start).getMonth() + 1,
                day: new Date(data[0].loan_start).getDate(),
              },
              terms: data[0].terms,
              selectedLoanTiming: data[0].loan_timing_id,
            });
            this.payrollRatesManagementService.loansDetailView(this.id).subscribe(data => {
              this.table = data
              this.computeFooter()
              this.isLoading = false
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
          this.isLoading = false
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  computeLoan() {
    let flag = true
    if (this.loanForm.get('totalLoanAmount').value === "" || this.loanForm.get('totalLoanAmount').value === null || this.loanForm.get('totalLoanAmount').value === 0) {
      flag = false;
    }
    if (this.loanForm.get('loanStart').value === "" || this.loanForm.get('loanStart').value === null) {
      flag = false;
    }
    if (this.loanForm.get('terms').value === "" || this.loanForm.get('terms').value === null || this.loanForm.get('terms').value === 0) {
      flag = false;
    }
    if (this.loanForm.get('selectedLoanTiming').value === "" || this.loanForm.get('selectedLoanTiming').value === null) {
      flag = false;
    }
    if (flag) {
      this.table = []
      this.payrollRatesManagementService.computeLoan(
        "0",
        this.loanForm.get("totalLoanAmount").value,
        this.pipe.transform(this.loanForm.get("loanStart").value.year + "/" + this.loanForm.get("loanStart").value.month + "/" + this.loanForm.get("loanStart").value.day + "", 'MM/dd/yyyy'),
        this.loanForm.get("terms").value,
        this.loanForm.get("selectedLoanTiming").value).subscribe(data => {
          this.table = data
          console.log(data)
          this.computeFooter()
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
    }
  }

  viewLoan(content, e) {
    this.index = e
    const selected = this.table[e]
    const date = {
      day: new Date(selected.date).getDate(),
      month: new Date(selected.date).getMonth() + 1,
      year: new Date(selected.date).getFullYear()
    }
    this.updateForm.get("date").setValue(date)
    this.updateForm.get("amount").setValue(selected.amount)
    this.modalService.open(content)
  }

  updateLoan() {
    this.table[this.index].amount = this.updateForm.get("amount").value
    this.table[this.index].date = this.pipe.transform(this.updateForm.get("date").value.year + "/" + this.updateForm.get("date").value.month + "/" + this.updateForm.get("date").value.day + "", 'MM/dd/yyyy')
    let amount = 0
    for (var i = 0; i < this.table.length; i++) {
      amount += this.table[i].amount
    }
    this.loanForm.get("totalLoanAmount").setValue(amount)
    this.computeFooter()
    this.modalService.dismissAll()
  }

  deleteLoan(e) {
    this.table.splice(e, 1);
    this.loanForm.get("terms").setValue(this.table.length)
    let amount = 0
    for (var i = 0; i < this.table.length; i++) {
      amount += this.table[i].amount
    }
    this.loanForm.get("totalLoanAmount").setValue(amount)
    this.computeFooter()
  }

  addLoan() {
    this.table.push({
      active: false,
      amount: 0,
      balance: 0,
      date: this.pipe.transform(this.dateToday.year + "/" + this.dateToday.month + "/" + this.dateToday.day + "", 'MM/dd/yyyy'),
      paid: 0,
      payslip: ""
    })
    this.loanForm.get("terms").setValue(this.table.length)
  }

  computeFooter() {
    this.fAmount = 0
    this.fPaid = 0
    this.fBalance = 0
    for (var i = 0; i < this.table.length; i++) {
      this.fAmount += this.table[i].amount
      this.fPaid += this.table[i].paid
      this.fBalance += this.table[i].balance
    }
  }

  resetError(e) {
    this.errLoanType = e
    this.errLoanName = e
    this.errEmployee = e
    this.errTotalAmount = e
    this.errAmount = e
    this.errLoanDate = e
    this.errLoanStart = e
    this.errTerms = e
    this.errTiming = e
  }

  validation() {
    this.resetError(false)
    let flag = true
    if (this.loanForm.get('selectedLoanType').value === "" || this.loanForm.get('selectedLoanType').value === null) {
      flag = false;
      this.errLoanType = true;
    }
    if (this.loanForm.get('loanName').value === "" || this.loanForm.get('loanName').value === null) {
      flag = false;
      this.errLoanName = true;
    }
    if (this.loanForm.get('selectedEmployee').value === "" || this.loanForm.get('selectedEmployee').value === null) {
      flag = false;
      this.errEmployee = true;
    }
    if (this.loanForm.get('totalLoanAmount').value === "" || this.loanForm.get('totalLoanAmount').value === null || this.loanForm.get('totalLoanAmount').value === 0) {
      flag = false;
      this.errTotalAmount = true;
    }
    if (this.loanForm.get('loanDate').value === "" || this.loanForm.get('loanDate').value === null) {
      flag = false;
      this.errLoanDate = true;
    }
    if (this.loanForm.get('loanStart').value === "" || this.loanForm.get('loanStart').value === null) {
      flag = false;
      this.errLoanStart = true;
    }
    if (this.loanForm.get('terms').value === "" || this.loanForm.get('terms').value === null || this.loanForm.get('terms').value === 0) {
      flag = false;
      this.errTerms = true;
    }
    if (this.loanForm.get('selectedLoanTiming').value === "" || this.loanForm.get('selectedLoanTiming').value === null) {
      flag = false;
      this.errTiming = true;
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
                loan_id: this.id,
                loan_code: this.loanForm.value.loanCode,
                loan_type_id: this.loanForm.value.selectedLoanType,
                loan_name: this.loanForm.value.loanName,
                employee_id: this.loanForm.value.selectedEmployee,
                total_amount: this.loanForm.value.totalLoanAmount,
                loan_date: this.pipe.transform(this.loanForm.get("loanDate").value.year + "/" + this.loanForm.get("loanDate").value.month + "/" + this.loanForm.get("loanDate").value.day + "", 'MM/dd/yyyy'),
                loan_start: this.pipe.transform(this.loanForm.get("loanStart").value.year + "/" + this.loanForm.get("loanStart").value.month + "/" + this.loanForm.get("loanStart").value.day + "", 'MM/dd/yyyy'),
                terms: this.loanForm.value.terms,
                loan_timing_id: this.loanForm.value.selectedLoanTiming,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
                Detail: this.table
              }
              this.payrollRatesManagementService.loanIU(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", data.description, "error");
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
