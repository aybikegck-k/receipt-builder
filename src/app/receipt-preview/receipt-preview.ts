import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-receipt-preview',
  standalone: true,
  imports: [NgFor, DragDropModule],
  templateUrl: './receipt-preview.html',
  styleUrl: './receipt-preview.css',
})
export class ReceiptPreview {
  @Input() items: any[] = [];

  drop(event: CdkDragDrop<any[]>) {
  const type = event.item.data;

  const newItem = {
    id: Date.now(),
    type: type,
    text: this.getPlaceholderText(type)
  };

  this.items.push(newItem);
}

  getPlaceholderText(type: string): string {
    switch (type) {
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