import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  baseUrl = "https://novopharma.tn"
  // ="https://localhost:7156"

  constructor(private http: HttpClient) { }

  getComFact(dateArrivee?: string, createdBy?: string): Observable<any[]> {
    let url = `${this.baseUrl}/api/MsAClient/comfact`;
    const params: string[] = [];
  
    if (dateArrivee) params.push(`dateArrivee=${encodeURIComponent(dateArrivee)}`);
    if (createdBy) params.push(`dermato=${encodeURIComponent(createdBy)}`);
  
    if (params.length > 0) url += `?${params.join("&")}`;
  
    return this.http.get<any[]>(url);
  }
  

  AddCommande(commande: any, commercial: any) {
    return this.http.post(`${this.baseUrl}/api/MsAClient/commandeComm?commercial=${commercial}
    `, commande)
  }

  updateCommandeQte(id: any, qte: any, client: any) {
    return this.http.put(`${this.baseUrl}/api/MsAClient/${id}/update-quantity?newQuantityVendue=${qte}`, client)
  }

  UpdateEnabledAuthClient(id: any, client: any) {
    return this.http.put(`${this.baseUrl}/auth/update/${id}
    `, client)
  }

  uploadCommandImage(commandId: any, file: File, commercial: any) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/api/MsAClient/commandeComm/upload-image?commandId=${commandId}&commercial=${commercial}`, formData);
  }

  getCommandImage(commandId: any) {
    return this.http.get(`${this.baseUrl}/api/MsAClient/commande/image/${commandId}`);
  }
  getCommandeAll(date?: string): Observable<any[]> {
    let url = `${this.baseUrl}/api/MsAClient/commande`;
    if (date) {
      url += `?date=${date}`; // format yyyy-MM-dd
    }
    return this.http.get<any[]>(url);
  }
  
  getCommandPharm(pharmacieId: any) {
    return this.http.get(`${this.baseUrl}/api/MsAClient/commandeP/${pharmacieId}`);
  }
  getCommandArticle(articleId: any) {
    return this.http.get(`${this.baseUrl}/api/MsAClient/commandeP/${articleId}`);
  }
  getCommandPharmArt(pharmacieId: any, articleId: any) {
    return this.http.get(`${this.baseUrl}/api/MsAClient/commandeP/${pharmacieId}/${articleId}`);
  }
}
