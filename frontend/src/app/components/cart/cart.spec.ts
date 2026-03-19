import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Cart } from '@app/models/cart';
import { Product } from '@app/models/product';
import { CartService } from '@app/services/cart';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { CartComponent } from './cart';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Widget',
  price: 10,
  description: 'A widget',
  imageUrl: '',
  currency: 'USD',
  stock: 5,
  category: 'tools',
  ...overrides,
});

const makeCart = (items: Cart['items'] = []): Cart => ({
  items,
  lastUpdated: new Date(),
});

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartSubject: BehaviorSubject<Cart>;
  let mockCartService: {
    cart$: ReturnType<BehaviorSubject<Cart>['asObservable']>;
    getSubtotal: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    updateQuantity: ReturnType<typeof vi.fn>;
    clearCart: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<Cart>(makeCart());
    mockCartService = {
      cart$: cartSubject.asObservable(),
      getSubtotal: vi.fn().mockReturnValue(0),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [provideRouter([]), { provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Test that subtotal, tax, and total are recalculated when cart$ emits a new value
  it('recalculates totals when cart$ emits', () => {
    // TODO: Configure mockCartService.getSubtotal to return a known value (e.g. 100)
    // Push a new cart into cartSubject
    // Assert component.subtotal, component.tax (10%), and component.total are correct
  });

  // TODO: Test that removeItem() delegates to CartService.removeItem
  it('calls CartService.removeItem with the correct productId', () => {
    // TODO: Call component.removeItem('p1')
    // Assert mockCartService.removeItem was called with 'p1'
  });

  // TODO: Test that updateQuantity() delegates to CartService.updateQuantity for positive values
  it('calls CartService.updateQuantity for a positive quantity', () => {
    // TODO: Call component.updateQuantity('p1', 3)
    // Assert mockCartService.updateQuantity was called with ('p1', 3)
  });

  // TODO: Test that updateQuantity() removes the item when quantity is 0 or negative
  it('removes the item when updateQuantity is called with 0 or less', () => {
    // TODO: Call component.updateQuantity('p1', 0)
    // Assert mockCartService.removeItem was called with 'p1'
  });

  // TODO: Test that onQuantityChange() parses the input event value and calls updateQuantity
  it('parses the input event value and delegates to updateQuantity', () => {
    // TODO: Create a synthetic Event with target.value = '4'
    // Call component.onQuantityChange('p1', event)
    // Assert updateQuantity was called with ('p1', 4)
  });
});
