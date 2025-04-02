import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser'; // Importar DomSanitizer
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

  constructor(
    private http: HttpClient, 
    private alertController: AlertController, 
    private sanitizer: DomSanitizer // Inyectar DomSanitizer
  ) {}

  async onRegister() {
    // Sanitizar entradas
    const sanitizedUsername = this.sanitizeInput(this.username);
    const sanitizedEmail = this.sanitizeInput(this.email);
    const sanitizedPassword = this.sanitizeInput(this.password);

    // Validar que los campos no estén vacíos
    if (!sanitizedUsername || !sanitizedEmail || !sanitizedPassword) {
      this.registrationMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Validar email con expresión regular
    if (!this.validateEmail(sanitizedEmail)) {
      this.registrationMessage = 'Correo electrónico inválido.';
      return;
    }

    const userData = {
      username: sanitizedUsername,
      password: sanitizedPassword,
      email: sanitizedEmail
    };

    this.http.post('http://localhost:5000/register', userData)
      .subscribe(async response => {
        this.registrationMessage = 'Registro exitoso';
        console.log('Registro exitoso:', response);

        // Mostrar alerta de éxito
        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'El usuario se ha registrado correctamente.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
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

  // Función para sanitizar entradas y evitar XSS
  sanitizeInput(input: string): string {
    return this.sanitizer.sanitize(1, input) || '';
  }

  // Función para validar el formato del email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
