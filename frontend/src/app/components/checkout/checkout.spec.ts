import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartService } from '@app/services/cart';
import { OrderService } from '@app/services/order';
import { of } from 'rxjs';
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

  // TODO: Test that the component fetches an idempotency key from OrderService on init
  it('fetches an idempotency key on init', async () => {
    // TODO: Call setup() and assert mockOrderService.getIdempotencyKey was called
    // Assert component.idempotencyKey equals the key returned by the mock
  });

  // TODO: Test that the form is invalid when empty
  it('form is invalid when fields are empty', async () => {
    // TODO: Call setup() and assert component.checkoutForm.invalid is true
  });

  // TODO: Test that the form is valid when all required fields are correctly filled
  it('form is valid with a complete set of valid inputs', async () => {
    // TODO: Call setup(), set all form fields to valid values
    // Assert component.checkoutForm.valid is true
  });

  // TODO: Test that submitOrder() does not call checkout when the form is invalid
  it('does not submit when the form is invalid', async () => {
    // TODO: Call setup() without filling the form
    // Call component.submitOrder()
    // Assert mockOrderService.checkout was NOT called
  });

  // TODO: Test that a successful submitOrder() clears the cart and sets orderPlaced = true
  it('clears the cart and marks the order as placed on success', async () => {
    // TODO: Call setup() and fill in valid form values
    // Call component.submitOrder() and await fixture.whenStable()
    // Assert mockOrderService.checkout was called
    // Assert mockCartService.clearCart was called
    // Assert component.orderPlaced is true
  });

  // TODO: Test that a failed submitOrder() populates submitError
  it('sets submitError when checkout fails', async () => {
    // TODO: Override mockOrderService.checkout to return throwError(...)
    // Fill the form and call submitOrder()
    // Assert component.submitError is set and isSubmitting is false
  });
});
