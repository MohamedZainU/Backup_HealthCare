import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {
  appointmentList: any = [];
  paginatedList: any = []; // Items for the current page
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page

  constructor(public httpService: HttpService) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getAppointmentByDoctor(userId).subscribe((data) => {
      this.appointmentList = data;
      this.appointmentList.sort((a: any, b: any) => {
        return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
      });
      this.updatePaginatedList();
    });
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.appointmentList.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return; // Prevent navigation to invalid pages
    }
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get totalPages(): number {
    return Math.ceil(this.appointmentList.length / this.itemsPerPage);
  }

  viewDetails(appointment: any) {
    // Logic to view appointment details
    // This could involve navigating to a detailed view or opening a modal
    console.log('Viewing details for appointment:', appointment);
  }
}