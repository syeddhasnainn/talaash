import React from "react";

type IFrameProps = React.IframeHTMLAttributes<HTMLIFrameElement>;

export const IFrame = (props: IFrameProps) => {
  const { ...rest } = props;
  return (
    <iframe
      style={{ width: "100%", height: "100%", border: "none" }}
      {...rest}
    ></iframe>
  );
};
