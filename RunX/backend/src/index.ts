import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { getraces } from "./API/Races/races";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import {
  appgetEventPlugin,
  appgetfillterEventPlugin,
} from "./API/org_Events/Events";
import { appUser } from "./Server/serverUser";
import { appAdmin } from "./Server/serverAdmin";
import { resetpassword } from "./API/Users/users";
import { appUsers } from "./API/Users/users";
import { appRunnerPlugin } from "./API/Runners/runners";
import { appSingupPlugin } from "./API/Users/signup";
import { appLoginPlugin } from "./API/Users/login";

const app = new Elysia()

  .use(cors({ credentials: true }))
  .derive(async ({ jwt, headers }) => {
    const auth = headers.authorization; ///////authorization
    if (auth) {
      const convert = auth.startsWith("Bearer ") ? auth.slice(7) : null;
      const profile = await jwt.verify(convert!); //jwt.verify(convert!)
      return { profile };
    } else {
      return false;
    }
  })
  .get("/", () => "server Runx is running ")
  .use(swagger())
  .use(appLoginPlugin)
  .use(appUser)
  .use(appAdmin)
  .use(resetpassword)
  .use(appSingupPlugin)

  .use(appUsers)
  .use(appRunnerPlugin)
  .use(getraces)
  .use(appgetEventPlugin)
  .use(appgetfillterEventPlugin)

  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

//       Object.keys(reacesResult).length
