"use strict";

import React from "react";

var getDotCount = function(spec) {
  const { slideCount, slidesToShow, slidesToScroll } = spec;
  return Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1;
};

export class Dots extends React.PureComponent {
  clickHandler(options, e) {
    e.preventDefault();
    this.props.clickHandler(options);
  }
  render() {
    const {
      dotsClass,
      slideCount,
      slidesToShow,
      currentSlide,
      slidesToScroll
    } = this.props;

    var dotCount = getDotCount({
      slideCount: slideCount,
      slidesToScroll: slidesToScroll,
      slidesToShow: slidesToShow
    });

    var dots = [];
    for (let i = 0; i < dotCount; i++) {
      var leftBound = i * slidesToScroll;
      var rightBound = leftBound + (slidesToScroll - 1);

      var className =
        currentSlide >= leftBound && currentSlide <= rightBound
          ? "slick-active"
          : "";

      var dotOptions = {
        message: "dots",
        index: i,
        slidesToScroll: this.props.slidesToScroll,
        currentSlide: this.props.currentSlide
      };

      var onClick = this.clickHandler.bind(this, dotOptions);
      dots.push(
        <li key={i} className={className}>
          {this.props.customPaging(i, onClick)}
        </li>
      );
    }

    return this.props.appendDots(dots, dotsClass);
  }
}
