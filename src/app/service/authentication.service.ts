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
    return this.http.post("http://localhost:9010/server_details/login", login);
  }

}
