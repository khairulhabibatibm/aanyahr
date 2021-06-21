import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { merge } from 'jquery';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { FilingManagementService } from '../../../services/FilingManagementService/filingManagement.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-overtime-render',
  templateUrl: './overtime-render.component.html',
  styleUrls: ['./overtime-render.component.css']
})
export class OvertimeRenderComponent implements OnInit {
  isLoading: boolean = true
  isSearch: boolean = false
  errEmployee: boolean = false
  isChecked = false
  employeeList = []
  renderList = []
  @ViewChild(DataTableDirective, { static: false })
  //@ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  renderForm: FormGroup
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
  pipe = new DatePipe('en-US')
  constructor(private filingManagementService: FilingManagementService, private userManagementService: UserManagementService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      processing: true,
    };
    this.renderForm = this.fb.group({
      dateFrom: this.startDate,
      dateTo: this.endDate,
      selectedEmployee: null,
    })
    this.userManagementService.employeeList().subscribe(data => {
      this.employeeList = merge([{ "encrypt_employee_id": 0, "display_name": "All" }], data)
      this.isLoading = false
      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  validation() {
    let flag = true;
    this.errEmployee = false;
    if (this.renderForm.get('selectedEmployee').value === "" || this.renderForm.get('selectedEmployee').value === null) {
      flag = false
      this.errEmployee = true;
    }
    return flag;
  }

  search() {
    if (this.validation()) {
      this.isSearch = true
      const dateFrom = this.pipe.transform(this.renderForm.get("dateFrom").value.year + "/" + this.renderForm.get("dateFrom").value.month + "/" + this.renderForm.get("dateFrom").value.day + "", 'MM/dd/yyyy')
      const dateTo = this.pipe.transform(this.renderForm.get("dateTo").value.year + "/" + this.renderForm.get("dateTo").value.month + "/" + this.renderForm.get("dateTo").value.day + "", 'MM/dd/yyyy')
      const selectedEmployee = this.renderForm.get("selectedEmployee").value
      this.filingManagementService.renderView(selectedEmployee, dateFrom, dateTo,).subscribe(data => {
        this.renderList = data
        console.log(data)
        this.rerender()
        this.isSearch = false

      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.isSearch = false
        })
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear().draw();
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  checkAll(values: any) {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.renderList.map(x => x.is_edit = false);
    }
    else {
      this.isChecked = true;
      this.renderList.map(x => x.is_edit = true);
    }
  }

  checkTrans(e, values: any) {
    this.renderList[e].is_edit = values.currentTarget.checked
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
            var obj = this.renderList.filter(x => x.is_edit === true).map(item => ({
              overtime_id: item.overtime_id,
              final_in: item.final_in,
              final_out: item.final_out,
              created_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }))
            this.filingManagementService.renderI(obj).subscribe(data => {
              console.log(data)
              if (data.id === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Transaction successful!", "success");
                this.search()
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
