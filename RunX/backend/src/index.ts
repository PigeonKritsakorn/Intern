import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { getraces } from "./races";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { appgetEventPlugin, appgetfillterEventPlugin } from "./Events";
// import { appUser } from "./server/serverUser";
// import { appAdmin } from "./server/serverAdmin";
// import { resetpassword } from "./api/user/users";
import { appUsers } from "./users";
import { appRunnerPlugin } from "./runners";
import { appSingupPlugin } from "../src/signup";
import { appLoginPlugin } from "./login";

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
  // .use(appUser)

  // .use(appAdmin)
  // .use(resetpassword)
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
