import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular'; // Import AlertController
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  email: string = '';
  registrationMessage: string = '';

  constructor(private http: HttpClient, private alertController: AlertController) {} // Inject AlertController

  async onRegister() {
    const userData = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    this.http.post('http://localhost:5000/register', userData)
      .subscribe(async response => {
        this.registrationMessage = 'Registro exitoso';
        console.log('Registro exitoso:', response);

        // Show alert dialog
        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'El usuario se ha registrado correctamente.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              // Redirect to login page
              window.location.href = '/login';
            }
          }]
        });

        await alert.present();
      }, error => {
        this.registrationMessage = 'Error en el registro';
        console.error('Error en el registro:', error);
      });
  }
}
