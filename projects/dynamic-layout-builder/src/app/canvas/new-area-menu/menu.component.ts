import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NewAreaMenuService } from '../../services/new-area-menu.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatFormFieldModule,
    // MatInputModule,
    // FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Input() data: string[] =   [];
  @Input() trigger = "Trigger";
  @Input() isRootNode = false;

  id = signal('0')

  private newAreaMenuSvc = inject(NewAreaMenuService)

  isExpandable(node: string): boolean {
    return this.newAreaMenuSvc.isExpandable(node);
  }

  isLoading = false;
  dataLoaded = false;

  getData(menuNode: string) {
    if (!this.dataLoaded) {
      this.isLoading = true;
      this.newAreaMenuSvc.getChildren(menuNode).subscribe((d) => {
        this.data = d?.slice() || ([] as string[]);
        this.isLoading = false;
        this.dataLoaded = true;
      });
    }
  }

  onMenuClick(node: string): void {
    console.log(this.id())
    if (!this.newAreaMenuSvc.isExpandable(node)) {
      this.newAreaMenuSvc.runAction(node);
    }
  }

}
