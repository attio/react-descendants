import React from "react"

export interface Descendant {
    hidden?: boolean
}

interface DescendantMap<TProps extends Descendant> {
    [key: string]: {index: number; props: TProps}
}

interface DescendantContextProviderContext<TProps extends Descendant> {
    get: (id: string, props: TProps) => number
    reset: () => void
    mapRef: React.RefObject<DescendantMap<TProps>>
}

export function createDescendantContext<TProps extends Descendant>() {
    const DescendantContextProvider =
        React.createContext<DescendantContextProviderContext<TProps> | null>(null)

    const DescendantTotalContext = React.createContext<number | null>(null)

    function useDescendants(): DescendantContextProviderContext<TProps> {
        const indexCounter = React.useRef(0)
        const mapRef = React.useRef<DescendantMap<TProps>>({})
        if (!mapRef.current) mapRef.current = {}

        const reset = () => {
            indexCounter.current = 0
            mapRef.current = {}
        }

        const get = (id: string, props: TProps) => {
            const hidden = props ? props.hidden : false
            if (!mapRef.current[id]) {
                mapRef.current[id] = {index: hidden ? -1 : indexCounter.current++, props}
            }
            mapRef.current[id].props = props
            return mapRef.current[id].index
        }

        return {get, mapRef, reset}
    }

    function DescendantsContextProvider({children}: React.PropsWithChildren) {
        const value = useDescendants()
        value.reset()

        const [total, setTotal] = React.useState(0)

        React.useLayoutEffect(() => {
            setTotal(Object.keys(value.mapRef.current).length)
        })

        return (
            <DescendantTotalContext.Provider value={total}>
                <DescendantContextProvider.Provider value={value}>
                    {children}
                </DescendantContextProvider.Provider>
            </DescendantTotalContext.Provider>
        )
    }

    function useDescendant(props: TProps) {
        const context = useMaybeDescendant(props)
        if (context === null) {
            throw new Error("useDescendant must be used within a DescendantContextProvider")
        }

        return context
    }

    function useMaybeDescendant(props: TProps) {
        const context = React.useContext(DescendantContextProvider)

        const descendantId = React.useId()
        const [index, setIndex] = React.useState(context?.get(descendantId, props) ?? -1)

        React.useLayoutEffect(() => {
            if (!context) return
            setIndex(context.get(descendantId, props))
        })

        return context ? index : null
    }

    function useMaybeDescendantTotal() {
        return React.useContext(DescendantTotalContext)
    }

    function useDescendantTotal() {
        const total = React.useContext(DescendantTotalContext)
        if (total === null) {
            throw new Error("useDescendantTotal must be used within a DescendantContextProvider")
        }
        return total
    }

    return {
        DescendantsContextProvider,
        useDescendant,
        useMaybeDescendant,
        useMaybeDescendantTotal,
        useDescendantTotal,
    }
}
