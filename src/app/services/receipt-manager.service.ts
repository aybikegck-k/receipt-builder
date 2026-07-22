
//Ürün, toplam ve silme işlemleri
import { Injectable } from '@angular/core';
import { ReceiptData } from './receipt.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptManagerService {

  updateProductsComponent( //bu fonskiyon tasarım alanındaki tüm bileşenlerle jsondan geln fiş verilerini alıyor
    receiptItems: any[],
    receiptData: ReceiptData
  ): void {
    const productItem = receiptItems.find( //find diziyi sırayla dolaşır ve koşula uyan ilk elemanı getirir
      item => item.type === 'Ürünler'
    );

    if (!productItem) {
      return;
    }

    productItem.products = [
      ...receiptData.products //jsondaki ürünleri bulup tasarım alanındaki ürünler bileşenin içiine koyuyor
    ];
  }

  updateTotalComponent( //toplam bileşni ilk 0 olabilir daha sıbra calculate service gittikten sonra güncelleniyor yani burası ekranda görünen yazıyı güncelliyor
    receiptItems: any[],
    total: number
  ): void {
    const totalItem = receiptItems.find(
      item => item.type === 'Toplam'
    );

    if (!totalItem) {
      return;
    }

    totalItem.text =
      `Toplam: ${total.toFixed(2)} TL`;

    totalItem.showSubtotal ??= true; // bu özellik null veya undefined ise true yap daha önce değeri varsa değiştirme
    totalItem.showDiscount ??= true;
    totalItem.showVat ??= true;
  }

  deleteSelectedItem(
    receiptItems: any[],
    selectedItem: any
  ): any[] {
    if (!selectedItem) {
      return receiptItems;
    }

    return receiptItems.filter(  //filter mevcut diziyi değiştirmez yeni bir dizi üretir
      item => item.id !== selectedItem.id
    );
  }
}