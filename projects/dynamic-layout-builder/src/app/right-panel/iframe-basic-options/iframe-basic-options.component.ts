import { CommonModule } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { SelectionService } from '../../services/selection.service';
import { BorderStylesService } from '../../services/styles/border-styles.service';
import { IframeStylesService } from '../../services/styles/iframe-styles.service';
import { Styles } from '../../interfaces/layout-elements';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-iframe-basic-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './iframe-basic-options.component.html',
  styleUrl: './iframe-basic-options.component.scss'
})
export class IframeBasicOptionsComponent {

  private iframeBasicSvc = inject(IframeStylesService);
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;

  urlInput = new FormControl();
  altInput = new FormControl();
  tooltipInput = new FormControl();

    constructor() {
    
    effect(() => {
      const node = this.selectedNode();
      if (!node) return;

      this.urlInput.setValue(node.data.src  ?? '');
      this.altInput.setValue(node.data.alt  ?? '');
      this.tooltipInput.setValue(node.data.tooltip  ?? '');


    });
  }

  ngOnInit() {

    this.urlInput.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(url => {
        // console.log('Add url:', url);
        if (url !== null)
          this.iframeBasicSvc.setUrl(url);
      });
      
      this.altInput.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(alt => {
          // console.log('Add alt:', alt);
          if (alt !== null)
            this.iframeBasicSvc.setAlt(alt);
        });

        this.tooltipInput.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(tooltip => {
          // console.log('Add tooltip:', tooltip);
          if (tooltip !== null)
            this.iframeBasicSvc.setTooltip(tooltip);
        });

  }

}
