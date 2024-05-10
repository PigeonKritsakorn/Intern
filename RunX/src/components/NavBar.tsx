import { Button } from "@/components/ui/button";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Stack, Box, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import GoogleLogoutBT from "./GoogleLogout";
import Login from "@/pages/Login";
import RunxBlue from "../assets/RunXBlue.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserLogin, getAdminLogin, setAdminLogin } from "@/lib/storage";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../components/colors";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(getUserLogin());

  const auth = isLoggedIn;
  const authAdmin = localStorage.getItem("AdminToken");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const Tosignup = () => {
    navigate("/Signup");
  };
  const Tologin = () => {
    navigate("/Login");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [data, setData] = useState<any[]>([]);

  const SHEET_SIDES = ["left"] as const;
  type SheetSide = (typeof SHEET_SIDES)[number];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dataFetch, setDataFetch] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigateTo = useNavigate();

  const fetchDataCur = () => {
    const authToken = localStorage.getItem("Login");
    axios
      .get("http://localhost:3000/currentusers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((dataFetch) => {
        setDataFetch(dataFetch);
        console.log(dataFetch);
        navigateTo(
          `/RunnerProfile/${dataFetch.user.firstname_eng}_${dataFetch.user.lastname_eng}`
        );
      })
      .catch((error) => {
        setError(
          "There was a problem with the fetch operation: " + error.message
        );
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const goToUploadPage = () => {
    window.location.href = "/admin";
  };

  return (
    <div>
      {auth || authAdmin ? (
        <nav className="w-full z-10 bg-white navShadowBottom">
          <div className="mx-auto px-5">
            <div className="relative flex h-16  items-center w-full ">
              <div className="flex items-center justify-center sm:items-stretch xs:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-8 w-auto"
                      src={RunxBlue}
                      alt="Your Company"
                    />
                  </Link>
                </div>
                {isMobile ? (
                  <div
                    className="flex justify-center sm:items-stretch xs:justify-end "
                    style={{ paddingLeft: "10px" }}
                  >
                    {SHEET_SIDES.map((side) => (
                      <Sheet key={side}>
                        <SheetTrigger asChild>
                          {/* <Button variant="outline">{side}</Button> */}
                          <Button variant="outline">
                            <FontAwesomeIcon icon={faBars} />
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side={side}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                          }}
                        >
                          <SheetHeader className="space-y-4">
                            <SheetTitle className="xs:text-lg">Menu</SheetTitle>
                            <NavLink
                              to="/"
                              className={({ isActive }) =>
                                "text-center transition-all duration-700 " +
                                (isActive
                                  ? "bg-black text-white rounded-md p-1 px-4"
                                  : "opacity-40")
                              }
                            >
                              Runners
                            </NavLink>
                            <NavLink
                              to="/races"
                              className={({ isActive }) =>
                                "text-center transition-all duration-700 " +
                                (isActive
                                  ? "bg-black text-white rounded-md p-1 px-4"
                                  : "opacity-40")
                              }
                            >
                              Races
                            </NavLink>
                            <NavLink
                              to="/AboutUs"
                              className={({ isActive }) =>
                                "text-center transition-all duration-700 " +
                                (isActive
                                  ? "bg-black text-white rounded-md p-1 px-4"
                                  : "opacity-40")
                              }
                            >
                              About Us
                            </NavLink>
                          </SheetHeader>

                          <SheetFooter
                            style={{ marginTop: "auto" }}
                            className="flex flex-col space-y-2"
                          >
                            <SheetClose asChild>
                              <div className="flex flex-col space-y-2 pt-2">
                                <Button
                                  onClick={fetchDataCur}
                                  style={{ backgroundColor: COLORS.BUTTON }}
                                >
                                  Profile
                                </Button>
                                <Button
                                  onClick={logout}
                                  style={{ backgroundColor: COLORS.DANGER }}
                                >
                                  Logout
                                </Button>
                              </div>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="xs:hidden sm:w-[100%] sm:flex sm:flex-row sm:justify-between md:w-[100%] md:flex md:flex-row md:justify-between lg:w-[100%] lg:flex lg:flex-row lg:justify-between xl:w-[100%] xl:flex xl:flex-row xl:justify-between">
                <div className="flex flex-row items-center px-3 xl:w-auto text-left space-x-4 font-semibold">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    Runners
                  </NavLink>
                  <NavLink
                    to="/races"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    Races
                  </NavLink>
                  <NavLink
                    to="/AboutUs"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    About Us
                  </NavLink>
                </div>

                {/* Google Logout Button */}

                <div className=" flex flex-row items-center lg:w-auto xl:w-auto text-center  font-semibold justify-end">
                  <div>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        justifyContent: "space-between",
                      }}
                    >
                      {auth ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Welcome</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={fetchDataCur}>
                                Profile
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                              Log out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Welcome</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={goToUploadPage}>
                                Upload Race Result
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                              Log out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    {/* <Button onClick={logout}>Logout</Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="w-full z-10 bg-white navShadowBottom">
          <div className="mx-auto px-5">
            <div className="relative flex h-16 items-center w-full">
              <div className="flex items-center justify-center sm:items-stretch xs:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-8 w-auto"
                      src={RunxBlue}
                      alt="Your Company"
                    />
                  </Link>
                </div>
                {isMobile ? (
                  <div
                    className="flex justify-center sm:items-stretch xs:justify-end"
                    style={{ paddingLeft: "10px" }}
                  >
                    {SHEET_SIDES.map((side) => (
                      <Sheet key={side}>
                        <SheetTrigger asChild>
                          {/* <Button variant="outline">{side}</Button> */}
                          <Button variant="outline">
                            <FontAwesomeIcon icon={faBars} />
                          </Button>
                        </SheetTrigger>
                        <div className="page-container">
                          <SheetContent
                            side={side}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "100vh",
                            }}
                          >
                            <SheetHeader>
                              <SheetTitle>Menu</SheetTitle>
                              <NavLink
                                to="/"
                                className={({ isActive }) =>
                                  "text-center transition-all duration-700 " +
                                  (isActive
                                    ? "bg-black text-white rounded-md p-1 px-4"
                                    : "opacity-40")
                                }
                              >
                                Runners
                              </NavLink>
                              <NavLink
                                to="/races"
                                className={({ isActive }) =>
                                  "text-center transition-all duration-700 " +
                                  (isActive
                                    ? "bg-black text-white rounded-md p-1 px-4"
                                    : "opacity-40")
                                }
                              >
                                Races
                              </NavLink>
                              <NavLink
                                to="/AboutUs"
                                className={({ isActive }) =>
                                  "text-center transition-all duration-700 " +
                                  (isActive
                                    ? "bg-black text-white rounded-md p-1 px-4"
                                    : "opacity-40")
                                }
                              >
                                About Us
                              </NavLink>
                            </SheetHeader>

                            <SheetFooter
                              style={{ marginTop: "auto" }}
                              className="flex flex-col space-y-2"
                            >
                              <SheetClose asChild>
                                <Button
                                  className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
                                  onClick={Tologin}
                                  style={{ backgroundColor: COLORS.BUTTON }}
                                >
                                  Sign in
                                </Button>
                              </SheetClose>

                              <Button
                                className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
                                onClick={Tosignup}
                                variant={"signup"}
                              >
                                Sign up
                              </Button>
                            </SheetFooter>
                          </SheetContent>
                        </div>
                      </Sheet>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap flex-row w-full invisible sm:visible py-2">
                <div className="flex flex-wrap flex-row items-center  px-3 xs:w-full md:w-[40%] lg:w-[40%] xl:w-[47%] text-left space-x-4 font-semibold">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    Runners
                  </NavLink>
                  <NavLink
                    to="/races"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    Races
                  </NavLink>
                  <NavLink
                    to="/AboutUs"
                    className={({ isActive }) =>
                      "text-center transition-all duration-700 " +
                      (isActive
                        ? "bg-black text-white rounded-md p-1 px-4"
                        : "opacity-40")
                    }
                  >
                    About Us
                  </NavLink>
                </div>

                {/* Google Logout Button */}

                <div className="absolute right-0 flex flex-row flex-wrap items-center sm:pr-0 space-x-4">
                  <Stack direction={"row"} spacing={2}>
                    <div>
                      <Link to="/Signup">
                        <Button className="" size={"sm"} variant={"signup"}>
                          Sign up
                        </Button>
                      </Link>
                    </div>
                    <div>
                      <Link to="/Login">
                        <Button
                          className=""
                          size={"sm"}
                          style={{ backgroundColor: COLORS.BUTTON }}
                        >
                          Sign in
                        </Button>
                      </Link>
                    </div>
                    {/* <GoogleLogoutBT /> */}
                    {/* Include the GoogleLogoutBT component here */}
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default Navbar;
