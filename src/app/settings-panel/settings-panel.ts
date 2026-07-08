import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.css',
})
export class SettingsPanel {
  @Input() selectedItem: any = null; //app buraya seçili item ı gönderiri burası da sağ panelde gösteriri

  @Output() deleteItem = new EventEmitter<void>();

  selectLogoImage(event: Event) {
    if (!this.selectedItem) return;

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedItem.imageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  deleteSelectedItem() { //kullanıcı sile basınca seetingspanel app e sil diyor
    this.deleteItem.emit();
  }
}

//emit dışarıya haber gönder demek yani burada yazdıgımız fonksion diyor ki app kullanıcı bir yazı boyutu seçti
//akış şu -> kullanıcı->SeyyingPanel->selectedFontSize("large")->emit("large")->App->changeFontSize("large")->fontSize="large"-->ReceiptPreview->yazılar büyür
//Silme işlemini SettingsPanel'de yapmadım çünkü receiptItems dizisi App componentinde tutuluyor. SettingsPanel sadece deleteItem eventi ile App'e haber veriyor. Asıl silme işlemi state'in bulunduğu App componentinde gerçekleştiriliyor.