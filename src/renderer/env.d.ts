/// <reference types="vite/client" />
declare module "*.svg?react" {
  import React = require("react");
  export default React.SFC<React.SVGProps<SVGSVGElement>>;
}
