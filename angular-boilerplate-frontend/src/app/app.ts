import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUiComponent } from './shared/components/block-ui/block-ui.component';
import { BlockUiService } from './core/services/helper/block-ui.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlockUiComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'ทดสอบ';

  constructor(public blockUiService: BlockUiService) { }
}
