
//Yeni bileşen oluşturur

import { Injectable } from '@angular/core';
import { ReceiptData } from './receipt.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptItemService {

  createReceiptItem(
    type: string,
    x: number,
    y: number,
    receiptData: ReceiptData,
    total: number
  ): any {
    return {
      id: Date.now() + Math.random(),
      type,

      text:
        type === 'Toplam'
          ? `Toplam: ${total.toFixed(2)} TL`
          : this.getPlaceholderText(
              type,
              receiptData,
              total
            ),

      imageUrl:
        type === 'Logo'
          ? receiptData.logo
          : '',

      logoWidth: 120,
      logoHeight: 80,

      products:
        type === 'Ürünler'
          ? [...receiptData.products]
          : undefined,

      fontSize: 16,
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

      width: 220,

      showSubtotal: true,
      showDiscount: true,
      showVat: true,

      x,
      y
    };
  }

  getPlaceholderText(
    type: string,
    receiptData: ReceiptData,
    total: number
  ): string {
    switch (type) {
      case 'Logo':
      case 'Çizgi':
        return '';

      case 'Restoran':
        return receiptData.restaurantName;

      case 'Tarih':
        return new Date().toLocaleString(
          'tr-TR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }
        );

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
        return `Toplam: ${total.toFixed(2)} TL`;

      case 'Dipnot':
        return receiptData.note;

      default:
        return 'Yeni Öğe';
    }
  }
}