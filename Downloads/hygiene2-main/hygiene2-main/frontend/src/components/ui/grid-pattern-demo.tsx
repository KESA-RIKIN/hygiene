'use client'

import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern"

export function GridPatternCardDemo() {
    return (
        <GridPatternCard>
            <GridPatternCardBody>
                <h3 className="text-lg font-bold mb-1 text-foreground">
                    Grid Pattern with Ellipsis
                </h3>
                <p className="text-wrap text-sm text-foreground/60">
                    A sophisticated pattern combining grid layout with ellipsis dots.
                    Perfect for creating depth and visual interest while maintaining
                    readability and modern aesthetics.
                </p>
            </GridPatternCardBody>
        </GridPatternCard>
    )
}
