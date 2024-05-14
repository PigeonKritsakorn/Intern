import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Stack,
  Typography,
  backdropClasses,
  colors,
} from "@mui/material";
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
import { COLORS } from "../components/colors";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import signupBG from "../assets/signupBG.png";
import RunxBlue from "../assets/RunXBlue.png";
import SignupRunx from "../assets/signupBG.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  firstname_eng: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname_eng: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirmpassword: z.string().min(2, {
    message: "Confirm password must be at least 2 characters.",
  }),
});

function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname_eng: "",
      lastname_eng: "",
      email: "",
      nationality: "",
      password: "",
      confirmpassword: "",
      // policy_agreement: true,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const policy_agreement = true;
      if (values.password === values.confirmpassword) {
        const updatedValues = {
          ...values,
          policy_agreement,
        };
        const response = await axios.post(
          "http://localhost:3000/users/signup",
          updatedValues
        );
        console.log(response);
        toast({
          variant: "success",
          title: "Create account successfully",
        });
        setIsRegistered(true);
      } else {
        console.log("Passwords are not match!");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Cannot create account! Password and Confirm password are not the same.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
        setIsRegistered(false);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    nationality: "",
    password: "",
    confirmpassword: "",
    policy_agreement: true,
  });
  const [passwordError, setPasswordError] = React.useState("");
  const [isRegistered, setIsRegistered] = React.useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key.toLowerCase()]: value,
    }));
  };

  const validatePassword = () => {
    const lowercasePassword = formData.password.toLowerCase();
    const lowercaseConfirmPassword = formData.confirmpassword.toLowerCase();

    if (lowercasePassword.trim() === "") {
      setPasswordError("Password cannot be empty");
      return false;
    }

    if (lowercasePassword !== lowercaseConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Cannot create account! Password and Confirm password are not the same.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      // setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) {
      // Display an error message or take other appropriate actions
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/users/signup",
        formData
      );
      console.log("Server response:", response.data);
      console.log(formData);
      toast({
        variant: "success",
        title: "Create account successfully",
      });
      setIsRegistered(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const BacktoLogin = () => {
    navigate("/Login");
  };

  const handleCheckboxChange = (event) => {
    setFormData({ ...formData, policy_agreement: event.target.checked });
  };

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        window.location.href = "/Login";
      }, 1000);
    }
  }, [isRegistered]);

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";
    // Enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Mobile */}
      {isMobile ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "screen",
            width: "max-content",
          }}
        >
          <div className="xs:flex xs:flex-col xs:h-[1500px] xs:justify-center xs:items-center  xl:flex xl:flex-row xl:justify-center xl:items-center xl:space-x-20">
            <div
              className="xs:w-[350px]  xl:w-[500px] xl:h-[300px] xl:pr-10"
              style={{ position: "absolute", top: "5%", left: "8%" }}
            >
              <img src={RunxBlue} alt="Runx Logo" />
            </div>
            <img
              src={signupBG}
              alt="Signup Background"
              className="w-[400px] xs:h-[100%] object-cover"
              style={{ marginLeft: 0 }}
            />

            <div className="absolute xs:w-[400px] xs:flex xs:top-[25%] flex-col  xs:space-y-4  xs:items-center xl:w-[500px] h-[500px]">
              <TextField
                label="Firstname"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xs:justify-center xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                required
              />
              <TextField
                label="Lastname"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <TextField
                label="Nationality"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                onChange={(e) => handleInputChange("password", e.target.value)}
                type="password"
                required
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px]"
                style={{ backgroundColor: COLORS.WHITE, borderRadius: "5px" }}
                type="password"
                onChange={(e) =>
                  handleInputChange("confirmpassword", e.target.value)
                }
                required
              />
              <div className="flex items-center space-x-2 px-6">
                <Checkbox
                  id="policy_agreement"
                  checked={formData.policy_agreement}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="policy_agreement"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: COLORS.WHITE }}
                >
                  By continuing, you agree to RunX’s Terms of Service and
                  <br />
                  acknowledge you've read our Privacy Policy.
                </label>
              </div>

              {passwordError && (
                <Typography sx={{ color: "red" }}>{passwordError}</Typography>
              )}
              <Button
                onClick={handleSubmit}
                className="mb-[10px] xs:w-[350px] xs:h-[71px] xl:w-[500px] xl:h-[100px]"
                style={{ backgroundColor: COLORS.BUTTON, color: COLORS.WHITE }}
              >
                Sign up
              </Button>
              <Button
                onClick={BacktoLogin}
                className="mb-[10px] xs:w-[350px] h-[71px] xl:w-[500px] xl:h-[100px]"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen sm:w-screen sm:h-screen sm:flex sm:flex-row md:w-screen md:flex md:flex-row lg:w-screen lg:flex lg:flex-row xl:w-screen xl:flex xl:flex-row">
          <img
            src={SignupRunx}
            alt="Signup Runx"
            className="sm:w-[50%] md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%]"
          />
          <div className="sm:w-[50%] md:w-[50%] lg:w-[50%] xl:w-[50%] xl:space-y-5 flex flex-col justify-center items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-[85%]"
              >
                <FormField
                  control={form.control}
                  name="firstname_eng"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname_eng"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insert Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-[100%]"
                  style={{ backgroundColor: COLORS.BUTTON }}
                >
                  Sign up
                </Button>
              </form>
            </Form>

            <Button
              onClick={BacktoLogin}
              className="mb-[10px] xs:w-[350px] lg:w-[500px]  xl:w-[85%]"
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
