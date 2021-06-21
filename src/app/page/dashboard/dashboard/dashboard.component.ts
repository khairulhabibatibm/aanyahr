import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AttendanceManagementService } from '../../../services/AttendanceManagementService/attendanceManagement.service';
import { FilingManagementService } from '../../../services/FilingManagementService/filingManagement.service';
import { PayrollManagementService } from '../../../services/PayrollManagementService/payrollManagement.service';
import { environment } from '../../../../environments/environment';
import { TimekeepingManagementService } from '../../../services/TimekeepingManagementService/timekeepingManagement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  image = environment.exportUrl
  payslip = environment.crystalReport;
  isLoading: boolean = true;
  parentDetail = []
  isChangeLog: boolean = false
  isChangeSchedule: boolean = false
  isLeave: boolean = false
  isOfficialBusiness: boolean = false
  isOvertime: boolean = false
  isOffset: boolean = false
  isButton: boolean
  filterargs = { title: 'hello' };
  isApprover: boolean = (sessionStorage.getItem('ap') == "true")
  reloadApp: boolean = true
  pipe = new DatePipe('en-US');
  calendarEvents = []
  filingList = []
  attendanceList = []
  payslipList = []
  selectedFiling: number
  payslipHeader: any
  url: string
  payslipDetail = []
  filingTypeList = [{
    id: 0,
    description: "Change Log"
  },
  {
    id: 1,
    description: "Change Schedule"
  },
  {
    id: 2,
    description: "Leave"
  },
  {
    id: 3,
    description: "Official Business"
  },
  {
    id: 4,
    description: "Overtime"
  },
  {
    id: 5,
    description: "Offset"
  }]
  count: number = 0
  fileType: number = 0
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
  dateFrom: any
  dateTo: any
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('filingModal') filingModal: ElementRef
  @ViewChild('attendanceModal') attendanceModal: ElementRef
  @ViewChild('payslipModal') payslipModal: ElementRef
  @ViewChild('htmlData') htmlData: ElementRef;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventStartEditable: false,
    firstDay: 1,
    customButtons: {
      prev: {
        text: '<',
        click: this.getEventsByMonthBefore.bind(this)
      },
      next: {
        text: '>',
        click: this.getEventsByMonthAfter.bind(this, this)
      }
    },
  };
  appTitle: string
  currentEvents: EventApi[] = [];
  payslipPDF = []
  constructor(private attendanceManagementService: AttendanceManagementService, private modalService: NgbModal,
    private filingManagementService: FilingManagementService, private payrollManagementService: PayrollManagementService,
    private timekeepingManagementService: TimekeepingManagementService) { }

  ngOnInit() {
    (sessionStorage.getItem('ap') == "true") === true ? this.isButton = true : this.isButton = false
    this.appTitle = "Application"
    this.dateFrom = this.startDate
    this.dateTo = this.endDate
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    let calendarApi = this.calendarComponent.getApi();
    const start = new Date(calendarApi.view.activeStart)
    const end = new Date(calendarApi.view.activeEnd)
    this.attendanceManagementService.dashboardDateView(this.pipe.transform(start, 'MM/dd/yyyy'), this.pipe.transform(end, 'MM/dd/yyyy')).subscribe(data => {
      this.calendarEvents = data;

      let calendarApi = this.calendarComponent.getApi();
      calendarApi.addEventSource(this.calendarEvents)

      this.filingManagementService.dashboardView(0, false).subscribe(data => {
        this.filingList = data

        this.payrollManagementService.payslipList(sessionStorage.getItem('u')).subscribe(data => {
          this.payslipList = data
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

  getEventsByMonthBefore(e, events: EventApi[]) {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev()
    const start = new Date(calendarApi.view.activeStart)
    const end = new Date(calendarApi.view.activeEnd)
    this.attendanceManagementService.dashboardDateView(this.pipe.transform(start, 'MM/dd/yyyy'), this.pipe.transform(end, 'MM/dd/yyyy')).subscribe(data => {
      calendarApi.removeAllEventSources()
      calendarApi.addEventSource(data)
      calendarApi.render()
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  getEventsByMonthAfter(e, events: EventApi[]) {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next()
    const start = new Date(calendarApi.view.activeStart)
    const end = new Date(calendarApi.view.activeEnd)
    this.attendanceManagementService.dashboardDateView(this.pipe.transform(start, 'MM/dd/yyyy'), this.pipe.transform(end, 'MM/dd/yyyy')).subscribe(data => {
      this.calendarEvents = data;
      calendarApi.removeAllEventSources()
      calendarApi.addEventSource(data)
      calendarApi.render()
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.resetHidden(false)
    this.selectedFiling = null
    this.parentDetail['dashboardId'] = 0
    this.parentDetail['view'] = false
    this.parentDetail['dashboardDate'] = this.pipe.transform(new Date(selectInfo.startStr), 'MM/dd/yyyy')
    this.modalService.open(this.filingModal, { size: 'xl' })
  }

  selectFiling() {
    this.resetHidden(false)
    switch (this.selectedFiling) {
      case 0: {
        this.isChangeLog = true
        break;
      }
      case 1: {
        this.isChangeSchedule = true
        break;
      }
      case 2: {
        this.isLeave = true
        break;
      }
      case 3: {
        this.isOfficialBusiness = true
        break;
      }
      case 4: {
        this.isOvertime = true
        break;
      }
      case 5: {
        this.isOffset = true
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

  isSuccess(event: string[]) {
    if (event["id"] !== 0) {
      this.modalService.dismissAll()

      let calendarApi = this.calendarComponent.getApi();
      const start = new Date(calendarApi.view.activeStart)
      const end = new Date(calendarApi.view.activeEnd)
      this.attendanceManagementService.dashboardDateView(this.pipe.transform(start, 'MM/dd/yyyy'), this.pipe.transform(end, 'MM/dd/yyyy')).subscribe(data => {
        this.calendarEvents = data;
        calendarApi.removeAllEventSources()
        calendarApi.addEventSource(data)
        calendarApi.render()
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        })
    }
  }

  next() {
    this.count++
    this.filingManagementService.dashboardView(this.count, this.isApprover).subscribe(data => {
      this.filingList = data
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  prev() {
    this.count--
    this.filingManagementService.dashboardView(this.count, this.isApprover).subscribe(data => {
      this.filingList = data
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  view(index) {
    const selected = this.filingList[index]
    this.parentDetail['dashboardId'] = selected.id
    this.parentDetail['dashboardDate'] = ""
    this.parentDetail['view'] = !this.isApprover
    this.resetHidden(false)
    switch (selected.module_id) {
      case 33: {
        this.selectedFiling = 0
        this.isChangeLog = true
        break;
      }
      case 32: {
        this.selectedFiling = 1
        this.isChangeSchedule = true
        break;
      }
      case 34: {
        this.selectedFiling = 2
        this.isLeave = true
        break;
      }
      case 35: {
        this.selectedFiling = 3
        this.isOfficialBusiness = true
        break;
      }
      case 36: {
        this.selectedFiling = 4
        this.isOvertime = true
        break;
      }
      case 37: {
        this.selectedFiling = 5
        this.isOffset = true
        break;
      }
    }
    this.modalService.open(this.filingModal, { size: 'xl' })
  }

  reload() {
    this.reloadApp = false
    this.filingManagementService.dashboardView(this.count, this.isApprover).subscribe(data => {
      this.isApprover === true ? this.appTitle = "Approval" : this.appTitle = "Application"
      this.isApprover === true ? this.isApprover = false : this.isApprover = true
      this.filingList = data
      this.reloadApp = true
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  viewLogs() {
    const start = this.pipe.transform(this.dateFrom.year + "/" + this.dateFrom.month + "/" + this.dateFrom.day + "", 'MM/dd/yyyy')
    const end = this.pipe.transform(this.dateTo.year + "/" + this.dateTo.month + "/" + this.dateTo.day + "", 'MM/dd/yyyy')

    this.timekeepingManagementService.employeeTimekeeping(sessionStorage.getItem('u'), start, end).subscribe(data => {
      this.modalService.open(this.attendanceModal, { size: 'xl' })
      this.attendanceList = data

      this.dtOptions['generated'] = {
        data: data,
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'print'
        ],
        columns: [
          { "data": "employee_code" },
          { "data": "display_name" },
          {
            "data": "date"
            , "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
            }
          },
          { "data": "rest_day" },
          { "data": "schedule_time_in" },
          { "data": "schedule_time_out" },
          { "data": "actual_time_in" },
          { "data": "actual_time_out" },
          { "data": "reg" },
          { "data": "late" },
          { "data": "undertime" },
          { "data": "is_absent" },
          { "data": "lwop_hour" },
          { "data": "vl_hour" },
          { "data": "sl_hour" },
          { "data": "otherl_hour" },
          { "data": "regnd" },
          { "data": "ot" },
          { "data": "otnd" },
          { "data": "lhot" },
          { "data": "lhotnd" },
          { "data": "lhot_e8" },
          { "data": "lhotnd_e8" },
          { "data": "lhrdot" },
          { "data": "lhrdotnd" },
          { "data": "lhrdot_e8" },
          { "data": "lhrdotnd_e8" },
          { "data": "shot" },
          { "data": "shotnd" },
          { "data": "shot_e8" },
          { "data": "shotnd_e8" },
          { "data": "shrdot" },
          { "data": "shrdotnd" },
          { "data": "shrdot_e8" },
          { "data": "shrdotnd_e8" },
          { "data": "otrd" },
          { "data": "otrdnd" },
          { "data": "otrd_e8" },
          { "data": "otrdnd_e8" },
          { "data": "dhot" },
          { "data": "dhotnd" },
          { "data": "dhot_e8" },
          { "data": "dhotnd_e8" },
          { "data": "dhrdot" },
          { "data": "dhrdotnd" },
          { "data": "dhrdot_e8" },
          { "data": "dhrdotnd_e8" },
          { "data": "remarks" },
        ],
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  selectedPayslip(e) {
    this.payrollManagementService.postedView("0", e.posted_payslip_id).subscribe(data => {
      this.payslipHeader = data[0]
      this.url = this.image + this.payslipHeader.company_logo
      this.payrollManagementService.payslipDetailList("0", e.posted_payslip_id).subscribe(data => {
        this.payslipDetail = data
        this.modalService.open(this.payslipModal, { size: 'lg' })
        this.payslipPDF.push({
          payroll_header_id: 0,
          posted_payslip_id: e.posted_payslip_id,
          created_by: sessionStorage.getItem('u'),
          series_code: sessionStorage.getItem('sc'),
          employee_id: sessionStorage.getItem('u'),
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

  public openPDF(): void {
    window.location.href = this.payslip + "reportviewer.aspx?payroll_header_id=" + this.payslipPDF[0].payroll_header_id + "&posted_payslip_id=" + this.payslipPDF[0].posted_payslip_id +  "&created_by=" + this.payslipPDF[0].created_by + "&series_code=" + this.payslipPDF[0].series_code + "&employee_id=" + this.payslipPDF[0].employee_id

    // let data = document.getElementById("htmlData",);
    // html2canvas(data, { useCORS: true }).then(canvas => {

    //   let PDF = new jsPDF('p', 'mm', 'a4');

    //   let fileWidth = 210;
    //   let fileHeight = canvas.height * fileWidth / canvas.width;

    //   const FILEURI = canvas.toDataURL('image/png')
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

    //   PDF.save('employee-payslip.pdf');
    // });
  }
}
