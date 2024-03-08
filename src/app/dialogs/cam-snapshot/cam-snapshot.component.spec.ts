import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamSnapshotComponent } from './cam-snapshot.component';

describe('CamSnapshotComponent', () => {
  let component: CamSnapshotComponent;
  let fixture: ComponentFixture<CamSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
