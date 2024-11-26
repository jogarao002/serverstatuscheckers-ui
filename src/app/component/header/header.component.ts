import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';



interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe, DropdownModule, FormsModule, RouterOutlet, FormGroup],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentTime: string = '';

  formattedDate: string = '';

  private intervalId: any;

  cities: City[] | undefined;

  formGroup: FormGroup | undefined;

  ngOnInit(): void {
    // Set the current time and start updating it every second
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.formGroup = new FormGroup({
      selectedCity: new FormControl<City | null>(null)
    });
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

}
