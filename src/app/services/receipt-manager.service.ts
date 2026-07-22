// Ürün, toplam ve silme işlemlerini yönetir.

import { Injectable } from '@angular/core';
import { ReceiptData } from './receipt.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptManagerService {

  // JSON'dan gelen ürünleri tasarım alanındaki Ürünler bileşenine aktarır.
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

  // JSON'dan gelen hazır toplam bilgilerini Toplam bileşenine aktarır.
  updateTotalComponent(
    receiptItems: any[],
    receiptData: ReceiptData
  ): void {
    const totalItem = receiptItems.find(
      item => item.type === 'Toplam'
    );

    if (!totalItem) {
      return;
    }

    // Genel toplam hazır olarak JSON'dan gelir.
    totalItem.text =
      `Toplam: ${receiptData.total.toFixed(2)} TL`;

    // Diğer tutarlar da hesaplanmadan doğrudan JSON'dan alınır.
    totalItem.subTotal = receiptData.subTotal;
    totalItem.discount = receiptData.discount;
    totalItem.amountAfterDiscount = receiptData.amountAfterDiscount;
    totalItem.vatRate = receiptData.vatRate;
    totalItem.vat = receiptData.vat;
    totalItem.total = receiptData.total;

    // Bu alanlar daha önce ayarlanmadıysa görünür yapılır.
    totalItem.showSubtotal ??= true;
    totalItem.showDiscount ??= true;
    totalItem.showVat ??= true;
  }

  // Seçili bileşeni receiptItems dizisinden çıkarır.
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