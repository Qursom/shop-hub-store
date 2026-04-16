import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartService } from '@app/services/cart';
import { OrderService } from '@app/services/order';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CheckoutComponent } from './checkout';

const makeCartService = (items: unknown[] = []) => ({
  getSubtotal: vi.fn().mockReturnValue(items.length ? 50 : 0),
  getCart: vi.fn().mockReturnValue({ items }),
  clearCart: vi.fn(),
});

const makeOrderService = () => ({
  getIdempotencyKey: vi.fn().mockReturnValue(of({ key: 'test-key', timestamp: '' })),
  checkout: vi
    .fn()
    .mockReturnValue(
      of({ message: 'ok', key: 'test-key', subtotal: '50.00', total: '55.00', itemCount: 1 }),
    ),
});

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockCartService: ReturnType<typeof makeCartService>;
  let mockOrderService: ReturnType<typeof makeOrderService>;

  const setup = async (
    items: unknown[] = [{ product: { id: 'p1', name: 'X', price: 50 }, quantity: 1 }],
  ) => {
    mockCartService = makeCartService(items);
    mockOrderService = makeOrderService();

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideRouter([{ path: 'products', loadComponent: async () => CheckoutComponent }]),
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.clearAllMocks();
  });

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('fetches an idempotency key on init', async () => {
    await setup();
    expect(mockOrderService.getIdempotencyKey).toHaveBeenCalled();
    expect(component.idempotencyKey).toBe('test-key');
  });

  it('form is invalid when fields are empty', async () => {
    await setup();
    component.checkoutForm.setValue({ name: '', email: '', address: '' });
    expect(component.checkoutForm.invalid).toBe(true);
  });

  it('form is valid with a complete set of valid inputs', async () => {
    await setup();
    component.checkoutForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St',
    });
    expect(component.checkoutForm.valid).toBe(true);
  });

  it('does not submit when the form is invalid', async () => {
    await setup();
    component.submitOrder();
    expect(mockOrderService.checkout).not.toHaveBeenCalled();
  });

  it('clears the cart and marks the order as placed on success', async () => {
    await setup();
    component.checkoutForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St',
    });

    component.submitOrder();
    await fixture.whenStable();

    expect(mockOrderService.checkout).toHaveBeenCalled();
    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(component.orderPlaced).toBe(true);
  });

  it('sets submitError when checkout fails', async () => {
    await setup();
    mockOrderService.checkout.mockReturnValue(
      throwError(() => ({ error: { message: 'Checkout API failed' } })),
    );
    component.checkoutForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St',
    });

    component.submitOrder();
    await fixture.whenStable();

    expect(component.submitError).toBe('Checkout API failed');
    expect(component.isSubmitting).toBe(false);
  });
});
