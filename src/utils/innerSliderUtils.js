import ReactDOM from "react-dom";

export const getWidth = elem => (elem && elem.offsetWidth) || 0;

export const initializedState = spec => {
  const slideCount = spec.children.length;
  const listRef = ReactDOM.findDOMNode(spec.listRef);
  const trackRef = ReactDOM.findDOMNode(spec.trackRef);

  const listWidth = Math.ceil(getWidth(listRef));
  const trackWidth = Math.ceil(getWidth(trackRef));

  const slideWidth = Math.ceil(listWidth / spec.slidesToShow);
  let currentSlide =
    spec.currentSlide === undefined ? spec.initialSlide : spec.currentSlide;

  let state = {
    slideCount,
    slideWidth,
    listWidth,
    trackWidth,
    currentSlide
  };

  return state;
};

export const changeSlide = (spec, options) => {
  var slideOffset, targetSlide;

  const { slidesToScroll, slidesToShow, slideCount, currentSlide } = spec;

  const indexOffset =
    slideCount % slidesToScroll !== 0
      ? 0
      : (slideCount - currentSlide) % slidesToScroll;

  switch (options.message) {
    case "previous":
      slideOffset =
        indexOffset === 0 ? slidesToScroll : slidesToShow - indexOffset;
      targetSlide = currentSlide - slideOffset;
      break;
    case "next":
      slideOffset = indexOffset === 0 ? slidesToScroll : indexOffset;
      targetSlide = currentSlide + slideOffset;
      break;
    case "dots":
      targetSlide = options.index * options.slidesToScroll;
      if (targetSlide === options.currentSlide) {
        return null;
      }
      break;
    case "index":
      targetSlide = Number(options.index);
      if (targetSlide === options.currentSlide) return null;
  }
  return targetSlide;
};

export const getTrackAnimateCSS = spec => {
  const { left, slideCount, slideWidth, speed, cssEase, slidesToShow } = spec;

  const width = slideCount * slideWidth;
  const WebkitTransform = `translate3d(${left}px, 0px, 0px)`;
  const transform = `translate3d(${left}px, 0px, 0px)`;
  const msTransform = `translateX(${left}px)`;
  const WebkitTransition = `-webkit-transform ${speed}ms ${cssEase}`;
  const transition = `transform ${speed}ms ${cssEase}`;

  return {
    width,
    WebkitTransform,
    transform,
    msTransform,
    WebkitTransition,
    transition
  };
};

export const slideHandler = spec => {
  const { index, slideCount, currentSlide, slidesToShow } = spec;

  let finalSlide = index;
  if (finalSlide < 0) {
    finalSlide = 0;
  } else if (finalSlide > currentSlide && finalSlide >= slideCount) {
    finalSlide = currentSlide;
  } else if (finalSlide >= slideCount) {
    finalSlide = slideCount - slidesToShow;
  }

  const animationLeft = getTrackLeft({ ...spec, slideIndex: finalSlide });
  const trackStyle = getTrackAnimateCSS({ ...spec, left: animationLeft });

  return {
    currentSlide: finalSlide,
    trackStyle: trackStyle
  };
};

export const getTrackLeft = spec => {
  if (spec.unslick) {
    return 0;
  }

  const { slideIndex, trackRef } = spec;

  let trackElem = ReactDOM.findDOMNode(trackRef);
  let targetSlide = trackElem && trackElem.childNodes[slideIndex];

  return targetSlide ? targetSlide.offsetLeft * -1 : 0;
};
