import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector:'register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myRegisterForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]]
  });

  signIn(){
    const {name, email, password, password2} = this.myRegisterForm.value;
    if(password === password2){
      this.authService.signin(name!, email!, password!)
      .subscribe({
        next: () => {this.router.navigateByUrl('/auth/login')
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registro exitoso!",
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          Swal.fire('Oops...', error, 'error')
        }
      })
    }
    else{
      Swal.fire('Oops...','No coincide la contraseña', 'error' )
    }
  }
}
