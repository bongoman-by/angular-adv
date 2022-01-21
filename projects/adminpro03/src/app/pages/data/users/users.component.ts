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
  public users: User[] = [];
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
        this.loadUsers();
      });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  back() {
    this.from = this.from - this.userService.limit;
    if (this.from < 0) {
      this.from = 0;
    }
    this.loadUsers();
  }

  next() {
    this.from = this.from + this.userService.limit;
    if (this.from > this.total) {
      this.from = this.total;
    }
    this.loadUsers();
  }

  loadUsers() {
    this.loaded = false;
    this.userService.getUsers(this.from).subscribe({
      next: ({ total, users }) => {
        this.total = total;
        this.users = users;
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
  }

  search(term: string) {
    if (!term) {
      return this.loadUsers();
    }
    this.loaded = false;
    this.searchesService.getCollection(Collections.users, term).subscribe({
      next: (users: any) => {
        this.users = this.userService.transformUsers(users);
        this.total = this.users.length;
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
  }

  deleteUser(user: User, term: string) {
    const id = user.uid || '';
    Swal.fire({
      title: 'Delete user?',
      text: `You are going to delete ${user.name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            if (!term) {
              this.loadUsers();
            }
            {
              this.search(term);
            }
          },
          error: (e) => {
            Swal.fire({
              title: 'Error!',
              text: e.error.msg || e.message,
              icon: 'error',
            });
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
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: e.error.msg || e.message,
          icon: 'error',
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
