// JSON dosyasındaki adisyon verilerini okur.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// JSON içerisindeki her ürünün sahip olması gereken alanlar.
export interface Product {
  name: string;
  quantity: number;
  price: number;

  // Ürünün toplam tutarı POS sisteminden hazır gelir.
  total: number;
}

// JSON içerisindeki fiş verilerinin yapısı.
export interface ReceiptData {
  restaurantName: string;
  logo: string;
  tableNo: string;
  waiter: string;
  phone: string;
  address: string;
  note: string;

  // Ürün bilgileri.
  products: Product[];

  // Bütün tutarlar dışarıdan hazır olarak gelir.
  subTotal: number;
  discount: number;
  amountAfterDiscount: number;
  vatRate: number;
  vat: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {

  // JSON dosyasının yolu sabit tutulur.
  private readonly receiptDataUrl = '/data/receipt-data.json';

  // HttpClient, Angular Dependency Injection sistemiyle alınır.
  constructor(private http: HttpClient) {}

  // JSON dosyasındaki fiş verilerini getirir.
  getReceiptData(): Observable<ReceiptData> {
    return this.http.get<ReceiptData>(this.receiptDataUrl);
  }
}