"use client"

import { ArrowBigUp } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

export default function BackToTopButton() {
    const [btnOpacity, setBtnOpacity] = useState<0 | 90>(0)

    useEffect(() => {
        const scrollListener = (_: Event) => {
            if (document.documentElement.scrollTop > 100) {
                setBtnOpacity(90)
            } else {
                setBtnOpacity(0)
            }
            document.removeEventListener("scroll", scrollListener)
            setTimeout(() => {
                document.addEventListener("scroll", scrollListener)
            }, 1000)
        }
        document.addEventListener("scroll", scrollListener)
        return () => document.removeEventListener("scroll", scrollListener)
    }, [])

    return (
        <Button
            size={"icon"}
            variant={"secondary"}
            style={{ opacity: btnOpacity }}
            className="fixed top-[calc(100%-5rem)] right-5 h-14 w-14 font-medium transition-opacity"
            onClick={() => {
                document.body.scrollIntoView({ behavior: "smooth" })
                setTimeout(() => setBtnOpacity(0), 1000)
            }}
        >
            <ArrowBigUp size={38} />
        </Button>
    )
}
