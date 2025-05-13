import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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

  @Input() data: {
    id: string,
    rootNodes: string[],
  } = {id: '0', rootNodes: []}
;
  @Input() trigger = "Trigger";
  @Input() isRootNode = false;

  private newAreaMenuSvc = inject(NewAreaMenuService)

  isExpandable(node: string): boolean {
    return this.newAreaMenuSvc.isExpandable(node);
  }

  isLoading = false;
  dataLoaded = false;

  getData(node: string, data: any) {
    if (!this.dataLoaded) {
      this.isLoading = true;
      this.newAreaMenuSvc.getChildren(node).subscribe((d) => {
        this.data.rootNodes = d?.slice() || ([] as string[]);
        this.data.id = data.id;
        this.isLoading = false;
        this.dataLoaded = true;
      });
    }
  }

  onMenuClick(node: string): void {
    console.log(this.data)
    if (!this.newAreaMenuSvc.isExpandable(node)) {
      this.newAreaMenuSvc.runAction(node, this.data.id);
    }
  }

}
