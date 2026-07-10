import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
 imports: [NgIf, NgFor, FormsModule],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.css',
})
export class SettingsPanel {
  @Input() selectedItem: any = null; //app buraya seçili item ı gönderiri burası da sağ panelde gösteriri

  @Output() deleteItem = new EventEmitter<void>();
  addProduct() {
  if (!this.selectedItem) return;

  // products dizisi yoksa önce oluştur
  if (!Array.isArray(this.selectedItem.products)) {
    this.selectedItem.products = [];
  }

  this.selectedItem.products.push({
    name: 'Yeni Ürün',
    quantity: 1,
    price: 0
  });
}
getProductsTotal(): number {
  if (!this.selectedItem?.products) {
    return 0;
  }

  return this.selectedItem.products.reduce(
    (total: number, product: any) =>
      total + (product.quantity * product.price),
    0
  );
} //aşağıdakiyle aynı mantık ürünler dizisini tek bir toplam değere indirger
/*let total = 0;
for (const product of products) {
  total += product.quantity * product.price;
}
return total;*/

deleteProduct(index: number) {//belirli ürün satırını siler
  if (!this.selectedItem) return;

  this.selectedItem.products.splice(index, 1);
}

  selectLogoImage(event: Event) {
    if (!this.selectedItem) return;

    const input = event.target as HTMLInputElement;//Dosya seçme olayını oluşturan HTML inputunu alır.

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader(); //Tarayıcının dosya okuma aracını oluşturur.
//Bilgisayardaki görseli doğrudan Angular değişkenine koyamayız. Önce tarayıcının okuyabileceği bir formata çevirmeliyiz.

    reader.onload = () => {//dosya okuma bittiğinde bu fonk çalışır
      this.selectedItem.imageUrl = reader.result as string;//Okunan görselin sonucunu seçili logo bileşeninin imageUrl alanına koyar.

    };

    reader.readAsDataURL(file); //seçilen dosyayı Data URL biçiminde okumya başlar
  }

  deleteSelectedItem() { //kullanıcı sile basınca seetingspanel app e sil diyor
    this.deleteItem.emit();
  }
}


//emit dışarıya haber gönder demek yani burada yazdıgımız fonksion diyor ki app kullanıcı bir yazı boyutu seçti
//akış şu -> kullanıcı->SeyyingPanel->selectedFontSize("large")->emit("large")->App->changeFontSize("large")->fontSize="large"-->ReceiptPreview->yazılar büyür
//Silme işlemini SettingsPanel'de yapmadım çünkü receiptItems dizisi App componentinde tutuluyor. SettingsPanel sadece deleteItem eventi ile App'e haber veriyor. Asıl silme işlemi state'in bulunduğu App componentinde gerçekleştiriliyor.