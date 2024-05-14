import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
// import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import { COLORS } from "./colors";
import Axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "1143px",
  height: "632px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  zIndex: 9999,
};

export default function ProfileModal() {
  const adminToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQHRoYWkucnVuIiwicm9sZSI6ImFkbWluIn0.v0AzvLkeMKL6JuZ6bl_xB7gYE-42SotCoGp4k2XRbX8";
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));
  const [selectedNationality, setSelectedNationality] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const dialogContentRef = useRef(null);

  const handlePointerDownOutside = (event) => {
    if (
      dialogContentRef.current &&
      !dialogContentRef.current.contains(event.target)
    ) {
      event.preventDefault();
    }
  };

  const handleClose = () => {
    setOpen(false);
    // window.location.reload();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      //id: userId,
      firstname_thai: formData.get("firstName"),
      lastname_thai: formData.get("lastName"),
      // telephone: formData.get("telephone"),
      nationality: formData.get("nationality"),
      id_passport: formData.get("idNumber"),
      gender: formData.get("gender"),
      birth_date: value ? value.format("YYYY-MM-DD") : "",
      // selectedNationality: selectedNationality,
      // email: formData.get("email"),
    };
    console.log("Form Data:", data);

    try {
      const authToken = localStorage.getItem("Login");
      // const authToken =
      //   "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImtyaXRzYWtvcm4uc0Bob3RtYWlsLmNvbSJ9.jkzGwapW6nc76-V8aY8W3_4aggZopI_tLIac6L7Tfd4";
      const response = await Axios.post(
        "http://localhost:3000/edit/user/",
        data,
        {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        console.log("Data submitted successfully!");
      } else {
        console.error("Failed to submit data:", response.statusText);
      }
    } catch (error: any) {
      console.error("Error submitting data:", error.message);
    }

    handleClose();
  };

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const formSchema = z.object({
    firstname_thai: z.string().max(50),
    lastname_thai: z.string().max(50),
    email: z.string().max(50),
    //password: z.string().min(2).max(50),
    id_passport: z.string().max(50),
    nationality: z.string().max(50),
    birth_date: z.date({
      required_error: "A date of birth is required.",
    }),
    gender: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname_thai: "",
      lastname_thai: "",
      email: "",
      id_passport: "",
      nationality: "",
      gender: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Image: ", showImage);
    const user_img = showImage;
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      const authToken = localStorage.getItem("Login");
      const userData = await Axios.get("http://localhost:3000/currentusers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Userdata: ", userData.data.user);
      const previousData = userData.data.user;
      delete previousData.id;
      delete previousData.firstname_eng;
      delete previousData.lastname_eng;
      delete previousData.user_img;
      const updatedData = { ...previousData, ...filteredData, user_img };

      console.log("UpdatedData: ", updatedData);

      const response = await Axios.post(
        "http://localhost:3000/currentusers",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      toast({
        variant: "success",
        title: "Edit Profile Successfully",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const authToken = localStorage.getItem("Login");
    Axios.get("http://localhost:3000/currentusers", {
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
      .then((data) => {
        setData(data);
        console.log("Fetched data:", data);
      })
      .catch((error) => {
        setError(
          "There was a problem with the fetch operation: " + error.message
        );
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {}, [data]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImage, setShowimage] = useState("");
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleSubmitLogoimageEvent = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await axios.get(
        "http://localhost:3000/creating/signUrl",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      const downloadURL = response.data.downloadUri;
      const uploadURL = response.data.uploadUri[0];
      return { downloadURL, uploadURL };
    } else {
      console.log("Cannont submit image");
    }
  };
  useEffect(() => {
    if (selectedFile) {
      const uploadFile = async () => {
        try {
          const imageUrl = await handleSubmitLogoimageEvent();
          const downloadURL = imageUrl?.downloadURL;
          const uploadURL = imageUrl?.uploadURL;
          console.log("IMG url: ", uploadURL);
          if (uploadURL) {
            await axios.put(uploadURL, selectedFile, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "image/jpeg",
                "x-goog-acl": "public-read",
              },
            });
            console.log("Download Eventimg URL: ", downloadURL);
            setShowimage(downloadURL);
            // If you need to do something with the downloadURL, do it here
          } else {
            console.log("Error: Unable to get image URL");
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      };

      uploadFile();
    }
  }, [selectedFile]);

  return (
    <div>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Edit Profile
          </Button>
        </DialogTrigger>

        <DialogContent
          className=" xl:max-w-[50%]"
          onPointerDownOutside={handlePointerDownOutside}
          ref={dialogContentRef}
        >
          <div className="flex flex-col w-[100%] space-y-4">
            <div className="flex justify-center">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-8 xl:w-[100%] justify-center items-center"
              >
                {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input id="picture" type="file" />
                </div> */}
                <div className="flex flex-row w-[70%] justify-between ">
                  <div className="flex flex-col flex-wrap space-y-5">
                    <FormField
                      control={form.control}
                      name="firstname_thai"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col space-y-5 w-900">
                            <div className="flex flex-row space-x-5">
                              <div className="flex flex-col space-y-3">
                                <FormLabel>First name (Eng)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={data.user.firstname_thai}
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "xs:w-[165px] xl:w-[180px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "MM/dd/yyyy")
                                  ) : (
                                    <span>{data.user.birth_date}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col space-y-5 w-900">
                            <div className="flex flex-row space-x-5">
                              <div className="flex flex-col space-y-3">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={data.user.email}
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col flex-wrap justify-center space-y-5">
                    <FormField
                      control={form.control}
                      name="lastname_thai"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col space-y-5">
                            <div className="flex flex-row space-x-5">
                              <div className="flex flex-col space-y-3">
                                <FormLabel>Last name (Eng)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={data.user.lastname_thai}
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="border">
                              <SelectTrigger>
                                <SelectValue placeholder={data.user.gender} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="id_passport"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col space-y-5 w-900">
                            <div className="flex flex-row space-x-5">
                              <div className="flex flex-col space-y-3">
                                <FormLabel>ID / Passport Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={data.user.id_passport}
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col space-y-5 w-900">
                        <div className="flex flex-row space-x-5">
                          <div className="flex flex-col space-y-3">
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={data.user.nationality}
                                {...field}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-center h-[30%] w-[70%]">
                  <div className="flex flex-row justify-between items-center w-[100%]">
                    <div className="flex flex-col items-start space-y-4 w-auto">
                      <h1>Upload Profile image </h1>
                      <div className="flex flex-row justify-center items-center">
                        <input
                          id="picture"
                          type="file"
                          onChange={handleFileChange}
                        />
                        {/* <img src={showImage} width={"50%"} height={"50%"} /> */}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        height: "auto",
                        position: "relative",
                      }}
                    >
                      <img
                        src={showImage}
                        style={{
                          maxWidth: "50%",
                          maxHeight: "50%",
                          objectFit: "contain",
                        }}
                        alt="Uploaded Event Logo"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-[70%] flex justify-end ">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
