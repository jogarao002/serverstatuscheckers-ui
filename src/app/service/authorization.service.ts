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
    return this.http.get("http://localhost:9010/server_details/get_all");
  }
}
