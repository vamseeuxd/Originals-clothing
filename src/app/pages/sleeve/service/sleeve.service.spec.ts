import { TestBed } from '@angular/core/testing'

import { SleeveService } from './sleeve.service'

describe('CountriesService', () => {
  let service: SleeveService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SleeveService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
