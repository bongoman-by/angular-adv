import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserService } from '../../../services/user.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';

import { User } from '../../../models/user.model';
import { Collections } from '../../../shared/collections.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent implements OnInit, OnDestroy {
  public items: User[] = [];
  public total: number = 0;
  public from: number = 0;
  public loaded: boolean = true;
  public user: User;
  sub: Subscription;

  constructor(
    private userService: UserService,
    private searchesService: SearchesService,
    private modalImageService: ModalImageService
  ) {
    this.user = this.userService.user;
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
    this.from = this.from - this.userService.limit;
    if (this.from < 0) {
      this.from = 0;
    }
    this.loadItems();
  }

  next() {
    this.from = this.from + this.userService.limit;
    if (this.from > this.total) {
      this.from = this.total;
    }
    this.loadItems();
  }

  loadItems() {
    this.loaded = false;
    this.userService.getItems(this.from).subscribe({
      next: ({ total, items }) => {
        if (items) {
          this.items = this.userService.transform(items);
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
    this.searchesService.getCollection(Collections.users, term).subscribe({
      next: (items: any) => {
        if (items) {
          this.items = this.userService.transform(items);
        } else {
          this.items = [];
        }
        this.total = this.items.length;
        this.loaded = true;
      },
    });
  }

  deleteItem(item: User, term: string) {
    const id = item.uid || '';
    Swal.fire({
      title: 'Delete user?',
      text: `You are going to delete ${item.name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteItem(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
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

  isCurrentUser(user: User) {
    return !(user.uid == this.user.uid);
  }

  changeRole(user: User) {
    this.userService.updateRole(user).subscribe({
      next: (res) => {
        Swal.fire({
          title: '',
          text: res.msg,
          icon: 'success',
        });
      },
    });
  }

  openModal(user: User) {
    this.modalImageService.startModal(
      user.image || '',
      user.uid || '',
      Collections.users
    );
  }
}
