import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentPool } from './component-pool';

describe('ComponentPool', () => {
  let component: ComponentPool;
  let fixture: ComponentFixture<ComponentPool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPool],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentPool);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
