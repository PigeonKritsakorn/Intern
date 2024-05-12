import React, { useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { setUserLogin } from "@/lib/storage";
import { COLORS } from "../components/colors";
import Running from "../assets/running.jpg";
import LoginBG from "../assets/LoginBG.png";
import RunxBlue from "../assets/RunXBlue.png";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().min(8).max(60),
  password: z.string().min(2).max(50),
});

// Function to set Authorization header
const setAuthHeader = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

function Login() {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    // Clear the authentication token from cookies
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/; secure;";

    // Remove the Authorization header from axios defaults
    delete axios.defaults.headers.common["Authorization"];

    console.log("Logged out successfully!");
  };

  const handleuserLogin = () => {
    console.log("Form Data:", formData);

    const requestData = {
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://localhost:3000/users/login", requestData)
      .then((response) => {
        console.log("Backend response:", response.data);

        if (response.data.status) {
          setIsLoggedIn(true);
          const authToken = response.data.token;
          // Set the token as a regular cookie
          document.cookie = `authToken=${authToken}; path=/; secure;`;
          // Log all cookies
          console.log("All cookies:", document.cookie);
          // Set the Authorization header for Axios requests
          setAuthHeader(authToken);
          setUserLogin(authToken);
          toast({
            variant: "success",
            title: "Login Successfully",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          console.error("Login failed. Invalid credentials.");
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Login failed. Email or password is incorrect.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
        setError("Login failed. Email or password is incorrect.");
        console.error("Error sending login request:", error);
      });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Values:", values);
    axios
      .post("http://localhost:3000/users/login", values)
      .then((response) => {
        console.log("Backend response:", response.data);

        if (response.data.status) {
          setIsLoggedIn(true);
          const authToken = response.data.token;
          // Set the token as a regular cookie
          document.cookie = `authToken=${authToken}; path=/; secure;`;
          // Log all cookies
          console.log("All cookies:", document.cookie);
          // Set the Authorization header for Axios requests
          setAuthHeader(authToken);
          setUserLogin(authToken);
          toast({
            variant: "success",
            title: "Login Successfully",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          console.error("Login failed. Invalid credentials.");
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Login failed. Email or password is incorrect.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
        setError("Login failed. Email or password is incorrect.");
        console.error("Error sending login request:", error);
      });
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const goToAdminPage = () => {
    window.location.href = "/AdminLogin";
  };

  return (
    <div className="flex flex-col xs:h-screen sm:h-screen md:h-screen lg:h-screen xl:w-screen xl:h-screen">
      <img
        src={LoginBG}
        alt="Login Background"
        className="xs:h-[20%] lg:h-[20%] xl:h-[20%]"
      />
      <div className="xs:flex xs:flex-col xs:justify-center xs:items-center sm:flex sm:flex-col sm:justify-center sm:items-center md:flex md:flex-col md:justify-center md:items-center lg:flex lg:flex-col lg:justify-center lg:items-center xs:h-[80%] lg:h-[80%] xl:h-auto xl:flex xl:flex-col xl:justify-center xl:items-center xs:w-full ">
        <img
          src={RunxBlue}
          alt="Thairun Logo"
          className="flex xs:w-[100%] xs:px-5 md:w-[55%] lg:w-[35%] xl:w-[30%] xl:justify-center xl:items-center"
        />

        <div className="flex flex-col  xs:w-[100%]  md:w-[50%] lg:w-[60%] xl:h-auto xl:w-auto justify-center space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col justify-start items-start space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col justify-start items-start space-y-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                className="mb-[10px] xs:w-[350px] h-[50px] xl:w-[100%] text-xl"
                style={{ backgroundColor: COLORS.BUTTON }}
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
          <div className="xs:justify-end xs:flex xl:flex xl:flex-col xl:w-[100%] xl:items-end">
            <Button
              onClick={goToAdminPage}
              className="mb-[10px] xs:w-[350px] h-[50px] xl:w-[100%]"
              style={{
                fontSize: "20px",
                fontWeight: 400,
                color: COLORS.WHITE,
                backgroundColor: COLORS.BLACK,
              }}
            >
              Login as Admin
            </Button>
            <Link to="/ForgetPassword">
              <Button
                style={{
                  color: COLORS.BLACK,
                  backgroundColor: COLORS.WHITE,
                  textDecoration: "underline",
                }}
              >
                Forgot Password?
              </Button>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <div
              style={{
                position: "relative",
                height: "200px",
              }}
              className="xs:w-[100%] xl:w-[500px]"
            >
              <div className="xs:w-[100%] xl:w-[500px]">
                <img
                  src={Running}
                  alt="Running Picture"
                  style={{ filter: "brightness(70%)" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                  paddingBottom: "15px",
                }}
              >
                <h1
                  style={{
                    color: COLORS.WHITE,
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  Don't have an account?
                  <br />
                  <Link
                    to="/Signup"
                    style={{
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "40px",
                        fontWeight: 700,
                        color: COLORS.WHITE,
                      }}
                    >
                      Create Account
                    </h1>
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
