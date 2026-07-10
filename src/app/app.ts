import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar'; 
import { ComponentPool } from './component-pool/component-pool';
import { ReceiptPreview } from './receipt-preview/receipt-preview';
import { SettingsPanel } from './settings-panel/settings-panel';

@Component({ //bundan sonra yazılacak claasın angular componenti olduğunu söylüyor
  selector: 'app-root', //<app-root></app-root> htmlde bunu gördüğünde App componentini çalıştır
  standalone: true,
  imports: [Navbar, ComponentPool, ReceiptPreview, SettingsPanel], //html içinde kullanılacak componentler
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { //adisyondaki bütün bileşenler ilk hali boş eklendikçe dolacak
  receiptItems: any[] = []; //
  
  selectedItem: any = null; //şuan hangi bileşen seçili basta bir şey seçili olmadıgı için null

  addComponent(event: any) { //sol panelden yeni bileşen eklenince çalışan fonksiyon
    const type = typeof event === 'string' ? event : event.type; //gelen verinin tipini alıyor


  const newItem = this.createReceiptItem( // yeni  bileşen oluşturuluyor
      type,
      20, //xin konumu yani soldan 20pc 
      this.receiptItems.length * 40 + 20// ynin konumu yani her yeni bileşen bir öncekinni altına gelsin diye
    );

    this.receiptItems.push(newItem); //yeni oluşan bileşeni adisyon listesine ekler

  }
  getTotal(): number { //ürünlerin toplam fiyatını hesaplayan fonksiyob

  const productItem = this.receiptItems.find(
    x => x.type === 'urunler' //adisyon içindeki ürünler bileşenini bulur
  );

  if (!productItem) return 0; //ürünler bileşeni yoksa sıfır döner

  return productItem.products.reduce( //ürün listesindeki fiyatları toplamak için reduce kullandık
    (total: number, product: any) =>
      total + product.quantity * product.price, //her ürün için adet*birim fiyatı toplama eklenir
    0
  );

}
  createReceiptItem(type: string, x: number, y: number) { //yeni adisyon bileşeni olusturan fonksiyon
    return {
      id: Date.now() + Math.random(),
      type: type,
      text: this.getPlaceholderText(type),
      imageUrl: '',
logoWidth: 120,
logoHeight: 80,
products: type === 'urunler' ? [] : undefined,
      

      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      fontFamily: 'serif',
      color: '#000000',
      backgroundColor: '#ffffff',
      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid',

      x: x,
      y: y
    };
  }

  selectItem(item: any) { //bu fonksiyon ReceiptPreview den seçili item bilgisini App'e kaydediyor.yani kullanıcı tasarım alanında tarihe tıklarsa app artık seçili item ın tarih oldugunu biliyor. ve
    //sağdaki panel hangi bileşeni düzenleyeceğini bilir
    this.selectedItem = item;
  }

  deleteSelectedItem() { //silme fonksiyonu
    if (!this.selectedItem) return;//seçili item yoksa bir şey yapma
 
    this.receiptItems = this.receiptItems.filter(
      item => item.id !== this.selectedItem.id
    );//Seçili item varsa receiptItems dizisinden onun id değerine sahip olan elemanı çıkarıyor. Sonra seçimi sıfırlıyor.

    this.selectedItem = null;
  }

  //placeholder yazısını belirleme işini ayrı bir fonksiyonda aldık böylece ekleme işiyle metin belirleme işi birbiirne karışmadı
  getPlaceholderText(type: string): string {
    switch(type) {
      case 'Logo': return 'Logonuz Buraya Gelecek';
      case 'Restoran': return 'Restoran Adınız';
      case 'Tarih': return new Date().toLocaleDateString();
      case 'Masa': return 'Masa No: 01';
      case 'Garson': return 'Garson: İsim';
      case 'Ürünler': return 'Ürün Listesi';
      case 'Toplam': return 'Toplam: 0.00 TL';
      case 'Dipnot': return 'Afiyet olsun!';
      default: return 'Yeni Öğe';
    }
  }
}

//her componentin bi görevi avr compoonenet-pool haber vermek , receipt-preview göstermek-setting-panel düzenlemek , app veriyi yönetmek
//"Componentler birbirlerinin iç durumunu (state) doğrudan değiştirmez.
//  Veri, ortak üst component tarafından yönetilir ve çocuk componentler Input/Output ile haberleşir.
//receiptıtems verisini app componentinde tuttuk çünkü bu veri birden fazla component tarafından kullanılıyo
//componentpool yeni bileşen eklemek istiyor receiptpreview bu veriyi ekranda gösteriyor settingpanels ise seçilen bileşenen özelliklerini değiştirecek.
//eğer bu veri bu componentlerin biririnin içinde olsaydı diğer componentler ona dpğrudan erişemeeycekti.
//state= uygulamanın o anki durumu
//Angular'da HTML değil, state yönetilir. HTML sadece state'in ekrandaki yansımasıdır.

// APP

//[]             []

//↓               ↓

//Receipt      Settings

//↑               ↑

//()             ()

//emit()       emit()

//app çocuklatra haber gönderiorsa html -> []->child->input    gösterilecek veya kullanılacak bilgi varsa input bir olay olunca output
//app çocuklardan haber alıyorsa output-> emit->html->app fonksiyonu