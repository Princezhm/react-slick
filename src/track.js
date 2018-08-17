import React from "react";

export class Track extends React.PureComponent {
  render() {
    const { children, currentSlide, slidesToShow } = this.props;
    return (
      <div className="slick-track" style={this.props.trackStyle}>
        {children.map((child, index) => {
          const ownClassName =
            child.props && child.props.className ? child.props.className : "";
          const generatedClassName =
            ownClassName +
            (currentSlide <= index && index < currentSlide + slidesToShow
              ? " slick-slide slick-active"
              : " slick-slide");

          return (
            <div
              key={child.key}
              className={generatedClassName}
              style={{
                outline: "none",
                ...(child.props.style || {})
              }}
              onClick={e =>
                child.props && child.props.onClick && child.props.onClick(e)
              }
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}
