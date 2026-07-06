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
  @Output() addComponentEvent /*eventin adı */ = new EventEmitter<string>();//gönderilen şey string olacak

  components = [ //angularda ekran görnen veri ts de tutulur html de değil ts veriyi tutar html gösterir bir özellik eklemek istediğimide buraya ekleriz
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
//output-> dışarı çıkış. yani bu component dışarıya haber gönderecek
//yani componenetPool App e haber veriyor
//eventEmitter-> bu görünce aklına şu gelsin bu compenent dışarıya haber gönderecek
//@output bu yazıldığında bu diyor ki birazdan olusturacagım değişken normal değişken değil bu bir event
//event->uygulamada gerçekleşen ve başka bir kodun tepki vermesini sağlayan harekettir logo süürklendş event, logo bırakıldı event, butona tıklandı event gibi