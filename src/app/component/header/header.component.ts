import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';


interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentTime: string = '';

  formattedDate: string = '';

  private intervalId: any;

  username: any;

  constructor(private authenticationService: AuthenticationService, private router:Router) {
  }

  ngOnInit(): void {

    this.username = this.authenticationService.getuserName();
    // Set the current time and start updating it every second
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime(): void {
    const now = new Date();

    // Get hours, minutes, and seconds
    let hours: number = now.getHours();
    const minutes: number = now.getMinutes();
    const seconds: number = now.getSeconds();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes and seconds with leading zero if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    // Get the full date in MM/DD/YYYY format
    this.formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

    // Combine into a string with AM/PM
    this.currentTime = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

  }

  onDropdownChange(event: any): void {
    debugger
    const selectedValue = event.target.value;
    if (selectedValue === '1') {
      this.logout();
    }
  }
  

  logout(): void {
    debugger
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

}
