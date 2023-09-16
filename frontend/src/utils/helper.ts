import { twMerge } from 'tailwind-merge';

export const concatClasses = (classes: string[]): string => twMerge(classes.join(' '));