export class User{
  id: any;
  name!:string;
  password!:string;
  uploadPhoto!:string;
  role!:string;
  mobNumber!:string;
  address!:Address;
  gender!:string;
  email!:string;
  agreetc!:boolean;
}
export class Address{
  addLine1!:string;
  city!:string;
  state!:string
  zipCode!:number;
}
export class Product{
  name!:string
  uploadPhoto!:string;
  productDesc!:string;
  mrp!:number;
  dp!:number;
  status!:boolean;
  quantity!: number;
  id: any;
  totalPrice!: number;
}
export class Order{
  userId!:string;
  product!:Product[];
  deliveryAddress!:Address;
  contact!:number;
  dateTime!:string;
}