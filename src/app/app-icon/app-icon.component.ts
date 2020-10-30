import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'yeca-app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class AppIconComponent {

  svgStyle = {
    'border-width': '5px',
    'padding': '5px',    
  }

  @Input() set size(s: number) {
    this.width = `${s}px`;
    this.height = `${s}px`;
    const i = Math.round(s * .14);
    this.svgStyle["border-width"] = `${i}px`; 
    this.svgStyle["padding"] = `${i}px`; 
  }
  @Input() set pulse(b: boolean) {
    this.svgStyle['animation'] = b ? 'pulse 2s infinite' : 'none';
  }
  @HostBinding('style.width') width = '24px';
  @HostBinding('style.height') height = '24px';
}
