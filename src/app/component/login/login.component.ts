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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, FormsModule, PasswordModule, ButtonModule, CommonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginPassword: any;
  loginUserName: any;
  generatedCaptcha: any;
  userCaptcha: any;

  constructor(private authenticationService: AuthenticationService, private router: Router, private messageService: MessageService) {

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
    this.getName();
  }

  getName(): void {
    setTimeout(() => {
      const canvas = document.getElementById(
        "textCanvas"
      ) as HTMLCanvasElement;
      const tCtx: any = canvas.getContext("2d");
      const imageElem: any = document.getElementById("image");
      const font = "600 50px Parisienne";
      tCtx.font = font;
      tCtx.canvas.width = tCtx.measureText(this.generatedCaptcha).width + 50;
      tCtx.canvas.height = 100;
      tCtx.font = font;
      tCtx.fillStyle = "#000";
      tCtx.fillText(this.generatedCaptcha, 20, 50);
      setTimeout(() => {
        imageElem.src = tCtx.canvas.toDataURL();
        imageElem.width = tCtx.measureText(this.generatedCaptcha).width + 50;
        imageElem.height = 50;
      }, 500);
    }, 500);
  }

  onSubmit() {
    const loginData: Login = {
      loginUserName: this.loginUserName,
      loginPassword: this.loginPassword
    };
    this.authenticationService.loginUser(loginData).subscribe({
      next: (response: any) => {
        if (response.status == 'Request Status Success ') {
          this.messageService.add({ severity: 'success', summary: response.status, detail: response.statusMsg });
          this.authenticationService.storeUserData(response);  // Store token and role
          const role = this.authenticationService.getUserRole();

          if (role === 'admin') {
            this.router.navigateByUrl('/admin');
          } else if (role === 'user') {
            this.router.navigateByUrl('/dashboard');
          }
        } else {
          this.messageService.add({ severity: 'warn', summary: response.status, detail: response.statusMsg });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'warn', summary: 'warning message', detail: 'We could not process your request' });
      }
    });
  }



  ngOnInit(): void {
    debugger
    this.captch();
    // setInterval(() => {
    //   this.authenticationService.autoLogout();
    // }, 2000);
  }

}
