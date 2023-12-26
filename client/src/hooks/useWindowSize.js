import { useState, useEffect } from "react";

function useWindowSize(breakpoint) {
  const [isWindowSmall, setIsWindowSmall] = useState(
    window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const checkSize = () => setIsWindowSmall(window.innerWidth < breakpoint);

    window.addEventListener("resize", checkSize);
    checkSize();

    return () => window.removeEventListener("resize", checkSize);
  }, [breakpoint]);

  return isWindowSmall;
}

export default useWindowSize;
