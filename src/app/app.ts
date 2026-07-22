import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  ReceiptData,
  ReceiptService
} from './services/receipt.service';

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
  imports: [
    Navbar,
    ComponentPool,
    ReceiptPreview,
    SettingsPanel
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  // Tasarım alanındaki fiş bileşenleri.
  receiptItems: any[] = [];

  // Kullanıcının seçtiği bileşen.
  selectedItem: any = null;

  // JSON verisi yüklenene kadar kullanılacak başlangıç değerleri.
  receiptData: ReceiptData = {
  restaurantName: '',
  logo: '',
  tableNo: '',
  waiter: '',
  phone: '',
  address: '',
  note: '',

  products: [],

  subTotal: 0,
  discount: 0,
  amountAfterDiscount: 0,
  vatRate: 0,
  vat: 0,
  total: 0,
};

  constructor(
    // Angular servisleri Dependency Injection ile oluşturup gönderir.
    private receiptService: ReceiptService,
    private templateService: TemplateService,
    private receiptItemService: ReceiptItemService,
    private receiptManagerService: ReceiptManagerService,
  ) {}

  ngOnInit(): void {
    // Uygulama açıldığında JSON verisini yükler.
    this.loadReceiptData();
  }

  // Kullanıcının oluşturduğu şablonu JSON dosyası olarak kaydeder.
  saveTemplate(): void {
    this.templateService.saveTemplate(this.receiptItems);
  }

  // Gizli dosya seçme alanını açar.
  loadTemplate(): void {
    this.fileInput.nativeElement.click();
  }

  // Kullanıcının seçtiği şablon dosyasını okur.
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      this.receiptItems =
        await this.templateService.readTemplateFile(file);

      this.selectedItem = null;

      // Yüklenen şablondaki veri alanlarını güncel JSON verisiyle yeniler.
      this.updateProductsComponent();
      this.updateTotalComponent();

      console.log(
        'Şablon başarıyla yüklendi:',
        this.receiptItems
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Şablon yüklenirken bir hata oluştu.';

      console.error(
        'Şablon yüklenemedi:',
        error
      );

      alert(message);
    } finally {
      // Aynı dosyanın tekrar seçilebilmesi için input temizlenir.
      input.value = '';
    }
  }

  // receipt-data.json içerisindeki hazır fiş verilerini yükler.
  loadReceiptData(): void {
    this.receiptService.getReceiptData().subscribe({
      next: (data: ReceiptData) => {
        this.receiptData = {
          ...data,

          products:
            Array.isArray(data.products)
              ? data.products
              : [],

          subTotal: Number(data.subTotal) || 0,
          discount: Number(data.discount) || 0,
          amountAfterDiscount:
            Number(data.amountAfterDiscount) || 0,
          vatRate: Number(data.vatRate) || 0,
          vat: Number(data.vat) || 0,
          total: Number(data.total) || 0,
        };

        this.updateProductsComponent();
        this.updateTotalComponent();

        console.log(
          'Adisyon verileri servis üzerinden yüklendi:',
          this.receiptData
        );
      },

      error: (error) => {
        console.error(
          'Adisyon verileri yüklenemedi:',
          error
        );
      },
    });
  }

  // JSON'dan gelen ürünleri Ürünler bileşenine aktarır.
  updateProductsComponent(): void {
    this.receiptManagerService.updateProductsComponent(
      this.receiptItems,
      this.receiptData
    );
  }

  // JSON'dan hazır gelen toplam bilgilerini Toplam bileşenine aktarır.
  updateTotalComponent(): void {
    this.receiptManagerService.updateTotalComponent(
      this.receiptItems,
      this.receiptData
    );
  }

  // Sol panelden bırakılan yeni bileşeni oluşturur.
  addComponent(event: any): void {
    const type =
      typeof event === 'string'
        ? event
        : event.type;

    const x = event?.x ?? 20;

    const y =
      event?.y ??
      this.receiptItems.length * 40 + 20;

    const newItem =
      this.receiptItemService.createReceiptItem(
        type,
        x,
        y,
        this.receiptData
      );

    this.receiptItems.push(newItem);

    // Eklenen bileşen Ürünler veya Toplam ise güncel JSON verileri aktarılır.
    this.updateProductsComponent();
    this.updateTotalComponent();
  }

  // Tasarım alanında tıklanan bileşeni seçer.
  selectItem(item: any): void {
    this.selectedItem = item;
  }

  // Seçili bileşeni tasarım alanından siler.
  deleteSelectedItem(): void {
    this.receiptItems =
      this.receiptManagerService.deleteSelectedItem(
        this.receiptItems,
        this.selectedItem
      );

    this.selectedItem = null;
  }
}