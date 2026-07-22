// Yeni fiş bileşenlerini oluşturur.

import { Injectable } from '@angular/core';
import { ReceiptData } from './receipt.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptItemService {

  createReceiptItem(
    type: string,
    x: number,
    y: number,
    receiptData: ReceiptData
  ): any {
    return {
      id: Date.now() + Math.random(),
      type,

      // Bileşenin ilk metni JSON verilerine göre hazırlanır.
      text: this.getPlaceholderText(type, receiptData),

      // Logo bileşenine JSON'daki logo yolu aktarılır.
      imageUrl: type === 'Logo' ? receiptData.logo : '',

      logoWidth: 120,
      logoHeight: 80,

      // Ürünler bileşenine JSON'daki ürün listesi aktarılır.
      products:
        type === 'Ürünler'
          ? [...receiptData.products]
          : undefined,

      fontSize: 12,
      bold: false,
      italic: false,
      underline: false,

      align: 'left',
      fontFamily: 'serif',

      color: '#000000',
      backgroundColor: 'transparent',
      fullBackground: false,

      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid',

      lineStyle: 'solid',
      lineWidth: 1,

      width: 230,

      // Toplam bileşeninde gösterilecek hazır değerler.
      subTotal:
        type === 'Toplam'
          ? receiptData.subTotal
          : undefined,

      discount:
        type === 'Toplam'
          ? receiptData.discount
          : undefined,

      amountAfterDiscount:
        type === 'Toplam'
          ? receiptData.amountAfterDiscount
          : undefined,

      vatRate:
        type === 'Toplam'
          ? receiptData.vatRate
          : undefined,

      vat:
        type === 'Toplam'
          ? receiptData.vat
          : undefined,

      total:
        type === 'Toplam'
          ? receiptData.total
          : undefined,

      showSubtotal: true,
      showDiscount: true,
      showVat: true,

      x,
      y,
    };
  }

  getPlaceholderText(
    type: string,
    receiptData: ReceiptData
  ): string {
    switch (type) {
      case 'Logo':
      case 'Çizgi':
        return '';

      case 'Restoran':
        return receiptData.restaurantName;

      case 'Tarih':
        return new Date().toLocaleString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

      case 'Masa':
        return `Masa No: ${receiptData.tableNo}`;

      case 'Garson':
        return `Garson: ${receiptData.waiter}`;

      case 'Telefon':
        return receiptData.phone;

      case 'Adres':
        return receiptData.address;

      case 'Ürünler':
        return 'Ürün Listesi';

      case 'Toplam':
        return `Toplam: ${receiptData.total.toFixed(2)} TL`;

      case 'Dipnot':
        return receiptData.note;

      default:
        return 'Yeni Öğe';
    }
  }
}