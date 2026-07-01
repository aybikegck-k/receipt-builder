import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptPreview } from './receipt-preview';

describe('ReceiptPreview', () => {
  let component: ReceiptPreview;
  let fixture: ComponentFixture<ReceiptPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
