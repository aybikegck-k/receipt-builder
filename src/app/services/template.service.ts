//Şablon kaydet/yükle
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  saveTemplate(receiptItems: any[]): void {
    const templateJson = JSON.stringify(
      receiptItems,
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

  readTemplateFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonText = reader.result as string;
          const loadedItems = JSON.parse(jsonText);

          if (!Array.isArray(loadedItems)) {
            reject(
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

      reader.readAsText(file);
    });
  }
}