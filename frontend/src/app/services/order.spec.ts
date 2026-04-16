import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CartItem } from '@app/models/cart';
import { environment } from '@environments/environment';
import { OrderService } from './order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  const apiBase = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches an idempotency key from GET /keys', () => {
    let responseKey = '';
    service.getIdempotencyKey().subscribe((response) => {
      responseKey = response.key;
    });

    const req = httpMock.expectOne(`${apiBase}/keys`);
    expect(req.request.method).toBe('GET');
    req.flush({ key: 'idempotency-key', timestamp: '2026-01-01T00:00:00.000Z' });

    expect(responseKey).toBe('idempotency-key');
  });

  it('submits a POST to /checkout with cart items and idempotency key', () => {
    const items: CartItem[] = [
      {
        product: {
          id: 'p1',
          name: 'Mechanical Keyboard',
          description: 'desc',
          price: 89.99,
          imageUrl: '',
          currency: 'USD',
          stock: 10,
          category: 'Accessories',
        },
        quantity: 2,
      },
    ];

    let completed = false;
    service.checkout(items, 'test-key').subscribe({
      next: () => {
        completed = true;
      },
    });

    const req = httpMock.expectOne(`${apiBase}/checkout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      key: 'test-key',
      items: [{ id: 'p1', name: 'Mechanical Keyboard', price: 89.99, quantity: 2 }],
    });

    req.flush({
      message: 'Checkout successful',
      key: 'test-key',
      subtotal: '179.98',
      total: '179.98',
      itemCount: 2,
    });
    expect(completed).toBe(true);
  });
});
