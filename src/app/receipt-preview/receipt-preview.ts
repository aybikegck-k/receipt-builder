import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-receipt-preview',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './receipt-preview.html',
  styleUrl: './receipt-preview.css',
})
export class ReceiptPreview {
  @Input() items: any[] = []; //App, receiptItems dizisini ReceiptPreviewe gönderiyor
  @Input() selectedItem: any = null; //appde hangi bileşenin seçili oldugunu receiptpreviewe gönderir

  @Output() itemSelected = new EventEmitter<any>();//Kullanıcı tasarım alanındaki bir bileşene tıklayınca, tıklanan bileşeni App’e gönderir.
  @Output() componentDropped = new EventEmitter<any>();//Sol panelden bir bileşen tasarım alanına bırakıldığında App’e haber verir.

  @ViewChild('editorReceipt') editorReceipt!: ElementRef;

  draggingItem: any = null; //şu anda hangi bileşenin taşındıgını tutar
  offsetX = 0; //bunlar sayesinde bileşen tutuldugu noktadan hareket eder
  offsetY = 0;//kullanılmazsa kaymaalr olur

  allowDrop(event: DragEvent) {
    event.preventDefault();//bazen tarayıcı bir elementi baska alanın üzerine bırakmaya izin vermiyor
  }//bu varsayılan bu davranısı engeller ve bırakılabilir hale getirir
getTotal(): number {
  const productItem = this.items.find(
    item => item.type === 'Ürünler'
  );

  if (!productItem || !Array.isArray(productItem.products)) {
    return 0;
  }

  return productItem.products.reduce(
    (total: number, product: any) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;

      return total + quantity * price;
    },
    0
  );
}

  dropComponent(event: DragEvent) { //Kullanıcı sol panelden sürüklediği bileşeni tasarım alanına bıraktığında çalışır.
    event.preventDefault(); //Tarayıcının varsayılan bırakma davranışını engeller.

    const type = event.dataTransfer?.getData('componentType');
//görünmez çantadaki bilgi bırakıldıgı zaman getData(compenentType) ile çantadak bilgiyi geri alıyoruz
    if (!type) return; //sürüklenen tür bilgisi bulunamadıysa bu 

    this.componentDropped.emit({
      type: type//app e type: logo gönderdi diyelim app bunu alıp addComponent(event) fonksiyonunu çalıştırır 
    });
  }

  selectItem(item: any) {//Kullanıcı tasarım alanındaki bir bileşene tıklayınca çalışır.
    this.itemSelected.emit(item); //tıklanan nesneyi emit(item) ile appe gönderir
  }

  startMove(event: MouseEvent, item: any) {//Kullanıcı tasarım alanındaki bir bileşene fareyle bastığında çalışır.
    event.preventDefault();//Kullanıcı tasarım alanındaki bir bileşene fareyle bastığında çalışır.

    this.selectItem(item);//Taşımaya başladığımız bileşeni aynı zamanda seçili hale getirir.
//Yani kullanıcı bir bileşeni tutunca sağ panel de o bileşenin ayarlarını gösterir.
    this.draggingItem = item;//Şu anda hareket ettirilen bileşeni kaydeder.

    const itemElement = event.currentTarget as HTMLElement;
    const rect = itemElement.getBoundingClientRect();//Tutulan bileşenin ekrandaki konumunu ve boyutunu alır.

    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
  }
 

  @HostListener('document:mousemove', ['$event']) //fare hareketlerini kontrol eder Bu kontrol olmasaydı kullanıcı sadece fareyi sayfada gezdirirken bile kod sürekli item taşımaya çalışırdı.
  moveItem(event: MouseEvent) {
    if (!this.draggingItem) return;

    const area = this.editorReceipt.nativeElement.getBoundingClientRect();

    this.draggingItem.x = event.clientX - area.left - this.offsetX;
    this.draggingItem.y = event.clientY - area.top - this.offsetY;
  }

  @HostListener('document:mouseup')
  stopMove() {
    this.draggingItem = null;
  } //taşıma işlemini bitirir sol tuşu buraktıgın an çalışır
}

//input parent compenentten child compenente veri almak için kullanılır
//output child compenentten parent compenente haber göndermek için kullanılır.
//dragover:sürüklenen şey alan üzerinde geziyor
//drop: kullanıcı fareyi bıraktı