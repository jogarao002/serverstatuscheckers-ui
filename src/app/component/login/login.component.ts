import { Component, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

}
