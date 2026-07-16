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
  @Input() selectedItem: any = null;

  @Output() deleteItem = new EventEmitter<void>();

  selectLogoImage(event: Event): void {
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

  deleteSelectedItem(): void {
    this.deleteItem.emit();
  }
}