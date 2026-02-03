import React from "react"

interface CustomEvent<T> {
    addListener(listener: (v: T) => void): void
    removeListener(listener: (v: T) => void): void
}

export function useEventValue<T>(initialValue: T, event?: CustomEvent<T>): T {
    const [value, setValue] = React.useState<T>(initialValue)
    React.useEffect(() => {
        if (!event) return

        event.addListener(setValue)
        return () => event.removeListener(setValue)
    }, [event])
    return value
}
