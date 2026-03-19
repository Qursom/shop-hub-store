import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '@app/models/product';
import { environment } from '@environments/environment';
import { ProductService } from './product';

const makeProduct = (id: string): Product => ({
  id,
  name: `Product ${id}`,
  price: 9.99,
  description: 'desc',
  imageUrl: '',
  currency: 'USD',
  stock: 10,
  category: 'general',
});

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiBase = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Test that getProducts() emits fetched items through products$
  it('emits the fetched items through products$', () => {
    // TODO: Subscribe to service.products$
    // Call service.getProducts(1, 10).subscribe()
    // Use httpMock.expectOne() to flush a response with items
    // Assert products$ emitted the expected products
  });

  // TODO: Test that getProducts() emits the total record count through total$
  it('emits the total count through total$', () => {
    // TODO: Subscribe to service.total$
    // Flush a response with a known total
    // Assert total$ emitted the expected value
  });

  // TODO: Test that loading$ transitions from true → false during a request
  it('transitions loading$ correctly during the request lifecycle', () => {
    // TODO: Collect loading$ emissions into an array
    // Initiate getProducts() and flush the HTTP response
    // Assert loading was true at some point and is false at the end
  });

  // TODO: Test that getProducts() sends the correct query parameters
  it('passes page and pageSize as query params', () => {
    // TODO: Call service.getProducts(3, 5)
    // Use httpMock.expectOne() with the expected URL including query params
    // Assert the request method is GET
  });

  // TODO: Test that error$ is populated when the HTTP request fails
  it('sets error$ on request failure', () => {
    // TODO: Subscribe to service.error$
    // Trigger an HTTP error via httpMock
    // Assert error$ contains a meaningful error message
  });
});
