import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  listaCompras: any[] = [];

  constructor() {}

  ionViewWillEnter() {
    this.cargarLista();
  }

  cargarLista() {
    this.listaCompras = JSON.parse(localStorage.getItem('listaCompras') || '[]');
  }

  marcarCompletado(index: number, event: any) {
    this.listaCompras[index].completado = event.detail.checked; 
  localStorage.setItem('listaCompras', JSON.stringify(this.listaCompras));
  }

  eliminarItem(index: number) {
    this.listaCompras.splice(index, 1);
    localStorage.setItem('listaCompras', JSON.stringify(this.listaCompras));
  }

  eliminarTodo() {
    this.listaCompras = [];
    localStorage.removeItem('listaCompras');
  }
}

