import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private alertController: AlertController, private router: Router) {}

  async onLogin() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:5000/login', loginData)
      .subscribe(async response => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/tabs/tab1']); // Redirect to /tabs/tab1 on successful login
      }, async error => {
        console.error('Error al iniciar sesión:', error);

        // Show alert dialog for incorrect credentials
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Usuario o contraseña incorrectos.',
          buttons: ['Aceptar']
        });

        await alert.present();
      });
  }
}
