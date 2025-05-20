import { Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { PreviewComponent } from './preview/preview.component';
import { PresentationComponent } from './presentation/presentation.component';

export const routes: Routes = [
    {
        path: 'create',
        component: WorkSpaceComponent
    }, {
        path:'preview',
        component: PreviewComponent
    }, {
        path:'presentation',
        component: PresentationComponent
    }
];
