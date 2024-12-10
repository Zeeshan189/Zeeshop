import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})

export class PageNotFoundComponent {

  constructor(private location:Location){}
  cancel(){
    this.location.back();
  }

}