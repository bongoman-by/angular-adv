import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription, take } from 'rxjs';
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  title: string = 'Blank Page';
  titleSubs$!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

  ngOnInit(): void {
    this.title = this.route.children[0].snapshot.data['title'];
    document.title = `AdminPro - ${this.title}`;
    this.titleSubs$ = this.router.events
      .pipe(
        filter((e): e is ActivationEnd => e instanceof ActivationEnd),
        filter((e: ActivationEnd) => e.snapshot.firstChild === null),
        map((e: ActivationEnd) => e.snapshot.data)
      )
      .subscribe(({ title }) => {
        this.title = title;
        document.title = `AdminPro - ${this.title}`;
      });
  }
}
