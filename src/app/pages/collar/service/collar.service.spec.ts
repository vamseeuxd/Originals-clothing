import { TestBed } from '@angular/core/testing'

import { CollarService } from './collar.service'

describe('CountriesService', () => {
  let service: CollarService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CollarService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
