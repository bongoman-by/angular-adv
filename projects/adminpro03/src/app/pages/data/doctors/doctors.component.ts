import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';
import { DoctorService } from '../../../services/doctor.service';

import { Hospital } from '../../../models/hospital.model';
import { Doctor } from '../../../models/doctor.model';
import { Collections } from '../../../shared/collections.enum';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [],
})
export class DoctorsComponent implements OnInit, OnDestroy {
  public items: Doctor[] = [];
  public total: number = 0;
  public from: number = 0;
  public loaded: boolean = true;
  public collection: Collections = Collections.doctors;
  sub: Subscription;

  constructor(
    private doctorService: DoctorService,
    private searchesService: SearchesService,
    private modalImageService: ModalImageService
  ) {
    this.sub = this.modalImageService.loadedImage
      .pipe(delay(1000))
      .subscribe(() => {
        this.loadItems();
      });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  back() {
    this.from = this.from - this.doctorService.limit;
    if (this.from < 0) {
      this.from = 0;
    }
    this.loadItems();
  }

  next() {
    this.from = this.from + this.doctorService.limit;
    if (this.from > this.total) {
      this.from = this.total;
    }
    this.loadItems();
  }

  loadItems() {
    this.loaded = false;
    this.doctorService.getItems(this.from).subscribe({
      next: ({ total, items }) => {
        if (items) {
          this.items = items;
        } else {
          this.items = [];
        }
        this.total = total;
        this.loaded = true;
      },
    });
  }

  search(term: string) {
    if (!term) {
      return this.loadItems();
    }
    this.loaded = false;
    this.searchesService.getCollection(this.collection, term).subscribe({
      next: (items: any) => {
        if (items) {
          this.items = this.doctorService.transform(items);
        } else {
          this.items = [];
        }
        this.total = this.items.length;
        this.loaded = true;
      },
    });
  }

  deleteItem(item: Hospital, term: string, test: boolean = false) {
    const id = item._id || '';
    if (test) {
      this.doctorService.deleteItem(id).subscribe({
        next: () => {},
      });
      return;
    }
    Swal.fire({
      title: 'Delete hospital?',
      text: `You are going to delete ${item.name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteItem(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Doctor has been deleted.', 'success');
            if (!term) {
              this.loadItems();
            }
            {
              this.search(term);
            }
          },
        });
      }
    });
  }

  openModal(item: Doctor) {
    this.modalImageService.startModal(
      item.image || '',
      item._id || '',
      this.collection
    );
  }
}
