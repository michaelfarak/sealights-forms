import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SealightsService } from 'src/app/services/sealights.service';
import { City } from 'src/app/interfaces/city.interface';
import { Country } from 'src/app/interfaces/country.interface';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent implements OnInit {
  personForm!: FormGroup;

  countries$!: Observable<Country[]>;

  private countriesSubject: BehaviorSubject<Country[]> = new BehaviorSubject<
    Country[]
  >([]);

  get addressArray(): FormArray {
    return this.personForm?.get('addresses') as FormArray;
  }

  constructor(private service: SealightsService) {}

  ngOnInit(): void {
    this.generateNewPersonForm();
    this.countries$ = this.countriesSubject.asObservable();
    this.getCountriesWithCities();
  }

  getCountriesWithCities(): void {
    this.service
      .getCountriesWithCities()
      .pipe(
        catchError(() => {
          return throwError(() => {
            new Error('error fetching');
          });
        })
      )
      .subscribe({
        next: (data) => {
          this.countriesSubject.next(data);
        },
      });
  }

  generateNewPersonForm(): void {
    this.personForm = new FormGroup({
      name: new FormControl('', Validators.required),
      birthdate: new FormControl(''),
      addresses: this.generateAddressFormArray(),
    });
  }

  generateAddressFormArray(): FormArray {
    return new FormArray([this.generateAddressForm()]);
  }

  generateAddressForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      country: new FormControl(''),
      city: new FormControl(''),
    });
  }

  addNewAddressForm(): void {
    this.addressArray.push(this.generateAddressForm());
  }

  onCityAdded(city: City): void {
    this.service
      .addCityToCountry(city)
      .pipe(
        catchError(() => {
          return throwError(() => {
            new Error('Cannot add city');
          });
        })
      )
      .subscribe({
        next: (response) => {
          const newData = this.countriesSubject.value.map((country) => {
            if (country.id === city.countryId) {
              country.cities.push(city);
            }
            return country;
          });
          this.countriesSubject.next(newData);
        },
      });
  }

  onSubmit() {
    console.log('Saving Person:', this.personForm.value.name);
    this.service
      .addPerson(this.personForm.value)
      .pipe(
        catchError(() => {
          return throwError(() => {
            new Error(
              `There was an issue saving '${this.personForm.value.name}' form`
            );
          });
        })
      )
      .subscribe((response) => console.log(response));
    this.generateNewPersonForm();
  }

  removeAddress(index: number) {
    this.addressArray.removeAt(index);
  }
}
