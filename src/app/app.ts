import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Navbar } from './navbar/navbar';
import { ComponentPool } from './component-pool/component-pool';
import { ReceiptPreview } from './receipt-preview/receipt-preview';
import { SettingsPanel } from './settings-panel/settings-panel';


/* =========================================================
   ÜRÜN VERİ MODELİ
   ========================================================= */

interface Product {
  name: string;
  quantity: number;
  price: number;
}


/* =========================================================
   ADİSYON VERİ MODELİ
   receipt-data.json dosyasından gelecek alanlar
   ========================================================= */

interface ReceiptData {
  restaurantName: string;
  logo: string;
  tableNo: string;
  waiter: string;
  phone: string;
  address: string;
  note: string;

  discount: number;
  vatRate: number;

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


  /* =========================================================
     ŞABLON YÜKLEME INPUT'U
     ========================================================= */

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;


  /* =========================================================
     TASARIM ALANINDAKİ BİLEŞENLER
     ========================================================= */

  // Tasarım alanındaki bütün bileşenleri tutar.
  receiptItems: any[] = [];

  // Tasarım alanında seçilmiş olan bileşeni tutar.
  selectedItem: any = null;


  /* =========================================================
     JSON'DAN GELEN ADİSYON VERİLERİ
     ========================================================= */

  receiptData: ReceiptData = {
    restaurantName: '',
    logo: '',
    tableNo: '',
    waiter: '',
    phone: '',
    address: '',
    note: '',

    // İndirim tutarı, TL cinsinden.
    discount: 0,

    // KDV oranı, yüzde cinsinden.
    vatRate: 0,

    products: []
  };


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(private http: HttpClient) {
    this.loadReceiptData();
  }


  /* =========================================================
     ŞABLONU JSON DOSYASI OLARAK KAYDETME
     ========================================================= */

  saveTemplate(): void {
    const templateJson = JSON.stringify(
      this.receiptItems,
      null,
      2
    );

    const blob = new Blob(
      [templateJson],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'adisyon-sablonu.json';

    link.click();

    URL.revokeObjectURL(url);
  }


  /* =========================================================
     ŞABLON DOSYASI SEÇME EKRANINI AÇMA
     ========================================================= */

  loadTemplate(): void {
    this.fileInput.nativeElement.click();
  }


  /* =========================================================
     SEÇİLEN ŞABLON DOSYASINI OKUMA
     ========================================================= */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonText = reader.result as string;
        const loadedItems = JSON.parse(jsonText);

        if (!Array.isArray(loadedItems)) {
          alert('Seçilen dosya geçerli bir şablon değil.');
          return;
        }

        this.receiptItems = loadedItems;
        this.selectedItem = null;

        /*
          Ürünler bileşeni varsa güncel ürünleri
          receipt-data.json dosyasından tekrar alır.
        */
        this.updateProductsComponent();

        /*
          Toplam bileşeninin hesaplarını tekrar günceller.
        */
        this.updateTotalComponent();

        console.log(
          'Şablon başarıyla yüklendi:',
          this.receiptItems
        );

      } catch (error) {
        console.error(
          'JSON dosyası okunamadı:',
          error
        );

        alert(
          'JSON dosyası okunamadı veya dosya biçimi hatalı.'
        );
      }

      /*
        Aynı dosyanın tekrar seçilebilmesi için
        input temizlenir.
      */
      input.value = '';
    };

    reader.onerror = () => {
      console.error(
        'Dosya okunurken hata oluştu.'
      );

      alert(
        'Dosya okunurken bir hata oluştu.'
      );

      input.value = '';
    };

    reader.readAsText(file);
  }


  /* =========================================================
     RECEIPT-DATA.JSON VERİLERİNİ YÜKLEME
     ========================================================= */

  loadReceiptData(): void {
    this.http
      .get<ReceiptData>('/data/receipt-data.json')
      .subscribe({

        next: (data) => {
          this.receiptData = data;

          /*
            Eski JSON dosyasında discount veya vatRate
            bulunmazsa uygulamanın bozulmasını engeller.
          */
          this.receiptData.discount =
            Number(this.receiptData.discount) || 0;

          this.receiptData.vatRate =
            Number(this.receiptData.vatRate) || 0;

          /*
            Ürünler veya Toplam bileşeni daha önce
            eklenmişse güncellenir.
          */
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


  /* =========================================================
     ÜRÜNLER BİLEŞENİNİ GÜNCELLEME
     ========================================================= */

  updateProductsComponent(): void {
    const productItem = this.receiptItems.find(
      item => item.type === 'Ürünler'
    );

    if (productItem) {
      productItem.products = [
        ...this.receiptData.products
      ];
    }
  }


  /* =========================================================
     TOPLAM BİLEŞENİNİ GÜNCELLEME
     ========================================================= */

  updateTotalComponent(): void {
    const totalItem = this.receiptItems.find(
      item => item.type === 'Toplam'
    );

    if (totalItem) {
      /*
        Toplam bileşeni artık HTML tarafında blok şeklinde
        gösterilecek. Ancak text değerini de güncel tutuyoruz.
      */
      totalItem.text =
        `Toplam: ${this.getTotal().toFixed(2)} TL`;

      /*
        Daha önce kaydedilmiş eski şablonlarda bu alanlar
        olmayabilir. Bu yüzden varsayılan değer veriyoruz.
      */
      if (totalItem.showSubtotal === undefined) {
        totalItem.showSubtotal = true;
      }

      if (totalItem.showDiscount === undefined) {
        totalItem.showDiscount = true;
      }

      if (totalItem.showVat === undefined) {
        totalItem.showVat = true;
      }
    }
  }


  /* =========================================================
     SOL PANELDEN YENİ BİLEŞEN EKLEME
     ========================================================= */

  addComponent(event: any): void {
    const type =
      typeof event === 'string'
        ? event
        : event.type;

    const x = event.x ?? 20;

    const y =
      event.y ??
      this.receiptItems.length * 40 + 20;

    const newItem = this.createReceiptItem(
      type,
      x,
      y
    );

    this.receiptItems.push(newItem);

    this.updateTotalComponent();
  }


  /* =========================================================
     ARA TOPLAM HESABI
     Ürünlerin miktar × fiyat toplamını hesaplar.
     ========================================================= */

  getSubTotal(): number {
    const productItem = this.receiptItems.find(
      item => item.type === 'Ürünler'
    );

    /*
      Ürünler bileşeni henüz tasarıma eklenmediyse,
      doğrudan receipt-data.json ürünlerini kullanır.
    */
    const products: Product[] =
      productItem &&
      Array.isArray(productItem.products)
        ? productItem.products
        : this.receiptData.products;

    if (!Array.isArray(products)) {
      return 0;
    }

    return products.reduce(
      (
        total: number,
        product: Product
      ) => {
        const quantity =
          Number(product.quantity) || 0;

        const price =
          Number(product.price) || 0;

        return total + quantity * price;
      },
      0
    );
  }


  /* =========================================================
     İNDİRİM TUTARI
     receipt-data.json dosyasından gelir.
     ========================================================= */

  getDiscount(): number {
    const discount =
      Number(this.receiptData.discount) || 0;

    /*
      İndirim, ara toplamdan büyük olursa negatif toplam
      oluşmaması için ara toplamla sınırlandırılır.
    */
    return Math.min(
      Math.max(discount, 0),
      this.getSubTotal()
    );
  }


  /* =========================================================
     İNDİRİM SONRASI TUTAR
     KDV bu tutar üzerinden hesaplanır.
     ========================================================= */

  getAmountAfterDiscount(): number {
    return (
      this.getSubTotal() -
      this.getDiscount()
    );
  }


  /* =========================================================
     KDV HESABI
     KDV = İndirim sonrası tutar × KDV oranı / 100
     ========================================================= */

  getVat(): number {
    const vatRate =
      Number(this.receiptData.vatRate) || 0;

    const amountAfterDiscount =
      this.getAmountAfterDiscount();

    return (
      amountAfterDiscount *
      vatRate /
      100
    );
  }


  /* =========================================================
     GENEL TOPLAM HESABI
     Ara Toplam - İndirim + KDV
     ========================================================= */

  getTotal(): number {
    return (
      this.getSubTotal() -
      this.getDiscount() +
      this.getVat()
    );
  }


  /* =========================================================
     YENİ ADİSYON BİLEŞENİ OLUŞTURMA
     ========================================================= */

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


      /* -------------------------
         LOGO ÖZELLİKLERİ
         ------------------------- */

      imageUrl:
        type === 'Logo'
          ? this.receiptData.logo
          : '',

      logoWidth: 120,
      logoHeight: 80,


      /* -------------------------
         ÜRÜNLER ÖZELLİKLERİ
         ------------------------- */

      products:
        type === 'Ürünler'
          ? [...this.receiptData.products]
          : undefined,


      /* -------------------------
         YAZI ÖZELLİKLERİ
         ------------------------- */

      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,

      align: 'left',
      fontFamily: 'serif',

      color: '#000000',
      backgroundColor: 'transparent',

      fullBackground: false,


      /* -------------------------
         KENARLIK ÖZELLİKLERİ
         ------------------------- */

      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid',


      /* -------------------------
         ÇİZGİ ÖZELLİKLERİ
         ------------------------- */

      lineStyle: 'solid',
      lineWidth: 1,


      /* -------------------------
         BİLEŞEN GENİŞLİĞİ
         ------------------------- */

      width: 220,


      /* -------------------------
         TOPLAM BLOĞU ÖZELLİKLERİ
         ------------------------- */

      showSubtotal: true,
      showDiscount: true,
      showVat: true,


      /* -------------------------
         KONUM BİLGİLERİ
         ------------------------- */

      x: x,
      y: y

    };
  }


  /* =========================================================
     SEÇİLEN BİLEŞENİ KAYDETME
     ========================================================= */

  selectItem(item: any): void {
    this.selectedItem = item;
  }


  /* =========================================================
     SEÇİLEN BİLEŞENİ SİLME
     ========================================================= */

  deleteSelectedItem(): void {
    if (!this.selectedItem) {
      return;
    }

    this.receiptItems =
      this.receiptItems.filter(
        item =>
          item.id !== this.selectedItem.id
      );

    this.selectedItem = null;

    /*
      Ürünler bileşeni silinmişse Toplam bileşeni
      tekrar güncellenir.
    */
    this.updateTotalComponent();
  }


  /* =========================================================
     BİLEŞENLERİN BAŞLANGIÇ METİNLERİ
     ========================================================= */

  getPlaceholderText(type: string): string {
    switch (type) {

      case 'Logo':
        return '';

      case 'Restoran':
        return this.receiptData.restaurantName;

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
        return (
          `Masa No: ${this.receiptData.tableNo}`
        );

      case 'Garson':
        return (
          `Garson: ${this.receiptData.waiter}`
        );

      case 'Telefon':
        return this.receiptData.phone;

      case 'Adres':
        return this.receiptData.address;

      case 'Ürünler':
        return 'Ürün Listesi';

      case 'Çizgi':
        return '';

      case 'Toplam':
        return (
          `Toplam: ${this.getTotal().toFixed(2)} TL`
        );

      case 'Dipnot':
        return this.receiptData.note;

      default:
        return 'Yeni Öğe';
    }
  }

}