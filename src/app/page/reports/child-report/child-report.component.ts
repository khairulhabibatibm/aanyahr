import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-child-report',
  templateUrl: './child-report.component.html',
  styleUrls: ['./child-report.component.css']
})
export class ChildReportComponent implements OnInit {
  @Input() headerList: any[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject();
  
  constructor() { }

  ngOnInit() {
    console.log(this.headerList)
  }

  searchReport(data){
   console.log(data)
   if(this.dtElement.dtInstance !== undefined){
    $('#reportTable').DataTable().clear();
    $('#reportTable').DataTable().destroy();
    this.dtOptions['reports'] = {
      data: data,
      dom: 'Bfrtip',
      destroy: true,
      buttons: [
        'copy', 'csv', 'excel', 'print'
      ],
      columns: this.headerList
    };
    setTimeout(() => {
      this.dtTrigger.next()
    }, 100);
  }
  else{
    this.dtOptions['reports'] = {
      data: data,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'print'
      ],
      columns: this.headerList
    };
    setTimeout(() => {
      this.dtTrigger.next()
    }, 100);
  }
  }

}
