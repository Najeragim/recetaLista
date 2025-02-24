import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  usuario = { nombre: 'Juan Pérez', email: 'juan@example.com' };

  cerrarSesion() {
    console.log('Cerrando sesión...');
  }
}

