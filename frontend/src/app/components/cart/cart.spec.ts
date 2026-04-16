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

  it('recalculates totals when cart$ emits', () => {
    mockCartService.getSubtotal.mockReturnValue(100);
    cartSubject.next(makeCart([{ product: makeProduct({ id: 'p1' }), quantity: 2 }]));

    expect(component.subtotal).toBe(100);
    expect(component.tax).toBe(10);
    expect(component.total).toBe(110);
  });

  it('calls CartService.removeItem with the correct productId', () => {
    component.removeItem('p1');

    expect(mockCartService.removeItem).toHaveBeenCalledWith('p1');
  });

  it('calls CartService.updateQuantity for a positive quantity', () => {
    component.updateQuantity('p1', 3);

    expect(mockCartService.updateQuantity).toHaveBeenCalledWith('p1', 3);
  });

  it('removes the item when updateQuantity is called with 0 or less', () => {
    component.updateQuantity('p1', 0);

    expect(mockCartService.removeItem).toHaveBeenCalledWith('p1');
  });

  it('parses the input event value and delegates to updateQuantity', () => {
    const spy = vi.spyOn(component, 'updateQuantity');
    const event = { target: { value: '4' } } as unknown as Event;

    component.onQuantityChange('p1', event);

    expect(spy).toHaveBeenCalledWith('p1', 4);
  });
});
