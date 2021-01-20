import { Directive, ContentChildren, QueryList, ElementRef, Renderer2, Input, AfterContentInit } from '@angular/core';
import { IonCard } from '@ionic/angular';

@Directive({
  selector: '[animateIonCards]'
})
export class AnimateItemsDirective implements AfterContentInit {
  @ContentChildren(IonCard, {read: ElementRef}) items: QueryList<ElementRef>;

  @Input() animateOnce: boolean = false

  private observer: IntersectionObserver;

  constructor(private renderer: Renderer2) { 

  }

  ngAfterContentInit(){
    if(this.observer) this.observer.disconnect()
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if(!entry.isIntersecting){
          this.renderer.addClass(entry.target, 'exit-enter-styles');
        } else {
          this.renderer.removeClass(entry.target, 'exit-enter-styles');
          if(this.animateOnce == true) this.observer.unobserve(entry.target)
        }
      })

    }, {threshold: 0.5});

    this.items.forEach(item => {
      this.observer.observe(item.nativeElement);
    });
    this.items.changes.subscribe(items=>{
      if(this.observer) this.observer.disconnect()
      items.forEach(item => {
        this.observer.observe(item.nativeElement);
      });
    })
  }
    
}