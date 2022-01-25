import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { SearchesService } from '../../services/searches.service';

import { Doctor } from '../../models/doctor.model';
import { Hospital } from '../../models/hospital.model';
import { User } from '../../models/user.model';
import { Collections } from '../../shared/collections.enum';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [],
})
export class SearchComponent implements OnInit {
  public users: User[] = [];
  public doctors: Doctor[] = [];
  public hospitals: Hospital[] = [];
  public loaded: boolean = true;
  public collectionHospitals: Collections = Collections.hospitals;
  public collectionDoctors: Collections = Collections.doctors;

  constructor(
    private route: ActivatedRoute,
    private searchesService: SearchesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ term }) => {
      if (term.trim().length === 0) {
        return;
      }
      this.loaded = false;
      this.searchesService.getAll(term).subscribe({
        next: (res: any) => {
          console.log(res);

          this.users = res.users;
          this.doctors = res.doctors;
          this.hospitals = res.hospitals;
          this.loaded = true;
        },
        error: (e) => {
          Swal.fire({
            title: 'Error!',
            text: e.error.msg || e.message,
            icon: 'error',
          });
        },
      });
    });
  }
}
