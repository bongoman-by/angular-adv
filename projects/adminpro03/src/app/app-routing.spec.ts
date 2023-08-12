import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

describe('Routes of AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    });
  });

  it(`should be exist route '' to page 'dashboard'`, () => {
    expect(routes).toContain({
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full',
    });
  });

  it(`should be exist route '**' to component NoPageFoundComponent`, () => {
    expect(routes).toContain({ path: '**', component: NoPageFoundComponent });
  });
});
