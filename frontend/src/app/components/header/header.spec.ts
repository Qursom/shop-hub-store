import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Cart } from '@app/models/cart';
import { AuthService } from '@app/services/auth';
import { CartService } from '@app/services/cart';
import { BehaviorSubject } from 'rxjs';
import { HeaderComponent } from './header';

const makeCart = (items: Cart['items'] = []): Cart => ({
  items,
  lastUpdated: new Date(),
});

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartSubject: BehaviorSubject<Cart>;
  let authSubject: BehaviorSubject<boolean>;
  let mockCartService: { cart$: ReturnType<BehaviorSubject<Cart>['asObservable']> };
  let mockAuthService: {
    isLoggedIn$: ReturnType<BehaviorSubject<boolean>['asObservable']>;
    setLoggedOut: () => void;
  };

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<Cart>(makeCart());
    authSubject = new BehaviorSubject<boolean>(true);
    mockCartService = { cart$: cartSubject.asObservable() };
    mockAuthService = { isLoggedIn$: authSubject.asObservable(), setLoggedOut: () => undefined };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: AuthService, useValue: mockAuthService },
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

  it('updates cartItemCount when cart$ emits a new cart', () => {
    cartSubject.next(
      makeCart([
        {
          product: {
            id: 'p1',
            name: 'A',
            description: '',
            price: 1,
            imageUrl: '',
            currency: 'USD',
          },
          quantity: 2,
        },
        {
          product: {
            id: 'p2',
            name: 'B',
            description: '',
            price: 1,
            imageUrl: '',
            currency: 'USD',
          },
          quantity: 3,
        },
      ]),
    );

    expect(component.cartItemCount).toBe(5);
  });

  it('shows the cart badge when there are items in the cart', () => {
    cartSubject.next(
      makeCart([
        {
          product: {
            id: 'p1',
            name: 'A',
            description: '',
            price: 1,
            imageUrl: '',
            currency: 'USD',
          },
          quantity: 1,
        },
      ]),
    );
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('1');
  });

  it('hides the cart badge when the cart is empty', () => {
    cartSubject.next(makeCart([]));
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeNull();
  });
});
