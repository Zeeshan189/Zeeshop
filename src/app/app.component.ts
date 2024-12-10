import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})

export class AppComponent {
  screenHeight:any;
  screenWidth:any;
  footerMaxHeight!:number;
  title = 'angularecommerce';

  constructor(){
    this.getScreenSize(event);
  }
  
  @HostListener('window:resize', ['$event'])
  getScreenSize(event:any){
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    //console.log(this.screenHeight, this.screenWidth)
    this.footerMaxHeight = this.screenHeight -160;
  }

}
