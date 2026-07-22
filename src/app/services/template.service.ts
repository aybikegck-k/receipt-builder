//Şablon kaydet/yükle
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  saveTemplate(receiptItems: any[]): void { //Tasarımı JSON dosyası olarak indirir.
    const templateJson = JSON.stringify(
      receiptItems, //bu fonksiyon dizideki tüm js dizisini filtrelemeden(null)json metnine dönüştür
      null,
      2
    );

    const blob = new Blob( //blob olusan json metnini tarayıcının dosya gibi kullanabileceği yapıya dönüştürüyor
      [templateJson], //dosyanın içersinde bulunacak içerik
      { type: 'application/json'  //bu verinin json dosyası oldugunu tarayıcıya bildirir

      }
    );

    const url = URL.createObjectURL(blob); //blob için geçiçi url olusturur
    const link = document.createElement('a'); //js ile html arasında bağlantı etiketi olusturuyor

    link.href = url; //olusturualn geçici dosya adresi bağlantıya atanıyor
    link.download = 'adisyon-sablonu.json'; //indirilecek dosyanın adı
    link.click();

    URL.revokeObjectURL(url); //olusturulan geçiçi url artık kullanılmayacagı için tarayıcı belleğinden temizleniyor
  }

  readTemplateFile(file: File): Promise<any[]> { //Kullanıcının seçtiği JSON dosyasını okur ve içindeki bileşenleri geri getirir.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();//kullanılan dosyaları okumamk için hazır araçtır
//kullanıvı adisyon-sablonu.json dosyasını seçtiğinde bu dosya readTemplateFile() fonksiyonuna gönderilir
//promise<any[]> fonksiyon sonucu hemen veremez dosyanın okunması zaman alabilir bu nedenle promise döndürülür
//bir işlem sonunda yalnızca bir kez başarılı bir sonuç veya hata verir
//promise in 2 temel sonucu vardır resolve:başarılı oldugunda reject: başarısız oldugunda
      reader.onload = () => { //okuma işlemi basarılı oldugunda bu fonksyon devreye girer
        try {
          const jsonText = reader.result as string;
          const loadedItems = JSON.parse(jsonText);
          //json metnini jsye çevirir

          if (!Array.isArray(loadedItems)) {
            reject( //dosya json olsa bile dizi değilse promise başarısız kabul ediliyor
              new Error(
                'Seçilen dosya geçerli bir şablon değil.'
              )
            );

            return;
          }

          resolve(loadedItems);
        } catch {
          reject(
            new Error(
              'JSON dosyası okunamadı veya dosya biçimi hatalı.'
            )
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            'Dosya okunurken bir hata oluştu.'
          )
        );
      };

      reader.readAsText(file); // gerçek okuma işlemini başlatır reaser olsuturuldu , başarılı olrusa ne yapılacagı hatalı olursa ne yapılacagı belirlendi bu satır çalsıtıgı an okunma başlar
      
    });
  }
}