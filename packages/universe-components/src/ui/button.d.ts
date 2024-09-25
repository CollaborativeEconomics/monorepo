import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "lg" | "sm" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
export interface ClaimButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    status: string;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
declare const ClaimButton: React.ForwardRefExoticComponent<ClaimButtonProps & React.RefAttributes<HTMLDivElement>>;
export { Button, ClaimButton, buttonVariants };
//# sourceMappingURL=button.d.ts.map