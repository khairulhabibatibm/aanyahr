import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EmployeeCategoryManagementService } from '../../../../../services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import { UserManagementService } from '../../../../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-employee-category-list',
  templateUrl: './employee-category-list.component.html',
  styleUrls: ['./employee-category-list.component.css']
})
export class EmployeeCategoryListComponent implements OnInit {

  isLoading: boolean = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  table = [];
  pipe = new DatePipe('en-US');

  constructor(private userManagementService: UserManagementService, private employeeCategoryService: EmployeeCategoryManagementService,
    private router: Router) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };

    this.employeeCategoryService.categoryView(0).subscribe(data => {
      this.table = data.map(item => ({
        active: item.active,
        created_by: item.created_by,
        created_desc: item.created_by_name,
        date_created: this.pipe.transform(item.date_created, 'MM/dd/yyyy'),
        category_code: item.category_code,
        category_description: item.category_description,
        category_name: item.category_name,
        category_id: item.category_id,
        encrypt_category_id: item.encrypt_category_id,
      }))
      this.isLoading = false;
      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewCategory(e) {
    this.router.navigate(["/layout/employee/employee-category-detail", e]);
  }

}
