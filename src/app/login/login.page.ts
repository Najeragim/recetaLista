import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'; // Importar DomSanitizer

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

  constructor(
    private http: HttpClient, 
    private alertController: AlertController, 
    private router: Router,
    private sanitizer: DomSanitizer // Inyectar DomSanitizer para sanitizar entradas
  ) {}

  async onLogin() {
    // Sanitizar entradas antes de enviarlas
    const sanitizedEmail = this.sanitizeInput(this.email);
    const sanitizedPassword = this.sanitizeInput(this.password);

    // Validar que los campos no estén vacíos
    if (!sanitizedEmail || !sanitizedPassword) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Validar el formato del email
    if (!this.validateEmail(sanitizedEmail)) {
      await this.showAlert('Error', 'Correo electrónico inválido.');
      return;
    }

    const loginData = {
      email: sanitizedEmail,
      password: sanitizedPassword
    };

    this.http.post('http://localhost:5000/login', loginData)
      .subscribe(async response => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/tabs/tab1']); // Redirigir a /tabs/tab1 después de iniciar sesión
      }, async error => {
        console.error('Error al iniciar sesión:', error);
        await this.showAlert('Error', 'Usuario o contraseña incorrectos.');
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

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
