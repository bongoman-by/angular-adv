import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { DoctorService } from '../../../services/doctor.service';
import { HospitalService } from './../../../services/hospital.service';

import { Hospital } from '../../../models/hospital.model';
import { Doctor } from '../../../models/doctor.model';
import { Collections } from '../../../shared/collections.enum';

@Component({
  selector: 'doctor-profile',
  templateUrl: './doctor.component.html',
  styles: [],
})
export class DoctorComponent implements OnInit {
  form: FormGroup;
  public doctor: Doctor = new Doctor('');
  public hospitals: Hospital[] = [];
  public imageDoctor: string = '';
  public imageHospital: string = '';
  public collectionHospitals: Collections = Collections.hospitals;
  public collectionDoctors: Collections = Collections.doctors;
  public loaded: boolean = true;
  public hospitalsDoctor: Hospital[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadHospitals();
    this.form.get('hospital')?.valueChanges.subscribe((_id) => {
      this.imageHospital =
        this.hospitals.filter((hospital) => hospital._id === _id)[0].image ||
        '';
    });
    this.route.params.subscribe(({ id }) => {
      if (id === 'new') {
        return;
      }
      this.loaded = false;
      this.doctorService.getItem(id).subscribe({
        next: (item: any) => {
          if (item) {
            this.doctor = item;
            this.hospitalsDoctor = item.hospital;
            this.form.setValue({
              name: this.doctor.name,
              hospital: item.hospital[0]._id,
            });
            this.imageDoctor = this.doctor.image || '';
            this.imageHospital = item.hospital[0].image;
          }
          this.loaded = true;
        },
      });
    });
  }

  loadHospitals() {
    this.hospitalService.getItems().subscribe({
      next: ({ total, items }) => {
        if (items) {
          this.hospitals = items;
        } else {
          this.hospitals = [];
        }
      },
    });
  }

  onSubmit() {
    if (!this.doctor._id) {
      this.doctorService.createItem(this.form.value).subscribe({
        next: (res) => {
          Swal.fire({
            title: '',
            text: res.msg,
            icon: 'success',
          });
          this.router.navigateByUrl(`/dashboard/doctor/${res.doctor._id}`);
        },
      });
    } else {
      this.doctorService
        .updateItem(this.form.value, this.doctor._id || '')
        .subscribe({
          next: (res) => {
            Swal.fire({
              title: '',
              text: res.msg,
              icon: 'success',
            });
            this.router.navigateByUrl(`/dashboard/doctor/${res.doctor._id}`);
            this.ngOnInit();
          },
        });
    }
  }
}
