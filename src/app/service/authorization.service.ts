import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {

  }

  getAllServers(): Observable<any> {
    return this.http.get(`${environment.base_url}${environment.root_url}${environment.get_all}`);
  }

  registerUser(user:any): Observable<any> {
    return this.http.post(`${environment.base_url}${environment.root_url}${environment.register}`, user);
  }
}
