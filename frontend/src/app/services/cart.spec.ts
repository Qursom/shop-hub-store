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

  // TODO: Test that addItem() adds a new product to the cart
  it('adds a new product to an empty cart', () => {
    // TODO: Call service.addItem(makeProduct(), 1)
    // Assert items.length === 1 and items[0].quantity === 1
  });

  // TODO: Test that addItem() increments quantity when the same product is added again
  it('increments quantity for a duplicate product', () => {
    // TODO: Call service.addItem() twice with the same product
    // Assert items.length is still 1 and quantity reflects the combined amount
  });

  // TODO: Test that removeItem() removes a product from the cart
  it('removes an existing item by product id', () => {
    // TODO: Add an item, then remove it via service.removeItem(productId)
    // Assert the cart is empty afterwards
  });

  // TODO: Test that getSubtotal() returns the correct sum of price × quantity
  it('calculates the correct subtotal', () => {
    // TODO: Add products with known prices and quantities
    // Assert service.getSubtotal() equals the expected total
  });

  // TODO: Test that getTotalItems() returns the sum of all quantities
  it('returns the total number of items across all cart entries', () => {
    // TODO: Add multiple items and assert service.getTotalItems() is correct
  });

  // TODO: Test that clearCart() empties the cart
  it('clears all items from the cart', () => {
    // TODO: Add items, call service.clearCart(), assert items.length === 0
  });

  // TODO: Test that the cart is persisted to and restored from localStorage
  it('persists cart to localStorage and restores it on reload', () => {
    // TODO: Add an item and verify localStorage contains the data
    // Reinitialise the service (TestBed.resetTestingModule) and verify
    // the restored cart still contains the item
  });
});
