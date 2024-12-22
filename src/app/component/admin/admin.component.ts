import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ServerDetails } from '../../interface/server-details';
import { AuthenticationService } from '../../service/authentication.service';
import { CronJob } from 'cron';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, InputTextModule, DropdownModule, FormsModule, ToastModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  servers: any[] = [];

  errorMessage: string = '';

  cols: any[] = [];

  hostName: any;
  serverProtocolType: any;
  serverIpAddress: any;
  serverPort: any;
  serviceName: any;
  serverStatus: any = 'true';

  constructor(private authorizationService: AuthorizationService, private authenticationService: AuthenticationService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.getAllServersList();
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
          this.servers = response.data;
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

  onSave() {
    const serverDetails: ServerDetails = {
      hostName: this.hostName,
      serverProtocolType: this.serverProtocolType,
      serverIpAddress: this.serverIpAddress,
      serverPort: this.serverPort,
      serverStatus: this.serverStatus,
      serviceName: this.serviceName
    };
    console.log(serverDetails);
    this.authenticationService.saveServerDetails(serverDetails).subscribe(
      (response: any) => {
        console.log(response);
        this.messageService.add({summary: response.status, detail: response.statusMsg});
      },
      (error: any) => {
        console.log(error);
        this.messageService.add({summary: error.status, detail: error.statusMsg});
      }
    );

  }

  onClose() {
    this.hostName = null;
    this.serverProtocolType = null;
    this.serverIpAddress = null;
    this.serverPort = null;
    this.serviceName = null;
  }

  onDelete(recordId: string) {
    debugger
    console.log('Deleting record with ID:', recordId);
    this.authenticationService.deleteServer(recordId).subscribe(
      (response: any) => {
        console.log("deleted successfully");
        this.messageService.add({summary: response.status, detail: response.statusMsg});
        this.servers = response.data;
        if (this.servers) {
          let i = 1;
          for (let server of this.servers) {
            server.slNo = i++;
          }
        }
      },
      (error: any) => {
        console.log("some error");
        this.messageService.add({summary: error.status, detail: error.statusMsg});
      }
    );
  }

  openPieChart(){
    this.router.navigateByUrl('/analysis')
  }

}
