import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Person } from 'src/app/interfaces/person.interface';
import { SealightsService } from 'src/app/services/sealights.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'name', 'birthdate', 'addresses'];

  constructor(private service: SealightsService) {}

  ngOnInit(): void {
    this.service.getPersons().subscribe((data) => {
      this.dataSource = new MatTableDataSource<Person>(data);
      console.log(this.dataSource);
    });
  }

  formatBirthdate(birthdate: string) {
    if (birthdate === undefined || birthdate === null || birthdate === 'NA') {
      return 'N/A';
    }
    const date = new Date(birthdate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
