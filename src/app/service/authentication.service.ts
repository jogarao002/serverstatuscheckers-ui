import { Injectable } from '@angular/core';
import { Login } from '../interface/login';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient) { }

  loginUser(login: Login): Observable<any> {
    debugger
    return this.http.post("http://localhost:9010/server_details/login", login);
  }

  storeUserData(response: any): void {
    // Store the token and role
    debugger
    localStorage.setItem('authToken', response.data[0].token);
    localStorage.setItem('role', response.data[0].userRole); 
    localStorage.setItem('userName', response.data[0].userName) ;
  }

  getUserRole(): string | null {
    debugger
    return localStorage.getItem('role');
  }

  getAuthToken(): string | null {
    debugger
    return localStorage.getItem('authToken');
  }

  getuserName():string | null {
    return localStorage.getItem('userName');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
  }

}
