import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { UserManagementService } from '../../../../services/UserManagementService/userManagement.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TenantDefaultService } from '../../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../../services/TenantMasterService/tenantMaster.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  image = environment.exportUrl
  index: number = 1;
  row: number = 12;
  isLoading: boolean = true;
  isTable: boolean = true;
  @ViewChild('div') div: ElementRef;
  employeeList = [];
  employeeFetch = [];
  employeeFetchOld = [];
  occupation = [];
  employeestatus = [];
  pipe = new DatePipe('en-US');
  searchText: any

  constructor(private router: Router, private renderer: Renderer2, private userManagement: UserManagementService,
    private tenantDefault: TenantDefaultService, private tenantMasterService: TenantMasterService) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.tenantDefault.dropdownTList("37").subscribe(data => {
      this.occupation = data

      this.tenantMasterService.dropdownList("36").subscribe(data => {
        this.employeestatus = data

        this.userManagement.employeeFetch("0", this.row, this.index).subscribe(data => {
          this.employeeFetch = data.map(item => ({
            employee_code: item.employee_code,
            display_name: item.display_name,
            occupation: item.occupation,
            employeestatus: item.employee_status,
            image_path: item.image_path,
            employee_id: item.encrypt_employee_id,
          }))

          this.employeeFetchOld = this.employeeFetch
          this.isLoading = false;

          this.userManagement.employeeView("0").subscribe(list => {
            this.employeeList = list.map(item => ({
              employee_code: item.employee_code,
              display_name: item.display_name,
              occupation: item.occupation,
              employeestatus: item.employee_status,
              image_path: item.image_path,
              occupation_id: item.occupation_id,
              employee_status_id: item.employee_status_id,
              created_by: item.created_by_name,
              date_created: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
              date_hired: this.pipe.transform(item.date_hired, 'MM/dd/yyyy'),
              employee_id: item.encrypt_employee_id,
            }))
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

  scroll = (event): void => {
    if (this.searchText === "" || this.searchText === undefined) {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        this.index++
        this.userManagement.employeeFetch("0", this.row, this.index).subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            this.employeeFetch.push({
              display_name: data[i].display_name,
              occupation: data[i].occupation_id === 0 ? "" : this.occupation.filter(x => x.id == data[i].occupation_id)[0].description,
              employeestatus: data[i].employee_status_id === 0 ? "" : this.employeestatus.filter(x => x.id == data[i].employee_status_id)[0].description,
              image_path: data[i].image_path,
              employee_id: data[i].encrypt_employee_id,
            })
          }
          this.employeeFetchOld = this.employeeFetch
        },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          })
      }
    }
  };

  search(e) {
    const filter = this.employeeList.filter(x => x.display_name.toString().toLowerCase().includes(e.target.value.toLowerCase())
      || x.occupation.toString().toLowerCase().includes(e.target.value.toLowerCase() || x.employee_status.toString().toLowerCase().includes(e.target.value.toLowerCase())))

    this.employeeFetch = [];
    if (e.target.value !== "" && e.target.value !== null) {
      for (var i = 0; i < filter.length; i++) {
        this.employeeFetch.push({
          display_name: filter[i].display_name,
          occupation: filter[i].occupation_id === 0 ? "" : this.occupation.filter(x => x.id == filter[i].occupation_id)[0].description,
          employeestatus: filter[i].employee_status_id === 0 ? "" : this.employeestatus.filter(x => x.id == filter[i].employee_status_id)[0].description,
          image_path: filter[i].image_path,
          employee_id: filter[i].employee_id,
        })
      }
    }
    else {
      this.employeeFetch = this.employeeFetchOld
    }

  }

  changeView() {
    this.isTable === true ? this.isTable = false : this.isTable = true;
  }

  viewEmployee(e) {
    this.router.navigate(["/layout/employee/employee-details", e]);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

}
