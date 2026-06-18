import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-changepass',
  standalone: true,
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ChangePassComponent implements OnInit{
  
  @Input() identificacion!: any;
  changePassForm!: FormGroup;

  private activeModal = inject(NgbActiveModal);  
  
  ngOnInit(): void {
    this.changePassForm = new FormGroup({
        pass1: new FormControl('', [  Validators.required,
                                      Validators.minLength(8),
                                      Validators.maxLength(8),
                                      Validators.pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{1,8}$/)
                                    ]),
        pass2: new FormControl('', Validators.required)
       },
       {
        validators: this.matchPass('pass1', 'pass2')
       }
      );

  };

  matchPass(password1:string, password2:string){
    return(group:AbstractControl):ValidationErrors|null =>{
      const pass1 = group.get(password1)?.value;
      const pass2 = group.get(password2)?.value;
      
      if (pass1 === pass2) {
        return null; // ✅ válido
      }
      return { fieldsNotMatch: true };// ❌ error
    }
  };

  changePassword(){
    console.log(this.changePassForm.value);
    console.log(this.identificacion);
    this.activeModal.close('actualizado')
  };

  cancelar() {
    this.activeModal.dismiss('cancelado');
  };

}
