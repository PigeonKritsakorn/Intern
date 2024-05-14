import { Elysia, t } from "elysia";
import { appUpload } from "../API/Races/upload"
import {
  appPostOrgPlugin,
  appgetOrgPlugin,
} from "../API/org_Events/Organization";
import { appEventPlugin } from "../API/org_Events/Events";
import { appRacesPlugin, getraces } from "../API/Races/races";
import { appuploadImg } from "../API/Users/uploadImg";

export const appAdmin = new Elysia().guard(
  {
    beforeHandle: ({ set, profile }) => {
      if (!profile) {
        set.status = 401;
        return "Unauthorized";
      } else if (profile.role != "admin") {
        return "Unauthorized";
      }
    },
  },
  (app) =>
    app
      .use(appUpload)
      .use(appuploadImg)
      .use(appPostOrgPlugin)
      .use(appEventPlugin)
      .use(appRacesPlugin)
      .use(appgetOrgPlugin)
);
