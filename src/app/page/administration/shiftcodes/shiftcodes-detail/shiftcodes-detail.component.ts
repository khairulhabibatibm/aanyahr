import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ShiftcodeManagementService } from '../../../../services/ShiftCodeManagementService/shiftcodeManagement.service';

@Component({
  selector: 'app-shiftcodes-detail',
  templateUrl: './shiftcodes-detail.component.html',
  styleUrls: ['./shiftcodes-detail.component.css']
})
export class ShiftcodesDetailComponent implements OnInit {
  isLoading: boolean = true;
  selectedBreak: number;
  shiftForm: FormGroup;
  breakForm: FormGroup;
  shiftID: string;
  timeIn: Date;
  timeOut: Date;
  days: number;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  breakList = ['First Break', 'Second Break', 'Third Break']
  break = [];
  isBreak = false;
  isBreakIn = false;
  isBreakOut = false;
  errShiftName = false;
  errDescription = false;
  errTimeIn = false;
  errTimeOut = false;
  errHalfDayIn = false;
  errHalfDayOut = false;
  errNightDiffIn = false;
  errNightDiffOut = false;
  BreakOut = '';
  BreakIn = '';
  halfDayIn = '';
  halfDayOut = '';
  nightDiffIn = '';
  nightDiffOut = '';
  constructor(private fb: FormBuilder, private decimalPipe: DecimalPipe, private shiftcodeManagementService: ShiftcodeManagementService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.shiftID = this.route.snapshot.paramMap.get('id');
    this.shiftForm = this.fb.group({
      shiftName: [''],
      gracePeriod: ['0'],
      description: [''],
      isFlexi: [false],
      timeIn: [''],
      dtimeIn: [''],
      daysCover: [0],
      timeOut: [''],
      dtimeOut: [''],
      halfDayIn: [''],
      halfDayOut: [''],
      halfDayInDays: [0],
      halfDayOutDays: [0],
      nightDiffIn: this.pipe.transform("01/01/1900/ 22:00", 'shortTime'),
      nightDiffOut: this.pipe.transform("01/01/1900/ 06:00", 'shortTime'),
      nightDiffInDays: [0],
      nightDiffOutDays: [1],
      is_rd_mon: false,
      is_rd_tue: false,
      is_rd_wed: false,
      is_rd_thu: false,
      is_rd_fri: false,
      is_rd_sat: false,
      is_rd_sun: false,
      first_break_in: null,
      first_break_out: null,
      first_break_in_days_cover: [0],
      first_break_out_days_cover: [0],
      second_break_in: null,
      second_break_out: null,
      second_break_in_days_cover: [0],
      second_break_out_days_cover: [0],
      third_break_in: null,
      third_break_out: null,
      third_break_in_days_cover: [0],
      third_break_out_days_cover: [0],
      workingHrs: [{ value: '0', disabled: true }],
    });
    this.breakForm = this.fb.group({
      selectedBreak: [null],
      description: [''],
      BreakIn: [''],
      breakInDays: [''],
      BreakOut: [''],
      breakOutDays: [''],
    });
    if (this.shiftID !== "") {
      this.shiftcodeManagementService.shiftView(this.shiftID).subscribe(data => {
        var date = new Date("01/01/1900/ " + data[0].time_out);
        date.setDate(date.getDate() + Number(data[0].time_out_days_cover))
        this.shiftForm = this.fb.group({
          shiftName: data[0].shift_name,
          gracePeriod: data[0].grace_period,
          description: data[0].description,
          isFlexi: data[0].is_flexi,
          timeIn: data[0].time_in,
          dtimeIn: new Date("01/01/1900/ " + data[0].time_in),
          daysCover: data[0].time_out_days_cover,
          timeOut: data[0].time_out,
          dtimeOut: date,
          halfDayIn: data[0].half_day_in,
          halfDayOut: data[0].half_day_out,
          halfDayInDays: data[0].half_day_in_days_cover,
          halfDayOutDays: data[0].half_day_out_days_cover,
          nightDiffIn: data[0].night_dif_in,
          nightDiffOut: data[0].night_dif_out,
          nightDiffInDays: data[0].night_dif_in_days_cover,
          nightDiffOutDays: data[0].night_dif_out_days_cover,
          is_rd_mon: data[0].is_rd_mon,
          is_rd_tue: data[0].is_rd_tue,
          is_rd_wed: data[0].is_rd_wed,
          is_rd_thu: data[0].is_rd_thu,
          is_rd_fri: data[0].is_rd_fri,
          is_rd_sat: data[0].is_rd_sat,
          is_rd_sun: data[0].is_rd_sun,
          first_break_in: data[0].first_break_in === "" ? null : data[0].first_break_in,
          first_break_out: data[0].first_break_out === "" ? null : data[0].first_break_out,
          first_break_in_days_cover: data[0].first_break_in === "" ? 0 : data[0].first_break_in_days_cover,
          first_break_out_days_cover: data[0].first_break_out === "" ? 0 : data[0].first_break_out_days_cover,
          second_break_in: data[0].second_break_in === "" ? null : data[0].second_break_in,
          second_break_out: data[0].second_break_out === "" ? null : data[0].second_break_out,
          second_break_in_days_cover: data[0].second_break_in === "" ? 0 : data[0].second_break_in_days_cover,
          second_break_out_days_cover: data[0].second_break_out === "" ? 0 : data[0].second_break_out_days_cover,
          third_break_in: data[0].third_break_in === "" ? null : data[0].third_break_in,
          third_break_out: data[0].third_break_out === "" ? null : data[0].third_break_out,
          third_break_in_days_cover: data[0].third_break_in === "" ? 0 : data[0].third_break_in_days_cover,
          third_break_out_days_cover: data[0].third_break_out === "" ? 0 : data[0].third_break_out_days_cover,
          workingHrs: [{ value: data[0].total_working_hours, disabled: !data[0].is_flexi }],
        })
        if (data[0].first_break_in !== "" && data[0].first_break_out != "") {
          this.break.push({
            breakType: this.breakList[0],
            breakIn: data[0].first_break_in,
            breakInDays: data[0].first_break_in_days_cover,
            breakOut: data[0].first_break_out,
            breakOutDays: data[0].first_break_out_days_cover,
          });
        }
        if (data[0].second_break_in !== "" && data[0].second_break_out != "") {
          this.break.push({
            breakType: this.breakList[1],
            breakIn: data[0].second_break_in,
            breakInDays: data[0].second_break_in_days_cover,
            breakOut: data[0].second_break_out,
            breakOutDays: data[0].second_break_out_days_cover,
          });
        }
        if (data[0].third_break_in !== "" && data[0].third_break_out != "") {
          this.break.push({
            breakType: this.breakList[2],
            breakIn: data[0].third_break_in,
            breakInDays: data[0].third_break_in_days_cover,
            breakOut: data[0].third_break_out,
            breakOutDays: data[0].third_break_out_days_cover,
          });
        }
        this.isLoading = false;
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        });
    }
    else {
      this.shiftID = "0";
      this.isLoading = false;
    }
  }

  onFlexi(e) {
    this.shiftForm.get('workingHrs').setValue("0");
    if (!e.target.checked) {
      this.shiftForm.get('workingHrs').disable()
      this.computeDateDiff();
    }
    else {
      this.shiftForm.get('workingHrs').enable()
    }
  }

  setTimeIn(e) {
    this.shiftForm.get('timeIn').setValue(this.pipe.transform(e, 'shortTime'));
    this.shiftForm.get('dtimeIn').setValue(e);
    this.computeDateDiff();
  }

  setTimeOut(e) {
    this.shiftForm.get('timeOut').setValue(this.pipe.transform(e, 'shortTime'));
    this.shiftForm.get('dtimeOut').setValue(e);
    this.computeDateDiff();
  }

  computeDateDiff() {
    if (this.shiftForm.get('dtimeIn').value != "" || this.shiftForm.get('dtimeIn').value != null
      && this.shiftForm.get('dtimeOut').value != "" || this.shiftForm.get('dtimeOut').value != null) {

      var eventStartTime = new Date(this.shiftForm.get('dtimeIn').value);
      var eventEndTime = new Date(this.shiftForm.get('dtimeOut').value);
      if (eventStartTime > eventEndTime) {
        eventEndTime.setDate(eventEndTime.getDate() + Number(this.shiftForm.get('daysCover').value))
      }
      var duration = eventEndTime.valueOf() - eventStartTime.valueOf();
      const diffInHours = duration / 1000 / 60 / 60;
      this.shiftForm.get('workingHrs').setValue(this.decimalPipe.transform(diffInHours, '1.2-2'));
    }
  }

  setHalfDayIn(e) {
    this.shiftForm.get('halfDayIn').setValue(this.pipe.transform(e, 'shortTime'));
  }

  setHalfDayOut(e) {
    this.shiftForm.get('halfDayOut').setValue(this.pipe.transform(e, 'shortTime'));
  }

  setBreakIn(e) {
    this.breakForm.get('BreakIn').setValue(this.pipe.transform(e, 'shortTime'));
  }

  setBreakOut(e) {
    this.breakForm.get('BreakOut').setValue(this.pipe.transform(e, 'shortTime'));
  }

  setNightDiffIn(e) {
    this.breakForm.get('nightDiffIn').setValue(this.pipe.transform(e, 'shortTime'));
  }

  setNightDiffOut(e) {
    this.breakForm.get('nightDiffOut').setValue(this.pipe.transform(e, 'shortTime'));
  }

  addBreak() {
    this.isBreak = false;
    if (this.break.length < 3) {
      var flag = this.breakValidation();
      if (flag) {
        this.break.push({
          breakType: this.breakList[this.break.length],
          breakIn: this.breakForm.get('BreakIn').value,
          breakInDays: this.breakForm.get('breakInDays').value == "" || this.breakForm.get('breakInDays').value == null ? "0" : this.breakForm.get('breakInDays').value,
          breakOut: this.breakForm.get('BreakOut').value,
          breakOutDays: this.breakForm.get('breakOutDays').value == "" || this.breakForm.get('breakOutDays').value == null ? "0" : this.breakForm.get('breakOutDays').value,
        });
        this.breakForm.reset();
      }
    }
    else {
      this.isBreak = true;
    }
  }

  breakValidation() {
    let flag = true;
    if (this.breakForm.get('BreakIn').value == "" || this.breakForm.get('BreakIn').value == null) {
      flag = false
      this.isBreakIn = true;
    }
    else {
      flag = true;
      this.isBreakIn = false;
    }
    if (this.breakForm.get('BreakOut').value == "" || this.breakForm.get('BreakOut').value == null) {
      flag = false
      this.isBreakOut = true;
    }
    else {
      flag = true;
      this.isBreakOut = false;
    }
    return flag
  }

  removeBreak(e) {
    this.isBreak = false;
    this.break.splice(e, 1);
    var obj = [];
    for (var i = 0; i < this.break.length; i++) {
      obj.push({
        breakType: this.breakList[i],
        breakIn: this.break[i].breakIn,
        breakInDays: this.break[i].breakInDays,
        breakOut: this.break[i].breakOut,
        breakOutDays: this.break[i].breakOutDays,
      })
    }
    this.break = obj;
  }

  submit() {
    var flag = this.formValidation()
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
              this.shiftForm.get('first_break_in').setValue(null);
              this.shiftForm.get('first_break_in_days_cover').setValue(0);
              this.shiftForm.get('first_break_out').setValue(null);
              this.shiftForm.get('first_break_out_days_cover').setValue(0);
              this.shiftForm.get('second_break_in').setValue(null);
              this.shiftForm.get('second_break_in_days_cover').setValue(0);
              this.shiftForm.get('second_break_out').setValue(null);
              this.shiftForm.get('second_break_out_days_cover').setValue(0);
              this.shiftForm.get('third_break_in').setValue(null);
              this.shiftForm.get('third_break_in_days_cover').setValue(0);
              this.shiftForm.get('third_break_out').setValue(null);
              this.shiftForm.get('third_break_out_days_cover').setValue(0);
              for (var i = 0; i < this.break.length; i++) {
                if (i === 1) {
                  this.shiftForm.get('second_break_in').setValue(this.break[i].breakIn);
                  this.shiftForm.get('second_break_in_days_cover').setValue(this.break[i].breakInDays);
                  this.shiftForm.get('second_break_out').setValue(this.break[i].breakOut);
                  this.shiftForm.get('second_break_out_days_cover').setValue(this.break[i].breakOutDays);
                }
                if (i === 2) {
                  this.shiftForm.get('third_break_in').setValue(this.break[i].breakIn);
                  this.shiftForm.get('third_break_in_days_cover').setValue(this.break[i].breakInDays);
                  this.shiftForm.get('third_break_out').setValue(this.break[i].breakOut);
                  this.shiftForm.get('third_break_out_days_cover').setValue(this.break[i].breakOutDays);
                }
                else {
                  this.shiftForm.get('first_break_in').setValue(this.break[i].breakIn);
                  this.shiftForm.get('first_break_in_days_cover').setValue(this.break[i].breakInDays);
                  this.shiftForm.get('first_break_out').setValue(this.break[i].breakOut);
                  this.shiftForm.get('first_break_out_days_cover').setValue(this.break[i].breakOutDays);
                }

              }
              var obj = {
                shift_id: this.shiftID,
                shift_name: this.shiftForm.get('shiftName').value,
                grace_period: this.shiftForm.get('gracePeriod').value == "" || this.shiftForm.get('gracePeriod').value == null ? "0" : this.shiftForm.get('gracePeriod').value,
                description: this.shiftForm.get('description').value,
                is_flexi: this.shiftForm.get('isFlexi').value,
                time_in: this.shiftForm.get('timeIn').value,
                time_out: this.shiftForm.get('timeOut').value,
                time_out_days_cover: this.shiftForm.get('daysCover').value == "" || this.shiftForm.get('daysCover').value == null ? "0" : this.shiftForm.get('daysCover').value,
                total_working_hours: this.shiftForm.get('workingHrs').value,
                is_rd_mon: this.shiftForm.get('is_rd_mon').value,
                is_rd_tue: this.shiftForm.get('is_rd_tue').value,
                is_rd_wed: this.shiftForm.get('is_rd_wed').value,
                is_rd_thu: this.shiftForm.get('is_rd_thu').value,
                is_rd_fri: this.shiftForm.get('is_rd_fri').value,
                is_rd_sat: this.shiftForm.get('is_rd_sat').value,
                is_rd_sun: this.shiftForm.get('is_rd_sun').value,
                half_day_in: this.shiftForm.get('halfDayIn').value,
                half_day_in_days_cover: this.shiftForm.get('halfDayInDays').value == "" || this.shiftForm.get('halfDayInDays').value == null ? "0" : this.shiftForm.get('halfDayInDays').value,
                half_day_out: this.shiftForm.get('halfDayOut').value,
                half_day_out_days_cover: this.shiftForm.get('halfDayOutDays').value == "" || this.shiftForm.get('halfDayOutDays').value == null ? "0" : this.shiftForm.get('halfDayOutDays').value,
                night_dif_in: this.shiftForm.get('nightDiffIn').value,
                night_dif_in_days_cover: this.shiftForm.get('nightDiffInDays').value,
                night_dif_out: this.shiftForm.get('nightDiffOut').value,
                night_dif_out_days_cover: this.shiftForm.get('nightDiffOutDays').value,
                first_break_in: this.shiftForm.get('first_break_in').value,
                first_break_in_days_cover: this.shiftForm.get('first_break_in_days_cover').value,
                first_break_out: this.shiftForm.get('first_break_out').value,
                first_break_out_days_cover: this.shiftForm.get('first_break_out_days_cover').value,
                second_break_in: this.shiftForm.get('second_break_in').value,
                second_break_in_days_cover: this.shiftForm.get('second_break_in_days_cover').value,
                second_break_out: this.shiftForm.get('second_break_out').value,
                second_break_out_days_cover: this.shiftForm.get('second_break_out_days_cover').value,
                third_break_in: this.shiftForm.get('third_break_in').value,
                third_break_in_days_cover: this.shiftForm.get('third_break_in_days_cover').value,
                third_break_out: this.shiftForm.get('third_break_out').value,
                third_break_out_days_cover: this.shiftForm.get('third_break_out_days_cover').value,
                created_by: sessionStorage.getItem('u'),
                active: true,
                series_code: sessionStorage.getItem('sc'),
              }
              this.shiftcodeManagementService.shiftIU(obj).subscribe(data => {
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

  formValidation() {
    let flag = true;
    this.errShiftName = false;
    this.errDescription = false;
    this.errTimeIn = false;
    this.errTimeOut = false;
    this.errHalfDayIn = false;
    this.errHalfDayOut = false;
    if (this.shiftForm.get('shiftName').value == "" || this.shiftForm.get('shiftName').value == null) {
      flag = false
      this.errShiftName = true;
    }
    if (this.shiftForm.get('description').value == "" || this.shiftForm.get('description').value == null) {
      flag = false
      this.errDescription = true;
    }
    if (this.shiftForm.get('timeIn').value == "" || this.shiftForm.get('timeIn').value == null) {
      flag = false
      this.errTimeIn = true;
    }
    if (this.shiftForm.get('timeOut').value == "" || this.shiftForm.get('timeOut').value == null) {
      flag = false
      this.errTimeOut = true;
    }
    if (this.shiftForm.get('halfDayIn').value == "" || this.shiftForm.get('halfDayIn').value == null) {
      flag = false
      this.errHalfDayIn = true;
    }
    if (this.shiftForm.get('halfDayOut').value == "" || this.shiftForm.get('halfDayOut').value == null) {
      flag = false
      this.errHalfDayOut = true;
    }
    return flag;
  }

}
