import { Routes } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WorkSpaceComponent } from './web-pages/work-space/work-space.component';
import { PreviewComponent } from './web-pages/preview/preview.component';
import { PresentationComponent } from './web-pages/presentation/presentation.component';

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
