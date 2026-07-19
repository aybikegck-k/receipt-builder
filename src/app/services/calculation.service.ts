//Hesaplamaları yapar

import { Injectable } from '@angular/core';
import { Product } from './receipt.service';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  getSubTotal(products: Product[]): number {
    if (!Array.isArray(products)) {
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

  getDiscount(
    subTotal: number,
    discountValue: number
  ): number {
    const discount = Number(discountValue) || 0;

    return Math.min(
      Math.max(discount, 0),
      subTotal
    );
  }

  getAmountAfterDiscount(
    subTotal: number,
    discount: number
  ): number {
    return subTotal - discount;
  }

  getVat(
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