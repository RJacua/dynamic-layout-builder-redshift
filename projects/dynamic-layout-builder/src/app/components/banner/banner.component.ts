import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService, BannerPayload } from '../../services/banner.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnInit {
  private bannerSvc = inject(BannerService);
  @Input() config!: BannerPayload; 
  visible = false;
  hiding = false;

  ngOnInit() {
    // Fade-in
    setTimeout(() => (this.visible = true), 50);

    // Auto-hide com fade-out
    if (this.config.autoHideMs) {
      setTimeout(() => this.hide(), this.config.autoHideMs);
    }
  }

  hide() {
    if (this.hiding) return;
    this.hiding = true;
    this.visible = false;

    setTimeout(() => {
      this.bannerSvc.close(null);
    }, 600); // tempo do fade
  }

  onAction(id: string) {
    if (this.config._resolve) {
      this.config._resolve(id);
    }
    this.hide();
  }
}
