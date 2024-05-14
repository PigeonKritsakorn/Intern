import axios from "axios";
import { COLORS } from "../components/colors";
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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import LoginBG from "../assets/LoginBG.png";
import RunxBlue from "../assets/RunXBlue.png";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

function AdminLogin() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:3000/admins/login",
        values
      );

      // Assuming the server returns a token in the response data
      const token = response.data.token;

      localStorage.setItem("AdminToken", token);
      console.log("Login successful!");
      toast({
        variant: "success",
        title: "Login Successfully",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Login failed. Email or password is incorrect.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      console.log("Error: ", error);
    }
  }

  const goToLoginPage = () => {
    window.location.href = "/Login";
  };

  return (
    <div className="flex flex-col xs:h-screen sm:h-screen md:h-screen lg:h-screen xl:h-screen">
      <img
        src={LoginBG}
        alt="Login Background"
        className="xs:h-[20%] lg:h-[20%] xl:h-[20%]"
      />
      <div className="xs:flex xs:flex-col xs:justify-center xs:items-center sm:flex sm:flex-col sm:justify-center sm:items-center md:flex md:flex-col md:justify-center md:items-center lg:flex lg:flex-col lg:justify-center lg:items-center xs:h-[80%] lg:h-[80%] xl:h-[80%] xl:flex xl:flex-col xl:justify-center xl:items-center xs:w-full ">
        <img
          src={RunxBlue}
          alt="Thairun Logo"
          className="flex xs:w-[100%] xs:px-5 md:w-[55%] lg:w-[35%] xl:w-[30%] xl:justify-center xl:items-center"
        />

        <div className="flex flex-col  xs:w-[100%]  md:w-[50%] lg:w-[60%] xl:w-[30%] justify-center">
          <div className="lg:flex lg:flex-col lg:justify-center lg:items-center xl:flex xl:flex-col xl:justify-center xl:items-center xs:justify-start xs:items-center space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[100%] space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col justify-start items-start space-y-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
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
                          <Input placeholder="Password" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  style={{
                    color: COLORS.WHITE,
                    backgroundColor: COLORS.BUTTON,
                  }}
                  className="w-[100%]"
                >
                  Login
                </Button>
              </form>
            </Form>
            <Button onClick={goToLoginPage} className="w-[100%]">
              Go back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
