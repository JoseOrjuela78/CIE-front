import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepass',
  standalone: true,
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ChangePassComponent implements OnInit{

  @Input() id_usuario!: number;
  changePassForm!: FormGroup;

  private activeModal = inject(NgbActiveModal);
  private userService = inject(UserService);

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

  changePassword() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Actualizando password...'

    });
    Swal.showLoading()
    console.log({ id_usuario: this.id_usuario, pass2: this.changePassForm.value.pass2})
    this.userService.passwordUser(this.id_usuario, this.changePassForm.value.pass2).subscribe({
      next: (res) => {
        Swal.close();
        this.activeModal.close('actualizado');
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Actualizando password'
        });
      }
    });
};

cancelar() {
    this.activeModal.dismiss('cancelado');
};

}
