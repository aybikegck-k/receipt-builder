import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Navbar } from './navbar/navbar';
import { ComponentPool } from './component-pool/component-pool';
import { ReceiptPreview } from './receipt-preview/receipt-preview';
import { SettingsPanel } from './settings-panel/settings-panel';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptData {
  restaurantName: string;
  logo: string;
  tableNo: string;
  waiter: string;
  note: string;
  products: Product[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    ComponentPool,
    ReceiptPreview,
    SettingsPanel
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Tasarım alanındaki bütün bileşenleri tutar.
  receiptItems: any[] = [];

  // Tasarım alanında seçili olan bileşeni tutar.
  selectedItem: any = null;

  // JSON dosyasından gelen bütün adisyon verileri.
  receiptData: ReceiptData = {
    restaurantName: '',
    logo: '',
    tableNo: '',
    waiter: '',
    note: '',
    products: []
  };

  constructor(private http: HttpClient) {
    this.loadReceiptData();
  }

  // Bütün adisyon verilerini tek JSON dosyasından okur.
  loadReceiptData(): void {
    this.http
      .get<ReceiptData>('/data/receipt-data.json')
      .subscribe({
        next: (data) => {
          this.receiptData = data;

          // Ürünler veya toplam bileşeni daha önce eklenmişse günceller.
          this.updateProductsComponent();
          this.updateTotalComponent();

          console.log(
            'Adisyon verileri JSON dosyasından yüklendi:',
            this.receiptData
          );
        },

        error: (error) => {
          console.error(
            'Adisyon verileri JSON dosyasından yüklenemedi:',
            error
          );
        }
      });
  }

  // Tasarım alanında Ürünler bileşeni varsa JSON ürünlerini ona aktarır.
  updateProductsComponent(): void {
    const productItem = this.receiptItems.find(
      item => item.type === 'Ürünler'
    );

    if (productItem) {
      productItem.products = [...this.receiptData.products];
    }
  }

  // Tasarım alanında Toplam bileşeni varsa toplam yazısını günceller.
  updateTotalComponent(): void {
    const totalItem = this.receiptItems.find(
      item => item.type === 'Toplam'
    );

    if (totalItem) {
      totalItem.text = `Toplam: ${this.getTotal().toFixed(2)} TL`;
    }
  }

 // Sol panelden yeni bir bileşen eklenince çalışır.
addComponent(event: any): void {
  const type =
    typeof event === 'string'
      ? event
      : event.type;

  const x = event.x ?? 20;
  const y = event.y ?? this.receiptItems.length * 40 + 20;

  const newItem = this.createReceiptItem(
    type,
    x,
    y
  );

  this.receiptItems.push(newItem);

  this.updateTotalComponent();
}

  // Ürünlerin toplam fiyatını hesaplar.
  getTotal(): number {
    const productItem = this.receiptItems.find(
      item => item.type === 'Ürünler'
    );

    if (
      !productItem ||
      !Array.isArray(productItem.products)
    ) {
      return 0;
    }

    return productItem.products.reduce(
      (total: number, product: Product) => {
        const quantity = Number(product.quantity) || 0;
        const price = Number(product.price) || 0;

        return total + quantity * price;
      },
      0
    );
  }

  // Yeni adisyon bileşeninin özelliklerini oluşturur.
  createReceiptItem(
    type: string,
    x: number,
    y: number
  ) {
    return {
      id: Date.now() + Math.random(),
      type: type,

      text:
        type === 'Toplam'
          ? `Toplam: ${this.getTotal().toFixed(2)} TL`
          : this.getPlaceholderText(type),

      // Logo bileşeni eklenirse JSON'daki logo yolu kullanılır.
      imageUrl:
        type === 'Logo'
          ? this.receiptData.logo
          : '',

      logoWidth: 120,
      logoHeight: 80,

      // Ürünler bileşeni eklenirse JSON'daki ürünler aktarılır.
      products:
        type === 'Ürünler'
          ? [...this.receiptData.products]
          : undefined,

      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      fontFamily: 'serif',
      color: '#000000',
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid',

      x: x,
      y: y
    };
  }

  // ReceiptPreview tarafından gönderilen seçili bileşeni kaydeder.
  selectItem(item: any): void {
    this.selectedItem = item;
  }

  // Seçili bileşeni tasarım alanından siler.
  deleteSelectedItem(): void {
    if (!this.selectedItem) {
      return;
    }

    this.receiptItems = this.receiptItems.filter(
      item => item.id !== this.selectedItem.id
    );

    this.selectedItem = null;

    // Ürünler silinmişse toplamı sıfırlar.
    this.updateTotalComponent();
  }

  // Her bileşenin göstereceği metni belirler.
  getPlaceholderText(type: string): string {
    switch (type) {
      case 'Logo':
        return '';

      case 'Restoran':
        return this.receiptData.restaurantName;

      case 'Tarih':
        return new Date().toLocaleString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

      case 'Masa':
        return `Masa No: ${this.receiptData.tableNo}`;

      case 'Garson':
        return `Garson: ${this.receiptData.waiter}`;

      case 'Ürünler':
        return 'Ürün Listesi';

      case 'Toplam':
        return `Toplam: ${this.getTotal().toFixed(2)} TL`;

      case 'Dipnot':
        return this.receiptData.note;

      default:
        return 'Yeni Öğe';
    }
  }
}