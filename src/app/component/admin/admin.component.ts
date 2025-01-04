import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerDetails } from '../../interface/server-details';
import { AuthenticationService } from '../../service/authentication.service';
import { CronJob } from 'cron';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, CommonModule,
    ButtonModule, InputTextModule,
    DropdownModule, FormsModule,
    ToastModule, CardModule,
    ReactiveFormsModule, DialogModule,
    PasswordModule, ConfirmPopupModule],
  providers: [ConfirmationService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  servers: any[] = [];

  errorMessage: string = '';

  cols: any[] = [];

  roles: any[] = [];

  selectedRole: any;

  visible: boolean = false;
  visibleUser: boolean = false;
  hostName: any;
  serverProtocolType: any;
  serverIpAddress: any;
  serverPort: any;
  serviceName: any;
  serverStatus: any = 'true';

  userFirstName: any;
  userLastName: any;
  email: any;
  password: any;
  userRole: any;

  intervalId: any;

  constructor(private authorizationService: AuthorizationService, private confirmationService: ConfirmationService, private authenticationService: AuthenticationService, private messageService: MessageService, private router: Router) {
    this.roles = [
      { name: 'Admin', value: 'admin' },
      { name: 'User', value: 'user' }
    ];
  }

  ngOnInit(): void {
    this.getAllServersList();
    // Set the interval to call getAllServersList every 10 minutes (600,000 ms)
    this.intervalId = setInterval(() => {
      this.getAllServersList();
    }, 600000); // 600,000 ms = 10 minutes
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
    this.authorizationService.getAllServers().subscribe({
      next: (response: any) => {
        if (response.error) {
          this.messageService.add({ severity: 'error', summary: response.error, detail: response.statusMsg });
        } else {
          this.servers = response.data;
          if (this.servers) {
            let i = 1;
            for (let server of this.servers) {
              server.slNo = i++;
            }
          }
        }
      },
      error: (error) => {
        // Handle any unexpected errors (this shouldn't be triggered if `catchError` is in the service)
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'An unexpected error occurred.' });
        console.error('Error loading servers:', error);
      }
    });


  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onSave() {
    const serverDetails: ServerDetails = {
      hostName: this.hostName,
      serverProtocolType: this.serverProtocolType,
      serverIpAddress: this.serverIpAddress,
      serverPort: this.serverPort,
      serverStatus: this.serverStatus,
      serviceName: this.serviceName
    };
    this.authenticationService.saveServerDetails(serverDetails).subscribe({
      next: (response: any) => {
        if (response.status == 'Request Status Success ') {
          this.messageService.add({ severity: 'success', summary: response.status, detail: response.statusMsg });
        } else {
          this.messageService.add({ severity: 'error', summary: response.status, detail: response.statusMsg });
        }

      },
      error: (error) => {
        this.messageService.add({ severity: 'warn', summary: error.status, detail: error.statusMsg });
      }
    });
  }

  onClose() {
    this.visibleUser = false;
  }

  onDelete(recordId: string) {
    this.authenticationService.deleteServer(recordId).subscribe({
      next: (response: any) => {
        if (response.status == 'Request Status Success ') {
          this.messageService.add({ severity: 'success', summary: response.status, detail: response.statusMsg });
          this.servers = response.data;
          if (this.servers) {
            let i = 1;
            for (let server of this.servers) {
              server.slNo = i++;
            }
          }
        } else {
          this.messageService.add({ severity: 'error', summary: response.status, detail: response.statusMsg });
        }

      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: error.status, detail: error.statusMsg });
      }
    });
  }

  confirm(event: Event, recordId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.onDelete(recordId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  openPieChart() {
    this.router.navigateByUrl('/analysis')
  }

  registerUser() {
    this.visible = true;
  }

  onRegister() {
    const user = {
      userFirstName: this.userFirstName,
      userLastName: this.userLastName,
      email: this.email,
      password: this.password,
      userRole: this.selectedRole.value
    };

    this.authorizationService.registerUser(user).subscribe({
      next: (response) => {
        if (response.status == 'Request Status Success ') {
          this.messageService.add({ severity: 'success', summary: response.status, detail: response.statusMsg });
        }
        else {
          this.messageService.add({ severity: 'error', summary: response.status, detail: response.statusMsg });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: error.status, detail: error.statusMsg });
      }
    });
  }

  addUser() {
    this.visibleUser = true;
  }

}
