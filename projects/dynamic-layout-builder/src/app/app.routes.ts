import { Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { AreaComponent } from './container/container.component';
import { HeaderComponent } from './header/header.component';
import { ParagraphComponent } from './paragraph/paragraph.component';

export const routes: Routes = [
    {path: 'create', component: CanvasComponent},
    {path: 'area', component: AreaComponent},
    {path: 'header', component: HeaderComponent},
    {path: 'paragraph', component: ParagraphComponent}
];
