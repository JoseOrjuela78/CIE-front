import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from "../../../../common/utilities.service";

@Component({
  selector: 'app-adduser',
  standalone: true,
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddUserComponent implements OnInit{

    private utils = inject(UtilitiesService);
    private modalService = inject(NgbModal);
    
    ngOnInit(): void {
        
    }
    
}