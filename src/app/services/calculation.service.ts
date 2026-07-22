//Hesaplamaları yapar

import { Injectable } from '@angular/core';
import { Product } from './receipt.service';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  getSubTotal(products: Product[]): number { //ara toplam hesaplıyor
    if (!Array.isArray(products)) { //products gerçekten bir dizi mi onu kontrol eder
      return 0;
    }

    return products.reduce(
      (total: number, product: Product) => {
        const quantity = Number(product.quantity) || 0;
        const price = Number(product.price) || 0;

        return total + quantity * price;
      },
      0
    );
  }
  //reduce bir diziyi tek bir sayıya dönüştürür


  getDiscount( //indirimi hesaplıyor
    subTotal: number,
    discountValue: number
  ): number {
    const discount = Number(discountValue) || 0;
//başa number koyma sebebimiz jsondan gelen stringi sayı yapması için
    return Math.min(
      Math.max(discount, 0),
      subTotal
    );
  }

  getAmountAfterDiscount(
    subTotal: number,
    discount: number
  ): number {
    return subTotal - discount; //ara toplam-indirim
  }

  getVat( //kdv hesaplıyor
    amountAfterDiscount: number,
    vatRateValue: number
  ): number {
    const vatRate = Number(vatRateValue) || 0;

    return amountAfterDiscount * vatRate / 100;
  }

  getTotal(
    subTotal: number,
    discount: number,
    vat: number
  ): number {
    return subTotal - discount + vat;
  }
}