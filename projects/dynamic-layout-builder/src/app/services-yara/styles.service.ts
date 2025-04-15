import { inject, Injectable } from '@angular/core';
import { BackgroundStylesService } from './backgroundStyles.service';
import { BorderStylesService } from './borderStyles.service';
import { CornerStylesService } from './cornerStyles.service';
import { SelectionService } from './selection.service';
import { TextStylesService } from './textStyles.service';
import { combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StylesService {
  private bgStylesService = inject(BackgroundStylesService)
  private textStylesService = inject(TextStylesService)
  private borderStylesService = inject(BorderStylesService)
  private cornerStylesService = inject(CornerStylesService)

  // Background Styles
  bgColor$ = this.bgStylesService.bgColor$;
  bgOpacity$ = this.bgStylesService.bgOpacity$;
  // Text Styles
  fontSize$ = this.textStylesService.fontSize$;
  fontWeight$ = this.textStylesService.fontWeight$;
  fontColor$ = this.textStylesService.fontColor$;
  horizontalAlign$ = this.textStylesService.horizontalAlign$;
  // Border Styles
  enableStroke$ = this.borderStylesService.enableStroke$;
  strokeColor$ = this.borderStylesService.strokeColor$;
  strokeRadius$ = this.cornerStylesService.strokeRadius$;
  strokeStyle$ = this.borderStylesService.strokeStyle$;
  strokeWidth$ = this.borderStylesService.strokeWidth$;
  // Corner Styles
  enableIndividualCorner$ = this.cornerStylesService.enableIndividualCorner$;
  topLeft$ = this.cornerStylesService.topLeft$;
  topRight$ = this.cornerStylesService.topRight$;
  bottomLeft$ = this.cornerStylesService.bottomLeft$;
  bottomRight$ = this.cornerStylesService.bottomRight$;

  readonly defaultBorder = '1px solid #81828555';
  readonly dynamicStyles$ = combineLatest([
    this.bgColor$,
    this.bgOpacity$,
    this.fontSize$,
    this.fontWeight$,
    this.fontColor$,
    this.horizontalAlign$
  ]).pipe(
    map(([bgColor, bgOpacity, fontSize, fontWeight, fontColor, horizontalAlign]) => ({
      'background-color': bgColor,
      'opacity': bgOpacity,
      'font-size': fontSize + 'px',
      'font-weight': fontWeight,
      'color': fontColor,
      'text-align': horizontalAlign,
    }))
  );

  readonly dynamicBorder$ = combineLatest([
    this.enableStroke$,
    this.strokeColor$,
    this.strokeStyle$,
    this.strokeWidth$
  ]).pipe(
    map(([enabled, strokeColor, strokeStyle, strokeWidth]) =>
      enabled ? `${strokeWidth}px ${strokeStyle} ${strokeColor}` : `${this.defaultBorder}`)
  );
  readonly individualDynamicCornerRadius$ = combineLatest([
    this.enableIndividualCorner$,
    this.topLeft$,
    this.topRight$,
    this.bottomLeft$,
    this.bottomRight$
  ]).pipe(
    map(([enable, topLeft, topRight, bottomLeft, bottomRight]) => ({
      'border-top-left-radius': enable ? `${topLeft}px` : '0',
      'border-top-right-radius': enable ? `${topRight}px` : '0',
      'border-bottom-left-radius': enable ? `${bottomLeft}px` : '0',
      'border-bottom-right-radius': enable ? `${bottomRight}px` : '0',
    }))
  );

}
