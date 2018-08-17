import React from "react";
import ReactDOM from "react-dom";
import debounce from "lodash.debounce";
import {
  initializedState,
  slideHandler,
  changeSlide,
  getTrackLeft,
  getTrackAnimateCSS
} from "./utils/innerSliderUtils";

import { Track } from "./track";
import { Dots } from "./dots";
import ResizeObserver from "resize-observer-polyfill";

export class InnerSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 0,
      slideCount: this.props.children.length
    };
    this.debouncedResize = null;
    this.list = null;
    this.track = null;
  }

  listRefHandler = ref => (this.list = ref);
  trackRefHandler = ref => (this.track = ref);

  componentDidMount = () => {
    this.ro = new ResizeObserver(() => {
      this.onWindowResized();
    });
    this.ro.observe(this.list);
  };

  onWindowResized = () => {
    if (this.debouncedResize) this.debouncedResize.cancel();
    this.debouncedResize = debounce(this.resizeWindow, 50);
    this.debouncedResize();
  };

  resizeWindow = () => {
    if (!ReactDOM.findDOMNode(this.track)) return;
    let spec = {
      listRef: this.list,
      trackRef: this.track,
      ...this.props,
      ...this.state
    };
    this.updateState(spec);
  };

  updateState = spec => {
    let updatedState = initializedState(spec);
    spec = { ...spec, ...updatedState, slideIndex: updatedState.currentSlide };
    let targetLeft = getTrackLeft(spec);
    spec = { ...spec, left: targetLeft };
    let trackStyle = getTrackAnimateCSS(spec);
    updatedState["trackStyle"] = trackStyle;
    this.setState(updatedState);
  };

  slideHandler = index => {
    const { currentSlide, slideCount, slideWidth } = this.state;

    const {
      slidesToShow,
      unslick,
      slideIndex,
      left,
      speed,
      cssEase
    } = this.props;

    let state = slideHandler({
      index,
      trackRef: this.track,
      //state
      currentSlide,
      slideCount,
      slideWidth,
      //props
      slidesToShow,
      unslick,
      slideIndex,
      left,
      speed,
      cssEase
    });

    if (!state) return;

    this.setState(state);
  };

  changeSlide = options => {
    const spec = { ...this.props, ...this.state };

    let targetSlide = changeSlide(spec, options);
    if (targetSlide !== 0 && !targetSlide) return;
    this.slideHandler(targetSlide);
  };
  //listo
  slickPrev = () => this.changeSlide({ message: "previous" });
  //listo
  slickNext = () => this.changeSlide({ message: "next" });

  slickGoTo = slide => {
    slide = Number(slide);
    if (isNaN(slide)) return "";
    this.changeSlide({
      message: "index",
      index: slide,
      currentSlide: this.state.currentSlide
    });
  };

  render = () => {
    const {
      className: componentClass,
      slidesToShow,
      dotsClass,
      slidesToScroll,
      customPaging,
      appendDots
    } = this.props;

    const { slideCount, currentSlide, trackStyle } = this.state;

    var className = `slick-slider slick-initialized ${componentClass}`;

    return (
      <div className={className}>
        <div ref={this.listRefHandler} className={"slick-list"}>
          <Track
            ref={this.trackRefHandler}
            currentSlide={currentSlide}
            slidesToShow={slidesToShow}
            trackStyle={trackStyle}
          >
            {this.props.children}
          </Track>
        </div>

        {slideCount > slidesToShow ? (
          <Dots
            dotsClass={dotsClass}
            slideCount={slideCount}
            slidesToShow={slidesToShow}
            currentSlide={currentSlide}
            slidesToScroll={slidesToScroll}
            customPaging={customPaging}
            appendDots={appendDots}
            clickHandler={this.changeSlide}
          />
        ) : null}
      </div>
    );
  };
}
