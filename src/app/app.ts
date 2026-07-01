import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar'; 
import { ComponentPool } from './component-pool/component-pool';
import { ReceiptPreview } from './receipt-preview/receipt-preview';
import { SettingsPanel } from './settings-panel/settings-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, ComponentPool, ReceiptPreview, SettingsPanel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  receiptItems: any[] = [];

  addComponent(type: string) {
    const newItem = {
      id: Date.now(),
      type: type,
      text: this.getPlaceholderText(type)
    };

    this.receiptItems.push(newItem);
  }

  getPlaceholderText(type: string): string {
    switch(type) {
      case 'logo': return 'Logonuz Buraya Gelecek';
      case 'restoran': return 'Restoran Adınız';
      case 'tarih': return new Date().toLocaleDateString();
      case 'masa': return 'Masa No: 01';
      case 'garson': return 'Garson: İsim';
      case 'urunler': return 'Ürün Listesi';
      case 'toplam': return 'Toplam: 0.00 TL';
      case 'dipnot': return 'Afiyet olsun!';
      default: return 'Yeni Öğe';
    }
  }
}