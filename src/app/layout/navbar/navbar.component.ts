import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AttendanceManagementService } from '../../services/AttendanceManagementService/attendanceManagement.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LogService } from '../../services/LogService/log.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private path = environment.exportUrl
  displayName: string
  companyName: string
  imagePath: string
  index: number = 1
  notifList = []
  id: string
  constructor( @Inject(DOCUMENT) private document: Document, private router: Router, 
  private attendanceManagementService: AttendanceManagementService, private logService: LogService) { }

  ngOnInit() {
    this.id = sessionStorage.getItem('u')
    this.logService.logList(5, this.index).subscribe(notif => {
      this.notifList = notif
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
    this.displayName = sessionStorage.getItem('dn')
    this.companyName = sessionStorage.getItem('cn')
    this.imagePath =  this.path + "\\" + sessionStorage.getItem('ip')
  }

  onLogout(e) {
    e.preventDefault();
    
    sessionStorage.removeItem('token');

    if (!sessionStorage.getItem('token')) {
      this.router.navigate(['login']);
    }
  }

  toggleSidebar(e){
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  bundy(e){
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
              in_out: e,
              created_by: sessionStorage.getItem('u'),
              series_code: sessionStorage.getItem('sc'),
            }
            this.attendanceManagementService.bundyI(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Bundy failed!", "error");
              }
              else {
                Swal.fire("Ok!", "Bundy successful!", "success");
              }
            },
              (error: HttpErrorResponse) => {
                console.log(error.error);
                Swal.fire("Failed!", "Bundy failed!", "error");
              });
          },
        });
      }
    })
  
  }

}
