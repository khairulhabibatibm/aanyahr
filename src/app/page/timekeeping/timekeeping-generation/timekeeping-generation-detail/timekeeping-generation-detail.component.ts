import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { EmployeeCategoryManagementService } from '../../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { TimekeepingManagementService } from '../../../../services/TimekeepingManagementService/timekeepingManagement.service';

@Component({
  selector: 'app-timekeeping-generation-detail',
  templateUrl: './timekeeping-generation-detail.component.html',
  styleUrls: ['./timekeeping-generation-detail.component.css']
})
export class TimekeepingGenerationDetailComponent implements OnInit {
  isLoading: boolean = true
  isGenerate: boolean = false
  isDate: boolean = true
  isView: boolean = false
  isCutoff: boolean = true
  timekeepingForm: FormGroup
  complete: boolean = true
  errPayrollType: boolean
  errCutoff: boolean
  errMonth: boolean
  errdateFrom: boolean
  errdateTo: boolean
  errCategory: boolean
  errBranch: boolean
  errConfidential: boolean
  id: string
  payrolltype = []
  confidential = []
  branch = []
  category = []
  cutoffList = []
  monthList = []
  generatedTimekeeping = []
  finalTimekeeping = []
  dateToday = {
    day: new Date(new Date()).getDate(),
    month: new Date(new Date()).getMonth() + 1,
    year: new Date(new Date()).getFullYear()
  }
  pipe = new DatePipe('en-US');
  dtOptions: DataTables.Settings[] = [];
  //dtHeaderOptions: DataTables.Settings = {};
  dtTriggerFinal: Subject<any> = new Subject();
  dtTriggerTkList: Subject<any> = new Subject();
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  @ViewChild('generatedModal') generatedModal: ElementRef

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private modalService: NgbModal,
    private tenantMasterService: TenantMasterService, private employeeCategory: EmployeeCategoryManagementService,
    private branchManagement: BranchManagementService, private timekeepingManagementService: TimekeepingManagementService,
    private renderer: Renderer2,) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.timekeepingForm = this.fb.group({
      timekeepingCode: '',
      selectedPayrollType: null,
      selectedCutoff: null,
      selectedMonth: null,
      dateFrom: { value: this.dateToday, disabled: this.isDate },
      dateTo: { value: this.dateToday, disabled: this.isDate },
      selectedCategory: 0,
      selectedBranch: 0,
      selectedConfidential: 0,
    })
    this.resetError(false)

    this.tenantMasterService.dropdownList("41, 42, 53, 54,").subscribe(data => {
      this.payrolltype = data.filter(x => x.type_id === 41)
      this.cutoffList = data.filter(x => x.type_id === 53)
      this.monthList = data.filter(x => x.type_id === 54)
      this.confidential = merge([{ "id": 0, "description": "All" }], data.filter(x => x.type_id === 42));

      this.employeeCategory.categoryList(0).subscribe(data => {
        this.category = merge([{ "category_id": 0, "category_name": "All" }], data);

        this.branchManagement.branchList().subscribe(data => {
          this.branch = merge([{ "branch_id": 0, "branch_name": "All" }], data);

          if (this.id !== "") {
            this.timekeepingManagementService.timekeepingView(this.id).subscribe(data => {
              this.timekeepingForm.setValue({
                timekeepingCode: data[0].timekeeping_header_code,
                selectedPayrollType: data[0].payroll_type_id,
                selectedCutoff: data[0].cutoff_id,
                selectedMonth: data[0].month_id,
                selectedCategory: data[0].category_id,
                selectedBranch: data[0].branch_id,
                selectedConfidential: data[0].confidentiality_id,
                dateFrom: {
                  year: new Date(data[0].date_from).getFullYear(),
                  month: new Date(data[0].date_from).getMonth() + 1,
                  day: new Date(data[0].date_from).getDate(),
                },
                dateTo: {
                  year: new Date(data[0].date_to).getFullYear(),
                  month: new Date(data[0].date_to).getMonth() + 1,
                  day: new Date(data[0].date_to).getDate(),
                },
              });
              this.isView = true
              this.isLoading = false
              this.reloadTimekeeping()

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

    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  ngAfterViewInit(): void {
    this.renderButton()
  }

  renderButton() {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.classList.contains("viewTimekeeping")) {
        this.viewTimekeeping(event.target.id)
      }
    });
  }

  changePayrollType() {
    // this.timekeepingForm.get('dateFrom').enable();
    var flag = true
    let cutoff_id = 0
    switch (this.timekeepingForm.get("selectedPayrollType").value) {
      case 68: {
        this.isCutoff = false
        cutoff_id = 0;
        if (this.timekeepingForm.get('selectedPayrollType').value === "" || this.timekeepingForm.get('selectedPayrollType').value === null) {
          flag = false;
        }
        if (this.timekeepingForm.get('selectedMonth').value === "" || this.timekeepingForm.get('selectedMonth').value === null) {
          flag = false;
        }
      } break;
      case 67: {
        this.isCutoff = true
        cutoff_id = this.timekeepingForm.get("selectedCutoff").value
        if (this.timekeepingForm.get('selectedPayrollType').value === "" || this.timekeepingForm.get('selectedPayrollType').value === null) {
          flag = false;
        }
        if (this.timekeepingForm.get('selectedCutoff').value === "" || this.timekeepingForm.get('selectedCutoff').value === null) {
          flag = false;
        }
        if (this.timekeepingForm.get('selectedMonth').value === "" || this.timekeepingForm.get('selectedMonth').value === null) {
          flag = false;
        }
      } break;
    }

    if (flag) {
      const month_id = this.timekeepingForm.get("selectedMonth").value
      this.timekeepingManagementService.cutoffView(cutoff_id, month_id).subscribe(data => {
        this.timekeepingForm.get('dateFrom').setValue({
          year: new Date(data[0].date_from).getFullYear(),
          month: new Date(data[0].date_from).getMonth() + 1,
          day: new Date(data[0].date_from).getDate(),
        })
        this.timekeepingForm.get('dateTo').setValue({
          year: new Date(data[0].date_to).getFullYear(),
          month: new Date(data[0].date_to).getMonth() + 1,
          day: new Date(data[0].date_to).getDate(),
        })
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }


  }

  validationHeader() {
    this.resetError(false)
    var flag = true
    if (this.timekeepingForm.get('selectedPayrollType').value === "" || this.timekeepingForm.get('selectedPayrollType').value === null) {
      flag = false;
      this.errPayrollType = true;
    }
    if (this.timekeepingForm.get('selectedCutoff').value === "" || this.timekeepingForm.get('selectedCutoff').value === null) {
      flag = false;
      this.errCutoff = true;
    }
    if (this.timekeepingForm.get('selectedMonth').value === "" || this.timekeepingForm.get('selectedMonth').value === null) {
      flag = false;
      this.errMonth = true;
    }
    if (this.timekeepingForm.get('dateFrom').value === "" || this.timekeepingForm.get('dateFrom').value === null) {
      flag = false;
      this.errdateFrom = true;
    }
    if (this.timekeepingForm.get('dateTo').value === "" || this.timekeepingForm.get('dateTo').value === null) {
      flag = false;
      this.errdateTo = true;
    }
    if (this.timekeepingForm.get('selectedCategory').value === "" || this.timekeepingForm.get('selectedCategory').value === null) {
      flag = false;
      this.errCategory = true;
    }
    if (this.timekeepingForm.get('selectedBranch').value === "" || this.timekeepingForm.get('selectedBranch').value === null) {
      flag = false;
      this.errBranch = true;
    }
    if (this.timekeepingForm.get('selectedConfidential').value === "" || this.timekeepingForm.get('selectedConfidential').value === null) {
      flag = false;
      this.errConfidential = true;
    }
    return flag
  }

  reloadTimekeeping() {
    this.timekeepingManagementService.generatedView(this.id, "0").subscribe(data => {
      this.generatedTimekeeping = data
      this.dtOptions['tkList'] = {
        data: this.generatedTimekeeping,
        columns: [
          { "data": "timekeeping_code" },
          {
            "data": "date_from", "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          {
            "data": "date_to", "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          { "data": "display_name" },
          {
            "data": "date_created", "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          {
            "data": "encrypt_timekeeping_id"
            , "render": function (data, type, item, meta) {
              return '<button type="button" id="' + data + '" class="btn btn-sm btn-primary btn-icon viewTimekeeping"><i class="feather icon-search viewTimekeeping" id="' + data + '" ></i></button>'
            }
          },
        ],
        order: [0, 'desc']
      }

      setTimeout(() => {
        this.dtTriggerTkList.next();
      }, 100);
      this.timekeepingManagementService.finalView(this.id, "0", "", "").subscribe(data => {
        this.finalTimekeeping = data
        this.dtOptions['tkFinal'] = {
          data: this.finalTimekeeping,
          dom: 'Bfrtip',
          buttons: [
            'copy', 'csv', 'excel', 'print'
          ],
          columns: [
            { "data": "employee_code" },
            { "data": "display_name" },
            {
              "data": "date"
              , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
              }
            },
            { "data": "rest_day" },
            { "data": "schedule_time_in" },
            { "data": "schedule_time_out" },
            { "data": "actual_time_in" },
            { "data": "actual_time_out" },
            { "data": "reg" },
            { "data": "late" },
            { "data": "undertime" },
            { "data": "is_absent" },
            { "data": "lwop_hour" },
            { "data": "vl_hour" },
            { "data": "sl_hour" },
            { "data": "otherl_hour" },
            { "data": "regnd" },
            { "data": "ot" },
            { "data": "otnd" },
            { "data": "lhot" },
            { "data": "lhotnd" },
            { "data": "lhot_e8" },
            { "data": "lhotnd_e8" },
            { "data": "lhrdot" },
            { "data": "lhrdotnd" },
            { "data": "lhrdot_e8" },
            { "data": "lhrdotnd_e8" },
            { "data": "shot" },
            { "data": "shotnd" },
            { "data": "shot_e8" },
            { "data": "shotnd_e8" },
            { "data": "shrdot" },
            { "data": "shrdotnd" },
            { "data": "shrdot_e8" },
            { "data": "shrdotnd_e8" },
            { "data": "otrd" },
            { "data": "otrdnd" },
            { "data": "otrd_e8" },
            { "data": "otrdnd_e8" },
            { "data": "dhot" },
            { "data": "dhotnd" },
            { "data": "dhot_e8" },
            { "data": "dhotnd_e8" },
            { "data": "dhrdot" },
            { "data": "dhrdotnd" },
            { "data": "dhrdot_e8" },
            { "data": "dhrdotnd_e8" },
            { "data": "remarks" },
          ],
          order: [[0, 'desc'], [2, 'asc']]
        }
        setTimeout(() => {
          this.dtTriggerFinal.next();
        }, 100);
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  submitHeader() {
    if (this.validationHeader()) {
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
                timekeeping_header_id: this.id,
                timekeeping_header_code: this.timekeepingForm.get("timekeepingCode").value,
                date_from: this.pipe.transform(this.timekeepingForm.get("dateFrom").value.year + "/" + this.timekeepingForm.get("dateFrom").value.month + "/" + this.timekeepingForm.get("dateFrom").value.day + "", 'MM/dd/yyyy'),
                date_to: this.pipe.transform(this.timekeepingForm.get("dateTo").value.year + "/" + this.timekeepingForm.get("dateTo").value.month + "/" + this.timekeepingForm.get("dateTo").value.day + "", 'MM/dd/yyyy'),
                payroll_type_id: this.timekeepingForm.get("selectedPayrollType").value,
                cutoff_id: this.timekeepingForm.get("selectedPayrollType").value === 68 ? 0 : this.timekeepingForm.get("selectedCutoff").value,
                month_id: this.timekeepingForm.get("selectedMonth").value,
                category_id: this.timekeepingForm.get("selectedCategory").value,
                branch_id: this.timekeepingForm.get("selectedBranch").value,
                confidentiality_id: this.timekeepingForm.get("selectedConfidential").value,
                active: true,
                approval_level_id: sessionStorage.getItem('apl'),
                series_code: sessionStorage.getItem('sc'),
                created_by: sessionStorage.getItem('u'),
              }
              this.timekeepingManagementService.timekeepingIU(obj).subscribe(data => {
                if (data.id === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                  this.id = data.encrypted_id
                  this.isView = true
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

  generate() {
    this.isGenerate = true
    this.generatedTimekeeping = []
    this.timekeepingManagementService.generationView(this.id).subscribe(data => {
      this.generatedTimekeeping = data
      this.isGenerate = false;
      this.modalService.open(this.generatedModal, { size: 'xl' })
      this.dtOptions['generated'] = {
        data: this.generatedTimekeeping,
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'print'
        ],
        columns: [
          { "data": "employee_code" },
          { "data": "display_name" },
          {
            "data": "date"
            , "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          { "data": "rest_day" },
          { "data": "schedule_time_in" },
          { "data": "schedule_time_out" },
          { "data": "actual_time_in" },
          { "data": "actual_time_out" },
          { "data": "reg" },
          { "data": "late" },
          { "data": "undertime" },
          { "data": "is_absent" },
          { "data": "lwop_hour" },
          { "data": "vl_hour" },
          { "data": "sl_hour" },
          { "data": "otherl_hour" },
          { "data": "regnd" },
          { "data": "ot" },
          { "data": "otnd" },
          { "data": "lhot" },
          { "data": "lhotnd" },
          { "data": "lhot_e8" },
          { "data": "lhotnd_e8" },
          { "data": "lhrdot" },
          { "data": "lhrdotnd" },
          { "data": "lhrdot_e8" },
          { "data": "lhrdotnd_e8" },
          { "data": "shot" },
          { "data": "shotnd" },
          { "data": "shot_e8" },
          { "data": "shotnd_e8" },
          { "data": "shrdot" },
          { "data": "shrdotnd" },
          { "data": "shrdot_e8" },
          { "data": "shrdotnd_e8" },
          { "data": "otrd" },
          { "data": "otrdnd" },
          { "data": "otrd_e8" },
          { "data": "otrdnd_e8" },
          { "data": "dhot" },
          { "data": "dhotnd" },
          { "data": "dhot_e8" },
          { "data": "dhotnd_e8" },
          { "data": "dhrdot" },
          { "data": "dhrdotnd" },
          { "data": "dhrdot_e8" },
          { "data": "dhrdotnd_e8" },
          { "data": "remarks" },
        ],
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  saveTimekeeping() {
    var flag = true
    if (this.generatedTimekeeping.length <= 0) {
      flag = false
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
                timekeeping_header_id: this.id,
                timekeeping_header_code: this.timekeepingForm.get("timekeepingCode").value,
                active: true,
                series_code: sessionStorage.getItem('sc'),
                created_by: sessionStorage.getItem('u'),
              }

              this.timekeepingManagementService.generationIU(obj).subscribe(data => {
                if (data.id === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                  this.timekeepingManagementService.generatedView(this.id, "0").subscribe(data => {

                    this.dtElements.forEach((dtElement: DataTableDirective) => {
                      if (dtElement.dtInstance)
                        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                          dtInstance.destroy();

                        });
                    });
                    this.reloadTimekeeping()
                    this.modalService.dismissAll()
                  },
                    (error: HttpErrorResponse) => {
                      console.log(error.error);
                    })
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

  viewTimekeeping(e) {
    this.timekeepingManagementService.generatedDetailView(this.id, e).subscribe(data => {
      this.generatedTimekeeping = data
      this.modalService.open(this.generatedModal, { size: 'xl' })
      this.dtOptions['generated'] = {
        data: this.generatedTimekeeping,
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'print'
        ],
        columns: [
          { "data": "employee_code" },
          { "data": "display_name" },
          {
            "data": "date"
            , "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          { "data": "rest_day" },
          { "data": "schedule_time_in" },
          { "data": "schedule_time_out" },
          { "data": "actual_time_in" },
          { "data": "actual_time_out" },
          { "data": "reg" },
          { "data": "late" },
          { "data": "undertime" },
          { "data": "is_absent" },
          { "data": "lwop_hour" },
          { "data": "vl_hour" },
          { "data": "sl_hour" },
          { "data": "otherl_hour" },
          { "data": "regnd" },
          { "data": "ot" },
          { "data": "otnd" },
          { "data": "lhot" },
          { "data": "lhotnd" },
          { "data": "lhot_e8" },
          { "data": "lhotnd_e8" },
          { "data": "lhrdot" },
          { "data": "lhrdotnd" },
          { "data": "lhrdot_e8" },
          { "data": "lhrdotnd_e8" },
          { "data": "shot" },
          { "data": "shotnd" },
          { "data": "shot_e8" },
          { "data": "shotnd_e8" },
          { "data": "shrdot" },
          { "data": "shrdotnd" },
          { "data": "shrdot_e8" },
          { "data": "shrdotnd_e8" },
          { "data": "otrd" },
          { "data": "otrdnd" },
          { "data": "otrd_e8" },
          { "data": "otrdnd_e8" },
          { "data": "dhot" },
          { "data": "dhotnd" },
          { "data": "dhot_e8" },
          { "data": "dhotnd_e8" },
          { "data": "dhrdot" },
          { "data": "dhrdotnd" },
          { "data": "dhrdot_e8" },
          { "data": "dhrdotnd_e8" },
          { "data": "remarks" },
        ],

      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })

  }

  resetError(e) {
    this.errPayrollType = e
    this.errCutoff = e
    this.errMonth = e
    this.errdateFrom = e
    this.errdateTo = e
    this.errCategory = e
    this.errBranch = e
    this.errConfidential = e
  }
}
