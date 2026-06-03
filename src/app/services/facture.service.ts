import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  url = "https://novopharma.tn"

  constructor(private http: HttpClient) { }

  Login(LoginRequest: any) {
    return this.http.post(`${this.url}/api/Facture
    `, LoginRequest)
  }

  GetAllFactures():Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/api/Facture
    `)
  }

  GetFActure(id: any) {
    return this.http.get(`${this.url}/api/Facture/${id}
    `)
  }
}
