import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';
import { Country } from 'src/app/interfaces/country.interface';
import { City } from 'src/app/interfaces/city.interface';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent {
  @Input() addressForm!: FormGroup;
  @Input() countriesList!: Country[];

  @Output() remove = new EventEmitter<void>();
  @Output() cityAdded = new EventEmitter<City>();

  selectedCountry!: Country;
  newCity!: City;
  citiesList!: City[];

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      data: { country: this.selectedCountry.name, city: this.newCity },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newCity: City = {
          id: this.selectedCountry.cities.length,
          countryId: this.selectedCountry.id,
          name: result,
        };
        this.cityAdded.emit(newCity);
      }
    });
  }

  onCountrySelectionChange(countryName: string): void {
    this.selectedCountry = this.findCountryByName(countryName);
    this.citiesList = this.selectedCountry.cities;
  }

  private findCountryByName(countryName: string): Country {
    const country = this.countriesList.find(
      (country) => country.name === countryName
    );
    if (!country) {
      throw new Error(`Country '${countryName}' not found.`);
    }
    return country;
  }
}
