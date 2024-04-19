import { useCallback, useRef } from "react"

interface useIntersectionObserverProps {
    isFetching: boolean
    hasNextPage: boolean
    callback: () => void
}

// observer logic
export default function useIntersectionObserver<T extends HTMLElement>({
    callback,
    hasNextPage,
    isFetching,
}: useIntersectionObserverProps) {
    const observer = useRef<IntersectionObserver | null>(null)
    const elementRef = useCallback(
        (node: T | null) => {
            if (node === null) return
            if (isFetching) return
            if (observer.current !== null) {
                observer.current.disconnect()
            }
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    callback()
                }
            })
            observer.current.observe(node)
        },
        [isFetching, observer, callback, hasNextPage],
    )

    return { elementRef }
}
