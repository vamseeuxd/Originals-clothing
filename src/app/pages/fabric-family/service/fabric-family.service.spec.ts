import { TestBed } from '@angular/core/testing'

import { FabricFamilyService } from './fabric-family.service'

describe('CountriesService', () => {
  let service: FabricFamilyService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(FabricFamilyService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
