import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';//htmldeki *ngFor çalışabilsin diye
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
//DragDropModule:Bu bütün sürükle-bırak sistemini Angular'a ekliyor. yani htmlde cdkDropList yazmammıkzı sağlıyor
@Component({
  selector: 'app-receipt-preview',
  standalone: true,
  imports: [NgFor, DragDropModule],
  templateUrl: './receipt-preview.html',
  styleUrl: './receipt-preview.css',
})
export class ReceiptPreview {
  @Input() items  /*App, bana gönderdiğin veriyi ben items ismiyle kullanacağım*/: any[] = [];
  @Input() fontSize: string = 'normal';

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
//input :Parent componentten veri almamızı sağlar.
//CdkDragDrop DragDropModule->Sistemi kuruyor.->CdkDragDrop->Bırakma anındaki bilgileri taşıyor.
//Yani kullanıcı bıraktığında Angular sana şöyle bir paket veriyor.->event
//İçinde hangi eleman nereden geldi nereye bırakıldı gibi bilgiler var.