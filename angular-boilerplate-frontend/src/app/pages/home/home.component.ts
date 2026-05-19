import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SandboxComponent } from '../sandbox/sandbox.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SandboxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
