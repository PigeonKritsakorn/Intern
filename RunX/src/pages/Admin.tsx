import React, { useState, useEffect } from "react";
import { COLORS } from "../components/colors";
import axios from "axios";
import AdminBG from "../assets/AdminBG.png";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

interface Organization {
  id: number;
  name: string;
}
interface Race {
  id: number;
  name: string;
  org_id: number;
  start_time: string;
  state: string;
  logo_img: string;
  cover_img: string;
  distance: number;
  event_id: number;
  date: Date;
  time_stamp: Date;
}

const formSchemaEvents = z.object({
  name: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  distance: z.string().min(2).max(50),
});

const formSchemaRaces = z.object({
  name: z.string().min(2).max(50),
  date: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  start_time: z.string().min(2).max(50),
  distance: z.string().min(2).max(50),
});

const formSchemaOrganization = z.object({
  name: z.string().min(2).max(50),
});

const formSchemaEditevents = z.object({
  name: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
});

const formSchemaEditraces = z.object({
  name: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  date: z.string().min(2).max(50),
  start_time: z.string().min(2).max(50),
});

export default function Admin() {
  const { toast } = useToast();
  const adminToken = localStorage.getItem("AdminToken");

  const [imgLink, setImgLink] = useState<String>("");
  const [uploadimgLink, setuploadimgLink] = useState<String>("");
  const [showForm, setShowform] = useState<Boolean>(false);

  const formEvents = useForm<z.infer<typeof formSchemaEvents>>({
    resolver: zodResolver(formSchemaEvents),
    defaultValues: {
      name: "",
      country: "",
      distance: "",
    },
  });

  const formRaces = useForm<z.infer<typeof formSchemaRaces>>({
    resolver: zodResolver(formSchemaRaces),
    defaultValues: {
      // organization_id: "",
      // event: "",
      name: "",
      date: "",
      state: "",
      start_time: "",
      distance: "",
    },
  });

  const formOrganizations = useForm<z.infer<typeof formSchemaOrganization>>({
    resolver: zodResolver(formSchemaOrganization),
    defaultValues: {
      name: "",
    },
  });

  const formEditevents = useForm<z.infer<typeof formSchemaEditevents>>({
    resolver: zodResolver(formSchemaEditevents),
    defaultValues: {
      name: "",
      country: "",
    },
  });

  const formEditraces = useForm<z.infer<typeof formSchemaEditraces>>({
    resolver: zodResolver(formSchemaEditraces),
    defaultValues: {
      name: "",
      state: "",
      date: "",
      start_time: "",
    },
  });

  const [raceId, setRaceId] = useState("1");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("picture");
    const selectedFile = fileInput.files[0];

    console.log("Selected file:", selectedFile);

    if (!selectedFile) {
      console.log("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);
    const selectedRacesString = selectedRaces.toString();
    formData.append("raceId", selectedRacesString);
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQHJ1bnguY29tIiwicm9sZSI6ImFkbWluIn0.siFolS5zXYpYmMK11sXq6NFZ52DtbvW-L09tre9cciU";
    // const queryParams = new URLSearchParams({
    //   excelFile: selectedFile,
    //   raceId: selectedRacesString,
    // });

    try {
      const response = await axios.post(
        `http://localhost:3000/result/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        variant: "success",
        title: "Upload race result successfully",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 1000,
      });
      window.location.reload();
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRaceIdChange = (event) => {
    setRaceId(event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoverimg, setSelectedCoverimg] = useState<File | null>(null);
  const [showImage, setShowimage] = useState("");
  const [showCoverimage, setShowcoverimage] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
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


  const handleFileCoverimageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedCoverimg(event.target.files[0]);
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

  const convertLogoimageEvent = async () => {
    try {
      const imageUrl = await handleSubmitLogoimageEvent();
      const downloadURL = imageUrl?.downloadURL;
      const uploadURL = imageUrl?.uploadURL;
      console.log("IMG url: ", uploadURL);
      if (uploadURL) {
        const response = await axios.put(uploadURL, selectedFile, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "image/jpeg",
            "x-goog-acl": "public-read",
          },
        });
        console.log("Download URL: ", downloadURL);
        return downloadURL;
      } else {
        console.log("Error: Unable to get image URL");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleSubmitLogoimageRace = async () => {
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
      // if (selectedCoverimg) {
      //   setShowform(true);
      // } else {
      //   setShowform(false);
      // }
      return { downloadURL, uploadURL };
    } else {
      console.log("Cannont submit image");
    }
  };

  const handleSubmitCoverimage = async () => {
    if (selectedCoverimg) {
      const formData = new FormData();
      formData.append("image", selectedCoverimg);
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
    if (selectedCoverimg) {
      const uploadCoverimage = async () => {
        try {
          const imageUrl = await handleSubmitCoverimage();
          if (imageUrl && imageUrl.uploadURL) {
            const { uploadURL, downloadURL } = imageUrl;
            console.log("IMG url: ", uploadURL);
            await axios.put(uploadURL, selectedCoverimg, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "image/jpeg",
                "x-goog-acl": "public-read",
              },
            });
            console.log("Download Raceimg URL: ", downloadURL);
            setShowcoverimage(downloadURL);
            // If you need to do something with the downloadURL, do it here
          } else {
            console.log("Error: Unable to get image URL");
          }
        } catch (error) {
          console.log("Error: ", error);
          // Handle error gracefully, e.g., display an error message to the user
        }
      };
      uploadCoverimage();
    }
  }, [selectedCoverimg, adminToken]);

  const convertLogoimageRace = async () => {
    try {
      const imageUrl = await handleSubmitLogoimageRace();
      const downloadURL = imageUrl?.downloadURL;
      const uploadURL = imageUrl?.uploadURL;
      console.log("IMG url: ", uploadURL);
      if (uploadURL) {
        const response = await axios.put(uploadURL, selectedFile, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "image/jpeg",
            "x-goog-acl": "public-read",
          },
        });
        console.log("Download URL: ", downloadURL);
        return downloadURL;
      } else {
        console.log("Error: Unable to get image URL");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const convertCoverImage = async () => {
    try {
      const imageUrl = await handleSubmitCoverimage();
      const downloadURL = imageUrl?.downloadURL;
      const uploadURL = imageUrl?.uploadURL;
      console.log("IMG url: ", uploadURL);
      if (uploadURL) {
        const response = await axios.put(uploadURL, selectedCoverimg, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "image/jpeg",
            "x-goog-acl": "public-read",
          },
        });
        console.log("Download URL: ", downloadURL);
        return downloadURL;
      } else {
        console.log("Error: Unable to get image URL");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchemaEvents>) {
    const adminToken = localStorage.getItem("AdminToken");
    const logo_img = await convertLogoimageEvent();
    const org_id = selectedOrganization;
    console.log("Org: ", org_id);
    console.log(logo_img);
    console.log("Values:", values);
    try {
      const updatedValues = { ...values, logo_img, org_id };
      const response = await axios.post(
        "http://localhost:3000/events",
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Create Event successfully!");
        toast({
          variant: "success",
          title: "Create Event Successfully",
          action: <ToastAction altText="OK">OK</ToastAction>,
          duration: 1000,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${response.data.message}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
      }
      // window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error?.response.data.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      console.log("Error: ", error);
    }
  }

  async function onSubmitRaces(values: z.infer<typeof formSchemaRaces>) {
    const adminToken = localStorage.getItem("AdminToken");
    const logo_img = await convertLogoimageEvent();
    const cover_img = await convertCoverImage();
    console.log("Cover image: ", cover_img);
    console.log("Values:", values);
    try {
      const organization_id = selectedOrganization;
      const event = selectedEvents;
      const updatedValues = {
        ...values,
        logo_img,
        cover_img,
        organization_id,
        event,
      };
      console.log(updatedValues);
      const response = await axios.post(
        `http://localhost:3000/races?org=${organization_id}&event=${event}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Create Event successfully!");
        toast({
          variant: "success",
          title: "Create Race Successfully",
          action: <ToastAction altText="OK">OK</ToastAction>,
          duration: 1000,
        });
        window.location.reload();
      } else {
        console.log("Error");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cannot create race. Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      console.log("Error: ", error);
    }
  }

  async function onSubmitOrganization(
    values: z.infer<typeof formSchemaOrganization>
  ) {
    const adminToken = localStorage.getItem("AdminToken");
    try {
      const response = await axios.post(
        "http://localhost:3000/organization",
        values,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function onEditevents(values: z.infer<typeof formSchemaEditevents>) {
    const adminToken = localStorage.getItem("AdminToken");
    const logo_img = await convertLogoimageEvent();
    const updatedValues = {
      ...values,
      logo_img,
    };
    console.log("Updated: ", updatedValues);
    try {
      const event = selectedEvents;
      const result = await axios.post(
        `http://localhost:3000/events/edit/${event}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (result.status === 200) {
        toast({
          variant: "success",
          title: "Edit event Successfully",
          action: <ToastAction altText="OK">OK</ToastAction>,
          duration: 1000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Cannot edit event. Something went wrong.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
      }

      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cannot edit event. Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      console.log("Error: ", error);
    }
  }

  async function onEditRace(values: z.infer<typeof formSchemaEditraces>) {
    const adminToken = localStorage.getItem("AdminToken");
    const logo_img = await convertLogoimageEvent();
    const cover_img = await convertCoverImage();
    const updatedValues = {
      ...values,
      logo_img,
      cover_img,
    };
    try {
      const race = selectedRaces;
      const result = await axios.post(
        `http://localhost:3000/races/edit/${selectedRaces}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (result.status === 200) {
        toast({
          variant: "success",
          title: "Edit race Successfully",
          action: <ToastAction altText="OK">OK</ToastAction>,
          duration: 1000,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Cannot edit race. Something went wrong.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 100000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cannot edit race. Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 100000,
      });
      console.log("Error: ", error);
    }
  }

  const [organization, setOrganization] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const fetchOrganization = async () => {
    try {
      const adminToken = localStorage.getItem("AdminToken");
      const response = await axios.get("http://localhost:3000/organization", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      console.log(response);
      setOrganization(response.data);
    } catch (error) {
      console.log("Error :", error);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  const [events, setEvents] = useState();
  const [selectedEvents, setSelectedEvents] = useState("");
  const [eventName, setEventName] = useState("");

  const fetchEvents = async (orgId) => {
    const queryParams = new URLSearchParams({
      org_id: orgId,
    });
    try {
      const response = await axios.get(
        `http://localhost:3000/events/filter?${queryParams}`
      );
      console.log("Response: ", response.data.data);
      setEvents(response.data.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    fetchEvents(selectedOrganization); // Initial fetch
  }, [selectedOrganization]);

  const [races, setRaces] = useState<Race>();
  const [selectedRaces, setSelectedRaces] = useState("");
  const [raceName, setRaceName] = useState("");

  const fetchallRaces = async () => {
    try {
      const response = await axios.get("http://localhost:3000/races");
      console.log("All races: ", response);
      setRaces(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchallRaces();
  }, []);

  const [activeTab, setActiveTab] = useState("Upload Events");
  const handleCreateOrganizationClick = () => {
    setActiveTab("Create Organization");
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${AdminBG})`,
          backgroundSize: "cover",
          overflowY: "auto",
        }}
        className="flex flex-row w-screen h-screen justify-center items-center"
      >
        <Tabs
          defaultValue="Upload Events"
          className="flex flex-row w-[100%] h-[100%] p-10 space-x-4 justify-center items-center"
        >
          <TabsList className="flex flex-col w-[25%]">
            <TabsTrigger
              value="Upload Events"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Upload Events
            </TabsTrigger>
            <TabsTrigger
              value="Edit Events"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Edit Events
            </TabsTrigger>
            <TabsTrigger
              value="Upload Races"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Upload Races
            </TabsTrigger>
            <TabsTrigger
              value="Edit Races"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Edit Races
            </TabsTrigger>
            <TabsTrigger
              value="Upload Race Result"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Upload Race Result
            </TabsTrigger>
            <TabsTrigger
              value="Create Organization"
              style={{
                fontSize: "20px",
                color: "white",
              }}
            >
              Create Organization
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Create Organization" className="w-[75%]">
            <div className="flex flex-col items-center ">
              <div className="bg-white bg-opacity-90 w-[100%] h-[300px] flex flex-col justify-center items-center">
                <div className="flex flex-col w-full h-full justify-center items-center bg-white bg-opacity-50 space-y-8">
                  <h1 className="text-3xl font-bold">Create Organization</h1>

                  <div className="flex flex-row space-x-4">
                    <h1 className="text-lg font-bold">Organization's name</h1>
                    <Form {...formOrganizations}>
                      <form
                        onSubmit={formOrganizations.handleSubmit(
                          onSubmitOrganization
                        )}
                        className="space-y-8"
                      >
                        <FormField
                          control={formOrganizations.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Insert name" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Upload Race Result" className="w-[75%]">
            <div className="flex flex-col items-center ">
              <div className="bg-white bg-opacity-90 w-[100%] h-[300px] flex flex-col justify-center items-center">
                <div className="flex flex-col w-full h-full justify-center items-center bg-white bg-opacity-50 space-y-8">
                  <h1 className="text-3xl font-bold">Upload Race Result</h1>

                  <input id="picture" type="file" />
                  <div className="flex flex-row space-x-4">
                    <h1 className="text-lg font-bold">Race ID</h1>
                    <div className="flex flex-row justify-center items-center space-x-4">
                      <h3>{raceName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Choose Races</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Races</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {races?.length > 0 &&
                              races?.map((race) => (
                                <DropdownMenuItem
                                  key={race.id}
                                  onClick={() => {
                                    setSelectedRaces(race.id);
                                    setRaceName(race.name);
                                  }}
                                >
                                  {race.name}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Button onClick={handleSubmit}>Submit Race Result</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Upload Events" className="w-[75%] h-[85%]">
            <div className="flex flex-col items-center bg-white bg-opacity-90 w-[100%] h-[100%] justify-center py-4">
              <div className="flex flex-col w-full h-[100%] justify-center items-center bg-white bg-opacity-50 space-y-8">
                <div className="flex flex-col justify-center h-[30%] w-[70%]">
                  <h1 className="text-3xl font-bold">Upload Events</h1>
                  <div className="flex flex-row justify-between items-center w-[100%]">
                    <div className="flex flex-col items-start space-y-4 w-auto">
                      <h1>Upload Event's logo image </h1>
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
                      {/* Ensure the image fills its container */}
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
                    {/* <Button onClick={convertLogoimageEvent}>Submit</Button> */}
                  </div>
                </div>
                <Form {...formEvents}>
                  <form
                    onSubmit={formEvents.handleSubmit(onSubmit)}
                    className="space-y-4 w-[50%]"
                  >
                    <div className="flex flex-row justify-between items-center space-x-4">
                      <h3>{organizationName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Choose Organization</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {organization.length > 0 &&
                              organization.map((org) => (
                                <DropdownMenuItem
                                  key={org.id}
                                  onClick={() => {
                                    setSelectedOrganization(org.id);
                                    setOrganizationName(org.name);
                                    fetchEvents(org.id);
                                  }}
                                >
                                  {org.name}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <FormField
                      control={formEvents.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Event name</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Event name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEvents.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEvents.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Distance</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Distance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Submit Event</Button>
                  </form>
                </Form>
                <h1>
                  If you don't have organization,please click{" "}
                  <a
                    href="#"
                    onClick={handleCreateOrganizationClick}
                    style={{ color: "blue" }}
                  >
                    Create Organization tab
                  </a>{" "}
                  first
                </h1>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Edit Events" className="w-[75%] h-[85%]">
            <div className="flex flex-col items-center bg-white bg-opacity-90 w-[100%] h-[100%] justify-center py-4">
              <div className="flex flex-col w-full h-[100%] justify-center items-center bg-white bg-opacity-50 space-y-20">
                <div className="flex flex-col justify-center h-[30%] w-[70%]">
                  <h1 className="text-3xl font-bold">Edit Events</h1>
                  <div className="flex flex-row justify-between items-center w-[100%]">
                    <div className="flex flex-col items-start space-y-4 w-auto">
                      <h1>Upload Event's logo image </h1>
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
                <Form {...formEditevents}>
                  <form
                    onSubmit={formEditevents.handleSubmit(onEditevents)}
                    className="space-y-4 w-[50%]"
                  >
                    <div className="flex flex-row justify-between items-center space-x-4">
                      <h3>{eventName}</h3>
                      {events && events.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Choose Event</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Events</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              {events.length > 0 &&
                                events.map((event) => (
                                  <DropdownMenuItem
                                    key={event.id}
                                    onClick={() => {
                                      setEventName(event.name);
                                      setSelectedEvents(event.id);
                                      fetchEvents(event.id);
                                    }}
                                  >
                                    {event.name}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                    <FormField
                      control={formEditevents.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Event name</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Event name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditevents.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Edit Event</Button>
                  </form>
                </Form>
              </div>
              {/* )} */}
            </div>
          </TabsContent>
          <TabsContent value="Upload Races" className="w-[75%] h-[90%]">
            <div className="flex flex-col items-center bg-white bg-opacity-90 w-[100%] h-auto justify-center p-5">
              {/* {showForm && ( */}
              <div className="flex flex-col w-full h-[100%] justify-center items-center bg-white bg-opacity-50 space-y-4">
                <div className="flex flex-col h-[30%] justify-center space-y-4">
                  <h1 className="text-3xl font-bold">Upload Races</h1>
                  <div className="flex flex-col justify-center items-center w-[100%]">
                    <div className="flex flex-row items-center space-y-4 w-[50%] h-auto">
                      <div className="flex flex-col">
                        <h1>Upload Race's logo image </h1>
                        <input
                          id="picture"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
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
                    <div className="flex flex-row items-center space-y-4 w-[50%] h-auto">
                      <div className="flex flex-col">
                        <h1>Upload Race's cover image </h1>
                        <input
                          id="picture"
                          type="file"
                          onChange={handleFileCoverimageChange}
                        />
                      </div>
                      <img
                        src={showCoverimage}
                        style={{
                          maxWidth: "50%",
                          maxHeight: "50%",
                          objectFit: "contain",
                        }}
                        alt="Uploaded Event Logo"
                      />
                      {/* <Button onClick={convertCoverImage}>Submit</Button> */}
                    </div>
                  </div>
                </div>
                <Form {...formRaces}>
                  <form
                    onSubmit={formRaces.handleSubmit(onSubmitRaces)}
                    className="space-y-8 h-[70%]"
                  >
                    <div className="flex flex-row justify-center items-center space-x-4">
                      <h3>{organizationName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Choose Organization</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {organization.length > 0 &&
                              organization.map((org) => (
                                <DropdownMenuItem
                                  key={org.id}
                                  onClick={() => {
                                    setSelectedOrganization(org.id);
                                    setOrganizationName(org.name);
                                    fetchEvents(org.id);
                                  }}
                                >
                                  {org.name}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <h3>{eventName}</h3>
                      {events && events.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Choose Event</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Events</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              {events.length > 0 &&
                                events.map((event) => (
                                  <DropdownMenuItem
                                    key={event.id}
                                    onClick={() => {
                                      setEventName(event.name);
                                      setSelectedEvents(event.id);
                                      fetchEvents(event.id);
                                    }}
                                  >
                                    {event.name}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                    <FormField
                      control={formRaces.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Race name</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Event name" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                            This is your public display name.
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRaces.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-10">
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Date" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                            This is your public display name.
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRaces.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRaces.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Start Time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRaces.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Distance</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Distance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Submit Race</Button>
                  </form>
                </Form>
              </div>
              {/* )} */}
            </div>
          </TabsContent>
          <TabsContent value="Edit Races" className="w-[75%] h-auto p-10">
            <div className="flex flex-col items-center bg-white bg-opacity-90 w-[100%] h-auto justify-center p-5">
              <div className="flex flex-col w-full h-[100%] justify-center items-center bg-white bg-opacity-50">
                <div className="flex flex-col justify-center h-auto w-[70%]">
                  <h1 className="text-3xl font-bold">Edit Races</h1>
                  <div className="flex flex-col justify-center items-center w-[100%]">
                    <div className="flex flex-row items-center w-[50%] h-[50%]">
                      <div className="flex flex-col">
                        <h1>Upload Race's logo image </h1>
                        <input
                          id="picture"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                      <img
                        src={showImage}
                        style={{
                          maxWidth: "50%",
                          maxHeight: "30%",
                          objectFit: "contain",
                        }}
                        alt="Uploaded Event Logo"
                      />
                    </div>
                    <div className="flex flex-row items-center w-[50%] h-auto">
                      <div className="flex flex-col">
                        <h1>Upload Race's cover image </h1>
                        <input
                          id="picture"
                          type="file"
                          onChange={handleFileCoverimageChange}
                        />
                      </div>
                      <img
                        src={showCoverimage}
                        style={{
                          maxWidth: "50%",
                          maxHeight: "30%",
                          objectFit: "contain",
                        }}
                        alt="Uploaded Event Logo"
                      />
                      {/* <Button onClick={convertCoverImage}>Submit</Button> */}
                    </div>
                  </div>
                </div>
                <Form {...formEditraces}>
                  <form
                    onSubmit={formEditraces.handleSubmit(onEditRace)}
                    className="space-y-4 w-[50%] h-[70%]"
                  >
                    <div className="flex flex-row justify-center items-center space-x-4">
                      <h3>{raceName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Choose Races</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Races</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {races?.length > 0 &&
                              races?.map((race) => (
                                <DropdownMenuItem
                                  key={race.id}
                                  onClick={() => {
                                    setSelectedRaces(race.id);
                                    setRaceName(race.name);
                                  }}
                                >
                                  {race.name}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <FormField
                      control={formEditraces.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Race name</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Race name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditraces.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditraces.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditraces.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-4">
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input placeholder="Insert Start Time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Edit Race</Button>
                  </form>
                </Form>
              </div>
              {/* )} */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
