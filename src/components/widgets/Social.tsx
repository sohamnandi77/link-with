"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import GoogleOneTapComponent from "../login/google-one-tap";

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = async (provider: "google" | "github") => {
    try {
      await signIn(provider, {
        callbackUrl: callbackUrl ?? "/login",
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-y-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        Login with Google
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        Login with Github
      </Button>
      <GoogleOneTapComponent />
    </div>
  );
};

export default Social;
