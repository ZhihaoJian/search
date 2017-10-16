import { animate, AnimationEntryMetadata, state, transition, trigger, style } from '@angular/core';

export const slideInOutAnimation: AnimationEntryMetadata =
    trigger('routeAnimation', [
        state('*', style({
            opacity: 1,
            transform: 'translateX(35%)'
        })),
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateX(-100%)'
            }),
            animate('0.5s ease-in')
        ]),
        transition(':leave', [
            animate('0.5s 0.1s ease-out', style({
                opacity: 0,
                transform: 'translateX(100%)',
            }))
        ])
    ]);
