import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // 🔥 estado reactivo con signals
  count = signal(0);

  // 🔥 valor derivado
  doubleCount = computed(() => this.count() * 2);
profileForm: any;

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
