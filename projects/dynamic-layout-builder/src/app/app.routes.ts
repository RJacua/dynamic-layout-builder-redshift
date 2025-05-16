import { Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { PreviewComponent } from './preview/preview.component';

export const routes: Routes = [
    {
        path: 'create',
        component: WorkSpaceComponent
    }, {
        path:'preview/:encoded',
        component: PreviewComponent
    }
];
