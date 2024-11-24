import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { HttpClientModule  } from '@angular/common/http';  // Import provideHttpClient

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  servers: any[] = [];

  errorMessage: string = '';  
  
  constructor(private authorizationService : AuthorizationService) {}
  ngOnInit(): void {
    this.getAllServersList();
  }

  getAllServersList(){
    this.authorizationService.getAllServers().subscribe(
      (response) => {
        if (response.error) {
          // Handle the error response
          this.errorMessage = response.error;
        } else {
          // Handle successful response
          this.servers = response; // Assuming response contains the server data
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
