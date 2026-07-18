import { Component, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-component-pool',
  standalone: true,
  imports: [NgFor],
  templateUrl: './component-pool.html',
  styleUrl: './component-pool.css',
})
export class ComponentPool {

components = [
  { type: 'Logo', label: '🍽️ Logo' },
  { type: 'Restoran', label: '🏪 Restoran Adı' },
  { type: 'Telefon', label: '📞 Telefon' },
  { type: 'Adres', label: '📍 Adres' },
  { type: 'Tarih', label: '📅 Tarih' },
  { type: 'Masa', label: '🪑 Masa' },
  { type: 'Garson', label: '👨‍🍳 Garson' },
  { type: 'Ürünler', label: '🍕 Ürünler' },
  { type: 'Çizgi', label: '➖ Çizgi' },
  { type: 'Toplam', label: '💰 Toplam' },
  { type: 'Dipnot', label: '📝 Dipnot' },
];

  dragStart(event: DragEvent, type: string) {
    event.dataTransfer?.setData('componentType', type);
  } //event ->sürükleme olayı ->dataTransfer süürklerken elindeki görünmez çanta bu çantanın içine bilgi koymak lazım
  //setData() çantanın içine veri koy demek

 
}