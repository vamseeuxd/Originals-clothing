import { TestBed } from '@angular/core/testing'

import { FabricfamilyService } from './fabric-family.service'

describe('CountriesService', () => {
  let service: FabricfamilyService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(FabricfamilyService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
