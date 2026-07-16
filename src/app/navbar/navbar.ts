import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() saveTemplate = new EventEmitter<void>();
@Output() loadTemplate = new EventEmitter<void>();

  save() {
  this.saveTemplate.emit();
}
load() {
  this.loadTemplate.emit();
}
}
