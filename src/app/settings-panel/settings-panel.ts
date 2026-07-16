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

 
  deleteSelectedItem(): void {
    this.deleteItem.emit();
  }
}