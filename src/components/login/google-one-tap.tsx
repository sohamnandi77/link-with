"use client";

import useOneTapSignin from "@/hooks/use-one-tap-sign-in";

const GoogleOneTapComponent = () => {
  const {} = useOneTapSignin({
    parentContainerId: "oneTap",
  });

  return <div id="oneTap" className="fixed right-0 top-0 z-[100]" />; // This is done with tailwind. Update with system of choice
};

export default GoogleOneTapComponent;
