import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ComponentRegistryService } from './services/component-registry.service';
import { ContainerComponent } from './components/container/container.component';
import { HeaderComponent } from './components/header/header.component';
import { ParagraphComponent } from './components/paragraph/paragraph.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => {
      const registry = inject(ComponentRegistryService);

      registry.register('paragraph', ParagraphComponent);
      registry.register('header', HeaderComponent);
      registry.register('container', ContainerComponent);
    })
  ]
};
