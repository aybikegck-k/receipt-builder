import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgFor } from '@angular/common'; //htmldeki *ngFor çalışabilsin diye
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
  @Input() items /*App, bana gönderdiğin veriyi ben items ismiyle kullanacağım*/: any[] = [];

  @Input() selectedItem: any = null; //appden gelen seçli item i aldık

  @Output() itemSelected = new EventEmitter<any>(); //appe ıtem seçildi diye haber gönderdi

  @Output() componentDropped = new EventEmitter<any>();
  //soldan bırakılan component tipini App'e gönderir

  @ViewChild('editorReceipt') editorReceipt!: ElementRef;

  draggingItem: any = null;
  offsetX = 0;
  offsetY = 0;

  drop(event: CdkDragDrop<any[]>) {
    const type = event.item.data;

    this.componentDropped.emit({
      type: type
    });
  }

  selectItem(item: any) { //tıklanan item ı appe gönderecek fonksiyon
    this.itemSelected.emit(item);
    //kullanıcı item a tıklar-> selectedItem(item) çalışır->emit(item) ile appe eseçilen item gönderilir->app selectedItem değerini günceller
  }

  startMove(event: MouseEvent, item: any) {
    event.preventDefault();

    this.selectItem(item);
    this.draggingItem = item;

    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
  }

  @HostListener('document:mousemove', ['$event'])
  moveItem(event: MouseEvent) {
    if (!this.draggingItem) return;

    const area = this.editorReceipt.nativeElement.getBoundingClientRect();

    this.draggingItem.x = event.clientX - area.left - this.offsetX;
    this.draggingItem.y = event.clientY - area.top - this.offsetY;
  }

  @HostListener('document:mouseup')
  stopMove() {
    this.draggingItem = null;
  }
}

//input :Parent componentten veri almamızı sağlar.
//CdkDragDrop DragDropModule->Sistemi kuruyor.->CdkDragDrop->Bırakma anındaki bilgileri taşıyor.
//Yani kullanıcı bıraktığında Angular sana şöyle bir paket veriyor.->event
//İçinde hangi eleman nereden geldi nereye bırakıldı gibi bilgiler var.