import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { FilingManagementService } from '../../../services/FilingManagementService/filingManagement.service';
import { PermissionManagementService } from '../../../services/PermissionManagementService/permissionManagement.service';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {
  isLoading: boolean = true
  approvalForm: FormGroup
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
  moduleId: number
  dateFrom: any
  dateTo: any
  moduleList = []
  headerList = []
  columns = []
  returnOutput = []
  selectedOutput = []
  tableOutput = []
  isShow: boolean = false
  pipe = new DatePipe('en-US');
  _object = Object;
  fileType: number = 1
  isChangeLog: boolean = false
  isChangeSchedule: boolean = false
  isLeave: boolean = false
  isOfficialBusiness: boolean = false
  isOvertime: boolean = false
  isOffset: boolean = false
  isChecked = false
  parentDetail = []
  @ViewChild('filingModal') filingModal: ElementRef
  showTable: boolean = false
  approvalType: number
  series: string = ""
  remarks: string = ""
  @ViewChild('disapprovedModal') viewModal: ElementRef
  constructor(private fb: FormBuilder, private permissionManagementService: PermissionManagementService,
    private tenantDefaultService: TenantDefaultService, private modalService: NgbModal,
    private filingManagementService: FilingManagementService) { }

  ngOnInit() {
    this.dateFrom = this.startDate
    this.dateTo = this.endDate
    this.moduleId = 0
    const start = this.pipe.transform(sessionStorage.getItem('s'), 'MM/dd/yyyy');
    const end = this.pipe.transform(sessionStorage.getItem('e'), 'MM/dd/yyyy');
    this.permissionManagementService.approvalModuleView(start, end).subscribe(data => {
      this.moduleList = data
      this.isLoading = false
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  selectedModule(e) {
    this.tenantDefaultService.approvalHeaderView(e).subscribe(data => {
      this.moduleId = e
      this.tableOutput = data
      this.headerList = data.filter(x => x.is_view === true)
      const start = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
      const end = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
      this.search(e, start, end)
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  searchDate(e, type) {
    if(type === "start"){
      this.startDate = e
    }
    else if(type === "end"){
      this.endDate = e
    }
    const start = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
    const end = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
    if(type === ""){
      if (this.moduleId !== 0) {
        this.search(this.moduleId, start, end)
      }
    }
    else{
      this.permissionManagementService.approvalModuleView(start, end).subscribe(data => {
        this.moduleList = data
        if (this.moduleId !== 0) {
          this.search(this.moduleId, start, end)
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  
  }

  search(e, start, end) {
    let s = ""
    if (this.series === "" || this.series === null) {
      s = "";
    }
    else{
      s = this.series
    }

    this.tenantDefaultService.approvalDetailView(s, e, start, end).subscribe(data => {
      let temp = JSON.parse(data.toString())
      this.selectedOutput = JSON.parse(data.toString())
      for (var i = 0; i < this.tableOutput.length; i++) {
        let col = this.tableOutput[i].columns
        let isView = this.tableOutput[i].is_view
        if (!isView) {
          temp.forEach(function (x) { delete x[col] });
        }
      }
      this.showTable = true
      this.returnOutput = temp
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  view(e) {
    this.resetHidden(false)
    this.parentDetail['dashboardId'] = this.selectedOutput[e].transaction_id
    this.parentDetail['dashboardDate'] = ""
    this.parentDetail['parentType'] = "1"
    this.parentDetail['view'] = true
    this.modalService.open(this.filingModal, { size: 'xl' })
    switch (this.moduleId) {
      case 33: {
        this.isChangeLog = true
        this.approvalType = 0
        break;
      }
      case 32: {
        this.isChangeSchedule = true
        this.approvalType = 0
        break;
      }
      case 34: {
        this.isLeave = true
        this.approvalType = 0
        break;
      }
      case 35: {
        this.isOfficialBusiness = true
        this.approvalType = 0
        break;
      }
      case 36: {
        this.isOvertime = true
        this.approvalType = 0
        break;
      }
      case 37: {
        this.isOffset = true
        this.approvalType = 0
        break;
      }
    }
  }

  resetHidden(e) {
    this.isChangeLog = e
    this.isChangeSchedule = e
    this.isLeave = e
    this.isOfficialBusiness = e
    this.isOvertime = e
    this.isOffset = e
  }

  checkTrans(e, values: any) {
    this.selectedOutput[e].is_check = values.currentTarget.checked
  }

  checkAll(values: any) {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.selectedOutput.map(x => x.is_check = false);
    }
    else {
      this.isChecked = true;
      this.selectedOutput.map(x => x.is_check = true);
    }
  }

  submit(e) {
    let flag = false
    let checked = this.selectedOutput.filter(x => x.is_check === true)
    for (var i = 0; i < checked.length; i++) {
      flag = true
    }
    if(flag){
      if(e === 1){
        Swal.fire({
          title: 'Are you sure you want to approve?',
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
                let trans = ""
                let selected = this.selectedOutput.filter(x => x.is_check === true)
                for (var i = 0; i < selected.length; i++) {
                  trans += selected[i].transaction_id + ","
                }
                var obj = {
                  module_id: this.moduleId,
                  transaction_id: trans,
                  action: 1,
                  remarks: "",
                  approved_by: sessionStorage.getItem('u'),
                  series_code: sessionStorage.getItem('sc')
                }
                console.log(JSON.stringify(obj))
                switch (this.approvalType) {
                  default:
                    this.filingManagementService.approvalIU(obj).subscribe(data => {
                      if (data.module_id === 0) {
                        Swal.fire("Failed!", "Transaction failed!", "error");
                      }
                      else {
                        Swal.fire("Ok!", "Transaction has been approved", "success");
                        const start = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
                        const end = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
                        this.search(this.moduleId, start, end)
                        this.reloadCount()
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
      else{
        this.modalService.open(this.viewModal, { size: 'sm' })
      }
    }
   
  }

  disapprovedTransaction(){
    Swal.fire({
      title: 'Are you sure you want to disapprove?',
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
            let trans = ""
            let selected = this.selectedOutput.filter(x => x.is_check === true)
            for (var i = 0; i < selected.length; i++) {
              trans += selected[i].transaction_id + ","
            }
            var obj = {
              module_id: this.moduleId,
              transaction_id: trans,
              action: 0,
              remarks: this.remarks,
              approved_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc')
            }
            switch (this.approvalType) {
              default:
                this.filingManagementService.approvalIU(obj).subscribe(data => {
                  if (data.module_id === 0) {
                    Swal.fire("Failed!", "Transaction failed!", "error");
                  }
                  else {
                    Swal.fire("Ok!", "Transaction has been disapproved", "success");
                    const start = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
                    const end = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
                    this.search(this.moduleId, start, end)
                    this.reloadCount()
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

  reloadCount() {
    const start = this.pipe.transform(this.startDate.year + "/" + this.startDate.month + "/" + this.startDate.day + "", 'MM/dd/yyyy')
    const end = this.pipe.transform(this.endDate.year + "/" + this.endDate.month + "/" + this.endDate.day + "", 'MM/dd/yyyy')
    this.permissionManagementService.approvalModuleView(start, end).subscribe(data => {
      this.moduleList = data
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }
}
