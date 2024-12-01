import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CronJob } from 'cron';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, CommonModule, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  servers: any[] = [];

  errorMessage: string = '';

  cols: any[] = [];

  constructor(private authorizationService: AuthorizationService, private messageService :MessageService) { }

  ngOnInit(): void {
    this.cronJob.start();
    this.cols = [
      { field: 'slNo', header: 'S.NO' },
      { field: 'hostName', header: 'Host Name' },
      { field: 'serverIpAddress', header: 'Server Ip Address' },
      { field: 'serverPort', header: 'Server Port' },
      { field: 'serviceName', header: 'Service Name' },
      { field: 'serverStatusName', header: 'Status' }
    ];

  }

  getAllServersList() {
    this.authorizationService.getAllServers().subscribe(
      (response) => {
        if (response.error) {
          this.messageService.add({summary: response.error, detail: response.statusMsg});
        } else {
          // Handle successful response
          this.servers = response.data; // Assuming response contains the server data
          if (this.servers) {
            let i = 1;
            for (let server of this.servers) {
              server.slNo = i++;
            }
          }
          console.log(this.servers);
        }
      },
      (error) => {
        // Handle any unexpected errors (this shouldn't be triggered if `catchError` is in the service)
        this.errorMessage = 'An unexpected error occurred.';
        console.error('Error loading servers:', error);
      }
    );
  }

  cronJob: CronJob = new CronJob('*/10 * * * *', () => {
    //console.log('Task is running every 2 minute');
    this.getAllServersList();
  });

}
