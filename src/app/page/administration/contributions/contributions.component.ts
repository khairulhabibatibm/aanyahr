import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PayrollRatesManagementService } from '../../../services/PayrollRatesManagementService/payrollRatesManagement.service';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';


@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {
  isLoading: boolean = false;
  selectedContribution: number;
  selectedGroup: number;
  selectedPayrollType: number;
  selectedPagibigType: number;
  contributionType = [];
  groupList = [];
  pagibigType = [];
  payrollType = [];
  table = [];
  tblSSS: boolean = false
  tblPagibig: boolean = false
  tblPhilhealth: boolean = false
  tblTax: boolean = false
  errGroup: boolean = false
  errType: boolean = false
  errPayroll: boolean = false
  isTax: boolean = false

  constructor(private tenantDefaultService: TenantDefaultService, private tenantMasterService: TenantMasterService,
    private payrollRatesService: PayrollRatesManagementService) { }

  ngOnInit() {
    this.tenantDefaultService.dropdownTList("22").subscribe(data => {
      this.groupList = data

      this.tenantMasterService.dropdownList("23").subscribe(data => {
        this.contributionType = data;

        this.tenantMasterService.dropdownList("48").subscribe(data => {
          this.pagibigType = data;

          this.tenantMasterService.dropdownList("49").subscribe(data => {
            this.payrollType = data;
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

  onChange(index, column, event) {
    this.table[index][column] = event.target.value;
  }

  onChangeSelect(index, event) {
    this.table[index].share_type_id = event.id;
  }

  add() {
    switch (this.selectedContribution) {
      case 48:
        this.table.push({
          range_from: 0,
          range_to: 0,
          salary_base: 0,
          employee_share: 0,
          employer_share: 0,
          employee_compensation: 0,
          employee_mpf: 0,
          employer_mpf: 0,
        })
        break;
      case 49:
        this.table.push({
          range_from: 0,
          range_to: 0,
          share_type_id: null,
          employee_share: 0,
          employer_share: 0,
        })
        break;
      case 50:
        this.table.push({
          maximum: 0,
          minimum: 0,
          premium_rate: 0,
        })
        break;
      default:
        this.table.push({
          range_from: 0,
          range_to: 0,
          salary_base: null,
          base_amount: 0,
          tax_percentage: 0,
        })
        break;
    }
  }

  remove(i) {
    this.table.splice(i, 1);
  }

  selectedTable() {
    this.table = []
    this.tblSSS = false
    this.tblPagibig = false
    this.tblPhilhealth = false
    this.tblTax = false
    this.isTax = false
    if ((this.selectedContribution !== null && this.selectedContribution !== undefined) &&
      (this.selectedGroup !== null && this.selectedGroup !== undefined)) {
      switch (this.selectedContribution) {
        case 48:
          this.tblSSS = true
          this.payrollRatesService.sssView(this.selectedGroup).subscribe(data => {
            if (data.length > 0) {
              this.table = data;
            }
            else {
              this.tenantMasterService.sssView().subscribe(data => {
                this.table = data;
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                })
            }
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
        case 49:
          this.tblPagibig = true
          this.payrollRatesService.pagibigView(this.selectedGroup).subscribe(data => {
            if (data.length > 0) {
              this.table = data;
            }
            else {
              this.tenantMasterService.pagibigView().subscribe(data => {
                this.table = data;
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                })
            }
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
        case 50:
          this.tblPhilhealth = true
          this.payrollRatesService.philhealthView(this.selectedGroup).subscribe(data => {
            if (data.length > 0) {
              this.table = data;
            }
            else {
              this.tenantMasterService.philhealthView().subscribe(data => {
                this.table = data;
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                })
            }
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
        default:
          this.tblTax = true
          this.isTax = true
          if (this.selectedPayrollType !== null && this.selectedPayrollType !== undefined) {
            this.payrollRatesService.taxView(this.selectedGroup, this.selectedPayrollType).subscribe(data => {
              if (data.length > 0) {
                this.table = data;
              }
              else {
                this.tenantMasterService.taxView(this.selectedPayrollType).subscribe(data => {
                  this.table = data;
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                  })
              }
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
              })
          }
          break;
      }
    }
  }

  validation() {
    this.errType = false
    this.errGroup = false
    this.errPayroll = false
    var flag = true
    if (this.selectedContribution === null || this.selectedContribution === undefined) {
      this.errType = true
      flag = false
    }
    if ((this.selectedGroup === null || this.selectedGroup === undefined)) {
      this.errGroup = true
      flag = false
    }
    if (this.isTax) {
      if ((this.selectedPayrollType === null || this.selectedPayrollType === undefined)) {
        this.errPayroll = true
        flag = false
      }
    }
    return flag
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
              switch (this.selectedContribution) {
                case 48:
                  this.payrollRatesService.sssIU(this.table.map(item => ({
                    base_amount: item.base_amount,
                    contribution_group_id: this.selectedGroup,
                    employee_compensation: item.employee_compensation,
                    employee_mpf: item.employee_mpf,
                    employee_share: item.employee_share,
                    employer_mpf: item.employer_mpf,
                    employer_share: item.employer_share,
                    range_from: item.range_from,
                    range_to: item.range_to,
                    salary_base: item.salary_base,
                    created_by: sessionStorage.getItem('u'),
                    series_code: sessionStorage.getItem('sc'),
                  }))).subscribe(data => {
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
                  break;
                case 49:
                  this.payrollRatesService.pagibigIU(
                    this.table.map(item => ({
                      contribution_group_id: this.selectedGroup,
                      employee_share: item.employee_share,
                      employer_share: item.employer_share,
                      range_from: item.range_from,
                      range_to: item.range_to,
                      share_type_id: item.share_type_id,
                      created_by: sessionStorage.getItem('u'),
                      series_code: sessionStorage.getItem('sc'),
                    }))).subscribe(data => {
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
                  break;
                case 50:
                  this.payrollRatesService.philhealthIU(this.table.map(item => ({
                    contribution_group_id: this.selectedGroup,
                    maximum: item.maximum,
                    minimum: item.minimum,
                    premium_rate: item.premium_rate,
                    created_by: sessionStorage.getItem('u'),
                    series_code: sessionStorage.getItem('sc'),
                  }))).subscribe(data => {
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
                  break;
                default:
                  this.payrollRatesService.taxIU(this.table.map(item => ({
                    contribution_group_id: this.selectedGroup,
                    base_amount: item.base_amount,
                    payroll_type_id: this.selectedPayrollType,
                    range_from: item.range_from,
                    range_to: item.range_to,
                    salary_base: item.salary_base,
                    tax_percentage: item.tax_percentage,
                    created_by: sessionStorage.getItem('u'),
                    series_code: sessionStorage.getItem('sc'),
                  }))).subscribe(data => {
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
                  break;
              }
            },
          });
        }
      })
    }
  }
}
