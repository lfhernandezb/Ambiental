import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionHtmlComponent } from './option-html.component';

describe('OptionHtmlComponent', () => {
  let component: OptionHtmlComponent;
  let fixture: ComponentFixture<OptionHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
