import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'  // Make sure the guard is provided at the root level
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    debugger

    // Check if the user is authenticated
    const isAuthenticated = this.authService.isAuthenticated();  // Ensure this checks the token presence or validity

    if (!isAuthenticated) {
      // If the user is not authenticated, redirect to login
      this.router.navigateByUrl('/login');
      return false;
    }

    // Get the role of the current user
    const role = this.authService.getUserRole();

    // Check if the user is authenticated and has a valid role
    if (role) {
      // If the route requires a specific role, check if it matches the user's role
      if (next.data['role'] && next.data['role'] !== role) {
        // If the user does not have the required role, redirect to dashboard
        return false;
      }
      // Allow access if the user has the correct role or no role requirement
      return true;
    }

    // If the user is not authenticated, redirect to login
    this.router.navigateByUrl('/login');
    return false;
  }
}
