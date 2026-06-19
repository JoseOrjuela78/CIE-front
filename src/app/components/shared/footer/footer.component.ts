import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports:[CommonModule]
})
export class FooterComponent {
  today = new Date();
  company = 'CIE DE COLOMBIA SAS'
  version = '6.0.0';

}
