import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AccountManagementService } from '../../../../services/AccountManagementService/accountManagement.service';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { EmployeeCategoryManagementService } from '../../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import { PayrollManagementService } from '../../../../services/PayrollManagementService/payrollManagement.service';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { TimekeepingManagementService } from '../../../../services/TimekeepingManagementService/timekeepingManagement.service';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-payroll-generation-detail',
  templateUrl: './payroll-generation-detail.component.html',
  styleUrls: ['./payroll-generation-detail.component.css']
})
export class PayrollGenerationDetailComponent implements OnInit {
  isLoading: boolean = true
  isView: boolean = false
  complete: boolean = true
  isGenerate: boolean = false
  errTimekeeping: boolean = false
  errPosting: boolean = false
  errAdjustmentType: boolean
  errAdjustment: boolean
  errTagType: boolean
  errName: boolean
  errAmount: boolean
  errCategory: boolean
  errBranch: boolean
  errConfidential: boolean
  isSearch: boolean = false
  isPost: boolean = false
  payrollForm: FormGroup
  headerForm: FormGroup
  adjustmentForm: FormGroup
  detailForm: FormGroup
  defaultNavActiveId = 1;
  tkList = []
  category = []
  branch = []
  confidential = []
  adjList = []
  adjHList = []
  payHList = []
  tagType = []
  branchlist = []
  company = []
  department = []
  employee = []
  nameList = []
  typeList = []
  genList = []
  postedList = []
  summary = []
  overtime = []
  addition = []
  deduction = []
  tkView = []
  payList = []
  hGross: any
  hAddition: any
  hDeduction: any
  hNetpay: any
  id: string
  selectedCode: any
  viewType: string
  pipe = new DatePipe('en-US');
  @ViewChild('generatedModal') generatedModal: ElementRef
  @ViewChild('adjustmentModal') adjustmentModal: ElementRef
  @ViewChild('viewModal') viewModal: ElementRef
  dtOptions: DataTables.Settings[] = [];
  dtTriggerPosting: Subject<any> = new Subject();
  dtTriggerPosted: Subject<any> = new Subject();
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  listenerFn: () => void;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private timekeepingManagementService: TimekeepingManagementService,
    private tenantMasterService: TenantMasterService, private employeeCategory: EmployeeCategoryManagementService,
    private branchManagement: BranchManagementService, private payrollManagementService: PayrollManagementService, private route: ActivatedRoute,
    private accountManagementService: AccountManagementService, private tenantDefaultService: TenantDefaultService, private userManagementService: UserManagementService,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.listenerFn = this.renderButton()
    this.id = this.route.snapshot.paramMap.get('id');
    this.payrollForm = this.fb.group({
      timekeepingID: null,
      payrollCode: '',
      includeTax: true,
      includeSSS: true,
      includePagibig: true,
      includePhilhealth: true,
      category: null,
      branch: null,
      confidential: null,
    })
    this.headerForm = this.fb.group({
      timekeepingID: null,
      payrollType: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      branch: '',
      confidential: '',
    })
    this.adjustmentForm = this.fb.group({
      adjustmentType: null,
      adjustment: '',
      amount: 0,
      taxable: false,
      selectedTagType: null,
      selectedEmployee: null,
    })
    this.detailForm = this.fb.group({
      company: '',
      payPeriod: '',
      employee: '',
      cutoffDate: '',
      department: '',
      paydate: '',
      position: '',
      bankAccount: '',
      payrollType: '',
      salaryRate: '',
    })
    this.resetError(false)
    this.dtOptions['postingView'] = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0, 'desc']
    };
    setTimeout(() => {
      this.dtTriggerPosting.next();
    }, 100);

    this.tenantMasterService.dropdownList("50").subscribe(data => {
      this.tagType = data.filter(x => x.type_id === 50)

      this.tenantMasterService.dropdownList("42, 26,").subscribe(data => {
        this.confidential = merge([{ "id": 0, "description": "All" }], data.filter(x => x.type_id === 42));
        this.typeList = data.filter(x => x.type_id === 26)

        if (this.id !== "") {
          this.isView = true
          this.payrollManagementService.headerView(this.id).subscribe(data => {
            this.tkList = data
            this.headerForm.setValue({
              timekeepingID: data[0].timekeeping_header_id,
              payrollType: data[0].payroll_type,
              dateFrom: this.pipe.transform(data[0].date_from, 'MM/dd/yyyy'),
              dateTo: this.pipe.transform(data[0].date_to, 'MM/dd/yyyy'),
              category: data[0].category_name,
              branch: data[0].branch,
              confidential: data[0].confidentiality,
            })
            this.payrollForm.setValue({
              timekeepingID: data[0].timekeeping_header_id,
              payrollCode: '',
              includeTax: true,
              includeSSS: true,
              includePagibig: true,
              includePhilhealth: true,
              category: data[0].category_id,
              branch: data[0].branch_id,
              confidential: data[0].confidentiality_id,
            })
            this.loadCustomDropdown(data)
            this.loadAdjustment()
            this.loadPayroll(0)
            this.loadPayrollList(0)
            this.loadPostedPayroll()
            this.isLoading = false
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })

        }
        else {
          this.id = "0"
          this.isView = false
          this.isLoading = false

          this.timekeepingManagementService.payrollTKView("0").subscribe(data => {
            this.tkList = data

          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
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

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  renderButton() {
    return this.renderer.listen('document', 'click', (event) => {
      if (event.target.classList.contains("viewPayroll")) {
        switch (this.viewType) {
          case "Generation": this.viewTempDetail(event.target.id)
            break;
          case "Generated": this.viewDetail(event.target.id)
            break;
        }

      }
      if (event.target.classList.contains("viewPostedPayroll")) {
        this.viewPostedDetail(event.target.id)
      }
      if (event.target.classList.contains("selectPayroll")) {
        this.genList[event.target.value].is_checked = event.target.checked
      }
    });
  }

  loadCustomDropdown(data) {
    if (data[0].branch_id !== 0) {
      this.branch = [{ "branch_id": data[0].branch_id, "branch_name": data[0].branch }];
    }
    else {
      this.branchManagement.branchList().subscribe(data => {
        this.branch = merge([{ "branch_id": 0, "branch_name": "All" }], data);
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }

    if (data[0].category_id !== 0) {
      this.category = [{ "category_id": data[0].category_id, "category_name": data[0].category_name }];
    }
    else {
      this.employeeCategory.categoryList(0).subscribe(data => {
        this.category = merge([{ "category_id": 0, "category_name": "All" }], data);
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }

    if (data[0].confidentiality_id !== 0) {
      this.confidential = [{ "id": data[0].confidentiality_id, "description": data[0].confidentiality }];
    }
  }
  
  reloadheader(){
    this.payrollManagementService.headerView(this.id).subscribe(data => {
      this.tkList = data
      this.headerForm.setValue({
        timekeepingID: data[0].timekeeping_header_id,
        payrollType: data[0].payroll_type,
        dateFrom: this.pipe.transform(data[0].date_from, 'MM/dd/yyyy'),
        dateTo: this.pipe.transform(data[0].date_to, 'MM/dd/yyyy'),
        category: data[0].category_name,
        branch: data[0].branch,
        confidential: data[0].confidentiality,
      })
      this.payrollForm.setValue({
        timekeepingID: data[0].timekeeping_header_id,
        payrollCode: '',
        includeTax: true,
        includeSSS: true,
        includePagibig: true,
        includePhilhealth: true,
        category: data[0].category_id,
        branch: data[0].branch_id,
        confidential: data[0].confidentiality_id,
      })
      this.loadCustomDropdown(data)
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  selectTK(e) {
    this.headerForm.setValue({
      timekeepingID: e.timekeeping_header_id,
      payrollType: e.payroll_type,
      dateFrom: this.pipe.transform(e.date_from, 'MM/dd/yyyy'),
      dateTo: this.pipe.transform(e.date_to, 'MM/dd/yyyy'),
      category: e.category,
      branch: e.branch,
      confidential: e.confidentiality,
    })
    this.payrollForm = this.fb.group({
      timekeepingID: e.timekeeping_header_id,
      payrollCode: '',
      includeTax: true,
      includeSSS: true,
      includePagibig: true,
      includePhilhealth: true,
      category: e.category_id,
      branch: e.branch_id,
      confidential: e.confidentiality_id,
    })
  }

  submitHeader() {
    let flag = true
    this.errTimekeeping = false
    if (this.headerForm.get('timekeepingID').value === "" || this.headerForm.get('timekeepingID').value === null) {
      flag = false;
      this.errTimekeeping = true
    }
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
                payroll_header_code: this.id,
                timekeeping_header_id: this.headerForm.value.timekeepingID,
                approval_level_id: sessionStorage.getItem('apl'),
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
              }
              this.payrollManagementService.headerIU(obj).subscribe(data => {
                if (data.payroll_header_id === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  this.id = data.encrypted_payroll_header_id
                  this.isView = true
                  this.reloadheader()
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

  onChange() {
    this.nameList = []
    switch (this.adjustmentForm.get("selectedTagType").value) {
      case 102:
        if (this.branchlist.length > 0) {
          this.nameList = this.branchlist
        }
        else {
          this.branchManagement.branchList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.branchlist.push({
                id: data[i].encrypted_branch_id,
                description: data[i].branch_name,
              })
            }
            this.nameList = this.branchlist
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 103:
        if (this.company.length > 0) {
          this.nameList = this.company
        }
        else {
          this.accountManagementService.companyView().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.company.push({
                id: data[i].companyID,
                description: data[i].companyName,
              })
            }
            this.nameList = this.company
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 90:
        if (this.department.length > 0) {
          this.nameList = this.department
        }
        else {
          this.tenantDefaultService.dropdownTList("38").subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.department.push({
                id: data[i].encrypted_id,
                description: data[i].description,
              })
            }
            this.nameList = this.department
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
      case 89:
        if (this.employee.length > 0) {
          this.nameList = this.employee
        }
        else {
          this.userManagementService.employeeList().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              this.employee.push({
                id: data[i].encrypt_employee_id,
                description: data[i].display_name,
              })
            }
            this.nameList = this.employee
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
        }
        break;
    }
  }

  resetError(e) {
    this.errAdjustmentType = e
    this.errAdjustment = e
    this.errTagType = e
    this.errName = e
    this.errAmount = e
    this.errCategory = e
    this.errBranch = e
    this.errConfidential = e
  }

  validation() {
    this.resetError(false)
    let flag = true
    if (this.adjustmentForm.get('adjustmentType').value === "" || this.adjustmentForm.get('adjustmentType').value === null) {
      flag = false;
      this.errAdjustmentType = true;
    }
    if (this.adjustmentForm.get('adjustment').value === "" || this.adjustmentForm.get('adjustment').value === null) {
      flag = false;
      this.errAdjustment = true;
    }
    if (this.adjustmentForm.get('selectedTagType').value === "" || this.adjustmentForm.get('selectedTagType').value === null) {
      flag = false;
      this.errTagType = true;
    }
    if (this.adjustmentForm.get('selectedEmployee').value === "" || this.adjustmentForm.get('selectedEmployee').value === null) {
      flag = false;
      this.errName = true;
    }
    if (this.adjustmentForm.get('amount').value === "" || this.adjustmentForm.get('amount').value === null) {
      flag = false;
      this.errAmount = true;
    }
    return flag
  }

  search() {
    if (this.validation()) {
      this.isSearch = true
      this.userManagementService.employeeAdjustment(
        this.id,
        this.adjustmentForm.value.adjustmentType,
        this.adjustmentForm.value.adjustment,
        this.adjustmentForm.value.amount,
        this.adjustmentForm.value.taxable,
        this.adjustmentForm.value.selectedTagType,
        this.adjustmentForm.value.selectedEmployee,
      ).subscribe(data => {
        this.adjList = data
        console.log(this.adjList)
        this.isSearch = false
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  deleteAdjustment(e) {
    this.adjList.splice(e, 1);
  }

  submitAdjustment() {
    let flag = true
    if (this.headerForm.get('timekeepingID').value === "" || this.headerForm.get('timekeepingID').value === null) {
      flag = false;
      this.errTimekeeping = true
    }
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
              var obj = this.adjList.map(item => ({
                payroll_adjustment_id: "0",
                payroll_header_id: this.id,
                employee_id: item.employee_id,
                adjustment_type_id: item.adjustment_type_id,
                adjustment_name: item.adjustment_name,
                amount: item.amount,
                taxable: item.taxable_id,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
              }))
              this.payrollManagementService.adjustmentIU(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                  this.loadAdjustment()
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

  loadAdjustment() {
    this.payrollManagementService.adjustmentView(this.id).subscribe(data => {
      this.adjHList = data
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  checkTrans(e, values: any) {
    var obj = [{
      payroll_adjustment_id: this.adjHList[e].encrypted_payroll_adjustment_id,
      payroll_header_id: this.id,
      employee_id: this.adjHList[e].employee_id,
      adjustment_type_id: this.adjHList[e].adjustment_type_id,
      adjustment_name: this.adjHList[e].adjustment_name,
      amount: this.adjHList[e].amount,
      taxable: this.adjHList[e].taxable_id,
      created_by: sessionStorage.getItem('u'),
      active: values.currentTarget.checked,
      series_code: sessionStorage.getItem('sc'),
    }]
    this.payrollManagementService.adjustmentIU(obj).subscribe(data => {

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      });
  }

  addAdjustment() {
    this.modalService.open(this.adjustmentModal, { size: 'xl' })
  }

  validateGeneration() {
    let flag = true
    this.resetError(false)
    if (this.payrollForm.get('category').value === "" || this.payrollForm.get('category').value === null) {
      flag = false;
      this.errCategory = true;
    }
    if (this.payrollForm.get('branch').value === "" || this.payrollForm.get('branch').value === null) {
      flag = false;
      this.errBranch = true;
    }
    if (this.payrollForm.get('confidential').value === "" || this.payrollForm.get('confidential').value === null) {
      flag = false;
      this.errConfidential = true;
    }
    return flag
  }

  generate() {
    if (this.validateGeneration()) {
      this.isGenerate = true
      this.payrollManagementService.payrollGeneration(
        this.id,
        this.payrollForm.value.category,
        this.payrollForm.value.branch,
        this.payrollForm.value.confidential,
        this.payrollForm.value.includeTax,
        this.payrollForm.value.includeSSS,
        this.payrollForm.value.includePagibig,
        this.payrollForm.value.includePhilhealth,
      ).subscribe(data => {
        this.isGenerate = false
        this.genList = data
        this.modalService.open(this.generatedModal, { size: 'xl' })
        this.generationModal(data, "Generation")
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  generationModal(data, viewType) {
    this.viewType = viewType
    this.dtOptions['modalView'] = {
      data: data,
      dom: 'Bfrtip',
      columns: [
        {
          "data": "pay_date"
          , "render": function (data) {
            var date = new Date(data);
            var month = date.getMonth() + 1;
            return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
          }
        },
        { "data": "payroll_code" },
        { "data": "employee_code" },
        { "data": "last_name" },
        { "data": "first_name" },
        { "data": "file_status" },
        { "data": "tax_status" },
        { "data": "daily_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' )},
        { "data": "monthly_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "basic_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "misc_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "leave_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "overtime", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "overtime_holiday", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "other_tax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "adjustments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "gross_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "witholding_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "net_salary_after_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "other_ntax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "loan_payments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "deductions", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "net_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_ec", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payroll_cost", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_witholding", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_13ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_13tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payment_type" },
        { "data": "bank_account" },
        { "data": "bank_name" },
        {
          "data": "date_employed"
          , "render": function (data) {
            var date = new Date(data);
            var month = date.getMonth() + 1;
            return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
          }
        },
        {
          "data": "date_terminated"
          , "render": function (data) {
            if (data !== "") {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
            else {
              return ""
            }
          }
        },
        { "data": "cost_center" },
        { "data": "currency" },
        { "data": "exchange_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payment_freq" },
        { "data": "mtd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_sss_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_mcr_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_pagibig_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_sss_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_mcr_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_ec_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_pagibig_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_wh_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "monthly_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "monthly_allow", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        {
          "data": "employee_id"
          , "render": function (data, type, item, meta) {
            return '<button type="button" id="' + data + '" class="btn btn-sm btn-primary btn-icon viewPayroll"><i class="feather icon-search viewPayroll" id="' + data + '" ></i></button>'
          }
        },
      ],
    }
  }

  viewTempDetail(type) {
    const selected = this.genList.filter(x => x.employee_id == type)
    this.hGross = selected[0].gross_income
    this.hAddition = selected[0].total_addition
    this.hDeduction = selected[0].total_deduction
    this.hNetpay = selected[0].net_salary
    this.detailForm.setValue({
      company: selected[0].company_name,
      payPeriod: selected[0].pay_period,
      employee: selected[0].display_name,
      cutoffDate: selected[0].cutoff_date,
      department: selected[0].department,
      paydate: selected[0].pay_date,
      position: selected[0].position,
      bankAccount: selected[0].bank_name,
      payrollType: selected[0].payroll_type,
      salaryRate: selected[0].salary_rate,
    })
    this.payrollManagementService.tempDetailView(this.id, type).subscribe(data => {
      this.summary = data.filter(x => x.detail_group_id === 1)
      this.overtime = data.filter(x => x.detail_group_id === 2)
      this.addition = data.filter(x => x.detail_group_id === 3)
      this.deduction = data.filter(x => x.detail_group_id === 4)
      this.payrollManagementService.tempTimekeepingView(this.id, type).subscribe(data => {
        this.tkView = data
        this.modalService.open(this.viewModal, { size: 'xl' })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  savePayroll() {
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
              payroll_code: this.payrollForm.value.payrollCode,
              payroll_header_id: this.id,
              category_id: this.payrollForm.value.category,
              branch_id: this.payrollForm.value.branch,
              confidential_id: this.payrollForm.value.confidential,
              include_tax: this.payrollForm.value.includeTax,
              include_sss: this.payrollForm.value.includeSSS,
              include_pagibig: this.payrollForm.value.includePagibig,
              include_philhealth: this.payrollForm.value.includePhilhealth,
              created_by: sessionStorage.getItem('u'),
              active: true,
              series_code: sessionStorage.getItem('sc'),
              approval_level_id: sessionStorage.getItem('apl'),
            }
            this.payrollManagementService.payrollI(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.loadPayroll(0)
                this.loadPayrollList(0)
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

  loadPayroll(i) {
    this.payrollManagementService.payrollView(this.id, i).subscribe(data => {
      this.payHList = data

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  loadPayrollList(i) {
    this.payrollManagementService.payrollList(this.id, i).subscribe(data => {
      this.payList = data
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  loadList() {
    this.isPost = true
    this.payrollManagementService.payrollDetailView(this.id, this.selectedCode, "0").subscribe(data => {
      this.viewType = "Generated"
      this.genList = data
      console.log(this.genList)
      console.log(data)
      this.loadPostPayroll(this.genList)

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  checkAll(values: any) {
    this.genList.map(x => x.is_checked = values.target.checked);
    this.loadPostPayroll(this.genList)
  }

  loadPostPayroll(data) {
    $('#postingTable').DataTable().clear();
    $('#postingTable').DataTable().destroy();
    this.dtOptions['postingView'] = {
      data: data,
      dom: 'Bfrtip',
      destroy: true,
      columns: [
        {
          "data": "is_posted",
          className: "text-center",
          render: function (data, type, row, meta) {            
            const isChecked = row.is_checked === true ? "checked" : ""
            if (data === false) {              
              return '<div class="custom-control custom-switch">' +
                '<input type="checkbox" ' + isChecked + ' value="' + meta.row + '" class="custom-control-input selectPayroll"' +
                'id="' + row.payslip_id + '">' +
                '<label class="custom-control-label" for="' + row.payslip_id + '"></label>' +
                '</div>';
            }
            else {
              return '<span class="badge badge-success">Posted</span>'
            }
          },
        },
        {
          "data": "pay_date"
          , "render": function (data) {
            var date = new Date(data);
            var month = date.getMonth() + 1;
            return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
          }
        },
        { "data": "payroll_code" },
        { "data": "employee_code" },
        { "data": "last_name" },
        { "data": "first_name" },
        { "data": "file_status" },
        { "data": "tax_status" },
        { "data": "daily_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "monthly_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "basic_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "misc_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "leave_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "overtime", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "overtime_holiday", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "other_tax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "adjustments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "gross_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "witholding_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "net_salary_after_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_ec", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employee_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "other_ntax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "loan_payments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "deductions", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "net_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "employer_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payroll_cost", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_witholding", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_13ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "ytd_13tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payment_type" },
        { "data": "bank_account" },
        { "data": "bank_name" },
        {
          "data": "date_employed"
          , "render": function (data) {
            var date = new Date(data);
            var month = date.getMonth() + 1;
            return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
          }
        },
        {
          "data": "date_terminated"
          , "render": function (data) {
            if (data !== "") {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
            else {
              return ""
            }
          }
        },
        { "data": "cost_center" },
        { "data": "currency" },
        { "data": "exchange_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "payment_freq" },
        { "data": "mtd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_sss_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_mcr_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_pagibig_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_sss_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_mcr_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_ec_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_pagibig_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_wh_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "monthly_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "monthly_allow", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        { "data": "mtd_ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
        {
          "data": "employee_id"
          , "render": function (data, type, item, meta) {
            return '<button type="button" id="' + data + '" class="btn btn-sm btn-primary btn-icon viewPayroll"><i class="feather icon-search viewPayroll" id="' + data + '" ></i></button>'
          }
        },
      ],
    }
    this.isPost = false
    setTimeout(() => {
      this.dtTriggerPosting.next()
      this.dtTriggerPosted.next()
    }, 100);
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });

  }

  view(i) {
    this.payrollManagementService.payrollDetailView(this.id, i, "0").subscribe(data => {
      this.genList = data
      this.generationModal(data, "Generated")
      this.modalService.open(this.generatedModal, { size: 'xl' })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewDetail(type) {
    const selected = this.genList.filter(x => x.employee_id == type)
    this.hGross = selected[0].gross_income
    this.hAddition = selected[0].total_addition
    this.hDeduction = selected[0].total_deduction
    this.hNetpay = selected[0].net_salary
    this.detailForm.setValue({
      company: selected[0].company_name,
      payPeriod: selected[0].pay_period,
      employee: selected[0].display_name,
      cutoffDate: selected[0].cutoff_date,
      department: selected[0].department,
      paydate: selected[0].pay_date,
      position: selected[0].position,
      bankAccount: selected[0].bank_name,
      payrollType: selected[0].payroll_type,
      salaryRate: selected[0].salary_rate,
    })
    this.payrollManagementService.detailView(this.id, type, selected[0].payroll_id, selected[0].payslip_id).subscribe(data => {
      this.summary = data.filter(x => x.detail_group_id === 1)
      this.overtime = data.filter(x => x.detail_group_id === 2)
      this.addition = data.filter(x => x.detail_group_id === 3)
      this.deduction = data.filter(x => x.detail_group_id === 4)
      this.payrollManagementService.timekeepingView(this.id, type, selected[0].payroll_id, selected[0].payslip_id, selected[0].timekeeping_header_id).subscribe(data => {
        this.tkView = data
        this.modalService.open(this.viewModal, { size: 'xl' })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  postPayroll() {
    let flag = true
    this.errPosting = false
    if (this.genList.filter(x => x.is_checked === true && x.is_posted === false).length <= 0) {
      flag = false;
      this.errPosting = true
    }
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
              var obj = this.genList.filter(x => x.is_checked === true && x.is_posted === false).map(item => ({
                payroll_header_id: this.id,
                payroll_id: item.payroll_id,
                payslip_id: item.payslip_id,
                employee_id: item.employee_id,
                created_by: sessionStorage.getItem('u'),
                series_code: sessionStorage.getItem('sc'),
              }))
              this.payrollManagementService.postPayroll(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  this.loadList()
                  this.loadPostedPayroll()
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

  loadPostedPayroll() {
    this.payrollManagementService.postedView(this.id, "0").subscribe(data => {
      this.postedList = data
      $('#postedTable').DataTable().clear();
      $('#postedTable').DataTable().destroy();
      this.dtOptions['postedView'] = {
        data: this.postedList,
        dom: 'Bfrtip',
        destroy: true,
        columns: [
          {
            "data": "pay_date"
            , "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          { "data": "payroll_code" },
          { "data": "employee_code" },
          { "data": "last_name" },
          { "data": "first_name" },
          { "data": "file_status" },
          { "data": "tax_status" },
          { "data": "daily_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "monthly_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "basic_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "misc_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "leave_amount", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "overtime", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "overtime_holiday", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "other_tax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "adjustments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "gross_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "witholding_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "net_salary_after_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employee_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employee_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employee_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "other_ntax_income", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "loan_payments", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "deductions", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "net_salary", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employer_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employer_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employer_ec", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "employer_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "payroll_cost", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_witholding", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_sss", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_mcr", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_pagibig", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_13ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "ytd_13tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "payment_type" },
          { "data": "bank_account" },
          { "data": "bank_name" },
          {
            "data": "date_employed"
            , "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          {
            "data": "date_terminated"
            , "render": function (data) {
              if (data !== "") {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
              }
              else {
                return ""
              }
            }
          },
          { "data": "cost_center" },
          { "data": "currency" },
          { "data": "exchange_rate", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "payment_freq" },
          { "data": "mtd_gross", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_sss_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_mcr_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_pagibig_employee", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_sss_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_mcr_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_ec_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_pagibig_employer", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_wh_tax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "monthly_basic", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "monthly_allow", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          { "data": "mtd_ntax", render: $.fn.dataTable.render.number( ',', '.', 2, '' ) },
          {
            "data": "employee_id"
            , "render": function (data, type, item, meta) {
              return '<button type="button" id="' + data + '" class="btn btn-sm btn-primary btn-icon viewPostedPayroll"><i class="feather icon-search viewPostedPayroll" id="' + data + '" ></i></button>'
            }
          },
        ],
      }
      setTimeout(() => {
        this.dtTriggerPosted.next()
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewPostedDetail(type) {
    const selected = this.postedList.filter(x => x.employee_id == type)
    this.hGross = selected[0].gross_income
    this.hAddition = selected[0].total_addition
    this.hDeduction = selected[0].total_deduction
    this.hNetpay = selected[0].net_salary
    this.detailForm.setValue({
      company: selected[0].company_name,
      payPeriod: selected[0].pay_period,
      employee: selected[0].display_name,
      cutoffDate: selected[0].cutoff_date,
      department: selected[0].department,
      paydate: selected[0].pay_date,
      position: selected[0].position,
      bankAccount: selected[0].bank_name,
      payrollType: selected[0].payroll_type,
      salaryRate: selected[0].salary_rate,
    })
    this.payrollManagementService.postedDetailView(this.id, selected[0].posted_payslip_id).subscribe(data => {
      this.summary = data.filter(x => x.detail_group_id === 1)
      this.overtime = data.filter(x => x.detail_group_id === 2)
      this.addition = data.filter(x => x.detail_group_id === 3)
      this.deduction = data.filter(x => x.detail_group_id === 4)
      this.payrollManagementService.postedTimekeepingView(this.id, selected[0].payroll_id, selected[0].employee_id, selected[0].timekeeping_header_id).subscribe(data => {
        this.tkView = data
        this.modalService.open(this.viewModal, { size: 'xl' })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }
}
