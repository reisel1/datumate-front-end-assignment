import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from "rxjs";
import { Gcp } from 'src/app/gcp-structure';
import { GcpService } from 'src/app/services/gcp.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';



@Component({
  selector: 'gcp-list',
  templateUrl: './gcp-list.component.html',
  styleUrls: ['./gcp-list.component.css']
})
export class GcpListComponent implements OnDestroy {

  displayedColumns: string[] = ['name', 'n', 'e', 'h'];
  dataSource = new MatTableDataSource<Gcp>();
  gcpList: Gcp[] = []
  sortedData: Gcp[] = []
  subscription: Subscription
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private GcpService: GcpService) {
    this.subscription = this.GcpService.listGcp$.subscribe(data => {
      data.forEach(d => this.gcpList.push(d))
      this.dataSource.data = this.gcpList
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


