import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ComponentRegistryService } from './app/services/component-registry.service';
import { HeaderComponent } from './app/header/header.component';
import { ParagraphComponent } from './app/paragraph/paragraph.component';
import { ContainerComponent } from './app/container/container.component';
import { APP_INITIALIZER } from '@angular/core';

const extendedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // mantém os providers existentes

    ComponentRegistryService, // garante que o service será injetado

    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (registry: ComponentRegistryService) => () => {
    //     registry.register('paragraph', ParagraphComponent);
    //     registry.register('header', HeaderComponent);
    //     registry.register('container', ContainerComponent);
    //   },
    //   deps: [ComponentRegistryService],
    //   multi: true
    // }
    
  ]
};

bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));
