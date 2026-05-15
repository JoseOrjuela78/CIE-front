import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

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