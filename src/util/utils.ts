import { Theme } from "@tolokoban/ui"

export function classNames(...args: unknown[]): string {
    return Theme.classNames.join(...args)
}
