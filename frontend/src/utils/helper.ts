import { twMerge } from 'tailwind-merge';

export const concatClasses = (classes: string[]): string => twMerge(classes.join(' '));

export const dateToString = (input : string) : string =>{
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    return `${day}-${month}-${year}`;
}

export const inputDate = (date: Date) : string=>{
    return (date.getFullYear().toString()+"-"+(date.getMonth()+1).toString().padStart(2,"0")+"-"+date.getDate().toString().padStart(2,"0"))
}