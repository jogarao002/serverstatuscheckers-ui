import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements OnInit {

  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    
  }

  getAllServers(): Observable<any> {
    return this.http.post("http://localhost:9010/server_details/get_all", {}).pipe(
      // Optional: Handle successful response
      catchError((error) => {
        console.error('Error occurred during the HTTP request:', error);
        
        // Return a fallback value or empty observable
        return of({ error: 'An error occurred while fetching server details' });
      })
    );
  }
}
