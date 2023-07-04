export interface Person {
  id?: number;
  name: string;
  birthdate?: string;
  address: Address;
}

export interface Address {
  name: string;
  country?: string;
  city?: string;
  streetName: string;
}
