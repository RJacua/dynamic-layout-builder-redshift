import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ComponentRegistryService } from './app/services/component-registry.service';

const extendedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 

    ComponentRegistryService, 

  ]
};

bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));
