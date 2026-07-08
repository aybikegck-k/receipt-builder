import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-receipt-preview',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './receipt-preview.html',
  styleUrl: './receipt-preview.css',
})
export class ReceiptPreview {
  @Input() items: any[] = [];
  @Input() selectedItem: any = null;

  @Output() itemSelected = new EventEmitter<any>();
  @Output() componentDropped = new EventEmitter<any>();

  @ViewChild('editorReceipt') editorReceipt!: ElementRef;

  draggingItem: any = null;
  offsetX = 0;
  offsetY = 0;

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }
  getTotal() {
  const productItem = this.items.find(
    item => item.type === 'urunler'
  );

  if (!productItem) return 0;

  return productItem.products.reduce(
    (total: number, product: any) =>
      total + product.quantity * product.price,
    0
  );
}

  dropComponent(event: DragEvent) {
    event.preventDefault();

    const type = event.dataTransfer?.getData('componentType');

    if (!type) return;

    this.componentDropped.emit({
      type: type
    });
  }

  selectItem(item: any) {
    this.itemSelected.emit(item);
  }

  startMove(event: MouseEvent, item: any) {
    event.preventDefault();

    this.selectItem(item);
    this.draggingItem = item;

    const itemElement = event.currentTarget as HTMLElement;
    const rect = itemElement.getBoundingClientRect();

    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
  }
  selectLogoImage(event: Event, item: any) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    item.imageUrl = reader.result as string;
  };

  reader.readAsDataURL(file);
}

  @HostListener('document:mousemove', ['$event'])
  moveItem(event: MouseEvent) {
    if (!this.draggingItem) return;

    const area = this.editorReceipt.nativeElement.getBoundingClientRect();

    this.draggingItem.x = event.clientX - area.left - this.offsetX;
    this.draggingItem.y = event.clientY - area.top - this.offsetY;
  }

  @HostListener('document:mouseup')
  stopMove() {
    this.draggingItem = null;
  }
}