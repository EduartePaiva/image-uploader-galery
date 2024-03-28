import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TooltipWrapperProps {
    children: React.ReactNode;
    tooltipMessage: string;
}

export default function TooltipWrapper({ children, tooltipMessage }: TooltipWrapperProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="z-10">{tooltipMessage}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}