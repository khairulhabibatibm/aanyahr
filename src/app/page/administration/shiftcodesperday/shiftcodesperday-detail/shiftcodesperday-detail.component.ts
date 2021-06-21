import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';
@Component({
  selector: 'app-shiftcodesperday-detail',
  templateUrl: './shiftcodesperday-detail.component.html',
  styleUrls: ['./shiftcodesperday-detail.component.css']
})
export class ShiftcodesperdayDetailComponent implements OnInit {
  isLoading: boolean = true
  errDescription: boolean
  errShiftName: boolean
  errGracePeriod: boolean
  firstBreak: boolean = false
  secondBreak: boolean = false
  thirdBreak: boolean = false
  shiftForm: FormGroup
  shiftID: string
  shiftDetail = []
  defaultDate: Date = new Date("1900-01-01 00:00");
  pipe = new DatePipe('en-US');
  breakCount = [{
    id: 1,
    description: "One Break"
  },
  {
    id: 2,
    description: "Two Break"
  },
  {
    id: 3,
    description: "Three Break"
  }]
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private decimalPipe: DecimalPipe,
    private shiftcodeManagementService: ShiftcodeManagementService) { }

  ngOnInit() {
    this.shiftID = this.route.snapshot.paramMap.get('id');
    this.shiftForm = this.fb.group({
      shiftName: '',
      shiftCode: '',
      gracePeriod: this.decimalPipe.transform(0, '1.2-2'),
      description: '',
      isFlexi: false,
    });
    this.resetError(false)


    if (this.shiftID != "") {
      this.shiftcodeManagementService.shiftPerDayView(this.shiftID).subscribe(data => {
        this.shiftForm.setValue({
          shiftName: data[0].shift_name,
          shiftCode: data[0].shift_per_day_code,
          gracePeriod: this.decimalPipe.transform(data[0].grace_period, '1.2-2'),
          description: data[0].description,
          isFlexi: data[0].is_flexi,
        });

        this.shiftcodeManagementService.shiftDetailPerDayView(this.shiftID).subscribe(data => {
          this.shiftDetail = data.map(item => ({
            day: item.day_name,
            index: item.day,
            isRestday: item.is_rest_day,
            disableRow: item.is_rest_day !== true ? true : false,
            popTimeIn: new Date("1900-01-01 " + item.time_in),
            timeIn: new Date("1900-01-01 " + item.time_in),
            prevTimeIn: new Date("1900-01-01 " + item.time_in),
            popTimeOut: new Date("1900-01-01 " + item.time_out),
            timeOut: new Date("1900-01-01 " + item.time_out),
            prevTimeOut: new Date("1900-01-01 " + item.time_out),
            popHalfdayIn: new Date("1900-01-01 " + item.half_day_in),
            halfdayIn: new Date("1900-01-01 " + item.half_day_in),
            prevHalfdayIn: new Date("1900-01-01 " + item.half_day_in),
            popHalfdayOut: new Date("1900-01-01 " + item.half_day_out),
            halfdayOut: new Date("1900-01-01 " + item.half_day_out),
            prevHalfdayOut: new Date("1900-01-01 " + item.half_day_out),
            popNightDiffIn: new Date("1900-01-01 " + item.night_dif_in),
            nightDiffIn: new Date("1900-01-01 " + item.night_dif_in),
            prevNightDiffIn: new Date("1900-01-01 " + item.night_dif_in),
            popNightDiffOut: new Date("1900-01-01 " + item.night_dif_out),
            nightDiffOut: new Date("1900-01-01 " + item.night_dif_out),
            prevNightDiffOut: new Date("1900-01-01 " + item.night_dif_out),
            breakCount: item.break_count === 0 ? null : item.break_count,
            popFirstBreakIn: new Date("1900-01-01 " + item.first_break_in),
            firstBreakIn: new Date("1900-01-01 " + item.first_break_in),
            prevFirstBreakIn: new Date("1900-01-01 " + item.first_break_in),
            popFirstBreakOut: new Date("1900-01-01 " + item.first_break_out),
            firstBreakOut: new Date("1900-01-01 " + item.first_break_out),
            prevFirstBreakOut: new Date("1900-01-01 " + item.first_break_out),
            popSecondBreakIn: new Date("1900-01-01 " + item.second_break_in),
            secondBreakIn: new Date("1900-01-01 " + item.second_break_in),
            prevSecondBreakIn: new Date("1900-01-01 " + item.second_break_in),
            popSecondBreakOut: new Date("1900-01-01 " + item.second_break_out),
            secondBreakOut: new Date("1900-01-01 " + item.second_break_out),
            prevSecondBreakOut: new Date("1900-01-01 " + item.second_break_out),
            popThirdBreakIn: new Date("1900-01-01 " + item.third_break_in),
            thirdBreakIn: new Date("1900-01-01 " + item.third_break_in),
            prevThirdBreakIn: new Date("1900-01-01 " + item.third_break_in),
            popThirdBreakOut: new Date("1900-01-01 " + item.third_break_out),
            thirdBreakOut: new Date("1900-01-01 " + item.third_break_out),
            prevThirdBreakOut: new Date("1900-01-01 " + item.third_break_out),
            workingHrs: this.decimalPipe.transform(item.total_working_hours, '1.2-2'),
            prevWorkingHrs: this.decimalPipe.transform(item.total_working_hours, '1.2-2'),
          }))

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
    else {
      this.shiftDetail.push({
        day: "Sunday",
        index: 1,
        isRestday: false,
        disableRow: true,
        popTimeIn: this.defaultDate,
        timeIn: this.defaultDate,
        prevTimeIn: this.defaultDate,
        popTimeOut: this.defaultDate,
        timeOut: this.defaultDate,
        prevTimeOut: this.defaultDate,
        popHalfdayIn: this.defaultDate,
        halfdayIn: this.defaultDate,
        prevHalfdayIn: this.defaultDate,
        popHalfdayOut: this.defaultDate,
        halfdayOut: this.defaultDate,
        prevHalfdayOut: this.defaultDate,
        popNightDiffIn: this.defaultDate,
        nightDiffIn: new Date("1900-01-01 22:00"),
        prevNightDiffIn: this.defaultDate,
        popNightDiffOut: this.defaultDate,
        nightDiffOut: new Date("1900-01-01 06:00"),
        prevNightDiffOut: new Date("1900-01-01 06:00"),
        breakCount: null,
        popFirstBreakIn: this.defaultDate,
        firstBreakIn: this.defaultDate,
        prevFirstBreakIn: this.defaultDate,
        popFirstBreakOut: this.defaultDate,
        firstBreakOut: this.defaultDate,
        prevFirstBreakOut: this.defaultDate,
        popSecondBreakIn: this.defaultDate,
        secondBreakIn: this.defaultDate,
        prevSecondBreakIn: this.defaultDate,
        popSecondBreakOut: this.defaultDate,
        secondBreakOut: this.defaultDate,
        prevSecondBreakOut: this.defaultDate,
        popThirdBreakIn: this.defaultDate,
        thirdBreakIn: this.defaultDate,
        prevThirdBreakIn: this.defaultDate,
        popThirdBreakOut: this.defaultDate,
        thirdBreakOut: this.defaultDate,
        prevThirdBreakOut: this.defaultDate,
        workingHrs: this.decimalPipe.transform(0, '1.2-2'),
        prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
      },
        {
          day: "Monday",
          index: 2,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        },
        {
          day: "Tuesday",
          index: 3,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        },
        {
          day: "Wednesday",
          index: 4,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        },
        {
          day: "Thursday",
          index: 5,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        },
        {
          day: "Friday",
          index: 6,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        },
        {
          day: "Saturday",
          index: 7,
          isRestday: false,
          disableRow: true,
          popTimeIn: this.defaultDate,
          timeIn: this.defaultDate,
          prevTimeIn: this.defaultDate,
          popTimeOut: this.defaultDate,
          timeOut: this.defaultDate,
          prevTimeOut: this.defaultDate,
          popHalfdayIn: this.defaultDate,
          halfdayIn: this.defaultDate,
          prevHalfdayIn: this.defaultDate,
          popHalfdayOut: this.defaultDate,
          halfdayOut: this.defaultDate,
          prevHalfdayOut: this.defaultDate,
          popNightDiffIn: this.defaultDate,
          nightDiffIn: new Date("1900-01-01 22:00"),
          prevNightDiffIn: this.defaultDate,
          popNightDiffOut: this.defaultDate,
          nightDiffOut: new Date("1900-01-01 06:00"),
          prevNightDiffOut: new Date("1900-01-01 06:00"),
          breakCount: null,
          popFirstBreakIn: this.defaultDate,
          firstBreakIn: this.defaultDate,
          prevFirstBreakIn: this.defaultDate,
          popFirstBreakOut: this.defaultDate,
          firstBreakOut: this.defaultDate,
          prevFirstBreakOut: this.defaultDate,
          popSecondBreakIn: this.defaultDate,
          secondBreakIn: this.defaultDate,
          prevSecondBreakIn: this.defaultDate,
          popSecondBreakOut: this.defaultDate,
          secondBreakOut: this.defaultDate,
          prevSecondBreakOut: this.defaultDate,
          popThirdBreakIn: this.defaultDate,
          thirdBreakIn: this.defaultDate,
          prevThirdBreakIn: this.defaultDate,
          popThirdBreakOut: this.defaultDate,
          thirdBreakOut: this.defaultDate,
          prevThirdBreakOut: this.defaultDate,
          workingHrs: this.decimalPipe.transform(0, '1.2-2'),
          prevWorkingHrs: this.decimalPipe.transform(0, '1.2-2'),
        })

      this.shiftID = "0"
      this.isLoading = false
    }


  }

  selectRestDay(e) {
    this.shiftDetail[e].disableRow = this.shiftDetail[e].isRestday
    if (!this.shiftDetail[e].isRestday) {
      this.shiftDetail[e].timeIn = this.defaultDate
      this.shiftDetail[e].timeOut = new Date("1900-01-01 11:59"),
        this.shiftDetail[e].halfdayIn = this.defaultDate
      this.shiftDetail[e].halfdayOut = this.defaultDate
      this.shiftDetail[e].nightDiffIn = new Date("1900-01-01 22:00")
      this.shiftDetail[e].nightDiffOut = new Date("1900-01-01 06:00")
      this.shiftDetail[e].firstBreakIn = this.defaultDate
      this.shiftDetail[e].firstBreakOut = this.defaultDate
      this.shiftDetail[e].secondBreakIn = this.defaultDate
      this.shiftDetail[e].secondBreakOu = this.defaultDate
      this.shiftDetail[e].thirdBreakIn = this.defaultDate
      this.shiftDetail[e].thirdBreakOut = this.defaultDate
      this.shiftDetail[e].workingHrs = this.decimalPipe.transform(0, '1.2-2')
    }
    else {
      this.shiftDetail[e].timeIn = this.shiftDetail[e].prevTimeIn
      this.shiftDetail[e].timeOut = this.shiftDetail[e].prevTimeOut
      this.shiftDetail[e].halfdayIn = this.shiftDetail[e].prevHalfdayIn
      this.shiftDetail[e].halfdayOut = this.shiftDetail[e].prevHalfdayOut
      this.shiftDetail[e].nightDiffIn = this.shiftDetail[e].prevNightDiffIn
      this.shiftDetail[e].nightDiffOut = this.shiftDetail[e].prevNightDiffOut
      this.shiftDetail[e].firstBreakIn = this.shiftDetail[e].prevFirstBreakIn
      this.shiftDetail[e].firstBreakOut = this.shiftDetail[e].prevFirstBreakOut
      this.shiftDetail[e].secondBreakIn = this.shiftDetail[e].prevSecondBreakIn
      this.shiftDetail[e].secondBreakOut = this.shiftDetail[e].prevSecondBreakOut
      this.shiftDetail[e].thirdBreakIn = this.shiftDetail[e].prevThirdBreakIn
      this.shiftDetail[e].thirdBreakOut = this.shiftDetail[e].prevThirdBreakOut
      this.shiftDetail[e].workingHrs = this.decimalPipe.transform(this.shiftDetail[e].prevWorkingHrs, '1.2-2')
    }

  }

  onFlexi(e) {
    if (e.target.checked) {
      this.shiftDetail.map(x => x.workingHrs = this.decimalPipe.transform(0, '1.2-2'));
      this.shiftDetail.map(x => x.prevWorkingHrs = this.decimalPipe.transform(0, '1.2-2'));
    }
    else {
      for (var i = 0; i < this.shiftDetail.length; i++) {
        this.computeDateDiff(i)
      }
    }
  }

  computeDateDiff(index) {
    if (this.shiftDetail[index].timeIn !== null || this.shiftDetail[index].timeIn !== ""
      && this.shiftDetail[index].timeOut !== null || this.shiftDetail[index].timeOut !== "") {
      var eventStartTime = new Date(this.shiftDetail[index].timeIn);
      var eventEndTime = new Date(this.shiftDetail[index].timeOut);
      if (eventStartTime > eventEndTime) {
        eventEndTime.setDate(eventEndTime.getDate() + 1)
      }
      var duration = eventEndTime.valueOf() - eventStartTime.valueOf();
      const diffInHours = duration / 1000 / 60 / 60;
      this.shiftDetail[index].workingHrs = this.decimalPipe.transform(diffInHours, '1.2-2');
      this.shiftDetail[index].prevWorkingHrs = this.decimalPipe.transform(diffInHours, '1.2-2');
    }
  }

  onChangeTimeIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].timeIn = d
      this.shiftDetail[i].prevTimeIn = d
      this.computeDateDiff(i)
    }
  }

  onChangeTimeOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].timeOut = d
      this.shiftDetail[i].prevTimeOut = d
      this.computeDateDiff(i)
    }
  }

  onChangeHalfdayIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].halfdayIn = d
      this.shiftDetail[i].prevHalfdayIn = d
    }
  }

  onChangeHalfdayOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].halfdayOut = d
      this.shiftDetail[i].prevHalfdayOut = d
    }
  }

  onChangeNightDiffIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].nightDiffIn = d
      this.shiftDetail[i].prevNightDiffIn = d
    }
  }

  onChangeNightDiffOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].nightDiffOut = d
      this.shiftDetail[i].prevNightDiffOut = d
    }
  }

  onFirstBreakIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].firstBreakIn = d
      this.shiftDetail[i].prevFirstBreakIn = d
    }
  }

  onFirstBreakOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].firstBreakOut = d
      this.shiftDetail[i].prevFirstBreakOut = d
    }
  }

  onSecondBreakIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].secondBreakIn = d
      this.shiftDetail[i].prevSecondBreakIn = d
    }
  }

  onSecondBreakOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].secondBreakOut = d
      this.shiftDetail[i].prevSecondBreakOut = d
    }
  }

  onThirdBreakIn(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].thirdBreakIn = d
      this.shiftDetail[i].prevThirdBreakIn = d
    }
  }

  onThirdBreakOut(i, e) {
    if (e.hour !== null && e.minute !== null) {
      const d = new Date("1900-01-01 " + e.hour + ":" + e.minute)
      this.shiftDetail[i].thirdBreakOut = d
      this.shiftDetail[i].prevThirdBreakOut = d
    }
  }

  breakChange() {
    let count = 0
    for (var i = 0; i < this.shiftDetail.length; i++) {
      if (count < this.shiftDetail[i].breakCount) {
        if (this.shiftDetail[i].breakCount === 3) {
          count = 3
        }
        else if (this.shiftDetail[i].breakCount === 2) {
          count = 2
        }
        else if (this.shiftDetail[i].breakCount === 1) {
          count = 1
        }
        else {
          count = 0
        }
      }
    }
    if (count === 3) {
      this.firstBreak = true
      this.secondBreak = true
      this.thirdBreak = true
    }
    else if (count === 2) {
      this.firstBreak = true
      this.secondBreak = true
      this.thirdBreak = false
    }
    else if (count === 1) {
      this.firstBreak = true
      this.secondBreak = false
      this.thirdBreak = false
    }
    else {
      this.firstBreak = false
      this.secondBreak = false
      this.thirdBreak = false
    }
  }

  resetError(e) {
    this.errDescription = e
    this.errShiftName = e
    this.errGracePeriod = e
  }

  validation() {
    this.resetError(false)
    let flag = true
    if (this.shiftForm.get('shiftName').value === "" || this.shiftForm.get('shiftName').value === null) {
      flag = false;
      this.errShiftName = true;
    }
    if (this.shiftForm.get('gracePeriod').value === null || this.shiftForm.get('gracePeriod').value === "") {
      flag = false;
      this.errGracePeriod = true;
    }
    if (this.shiftForm.get('description').value === "" || this.shiftForm.get('description').value === null) {
      flag = false;
      this.errDescription = true;
    }
    return flag
  }

  submit() {
    if (this.validation()) {
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
              let detail = this.shiftDetail.map(item => ({
                shift_per_day_id: this.shiftID,
                shift_per_day_code: this.shiftForm.value.shiftCode,
                shift_name: this.shiftForm.value.shiftName,
                grace_period: parseFloat(this.shiftForm.value.gracePeriod.replace(",", "")),
                description: this.shiftForm.value.description,
                is_flexi: this.shiftForm.value.isFlexi,
                time_in: this.pipe.transform(item.timeIn, 'MM/dd/yyyy hh:mm a'),
                time_out: this.pipe.transform(item.timeOut, 'MM/dd/yyyy hh:mm a'),
                total_working_hours: parseFloat(item.workingHrs.toString().replace(",", "")),
                half_day_in: this.pipe.transform(item.halfdayIn, 'MM/dd/yyyy hh:mm a'),
                half_day_out: this.pipe.transform(item.halfdayOut, 'MM/dd/yyyy hh:mm a'),
                night_dif_in: this.pipe.transform(item.nightDiffIn, 'MM/dd/yyyy hh:mm a'),
                night_dif_out: this.pipe.transform(item.nightDiffOut, 'MM/dd/yyyy hh:mm a'),
                first_break_in: this.pipe.transform(item.firstBreakIn, 'MM/dd/yyyy hh:mm a'),
                first_break_out: this.pipe.transform(item.firstBreakOut, 'MM/dd/yyyy hh:mm a'),
                second_break_in: this.pipe.transform(item.secondBreakIn, 'MM/dd/yyyy hh:mm a'),
                second_break_out: this.pipe.transform(item.secondBreakOut, 'MM/dd/yyyy hh:mm a'),
                third_break_in: this.pipe.transform(item.thirdBreakIn, 'MM/dd/yyyy hh:mm a'),
                third_break_out: this.pipe.transform(item.thirdBreakOut, 'MM/dd/yyyy hh:mm a'),
                break_count: item.breakCount === null ? 0 : item.breakCount,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
                day: item.index,
                is_rest_day: item.isRestday,
              }))
              let obj = {
                shift_per_day_id: this.shiftID,
                shift_per_day_code: this.shiftForm.value.shiftCode,
                shift_name: this.shiftForm.value.shiftName,
                grace_period: parseFloat(this.shiftForm.value.gracePeriod.replace(",", "")),
                description: this.shiftForm.value.description,
                is_flexi: this.shiftForm.value.isFlexi,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
                Detail: detail
              }

              this.shiftcodeManagementService.shiftDetailIU(obj).subscribe(data => {
                if (data === 0) {
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
            },
          });
        }
      })
    }

  }

}
