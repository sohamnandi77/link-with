import { env } from "@/env";
import {
  type CredentialResponse,
  type PromptMomentNotification,
} from "google-one-tap";
import { signIn, useSession, type SignInOptions } from "next-auth/react";
import { useEffect, useState } from "react";

interface OneTapSigninOptions {
  parentContainerId?: string;
}

const useOneTapSignin = (
  opt?: OneTapSigninOptions & Pick<SignInOptions, "redirect" | "callbackUrl">,
) => {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const { parentContainerId } = opt ?? {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn && !isLoading) {
      const { google } = window;
      if (google) {
        google.accounts.id.initialize({
          client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          prompt_parent_id: parentContainerId,
          callback: (response: CredentialResponse) => {
            setIsLoading(true);

            // Here we call our Provider with the token provided by google
            void signIn("googleonetap", {
              credential: response.credential,
              redirect: true,
              ...opt,
            });
            setIsLoading(false);
          },
        });

        // Here we just console.log some error situations and reason why the google one tap
        // is not displayed. You may want to handle it depending on yuor application
        google.accounts.id.prompt((notification: PromptMomentNotification) => {
          console.log(notification);
          if (notification.isNotDisplayed()) {
            console.log(notification.getNotDisplayedReason());
          } else if (notification.isSkippedMoment()) {
            console.log(notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log(notification.getDismissedReason());
          }
        });
      }
    }
  }, [isLoading, isSignedIn, opt, parentContainerId]);

  return { isLoading };
};

export default useOneTapSignin;
