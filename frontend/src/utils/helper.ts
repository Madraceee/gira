import { twMerge } from 'tailwind-merge';

export const concatClasses = (classes: string[]): string => twMerge(classes.join(' '));

export const dateToString = (input : string) : string =>{
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    return `${day}-${month}-${year}`;
}