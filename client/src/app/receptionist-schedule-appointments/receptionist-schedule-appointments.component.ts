import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-receptionist-schedule-appointments',
  templateUrl: './receptionist-schedule-appointments.component.html',
  styleUrls: ['./receptionist-schedule-appointments.component.scss'],
  providers: [DatePipe]
})
export class ReceptionistScheduleAppointmentsComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = {};
  responseMessage: any;
  isAdded: boolean = false;

  constructor(
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.itemForm = this.formBuilder.group({
      patientId: [this.formModel.patientId, [Validators.required]],
      doctorId: [this.formModel.doctorId, [Validators.required]],
      time: [this.formModel.time, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Additional setup can be done here if needed
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formattedTime = this.datePipe.transform(this.itemForm.controls['time'].value, 'yyyy-MM-dd HH:mm:ss');
      this.itemForm.controls['time'].setValue(formattedTime);
  
      this.httpService.ScheduleAppointmentByReceptionist(this.itemForm.value).subscribe({
        next: (data) => {
          this.itemForm.reset();
          this.responseMessage = 'Appointment saved successfully';
          this.isAdded = false;
        },
        error: (error) => {
          this.responseMessage = 'Error scheduling appointment';
          console.error('Error scheduling appointment', error);
        }
      });
    }
  }
  
}
