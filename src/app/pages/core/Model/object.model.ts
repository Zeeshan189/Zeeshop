export class User {
  name!: string;
  password!: string;
  uploadPhoto!: string;
  role!: string;
  mobNumber!: string;
  address!: string;
  city!: string;
  zipCode!: number;
  gender!: string;
  email!: string;
  agreetc!: boolean;
  id: any;
}
// export class Address {
//   addLine1!: string;
//   city!: string;
//   state!: string;
//   zipCode!: number;
// }
export class Product {
  name!: string;
  uploadPhoto!: string;
  productDesc!: string;
  mrp!: number;
  dp!: number;
  status!: boolean;
  quantity!: number;
  id: any;
  totalPrice!: number;
}
export class Order {
  userId!: string;
  product!: Product[];
  deliveryAddress!: string;
  contact!: number;
  dateTime!: string;
}
