import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

baseUrl = "https://novopharma.tn"
//baseUrl ="https://localhost:7156"
  constructor(private http: HttpClient) { }


  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/MbArticle`)
  }
  getAllArticles() {
    return this.http.get(`${this.baseUrl}/api/MbArticle/all-articles`)
  }
  getArticlesGift(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/MbArticle/gift`)
  }
  getArticlesAllGift(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/gift/all-gift`)
  }
  getGiftsByDermo(dermoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/gift/gifts-by-dermo/${dermoId}`);
  }
  deleteGiftAssignment(assignmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/gift/delete-assignment/${assignmentId}`);
  }
  getArticleById(ref: any) {
    return this.http.get(`${this.baseUrl}/api/MbArticle/${ref}`)
  }
  getFamilleArticle(ref: any) {
    return this.http.get(`${this.baseUrl}/api/MbArticle/famille/${ref}`)
  }
  saveDetailsArticle(detail: any, ref: any) {
    return this.http.post(`${this.baseUrl}/api/MbArticle/detail/${ref}`, detail)
  }
  updateDetailsArticle(detail: any, arRef: any) {
    return this.http.put(`${this.baseUrl}/api/MbArticle/detail/${arRef}`, detail)
  }
  updateRecArticle(detail: any, arRef: any) {
    return this.http.put(`${this.baseUrl}/api/MbArticle/recommande/${arRef}`, detail)
  }
  updateRecArticleMedSource(detail: any, arRef: any) {
    return this.http.put(`${this.baseUrl}/api/MbArticle/recommande/medsource/${arRef}`, detail)
  }
  
  getEntetesFactures(code_client: string) {
    return this.http.get(`${this.baseUrl}/api/MsAEntt/facture?code_client=${code_client}`)
  }
  getLigneByDop(dop: any) {
    return this.http.get(`${this.baseUrl}/api/MsAEntt/ligne/${dop}`)
  }
  getEntetesCommandes(code_client: string) {
    return this.http.get(`${this.baseUrl}/api/MsAEntt/commande?code_client=${code_client}`)
  }
  getEntetesCommandesMois(code_client: string) {
    return this.http.get(`${this.baseUrl}/api/MsAEntt/commande/mois?code_client=${code_client}`)
  }
  getEntetesCommandesTrimestre(code_client: string) {
    return this.http.get(`${this.baseUrl}/api/MsAEntt/commande/trimestre?code_client=${code_client}`)
  }
  getLignes() {
    return this.http.get(`${this.baseUrl}/api/Ligne`)
  }
  getEntete(id: number) {
    return this.http.get(`${this.baseUrl}/api/Ent/${id}`)
  }
  getLigne(id: number) {
    return this.http.get(`${this.baseUrl}/api/Ligne/${id}`)
  }
  getClients() {
    return this.http.get(`${this.baseUrl}/api/MsAClient`)
  }
  getClient(id: number) {
    return this.http.get(`${this.baseUrl}/api/Client/${id}`)
  }
  assignGift(data: { GiftRef: string, DermoId: number, QuantiteAttribuee: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Gift/assign-gift`, data);
  }
  assignGiftMedsource(data: { GiftRef: string, DermoId: number, QuantiteAttribuee: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Gift/assign-gift`, data);
  }
  getAllGiftOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Gift/gift-orders`);
  }

  /** 🔹 Récupérer les commandes d’un dermo spécifique */
  getGiftOrdersByDermo(dermoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Gift/gift-orders-by-dermo/${dermoId}`);
  }


  getGiftOrdersByDermo1(params: {
    nomDermo?: string;
    dateCommande: string;   // obligatoire
    pharmacieId: string;    // obligatoire
  }): Observable<any[]> {
  
    return this.http.get<any[]>(`${this.baseUrl}/api/Gift/gift-orders-by-dermo`, {
      params: {
        nomDermo: params.nomDermo || "",
        dateCommande: params.dateCommande,
        pharmacieId: params.pharmacieId
      }
    });
  }
  
  /** 🔹 Récupérer les commandes d’une pharmacie spécifique */
  getGiftOrdersByPharmacie(codePharmacie: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Gift/gift-orders-by-pharmacie/${codePharmacie}`);
  }
}
