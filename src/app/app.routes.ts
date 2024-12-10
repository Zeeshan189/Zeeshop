import { Routes } from '@angular/router';
import {
  AdminAuthGuardLogin,
  AdminAuthGaurdService,
  SellerBuyerAuthGuardLogin,
  SellerAuthGaurdService,
  BuyerAuthGaurdService,
} from './pages/shared/services/auth-guard.service';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BuyerDashboardComponent } from './pages/customer/buyer/buyer-dashboard/buyer-dashboard.component';
import { CheckoutComponent } from './pages/customer/buyer/checkout/checkout.component';
import { SellerDashboardComponent } from './pages/customer/seller/seller-dashboard/seller-dashboard.component';
import { SigninSignupComponent } from './pages/customer/signin-signup/signin-signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { PageNotFoundComponent } from './pages/shared/layouts/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { UserCrudComponent } from './pages/admin/user/user-crud.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    canActivate: [SellerBuyerAuthGuardLogin],
    children: [
      { path: 'sign-in', component: SigninSignupComponent },
      { path: 'sign-up', component: SigninSignupComponent },
    ],
  },
  {
    path: '',
    canActivate: [AdminAuthGuardLogin],
    children: [{ path: 'admin-login', component: LoginComponent }],
  },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      { path: 'contact-us', component: ContactComponent },
      { path: 'my-profile', component: UserProfileComponent },
      //admin
      {
        path: '',
        canActivate: [AdminAuthGaurdService],
        children: [
          { path: 'admin-dashboard', component: AdminDashboardComponent },
          { path: 'admin/user', component: UserCrudComponent },
          { path: 'admin/product', component: ProductComponent },
        ],
      },
      {
        path: '',
        canActivate: [SellerAuthGaurdService],
        children: [
          { path: 'seller-dashboard', component: SellerDashboardComponent },
          { path: 'seller/product', component: ProductComponent },
        ],
      },
      {
        path: '',
        canActivate: [BuyerAuthGaurdService],
        children: [
          { path: 'buyer-dashboard', component: BuyerDashboardComponent },
          { path: 'checkout', component: CheckoutComponent },
        ],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];
