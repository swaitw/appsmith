import React, { ReactNode } from "react";
import { BaseStyle } from "widgets/BaseWidget";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import styled from "styled-components";
import { useClickOpenPropPane } from "utils/hooks/useClickOpenPropPane";
import { getAppMode } from "selectors/applicationSelectors";
import { useSelector } from "store";
import { APP_MODE } from "reducers/entityReducers/appReducer";

const PositionedWidget = styled.div`
  &.allow-hover:hover {
    z-index: 1;
  }
`;
type PositionedContainerProps = {
  style: BaseStyle;
  children: ReactNode;
  widgetId: string;
  widgetType: string;
};

export const PositionedContainer = (props: PositionedContainerProps) => {
  const x = props.style.xPosition + (props.style.xPositionUnit || "px");
  const y = props.style.yPosition + (props.style.yPositionUnit || "px");
  const padding = WIDGET_PADDING;
  const openPropertyPane = useClickOpenPropPane();
  const appMode = useSelector(getAppMode);
  const hoverClass = appMode === APP_MODE.EDIT ? "allow-hover" : "";
  return (
    <PositionedWidget
      onClickCapture={openPropertyPane}
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: props.style.componentHeight + (props.style.heightUnit || "px"),
        width: props.style.componentWidth + (props.style.widthUnit || "px"),
        padding: padding + "px",
      }}
      id={props.widgetId}
      //Before you remove: This is used by property pane to reference the element
      className={
        generateClassName(props.widgetId) +
        " " +
        `t--widget-${props.widgetType
          .split("_")
          .join("")
          .toLowerCase()} ${hoverClass}`
      }
    >
      {props.children}
    </PositionedWidget>
  );
};

PositionedContainer.padding = WIDGET_PADDING;

export default PositionedContainer;
