import { Elysia, t } from "elysia";
import { appUsersPlugin } from "../src/users";
import { currentusersPlugin } from "../src/currentuser";
import { appuploadImg } from "../src/uploadImg";

export const appUser = new Elysia().guard(
  {
    beforeHandle: ({ set, profile }) => {
      if (!profile) {
        set.status = 401;
        return "Unauthorized";
      } else if (profile.role != "user") {
        return "Unauthorized";
      }
    },
  },
  (app) => app.use(appuploadImg).use(currentusersPlugin).use(appUsersPlugin)
);
