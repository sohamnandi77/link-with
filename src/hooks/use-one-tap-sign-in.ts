import { env } from "@/env";
import {
  type CredentialResponse,
  type PromptMomentNotification,
} from "google-one-tap";
import { signIn, useSession, type SignInOptions } from "next-auth/react";
import { useTransition } from "react";

interface OneTapSigninOptions {
  parentContainerId?: string;
}

const useOneTapSignin = (
  options?: OneTapSigninOptions &
    Pick<SignInOptions, "redirect" | "callbackUrl">,
) => {
  const { parentContainerId } = options ?? {};
  const [isLoading, startTransition] = useTransition();

  // Taking advantage in recent development of useSession hook.
  // If user is unauthenticated, google one tap ui is initialized and rendered
  useSession({
    required: true,
    onUnauthenticated() {
      if (!isLoading) {
        const { google } = window;
        if (google) {
          google.accounts.id.initialize({
            client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            // auto_select: true, // ? Uncomment this line if you want to skip the one tap UI
            callback: (response: CredentialResponse) => {
              // Here we call our Provider with the token provided by google
              startTransition(async () => {
                await signIn("googleonetap", {
                  credential: response.credential,
                  redirect: true,
                  ...options,
                });
              });
            },
            prompt_parent_id: parentContainerId,
          });

          // Here we just console.log some error situations and reason why the google one tap
          // is not displayed. You may want to handle it depending on yuor application
          google.accounts.id.prompt(
            (notification: PromptMomentNotification) => {
              if (notification.isNotDisplayed()) {
                console.log(
                  "getNotDisplayedReason: ",
                  notification.getNotDisplayedReason(),
                );
              } else if (notification.isSkippedMoment()) {
                console.log(
                  "getSkippedReason: ",
                  notification.getSkippedReason(),
                );
              } else if (notification.isDismissedMoment()) {
                console.log(
                  "getDismissedReason: ",
                  notification.getDismissedReason(),
                );
              }
            },
          );
        }
      }
    },
  });
};

export default useOneTapSignin;
