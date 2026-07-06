import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.css',
})
export class SettingsPanel {
  @Output() fontSizeChange = new EventEmitter<string>();
  selectFontSize(size: string){
    this.fontSizeChange.emit(size);
  }
}
//emit dışarıya haber gönder demek yani burada yazdıgımız fonksion diyor ki app kullanıcı bir yazı boyutu seçti
//akış şu -> kullanıcı->SeyyingPanel->selectedFontSize("large")->emit("large")->App->changeFontSize("large")->fontSize="large"-->ReceiptPreview->yazılar büyür

