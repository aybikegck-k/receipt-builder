
//JSON verilerini okur

import { Injectable } from '@angular/core'; //bu sınf servis sınıfıdır bunu istediğin yerde kullanabilirsin
import { HttpClient } from '@angular/common/http'; //angular da istekleri yapıyor burada get isteği json u oku getir
import { Observable } from 'rxjs'; //veri hemen gelmeyebilir gelince haber vereceğim 

export interface Product { //her ürünün adı miktarı fiyatı olacak
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData { //fişimizdeki tüm elemanlar
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
@Injectable({ 
  providedIn: 'root',//bu servisi tüm dosyalar kullanabilir
})
export class ReceiptService { //bu sınıfın göre json dosyasını okumak
  private readonly receiptDataUrl =
  '/data/receipt-data.json'; //reodonly : bu değer bir kez verildikten sonra değiştirilemez json yolunu yanlıslıkla değiştirme riski ortadan kalkar
 
 constructor(private http: HttpClient) {} 
  //"Service içerisinde JSON dosyasına istek atabilmek için HttpClient kullandım. HttpClient nesnesini kendim oluşturmadım. Angular'ın Dependency Injection mekanizması ile constructor üzerinden aldım."
 getReceiptData(): Observable<ReceiptData> {
  return this.http.get<ReceiptData>(
    this.receiptDataUrl
  );
}
}
//constructor lar bir sınıf olusturuldugunda ilk çalısan yer
//Observable<ReceiptData>  fonksiyonun döndüreceği değer ReceiptData nesnesi getireceğim demek
//this.http construuctean alınnan HttpClient kullanılıyor
//.get() http get isteği gönderiliyor
//this.receiptDataUrl /data/receipt-data.json json dosyası okunuyor
//gelen verini ReceiptData yapsında olması bekleniyor
//sonuç bir observable olarak geri döndürülüyor
//observable veri hemen gelmezse veri hazır oldgunda düzgünce almamızı sağlar