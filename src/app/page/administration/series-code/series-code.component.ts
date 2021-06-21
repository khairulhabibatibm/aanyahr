import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TenantDefaultService } from '../../../services/TenantDefaultService/tenantDefault.service';
import { TenantMasterService } from '../../../services/TenantMasterService/tenantMaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-series-code',
  templateUrl: './series-code.component.html',
  styleUrls: ['./series-code.component.css']
})
export class SeriesCodeComponent implements OnInit {
  isLoading: boolean = true;
  seriesList = [];
  moduleList = [];
  table = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild('seriesModal') seriesModal: ElementRef
  seriesForm: FormGroup
  seriesCode = "";
  transactionType = "";
  module_id: number;
  constructor(private tenantDefaultService: TenantDefaultService, private tenantMasterService: TenantMasterService,
    private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };

    this.seriesForm = this.fb.group({
      prefix: [''],
      year: [''],
      series: [''],
      length: [''],
    })

    this.tenantDefaultService.seriesList().subscribe(data => {
      this.table = data;

      setTimeout(() => {
        this.dtTrigger.next();
      }, 100);
      this.isLoading = false;
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      });
  }

  editSeries(e) {
    this.module_id = e;
    this.modalService.open(this.seriesModal)
    let selected = this.table.filter(x => x.module_id == e)[0]
    this.seriesCode = selected.series_code;
    this.transactionType = selected.module_name;
    this.seriesForm.setValue({
      prefix: selected.prefix,
      year: selected.year,
      series: selected.series,
      length: selected.length,
    })
  }

  loadSeries() {
    var series = '' + this.seriesForm.get('series').value;
    while (series.length < this.seriesForm.get('length').value) {
      series = '0' + series;
    }
    if (series.length <= this.seriesForm.get('length').value) {
      this.seriesCode = this.seriesForm.get('prefix').value + this.seriesForm.get('year').value + series;
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
            var obj = {
              module_id: this.module_id,
              created_by: sessionStorage.getItem('u'),
              series: this.seriesForm.get('series').value,
              series_code: sessionStorage.getItem('sc'),
              prefix: this.seriesForm.get('prefix').value,
              year: this.seriesForm.get('year').value,
              length: this.seriesForm.get('length').value,
              active: true,
            }
            this.tenantDefaultService.seriesU(obj).subscribe(data => {
              if (data === 0) {
                Swal.fire("Failed!", "Transaction failed!", "error");
              }
              else {
                this.tenantDefaultService.seriesList().subscribe(data => {
                  this.seriesList = data;
                  this.table = [];
                  for (var i = 0; i < this.seriesList.length; i++) {
                    this.table.push({
                      module_id: this.seriesList[i]['module_id'],
                      module_name: this.seriesList[i]['module_name'],
                      prefix: this.seriesList[i]['prefix'],
                      year: this.seriesList[i]['year'],
                      series: this.seriesList[i]['series'],
                      length: this.seriesList[i]['length'],
                      series_code: this.seriesList[i]['series_code'],
                    })
                  }
                  $('#dataTableExample').DataTable().destroy()
                  this.dtTrigger.next()
                  Swal.fire("Ok!", "Transaction successful!", "success");
                },
                  (error: HttpErrorResponse) => {
                    console.log(error.error);
                  });
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
