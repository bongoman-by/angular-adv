import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Hospital } from '../../../models/hospital.model';
import { DoctorService } from '../../../services/doctor.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';

import { DoctorsComponent } from './doctors.component';

describe('DoctorsComponent', () => {
  let fixture: ComponentFixture<DoctorsComponent>;
  let doctorService: DoctorService;
  let searchesService: SearchesService;
  let spy: any;

  let component: DoctorsComponent;
  const hospital = new Hospital('new Hospital');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorsComponent],
      providers: [DoctorService, SearchesService, ModalImageService],
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
    });
    fixture = TestBed.createComponent(DoctorsComponent);
    component = fixture.componentInstance;
    doctorService = TestBed.inject(DoctorService);
    spyOn(doctorService, 'getItems').and.returnValue(
      of({ length: 0, total: 0, items: null })
    );
    searchesService = TestBed.inject(SearchesService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch items on ngOnInit when bad request', () => {
    fixture.detectChanges();
    expect(component.items).toEqual([]);
  });

  it('should call service for delete item', () => {
    spy = spyOn(doctorService, 'deleteItem').and.callFake(() => {
      return of({});
    });
    component.deleteItem(hospital, '', true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call service for search items', () => {
    spy = spyOn(searchesService, 'getCollection').and.callFake(() => {
      return of(null);
    });
    component.search('&#*@%');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it(`should be button with name 'Create doctor'`, () => {
    const element = fixture.nativeElement.querySelector('.fa-user');
    expect(element.innerText).toEqual('Create doctor');
  });

  it(`should be button 'Create doctor' with a link to page of new doctor`, () => {
    // const elements = fixture.debugElement.queryAll(
    //   By.directive(RouterLinkWithHref)
    // );
    const elements = fixture.debugElement.queryAll(By.directive(RouterLink));
    // const el = fixture.nativeElement.querySelector('.btn-primary');
    console.log(elements);
    let exist = false;
    for (const element of elements) {
      if (element.attributes['routerLink'] === '/dashboard/doctor/new') {
        exist = true;
        break;
      }
    }
    expect(exist).toBeTruthy();
  });

  it(`should be buttons 'Next' and 'Back' are changed with click`, fakeAsync(() => {
    component.loaded = true;
    component.from = doctorService.limit;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const elements = fixture.debugElement.queryAll(By.css('.btn-secondary'));
      elements[0].triggerEventHandler('click', null);
      tick();
      expect(component.from).toBe(0);
      component.total = doctorService.limit;
      elements[1].triggerEventHandler('click', null);
      tick();
      expect(component.from).toBe(doctorService.limit);
    });
  }));
});
