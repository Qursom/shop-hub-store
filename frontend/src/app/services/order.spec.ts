import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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

  // TODO: Test that getIdempotencyKey() makes a GET request to /keys and returns the key
  it('fetches an idempotency key from GET /keys', () => {
    // TODO: Subscribe to service.getIdempotencyKey()
    // Use httpMock.expectOne(`${apiBase}/keys`) to intercept and flush a response
    // Assert the returned key matches the flushed response value
  });

  // TODO: Test that checkout() makes a POST request to /checkout with the correct payload
  it('submits a POST to /checkout with cart items and idempotency key', () => {
    // TODO: Call service.checkout(items, 'test-key').subscribe()
    // Use httpMock.expectOne(`${apiBase}/checkout`) to intercept the request
    // Assert the request body contains the idempotencyKey and items
    // Flush a success response and assert the observable completes
  });
});
