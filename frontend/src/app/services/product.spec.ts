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

  it('emits the fetched items through products$', () => {
    let latestProducts: Product[] = [];
    service.products$.subscribe((products) => (latestProducts = products));

    service.getProducts(1, 10).subscribe();

    const req = httpMock.expectOne(`${apiBase}/products?page=1&pageSize=10`);
    req.flush({ items: [makeProduct('p1')], total: 1 });

    expect(latestProducts).toEqual([makeProduct('p1')]);
  });

  it('emits the total count through total$', () => {
    let latestTotal = 0;
    service.total$.subscribe((total) => (latestTotal = total));

    service.getProducts(1, 10).subscribe();

    const req = httpMock.expectOne(`${apiBase}/products?page=1&pageSize=10`);
    req.flush({ items: [makeProduct('p1')], total: 38 });

    expect(latestTotal).toBe(38);
  });

  it('transitions loading$ correctly during the request lifecycle', () => {
    const loadingStates: boolean[] = [];
    service.loading$.subscribe((state) => loadingStates.push(state));

    service.getProducts(1, 10).subscribe();
    const req = httpMock.expectOne(`${apiBase}/products?page=1&pageSize=10`);
    req.flush({ items: [makeProduct('p1')], total: 1 });

    expect(loadingStates).toContain(true);
    expect(loadingStates[loadingStates.length - 1]).toBe(false);
  });

  it('passes page and pageSize as query params', () => {
    service.getProducts(3, 5).subscribe();

    const req = httpMock.expectOne(`${apiBase}/products?page=3&pageSize=5`);
    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total: 0 });
  });

  it('sets error$ on request failure', () => {
    let latestError: string | null = null;
    service.error$.subscribe((error) => (latestError = error));

    service.getProducts(1, 10).subscribe((products) => {
      expect(products).toEqual([]);
    });

    const req = httpMock.expectOne(`${apiBase}/products?page=1&pageSize=10`);
    req.flush({ error: { message: 'Products endpoint failed' } }, { status: 500, statusText: 'Server Error' });

    expect(latestError).toBe('Products endpoint failed');
  });
});
