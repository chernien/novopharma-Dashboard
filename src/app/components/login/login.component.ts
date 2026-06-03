import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginForm: FormGroup
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Commercial")!)

  constructor(private authservice: AuthService, private formBuilder: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('loggedIn') === "true";
    if (isLoggedIn) {
      // L'utilisateur est connecté, donc autorisé à accéder à la route
      this.route.navigateByUrl('/home')
    } 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  onLogin() {
    this.authservice.Login(this.loginForm.value).subscribe(
      (res: any) => {

        console.log(res);
        localStorage.setItem("Admin", JSON.stringify(res));
        localStorage.setItem("loggedIn", JSON.stringify(true))
        this.route.navigateByUrl("/home")
        Swal.fire({
          icon: 'success',
          text: 'Bienvenue Chez MSL Administration'
        })

      }, (err: any) => {
        Swal.fire({
          icon: 'error',
          text: "Nom d'utilisateur ou Mot de Passe Invalide !"
        })
      }
    )
  }

}
