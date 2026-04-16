import { TestBed } from '@angular/core/testing';
import { Product } from '@app/models/product';
import { CartService } from './cart';

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

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds a new product to an empty cart', () => {
    service.addItem(makeProduct(), 1);

    const cart = service.getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.items[0].product.id).toBe('p1');
  });

  it('increments quantity for a duplicate product', () => {
    service.addItem(makeProduct(), 1);
    service.addItem(makeProduct(), 2);

    const cart = service.getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it('removes an existing item by product id', () => {
    service.addItem(makeProduct(), 1);
    service.removeItem('p1');

    expect(service.getCart().items).toHaveLength(0);
  });

  it('calculates the correct subtotal', () => {
    service.addItem(makeProduct({ id: 'p1', price: 10 }), 2);
    service.addItem(makeProduct({ id: 'p2', price: 15 }), 1);

    expect(service.getSubtotal()).toBe(35);
  });

  it('returns the total number of items across all cart entries', () => {
    service.addItem(makeProduct({ id: 'p1' }), 2);
    service.addItem(makeProduct({ id: 'p2' }), 3);

    expect(service.getTotalItems()).toBe(5);
  });

  it('clears all items from the cart', () => {
    service.addItem(makeProduct({ id: 'p1' }), 1);
    service.addItem(makeProduct({ id: 'p2' }), 1);

    service.clearCart();

    expect(service.getCart().items).toHaveLength(0);
    expect(service.getTotalItems()).toBe(0);
  });

  it('persists cart to localStorage and restores it on reload', () => {
    service.addItem(makeProduct({ id: 'p1', price: 12 }), 2);

    const stored = localStorage.getItem('shopping-cart');
    expect(stored).toBeTruthy();
    expect(stored).toContain('"id":"p1"');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloadedService = TestBed.inject(CartService);

    const reloadedCart = reloadedService.getCart();
    expect(reloadedCart.items).toHaveLength(1);
    expect(reloadedCart.items[0].product.id).toBe('p1');
    expect(reloadedCart.items[0].quantity).toBe(2);
  });
});
