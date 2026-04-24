import { Tooltip, TooltipProps } from "@fluentui/react-components";
import React, { useState } from "react";

const isTouch = () => window.matchMedia("(hover: none)").matches;

export const DesktopTooltip: React.FC<TooltipProps> = (props) => {
    const [touch] = useState(isTouch);
    if (touch) return props.children as React.ReactElement;
    return <Tooltip {...props} />;
};
