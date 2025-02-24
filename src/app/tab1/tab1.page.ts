import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  recetas: any[] = [];
  terminoBusqueda: string = '';

  constructor(private http: HttpClient, private toastController: ToastController) {}

  buscarRecetas(event: any) {
    this.terminoBusqueda = event.target.value.trim();
    if (this.terminoBusqueda.length > 0) {
      this.obtenerRecetas(this.terminoBusqueda);
    } else {
      this.recetas = [];
    }
  }

  obtenerRecetas(termino: string) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${termino}`;

    this.http.get(url).subscribe((res: any) => {
      this.recetas = res.meals ? res.meals.map((meal: { idMeal: any; strMeal: any; strMealThumb: any; }) => ({
        id: meal.idMeal,
        nombre: meal.strMeal,
        imagen: meal.strMealThumb,
        ingredientes: this.obtenerIngredientes(meal)
      })) : [];
    });
  }

  obtenerIngredientes(meal: any) {
    let ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      let ingrediente = meal[`strIngredient${i}`];
      let cantidad = meal[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push({ nombre: ingrediente, cantidad: cantidad.trim() });
      }
    }
    return ingredientes;
  }

  async agregarALista(receta: { ingredientes: any[]; }) {
    let listaCompras = JSON.parse(localStorage.getItem('listaCompras') || '[]');

    receta.ingredientes.forEach(nuevoIngrediente => {
      let existente = listaCompras.find((item: { nombre: any; }) => item.nombre === nuevoIngrediente.nombre);

      if (existente) {
        existente.cantidad = this.sumarCantidades(existente.cantidad, nuevoIngrediente.cantidad);
      } else {
        listaCompras.push(nuevoIngrediente);
      }
    });

    localStorage.setItem('listaCompras', JSON.stringify(listaCompras));

    const toast = await this.toastController.create({
      message: 'Ingredientes añadidos a la lista de compras.',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  sumarCantidades(cantidad1: string, cantidad2: string): string {
    let num1 = parseFloat(cantidad1) || 0;
    let num2 = parseFloat(cantidad2) || 0;
    let unidad1 = cantidad1.replace(/[0-9.]/g, '').trim();
    let unidad2 = cantidad2.replace(/[0-9.]/g, '').trim();

    if (unidad1 === unidad2 || unidad2 === '') {
      return `${num1 + num2} ${unidad1}`.trim();
    }

    return `${cantidad1} + ${cantidad2}`;
  }
}

