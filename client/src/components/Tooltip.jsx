import React, { Fragment } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { uniqueId } from "lodash";

const Tooltip = ({
  id,
  children,
  content,
  position,
  triggerClassName,
  effect,
  disableInternalStyle,
  type,
  offset,
  clickable,
  multiline,
  border,
  borderClass,
  textColor,
  backgroundColor,
  borderColor,
  arrowColor,
  insecure,
  class: customClass,
  className,
  html,
  delayHide,
  delayUpdate,
  delayShow,
  event,
  eventOff,
  isCapture,
  globalEventOff,
  getContent,
  afterShow,
  afterHide,
  overridePosition,
  disable,
  scrollHide,
  resizeHide,
  wrapper,
  bodyMode,
  possibleCustomEvents,
  possibleCustomEventsOff,
  role,
  padding,
}) => {
  const data_id = id || uniqueId(`tooltip-${uuidv4()}`);
  return (
    <Fragment>
      <div data-tip data-for={data_id} className={twMerge(triggerClassName)}>
        {children}
      </div>
      <ReactTooltip
        id={data_id}
        place={position}
        effect={effect}
        clickable={clickable}
        multiline={multiline}
        type={type}
        offset={offset}
        className={twMerge(className)}
        disableInternalStyle={disableInternalStyle}
        border={border}
        borderClass={borderClass}
        textColor={textColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        arrowColor={arrowColor}
        insecure={insecure}
        class={customClass}
        html={html}
        delayHide={delayHide}
        delayUpdate={delayUpdate}
        delayShow={delayShow}
        event={event}
        eventOff={eventOff}
        isCapture={isCapture}
        globalEventOff={globalEventOff}
        getContent={getContent}
        afterShow={afterShow}
        afterHide={afterHide}
        overridePosition={overridePosition}
        disable={disable}
        scrollHide={scrollHide}
        resizeHide={resizeHide}
        wrapper={wrapper}
        bodyMode={bodyMode}
        possibleCustomEvents={possibleCustomEvents}
        possibleCustomEventsOff={possibleCustomEventsOff}
        role={role}
        padding={padding}
      >
        {content}
      </ReactTooltip>
    </Fragment>
  );
};

Tooltip.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  uuid: PropTypes.string,
  position: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.oneOf([
    "dark",
    "success",
    "warning",
    "error",
    "info",
    "light",
  ]),
  effect: PropTypes.oneOf(["float", "solid"]),
  offset: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
  }),
  multiline: PropTypes.bool,
  border: PropTypes.bool,
  borderClass: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  arrowColor: PropTypes.string,
  insecure: PropTypes.bool,
  class: PropTypes.string,
  className: PropTypes.string,
  html: PropTypes.bool,
  delayHide: PropTypes.number,
  delayUpdate: PropTypes.number,
  delayShow: PropTypes.number,
  event: PropTypes.string,
  eventOff: PropTypes.string,
  isCapture: PropTypes.bool,
  globalEventOff: PropTypes.string,
  getContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  afterShow: PropTypes.func,
  afterHide: PropTypes.func,
  overridePosition: PropTypes.func,
  disable: PropTypes.bool,
  scrollHide: PropTypes.bool,
  resizeHide: PropTypes.bool,
  wrapper: PropTypes.oneOf(["div", "span"]),
  bodyMode: PropTypes.bool,
  possibleCustomEvents: PropTypes.string,
  possibleCustomEventsOff: PropTypes.string,
  clickable: PropTypes.bool,
  role: PropTypes.string,
  padding: PropTypes.string,
  disableInternalStyle: PropTypes.bool,
};

Tooltip.defaultProps = {
  effect: "solid",
  type: "dark",
};

export default Tooltip;
