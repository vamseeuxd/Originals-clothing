import { TestBed } from '@angular/core/testing'

import { ColorsService } from './colors.service'

describe('CountriesService', () => {
  let service: ColorsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ColorsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
