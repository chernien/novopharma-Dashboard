import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "https://novopharma.tn"
  //url = "https://localhost:7156"

  
  constructor(private http: HttpClient) { }

  Login(LoginRequest: any) {
    return this.http.post(`${this.url}/api/MsAClient/login
    `, LoginRequest)
  }

  GetAuthClients() :Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/api/MsAClient/auth
    `)
  }

  UpdateEnabledAuthClient(id: number, enabled: boolean): Observable<any> {
    return this.http.put(`${this.url}/api/MsAClient/UpdateEnabled/${id}`, enabled, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  GetDermos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/api/MsAClient/dermos`);
  }
  
  
  

  GetAuthClient(id: any) {
    return this.http.get(`${this.url}/auth/${id}
    `)
  }

  UpdatePassAuthClient(id: any, client: any) {
    return this.http.put(`${this.url}/auth/password/${id}
    `, client)
  }
  AddAuthClient(client: any) {
    return this.http.post(`${this.url}/api/MsAClient/dermo/add`, client)
  }
  
}
