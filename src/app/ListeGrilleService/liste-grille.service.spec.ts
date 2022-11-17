import { TestBed } from '@angular/core/testing';

import { ListeGrilleService } from './liste-grille.service';

describe('ListeGrilleService', () => {
  let service: ListeGrilleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeGrilleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
