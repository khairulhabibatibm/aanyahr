import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { UserManagementService } from '../../../services/UserManagementService/userManagement.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.css']
})
export class ApprovalProcessComponent implements OnInit {
  isLoading: boolean = true;
  defaultStatus: boolean = true;
  selectedIndex: number;
  approvalForm: FormGroup;
  employeeForm: FormGroup;
  headerForm: FormGroup;
  statusList = [];
  employeeList = [];
  approvalList = [];
  moduleList = [];
  allModule = [];
  errStatus = "";
  errSelectStatus = "";
  errEmployee = "";
  sequenceList = [];
  @ViewChild('sequenceModal') sequenceModal: ElementRef
  constructor(private fb: FormBuilder, private userManagementService: UserManagementService,
    private tenantDefaultService: TenantDefaultService, private tenantMasterService: TenantMasterService,
    private modalService: NgbModal) { }
  ngOnInit() {
    this.isLoading = true
    this.headerForm = this.fb.group({
      selectedApprovalGroup: [null],
      selectedModule: null,
    });
    this.approvalForm = this.fb.group({
      status: [''],
    });
    this.employeeForm = this.fb.group({
      status: [''],
      selectedStatus: [null],
      selectedEmployee: [null],
    });
    this.userManagementService.employeeList().subscribe(data => {
      this.employeeList = data

      this.tenantDefaultService.dropdownTList("17").subscribe(data => {
        this.approvalList = data

        this.tenantMasterService.moduleList().subscribe(data => {
          this.moduleList = data
          for (var i = 0; i < data.length; i++) {
            if (data[i]['module_id'] !== 0) {
              this.allModule.push(data[i]['module_id'])
            }
          }
          this.isLoading = false
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

  selectAll() {
    let list = this.headerForm.get('selectedModule').value
    var flag = false
    for (var i = 0; i < list.length; i++) {
      if (list[i] === 0) {
        flag = true
      }
    }
    if (flag) {
      this.headerForm.controls['selectedModule'].setValue(this.allModule)
    }
  }

  validateStatus() {
    var flag = true
    this.errStatus = "";
    this.errSelectStatus = "";
    this.errEmployee = "";
    if (this.approvalForm.get('status').value === "" || this.approvalForm.get('status').value === null) {
      flag = false
      this.errStatus = "Input Status!"
    }
    for (var i = 0; i < this.statusList.length; i++) {
      if (this.approvalForm.get('status').value === this.statusList[i]['status']) {
        flag = false
        this.errStatus = "Duplicate Status!"
      }
    }
    return flag
  }

  addStatus() {
    if (this.validateStatus()) {
      this.defaultStatus = false;
      this.statusList.push({
        index: this.statusList.length,
        status: this.approvalForm.get('status').value,
        DetailRequest: []
      })
      this.approvalForm.reset()
    }
  }

  removeStatus(e) {
    this.statusList.splice(e, 1);
  }

  validateEmployee() {
    var flag = true
    this.errStatus = "";
    this.errSelectStatus = "";
    this.errEmployee = "";
    var selectedEmployee = this.employeeForm.get('selectedEmployee').value
    if (this.employeeForm.get('selectedStatus').value === "" || this.employeeForm.get('selectedStatus').value === null) {
      flag = false;
      this.errSelectStatus = "Select Status!";
    }
    else {
      if (this.employeeForm.get('selectedEmployee').value === "" || this.employeeForm.get('selectedEmployee').value === null) {
        flag = false;
        this.errEmployee = "Select Employee!";
      }
      else {
        var selectedStatus = this.statusList[this.selectedIndex].status
        this.statusList.forEach(function (arrayItem) {
          for (var i = 0; i < arrayItem.DetailRequest.length; i++) {
            if (selectedEmployee === arrayItem.DetailRequest[i]['approver_id'] &&
              selectedStatus === arrayItem.status) {
              flag = false

            }
          }
        });
        if (!flag) { this.errEmployee = "Duplicate Employee!" }
      }
    }
    return flag
  }

  addEmployee() {
    if (this.validateEmployee()) {
      let selected = this.employeeList.filter(x => x.employee_id === this.employeeForm.get('selectedEmployee').value)[0]
      this.statusList[this.selectedIndex].DetailRequest.push({
        approver_id: this.employeeForm.get('selectedEmployee').value,
        display_name: selected.display_name
      });
      this.employeeForm.reset()
    }
  }

  changeStatus(e) {
    this.selectedIndex = e;
  }

  openSequenceModal() {
    let list = this.headerForm.get('selectedModule').value
    var selected = ""
    var obj = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] !== 0) {
        selected += list[i] + ","
      }
    }
    this.tenantDefaultService.approvalSequenceList(selected, this.headerForm.get('selectedApprovalGroup').value).subscribe(data => {
      for (var i = 0; i < data.length; i++) {
        var seq = [];
        for (var x = 0; x < data[i]['statusRequest'].length; x++) {
          var approver = [];
          for (var z = 0; z < data[i]['statusRequest'][x]['detailRequest'].length; z++) {
            var id = data[i]['statusRequest'][x]['detailRequest'][z]['approver_id']
            approver.push({
              display_name: this.employeeList.filter(x => x.employee_id === id)[0]['display_name']
            })
          }
          seq.push({
            status: data[i]['statusRequest'][x]['status'],
            approver: approver
          })
        }
        obj.push({
          module_name: this.moduleList.filter(x => x.module_id === data[i]['module_id'])[0]['module_name'],
          status: seq
        })
      }
      this.sequenceList = obj
      this.modalService.open(this.sequenceModal, { size: 'lg' })
    });
  }

  validation() {
    var flag = true

    return flag;
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
              var obj = []
              var selected = this.headerForm.controls['selectedModule'].value
              for (var i = 0; i < selected.length; i++) {
                obj.push({
                  module_id: selected[i],
                  approval_level_id: this.headerForm.controls['selectedApprovalGroup'].value,
                  created_by: sessionStorage.getItem('u'),
                  series_code: sessionStorage.getItem('sc'),
                  StatusRequest: this.statusList
                })
              }
              this.tenantDefaultService.approvalIU(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Transaction successful!", "success");
                }
              },
                (error: HttpErrorResponse) => {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                });
            },
          });
        }
      })
    }
  }
}
