import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BranchManagementService } from '../../../../services/BranchManagementService/branchManagement.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.css']
})
export class BranchViewComponent implements OnDestroy, OnInit {
  isLoading: boolean = true
  branchList = [];

  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private branchService: BranchManagementService, private router: Router) {
  }

  ngOnInit() {
    this.branchService.branchView("0").subscribe(data => {
      this.branchList = data;
      const myTable = document.querySelector("#myTable");
      this.isLoading = false;
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  viewBranch(id) {
    this.router.navigate(["/layout/administration/branch-detail", id]);
  }

}
