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
  fontSize: string = 'normal';

  addComponent(type: string) { //Yeni bir bileşen nesnesi oluştur ve receiptItems dizisine ekle.
    const newItem = { //bu class gelen tipin özelliklerini belirler id , renk ,boyut vs
      id: Date.now(),
      type: type, //sürüklendyse onu kaydet logo geldiyse type:'logo'
      text: this.getPlaceholderText(type), //gelen tipe göre ekranda yazılacak yazıyı çağırıyoruz

    };
  
    this.receiptItems.push(newItem); //Yeni oluşturduğumuz bileşeni receiptItems dizisinin sonuna ekliyoruz.
  }
  changeFontSize(size: string) {
    this.fontSize = size;
  }
//placeholder yazısını belirleme işini ayrı bir fonksiyonda aldık böylece ekleme işiyle metin belirleme işi birbiirne karışmadı
  getPlaceholderText(type: string): string {
    switch(type) {
      case 'logo': return 'Logonuz Buraya Gelecek';
      case 'restoran': return 'Restoran Adınız';
      case 'tarih': return new Date().toLocaleDateString();
      case 'masa': return 'Masa No: 01';
      case 'garson': return 'Garson: İsim';
      case 'urunler': return 'Ürün Listesi';
      case 'toplam': return 'Toplam: 0.00 TL';
      case 'dipnot': return 'Afiyet olsun!';
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
