import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Product, ReceiptData, ReceiptService } from './services/receipt.service';

import { CalculationService } from './services/calculation.service';
import { TemplateService } from './services/template.service';
import { ReceiptItemService } from './services/receipt-item.service';
import { ReceiptManagerService } from './services/receipt-manager.service';

import { Navbar } from './navbar/navbar';
import { ComponentPool } from './component-pool/component-pool';
import { ReceiptPreview } from './receipt-preview/receipt-preview';
import { SettingsPanel } from './settings-panel/settings-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, ComponentPool, ReceiptPreview, SettingsPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  receiptItems: any[] = [];
  selectedItem: any = null;

  receiptData: ReceiptData = {
    restaurantName: '',
    logo: '',
    tableNo: '',
    waiter: '',
    phone: '',
    address: '',
    note: '',
    discount: 0,
    vatRate: 0,
    products: [],
  };

  constructor(
    //angular servisleri kendisi olusturup constructor içine gönderiyor
    private receiptService: ReceiptService,
    private calculationService: CalculationService,
    private templateService: TemplateService,
    private receiptItemService: ReceiptItemService,
    private receiptManagerService: ReceiptManagerService,
  ) {}

  ngOnInit(): void {
    //uygulama açılır açılmaz json verisi okunuyor
    this.loadReceiptData();
  }

  saveTemplate(): void {
    //tamplateService diyorki bileşenler dizisini kaydet geri kalan işlemler o servisin içidnek aydedilir
    this.templateService.saveTemplate(this.receiptItems);
  }

  loadTemplate(): void {
    this.fileInput.nativeElement.click(); //gerçek dosya seçme penceresi
  }

  async onFileSelected(event: Event): Promise<void> {
    //bu fonksiyon kullanıcı bir json şablon dosyası seçtiğinde çalışır
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      //dosya okuma sırasında ataları yakalamak için
      this.receiptItems = await this.templateService.readTemplateFile(file);

      this.selectedItem = null; //temizleme

      this.updateProductsComponent();
      this.updateTotalComponent();

      console.log('Şablon başarıyla yüklendi:', this.receiptItems);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Şablon yüklenirken bir hata oluştu.';

      console.error('Şablon yüklenemedi:', error);

      alert(message);
    } finally {
      input.value = ''; //dosya seçimini sıfırlıyor
    }
  }
  loadReceiptData(): void {
    this.receiptService.getReceiptData().subscribe({
      next: (data: ReceiptData) => {
        this.receiptData = {
          ...data,
          discount: Number(data.discount) || 0,
          vatRate: Number(data.vatRate) || 0,
          products: Array.isArray(data.products) ? data.products : [],
        };

        this.updateProductsComponent();
        this.updateTotalComponent();

        console.log('Adisyon verileri service üzerinden yüklendi:', this.receiptData);
      },

      error: (error) => {
        console.error('Adisyon verileri yüklenemedi:', error);
      },
    });
  }

  updateProductsComponent(): void {
    this.receiptManagerService.updateProductsComponent(
      this.receiptItems, //tasarım alanındaki bileşenler
      this.receiptData, //jsondan gelen
    );
  }
  updateTotalComponent(): void {
    this.receiptManagerService.updateTotalComponent(this.receiptItems, this.getTotal());
  }
  addComponent(event: any): void {
    const type = typeof event === 'string' ? event : event.type;

    const x = event?.x ?? 20;

    const y = event?.y ?? this.receiptItems.length * 40 + 20;

    const newItem = this.receiptItemService.createReceiptItem(
      type,
      x,
      y,
      this.receiptData,
      this.getTotal(),
    );

    this.receiptItems.push(newItem);
    this.updateTotalComponent();
  }

  getSubTotal(): number {
    const productItem = this.receiptItems.find((item) => item.type === 'Ürünler');

    const products: Product[] =
      productItem && Array.isArray(productItem.products)
        ? productItem.products
        : this.receiptData.products;

    return this.calculationService.getSubTotal(products);
  }

  getDiscount(): number {
    return this.calculationService.getDiscount(this.getSubTotal(), this.receiptData.discount);
  }

  getAmountAfterDiscount(): number {
    return this.calculationService.getAmountAfterDiscount(this.getSubTotal(), this.getDiscount());
  }

  getVat(): number {
    return this.calculationService.getVat(this.getAmountAfterDiscount(), this.receiptData.vatRate);
  }

  getTotal(): number {
    return this.calculationService.getTotal(this.getSubTotal(), this.getDiscount(), this.getVat());
  }

  selectItem(item: any): void {
    this.selectedItem = item;
  }

  deleteSelectedItem(): void {
    this.receiptItems = this.receiptManagerService.deleteSelectedItem(
      this.receiptItems,
      this.selectedItem,
    );

    this.selectedItem = null;
    this.updateTotalComponent();
  }
}
