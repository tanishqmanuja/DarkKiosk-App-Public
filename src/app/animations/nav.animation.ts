import {AnimationController,Animation} from '@ionic/angular'

export function NavAnimation(baseEl: HTMLElement,opts?: any): Animation {
    const DURATION = 200;
    const animationCtrl = new AnimationController();

    let enterAnime = animationCtrl.create()
        .addElement(opts.enteringEl)
        .duration(opts.direction === 'forward' ? DURATION : 0)
        .easing('ease-in')
        .fromTo('opacity',0,1);
    let leaveAnime = animationCtrl.create()
        .addElement(opts.leavingEl)
        .duration(DURATION)
        .easing('ease-out')
        .fromTo('opacity',1,0);

    if(opts.direction === 'forward'){
        return enterAnime;
    } else {
        return animationCtrl.create().addAnimation([enterAnime,leaveAnime]);
    }
}