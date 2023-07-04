import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { Person } from '../interfaces/person.interface';
import { City } from '../interfaces/city.interface';

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class SealightsService {
  constructor(private http: HttpClient) {}

  getPersons(): Observable<Person[]> {
    const url = API_URL + '/persons';
    return this.http.get<Person[]>(url).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(
          () => new Error('An error occurred while trying to retrieve persons')
        );
      })
    );
  }

  addPerson(personData: Person): Observable<Person> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(personData);
    const url = API_URL + '/person';
    return this.http.post<Person>(url, body, { headers });
  }

  getCountriesWithCities() {
    return this.http.get<Country[]>(API_URL + '/countries').pipe(
      switchMap((countries) => {
        const observables: Observable<Country>[] = countries.map((country) =>
          this.http
            .get<City[]>(`${API_URL + '/cities/'}${country.id}`)
            .pipe(map((cities) => ({ ...country, cities })))
        );
        return forkJoin(observables);
      })
    );
  }

  addCityToCountry(city: City): Observable<City> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(city);
    const url = API_URL + '/city';
    return this.http.post<City>(url, body, { headers: headers });
  }
}
