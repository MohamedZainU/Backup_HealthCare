import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
  providers: [DatePipe] 
})
export class ScheduleAppointmentComponent implements OnInit {
  doctorList: any=[];
  itemForm: FormGroup;
  formModel:any={};
  responseMessage:any;
  isAdded: boolean=false;
  today: string;
  constructor(public httpService:HttpService,private formBuilder: FormBuilder,private datePipe: DatePipe) {
    this.today = new Date().toISOString().split('T')[0];
    this.itemForm = this.formBuilder.group({
      patientId: [this.formModel.patientId,[ Validators.required]],
      doctorId: [this.formModel.doctorId,[ Validators.required]],
      time: [this.formModel.time,[ Validators.required], [this.timeValidator()]],
  });
   }

   timeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log("Front END: " + control.value);
      // Convert the datetime-local string to an ISO 8601 string
      let isoDateTime = control.value + ":00.000Z";
      return this.httpService.appointmentTimeExists(isoDateTime).pipe(
        map(isTaken => {
          if (isTaken) {
            return { negativeValue: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }  

  ngOnInit(): void {
    this.getPatients();
  }
  getPatients() {
    this.doctorList
    this.httpService.getDoctors().subscribe((data)=>{
      this.doctorList=data;
      console.log(this.doctorList);
    })
  }
  addAppointment(val:any)
  {  
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;
    this.itemForm.controls["doctorId"].setValue(val.id);
    this.itemForm.controls["patientId"].setValue(userId);
  
    this.isAdded=true;
  }
  onSubmit() {
    const selectedTime = new Date(this.itemForm.controls['time'].value);
    const now = new Date();
  
    if (selectedTime < now) {
      this.responseMessage = "Cannot book an appointment in the past.";
      return; // Prevent the form submission
    }
  
    const formattedTime = this.datePipe.transform(selectedTime, 'yyyy-MM-dd HH:mm:ss');
    this.itemForm.controls['time'].setValue(formattedTime);
  
    this.httpService.ScheduleAppointment(this.itemForm.value).subscribe((data) => {
      this.itemForm.reset();
      this.responseMessage = "Appointment saved successfully.";
      this.isAdded = false;
    });
  }

}