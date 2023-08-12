import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';
import { HospitalService } from '../../../services/hospital.service';

import { Hospital } from '../../../models/hospital.model';
import { Collections } from '../../../shared/collections.enum';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [],
})
export class HospitalsComponent implements OnInit, OnDestroy {
  public items: Hospital[] = [];
  public total: number = 0;
  public from: number = 0;
  public loaded: boolean = true;
  public collection: Collections = Collections.hospitals;
  sub: Subscription;

  constructor(
    private hospitalService: HospitalService,
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
    this.from = this.from - this.hospitalService.limit;
    if (this.from < 0) {
      this.from = 0;
    }
    this.loadItems();
  }

  next() {
    this.from = this.from + this.hospitalService.limit;
    if (this.from > this.total) {
      this.from = this.total;
    }
    this.loadItems();
  }

  loadItems() {
    this.loaded = false;
    this.hospitalService.getItems(this.from).subscribe({
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
          this.items = this.hospitalService.transform(items);
        } else {
          this.items = [];
        }
        this.total = this.items.length;
        this.loaded = true;
      },
    });
  }

  createItem(name: string) {
    this.hospitalService
      .createItem({
        name,
      })
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: '',
            text: res.msg,
            icon: 'success',
          });
          this.search(name);
        },
      });
  }

  deleteItem(item: Hospital, term: string) {
    const id = item._id || '';
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
        this.hospitalService.deleteItem(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Hospital has been deleted.', 'success');
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

  changeItem(item: Hospital) {
    this.hospitalService
      .updateItem(
        {
          name: item.name,
          user: item.user?._id || '',
        },
        item._id || ''
      )
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: '',
            text: res.msg,
            icon: 'success',
          });
        },
      });
  }

  openModal(item: Hospital) {
    this.modalImageService.startModal(
      item.image || '',
      item._id || '',
      this.collection
    );
  }
}
