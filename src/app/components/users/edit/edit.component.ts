import { Component, signal, computed, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassComponent } from './modal/changepass/changepass.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  private modalService = inject(NgbModal);

  openChangePass() {
    const modalref = this.modalService.open(ChangePassComponent);
  }
}
