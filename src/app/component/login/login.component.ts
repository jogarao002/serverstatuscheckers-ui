import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../service/authentication.service';
import { Login } from '../../interface/login';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, FormsModule, PasswordModule, ButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginPassword: any;
  loginUserName: any;
  generatedCaptcha: any;
  userCaptcha: any;

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  captch() {
    let alpha = new Array(
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    );
    // Generate 6 random characters from the `alpha` array
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      let randomChar = alpha[Math.floor(Math.random() * alpha.length)];
      captcha += randomChar;
    }

    // Trim the final CAPTCHA string to remove the last space
    this.generatedCaptcha = captcha.trim();

  }

  onSubmit() {
    const loginData: Login = {
      loginUserName: this.loginUserName,
      loginPassword: this.loginPassword
    };

    this.authenticationService.loginUser(loginData).subscribe(
      (response: any) => {
        debugger
        console.log('Login successful', response);
        this.authenticationService.storeUserData(response);  // Store token and role
        const role = this.authenticationService.getUserRole();

        if (role === 'admin') {
          this.router.navigateByUrl('/admin');
        } else if (role === 'user') {
          this.router.navigateByUrl('/dashboard');
        }
      },
      (error: any) => {
        console.error('Login failed', error);
      }
    );
  }



  ngOnInit(): void {
    debugger
    this.captch();
    // setInterval(() => {
    //   this.authenticationService.autoLogout();
    // }, 2000);
  }

}
