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

  @Output() addComponentEvent /*eventin adı */ = new EventEmitter<string>();
  //gönderilen şey string olacak

  components = [
    //angularda ekranda görünen veri ts de tutulur html de değil
    //ts veriyi tutar html gösterir
    //bir özellik eklemek istediğimde buraya ekleriz

    { type: 'logo', label: '🍽️ Logo' },
    { type: 'restoran', label: '🏪 Restoran Adı' },
    { type: 'tarih', label: '📅 Tarih' },
    { type: 'masa', label: '🪑 Masa' },
    { type: 'garson', label: '👨‍🍳 Garson' },
    { type: 'urunler', label: '🍕 Ürünler' },
    { type: 'toplam', label: '💰 Toplam' },
    { type: 'dipnot', label: '📝 Dipnot' },
  ];

  addComponent(type: string) {
    this.addComponentEvent.emit(type);
  }
}

//output-> dışarı çıkış. yani bu component dışarıya haber gönderecek
//yani ComponentPool App'e haber veriyor
//EventEmitter-> bunu görünce aklına şu gelsin:
//"Bu component dışarıya haber gönderecek."
//@Output yazıldığında oluşturacağımız değişken normal değişken değil,
//bir event oluyor.
//event-> uygulamada gerçekleşen ve başka bir kodun tepki vermesini sağlayan harekettir.
//Logo sürüklendi event, logo bırakıldı event, butona tıklandı event gibi.