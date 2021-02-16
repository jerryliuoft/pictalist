import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
// STOLE THIS FROM https://fireship.io/lessons/angular-router-animations/
export const slider = trigger('routeAnimations', [
  transition('isRight => isLeft', slideTo('left')),
  transition('isLeft => isRight', slideTo('right')),
  transition('* => isLeft', slideTo('left')),
  transition('* => isRight', slideTo('left')),
  transition('isRight => *', slideTo('right')),
  transition('isLeft => *', slideTo('right')),
]);

function slideTo(direction: string) {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '',
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('600ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))]),
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild(), optional),
    // query(':enter', animateChild(), optional),
  ];
}
