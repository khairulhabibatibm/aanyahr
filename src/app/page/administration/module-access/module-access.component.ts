import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PermissionManagementService } from '../../../services/PermissionManagementService/permissionManagement.service';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.css']
})
export class ModuleAccessComponent implements OnInit {
  moduleAccessForm: FormGroup
  isLoading: boolean = true
  selectedModule: number;
  moduleType = [];
  accessType = [];
  table = [];
  constructor(private tenantMasterService: TenantMasterService, private tenantDefaultService: TenantDefaultService, private permissionManagementService: PermissionManagementService, private fb: FormBuilder) { }

  ngOnInit() {
    this.moduleAccessForm = this.fb.group({
      selectedModule: [null],
      selectedAccess: [null],
    });

    this.tenantMasterService.dropdownList("13").subscribe(data => {
      this.moduleType = data

      this.tenantDefaultService.dropdownTList("14").subscribe(data => {
        this.accessType = data
        this.isLoading = false;
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  onChange() {
    let ret = true
    if (this.moduleAccessForm.get('selectedModule').value === "" || this.moduleAccessForm.get('selectedModule').value === null) {
      ret = false;
    }
    if (this.moduleAccessForm.get('selectedAccess').value === "" || this.moduleAccessForm.get('selectedAccess').value === null) {
      ret = false;
    }
    if (ret === true) {
      switch (this.moduleAccessForm.get('selectedModule').value) {
        case 33:
          this.permissionManagementService.dataUploadList(this.moduleAccessForm.get('selectedAccess').value).subscribe(data => {
            this.showTable(data)
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
        case 31:
          this.permissionManagementService.moduleList(this.moduleAccessForm.get('selectedAccess').value).subscribe(data => {
            this.showTable(data)
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
        case 32:
          this.permissionManagementService.reportList(this.moduleAccessForm.get('selectedAccess').value).subscribe(data => {
            this.showTable(data)
          },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            })
          break;
      }
    }
  }

  showTable(access) {
    switch (this.moduleAccessForm.get('selectedModule').value) {
      case 33:
        this.table = access.map(item => ({
          data_upload_id: item.data_upload_id,
          description: item.data_upload_name,
          active: item.active,
          access_level_id: item.int_access_level_id,
          series_code: sessionStorage.getItem('sc'),
          created_by: sessionStorage.getItem('u'),
          param_id: item.data_upload_id,
        }))
        break;
      case 31:
        this.table = access.map(item => ({
          module_id: item.module_id,
          description: item.module_name,
          active: item.active,
          access_level_id: item.int_access_level_id,
          series_code: sessionStorage.getItem('sc'),
          created_by: sessionStorage.getItem('u'),
          param_id: item.module_id,
        }))
        break;
      case 32:
        console.log(access)
        this.table = access.map(item => ({
          report_id: item.report_id,
          description: item.report_name,
          active: item.active,
          access_level_id: item.int_access_level_id,
          series_code: sessionStorage.getItem('sc'),
          created_by: sessionStorage.getItem('u'),
          param_id: item.report_id,
        }))
        break;
    }
  }

  checkChange(e) {
    switch (this.moduleAccessForm.get('selectedModule').value) {
      case 33:
        this.table[this.table.findIndex((x => x.data_upload_id == e.target.value))].active = e.target.checked
        break;
      case 31:
        this.table[this.table.findIndex((x => x.module_id == e.target.value))].active = e.target.checked
        break;
      case 32:
        this.table[this.table.findIndex((x => x.report_id == e.target.value))].active = e.target.checked
        break;
    }
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
            switch (this.moduleAccessForm.get('selectedModule').value) {
              case 33:
                this.permissionManagementService.dataUploadIn(this.table.filter(x => x.active === true)).subscribe(data => {
                  if (data.data_upload_id === 0) {
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
              case 31:
                this.permissionManagementService.moduleIn(this.table.filter(x => x.active === true)).subscribe(data => {
                  if (data.module_id === 0) {
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
              case 32:
                this.permissionManagementService.reportIn(this.table.filter(x => x.active === true)).subscribe(data => {
                  if (data.report_id === 0) {
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
