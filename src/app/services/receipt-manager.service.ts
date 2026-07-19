
//Ürün, toplam ve silme işlemleri
import { Injectable } from '@angular/core';
import { ReceiptData } from './receipt.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptManagerService {

  updateProductsComponent(
    receiptItems: any[],
    receiptData: ReceiptData
  ): void {
    const productItem = receiptItems.find(
      item => item.type === 'Ürünler'
    );

    if (!productItem) {
      return;
    }

    productItem.products = [
      ...receiptData.products
    ];
  }

  updateTotalComponent(
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

    totalItem.showSubtotal ??= true;
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

    return receiptItems.filter(
      item => item.id !== selectedItem.id
    );
  }
}