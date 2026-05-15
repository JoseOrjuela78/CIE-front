import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-permits',
  standalone: true,
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.css']
})
export class PermitsComponent {

   // 🔥 estado reactivo con signals
  count = signal(0);

  // 🔥 valor derivado
  doubleCount = computed(() => this.count() * 2);

  // acciones
  increment() {
    this.count.update(value => value + 1);
  }

  decrement() {
    this.count.update(value => value - 1);
  }

  reset() {
    this.count.set(0);
  }
}