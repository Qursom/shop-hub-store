import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Cart } from '@app/models/cart';
import { CartService } from '@app/services/cart';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { HeaderComponent } from './header';

const makeCart = (items: Cart['items'] = []): Cart => ({
  items,
  lastUpdated: new Date(),
});

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartSubject: BehaviorSubject<Cart>;
  let mockCartService: { cart$: ReturnType<BehaviorSubject<Cart>['asObservable']> };

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<Cart>(makeCart());
    mockCartService = { cart$: cartSubject.asObservable() };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Test that cartItemCount reflects the total quantity from CartService.cart$
  it('updates cartItemCount when cart$ emits a new cart', () => {
    // TODO: Push a cart with known items into cartSubject (e.g. two items with quantities 2 and 3)
    // Call fixture.detectChanges()
    // Assert component.cartItemCount equals the total quantity (e.g. 5)
  });

  // TODO: Test that the cart badge is visible in the DOM when cartItemCount > 0
  it('shows the cart badge when there are items in the cart', () => {
    // TODO: Push a cart with at least one item into cartSubject
    // Call fixture.detectChanges()
    // Query the DOM for the badge element and assert it is present
    // Assert the badge text content matches cartItemCount
  });

  // TODO: Test that the cart badge is hidden when the cart is empty
  it('hides the cart badge when the cart is empty', () => {
    // TODO: Ensure cartSubject has an empty cart (default from beforeEach)
    // Call fixture.detectChanges()
    // Assert the badge element is not present in the DOM
  });
});
