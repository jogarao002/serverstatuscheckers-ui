import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  servers: any[] = [];

  errorMessage: string = '';

  cols: any[] = [];

  constructor(private authorizationService: AuthorizationService) { }
  ngOnInit(): void {
    this.cols = [
      { field: 'serverName', header: 'serverName' },
      { field: 'serverIp', header: 'serverIp' },
      { field: 'serverPort', header: 'serverPort' },
      { field: 'serverStatus', header: 'admin' }
    ];

  }



  getAllServersList() {
    this.authorizationService.getAllServers().subscribe(
      (response) => {
        if (response.error) {
          // Handle the error response
          this.errorMessage = response.error;
        } else {
          // Handle successful response
          this.servers = response; // Assuming response contains the server data
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
}
