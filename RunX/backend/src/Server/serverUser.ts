import { Elysia, t } from "elysia";
import { appUsersPlugin } from "../API/Users/users";
import { currentusersPlugin } from "../API/Users/currentuser";
import { appuploadImg } from "../API/Users/uploadImg";

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
