import { Injectable } from '@angular/core';
import { Login } from '../interface/login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ServerDetails } from '../interface/server-details';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  loginUser(login: Login): Observable<any> {
    return this.http.post(`${environment.base_url}${environment.root_url}${environment.login}`, login);
  }

  saveServerDetails(serverDetails : ServerDetails){
    return this.http.post(`${environment.base_url}${environment.root_url}${environment.add}`, serverDetails);
  }

  deleteServer(recordId : any): Observable<any>{
    return this.http.delete(`${environment.base_url}${environment.root_url}${environment.remove}/${recordId}`);
  }

  // Check if the user is authenticated (token exists and is valid)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken'); // Or sessionStorage, depending on your choice
    return !!token;
  }

  storeUserData(response: any): void {
    // Store the token and role
    localStorage.setItem('authToken', response.data[0].token);
    localStorage.setItem('role', response.data[0].userRole);
    localStorage.setItem('userName', response.data[0].userName);
    localStorage.setItem('expirationToken', response.data[0].expirationToken);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getuserName(): string | null {
    return localStorage.getItem('userName');
  }

  getExpirationTime(): string | null {
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
