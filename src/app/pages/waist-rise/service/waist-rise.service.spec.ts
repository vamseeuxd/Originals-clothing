import { TestBed } from '@angular/core/testing'

import { BrandService } from './waist-rise.service'

describe('CountriesService', () => {
  let service: BrandService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(BrandService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})