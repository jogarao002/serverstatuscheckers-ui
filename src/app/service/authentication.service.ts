import { Injectable } from '@angular/core';
import { Login } from '../interface/login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ServerDetails } from '../interface/server-details';
Router


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  loginUser(login: Login): Observable<any> {
    debugger
    return this.http.post("http://localhost:9010/server_details/login", login);
  }

  saveServerDetails(serverDetails : ServerDetails){
    return this.http.post("http://localhost:9010/server_details/add", serverDetails);
  }

  deleteServer(recordId : any){
    return this.http.delete("http://localhost:9010/server_details/remove", recordId);
  }

  // Check if the user is authenticated (token exists and is valid)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken'); // Or sessionStorage, depending on your choice
    return !!token;
  }

  storeUserData(response: any): void {
    // Store the token and role
    debugger
    localStorage.setItem('authToken', response.data[0].token);
    localStorage.setItem('role', response.data[0].userRole);
    localStorage.setItem('userName', response.data[0].userName);
    localStorage.setItem('expirationToken', response.data[0].expirationToken);
  }

  getUserRole(): string | null {
    debugger
    return localStorage.getItem('role');
  }

  getAuthToken(): string | null {
    debugger
    return localStorage.getItem('authToken');
  }

  getuserName(): string | null {
    return localStorage.getItem('userName');
  }

  getExpirationTime(): string | null {
    debugger
    const expToken = localStorage.getItem('expirationToken');

    if (!expToken) {
      return null;
    }

    try {
      const decoded: any = jwtDecode(expToken);

      const expTime = decoded.exp;

      if (!expTime) {
        return null;
      }

      return new Date(expTime * 1000).toISOString(); // Convert Unix timestamp to ISO date string
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  autoLogout() {
    const expirationTime = this.getExpirationTime();
    if (expirationTime) {
      const currentTime = new Date().toISOString();

      // If current time is greater than or equal to expiration time, log out
      if (currentTime >= expirationTime) {
        this.logout();  // Remove tokens and user data
        alert('Session expired, please log in again.');
        this.router.navigateByUrl('/login');  // Redirect to login page
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('expirationToken');
  }

}
