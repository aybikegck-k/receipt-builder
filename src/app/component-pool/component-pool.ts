import { Component, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-component-pool',
  standalone: true,
  imports: [NgFor, DragDropModule],
  templateUrl: './component-pool.html',
  styleUrl: './component-pool.css',
})
export class ComponentPool {
  @Output() addComponentEvent = new EventEmitter<string>();

  components = [
    { type: 'logo', label: '🍽️ Logo' },
    { type: 'restoran', label: '🏪 Restoran Adı' },
    { type: 'tarih', label: '📅 Tarih' },
    { type: 'masa', label: '🪑 Masa' },
    { type: 'garson', label: '👨‍🍳 Garson' },
    { type: 'urunler', label: '🍕 Ürünler' },
    { type: 'toplam', label: '💰 Toplam' },
    { type: 'dipnot', label: '📝 Dipnot' },
  ];
}