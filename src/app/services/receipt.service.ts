
//JSON verilerini okur

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  restaurantName: string;
  logo: string;
  tableNo: string;
  waiter: string;
  phone: string;
  address: string;
  note: string;
  discount: number;
  vatRate: number;
  products: Product[];
}
@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private readonly receiptDataUrl =
  '/data/receipt-data.json';
 
 constructor(private http: HttpClient) {}  //"Service içerisinde JSON dosyasına istek atabilmek için HttpClient kullandım. HttpClient nesnesini kendim oluşturmadım. Angular'ın Dependency Injection mekanizması ile constructor üzerinden aldım."
 getReceiptData(): Observable<ReceiptData> {
  return this.http.get<ReceiptData>(
    this.receiptDataUrl
  );
}
}