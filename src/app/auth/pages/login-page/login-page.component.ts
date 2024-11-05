import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)


  public myForm:FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login(){
    const {email, password} = this.myForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => {this.router.navigateByUrl('/dashboard')
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Bienvenido",
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          Swal.fire('Oops...', error, 'error')
        }
      })
  }

}
