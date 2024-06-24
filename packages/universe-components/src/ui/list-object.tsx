import * as React from "react"

import { cn } from "@/lib/shadCnUtil"
import { LucideIcon } from "lucide-react"

export interface ListObjectProps
    extends React.HTMLAttributes<HTMLLIElement> {
    Icon: LucideIcon,
    text: string,
}

const ListObject = React.forwardRef<HTMLLIElement, ListObjectProps>(
    ({ className, Icon, text, ...props }, ref) => {
        return (
            <li
                key={text}
                ref={ref}
                className={cn(
                    "inline-flex gap-3 text-sm font-semibold",
                    className
                )}
                {...props}
            >
                <Icon size={17} />
                {text}
            </li>
        )
    }
)
ListObject.displayName = "list-object"

export { ListObject }
