import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Search, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { COLORS } from "./colors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { max } from "date-fns";

function withEventCardNavigation(Component) {
  return function WrappedComponent(props) {
    const navigateToEvent = (event, url) => {
      console.log("Navigate to:", event.name);
      window.location.href = url; // Navigate to URL
    };

    return <Component {...props} navigateToEvent={navigateToEvent} />;
  };
}

function EventCard({ navigateToEvent }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Anywhere");
  const [selectedDistance, setSelectedDistance] = useState("Any Distance");
  const [selectedDisname, setSelecteddisname] = useState("Any Distance");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventsToShow, setEventsToShow] = useState(5);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(200);

  const handleDistanceChange = async (value) => {
    try {
      if (value === "1-10") {
        setMin(1);
        setMax(10);
        setSelecteddisname("1 KM - 10 KM");
        console.log("Filtered Events: ", filteredEvents);
      } else if (value === "11-21") {
        setMin(11);
        setMax(21);
        setSelecteddisname("11 KM - 21 KM");
      } else if (value === "22-42") {
        setMin(22);
        setMax(42);
        setSelecteddisname("22 KM - 42 KM");
      } else if (value === "43-200") {
        setMin(43);
        setMax(200);
        setSelecteddisname("43 KM Above");
      } else {
        setMin(1);
        setMax(200);
        setSelecteddisname("Any Distance");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          country: selectedCountry === "Anywhere" ? "" : selectedCountry,
          distance: selectedDistance === "Any Distance" ? "" : selectedDistance,
          year: "",
          title: searchTerm,
          min: min,
          max: max,
        });

        const url = `http://localhost:3000/events/filter?${queryParams}`;

        const response = await axios.get(url);
        setFilteredEvents(response.data.data);

        console.log("Data:", response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCountry, selectedDistance, searchTerm, min, max]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEventsSearch = filteredEvents.filter((race) =>
    race?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredEventsSearch);

  const handleLoadMore = () => {
    setEventsToShow(eventsToShow + 5);
  };

  useEffect(() => {
    try {
      if (events && events.length > 0) {
        const filtered = events.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(filtered);
        setFilteredEvents(filtered);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [searchTerm, events]);

  const [nationality, setNationality] = useState([]);

  const UserRunxData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events/filter");
      console.log("Nationality", response.data.data);
      const uniqueCountries = [
        ...new Set(response.data.data.map((item) => item.country)),
      ];
      console.log(uniqueCountries);
      setNationality(uniqueCountries);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    UserRunxData();
  }, []);

  return (
    <div className="xs:w-full xs:h-full xs:space-y-5 xs:pt-[5%] lg:w-[full] lg:flex lg:flex-col lg:items-center lg:mt-10 xl:w-full xl:flex xl:flex-col xl:items-center xl:mt-10 pb-[5%] space-y-4">
      <div className=" xs:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] xs:mx-5 sm:mx-8 md:mx-10 lg:mx-12 flex flex-row bg-[#F5F5F5] rounded-lg  ">
        <div className="flex flex-wrap content-center pl-2">
          <Search className="opacity-[0.6]" />
        </div>
        <Input
          onChange={handleSearchInputChange}
          value={searchTerm}
          type="text"
          placeholder="Search for events..."
          className="border-0 placeholder:text-sm bg-[#F5F5F5]"
        />
      </div>
      <div className="lg:hidden xl:hidden xs:w-full">
        <Drawer>
          <DrawerTrigger asChild>
            <div>
              <Button variant="outline" className="xs:w-[90%]">
                <div className="xs:flex xs:flex-row xs:space-x-3 xs:items-center xs:justify-center">
                  <FontAwesomeIcon icon={faFilter} />
                  <h1>Filter</h1>
                </div>
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Filter</DrawerTitle>
                <DrawerDescription>Apply filter for Events</DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col space-y-4 xs:w-[100%] xl:w-full">
                <div className="xl:flex xl:flex-col xl:justify-start xl:items-start w-[50%] xs:w-full xs:px-4">
                  <h2 className="font-bold">Country</h2>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                    defaultValue="Anywhere"
                  >
                    <SelectTrigger
                      className="xl:w-[200px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue>{selectedCountry}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="Anywhere">Anywhere</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="xl:flex xl:flex-col xl:justify-start xl:items-start w-[50%] xs:w-full xs:px-4">
                  <h2 className="font-bold">Distance</h2>
                  <Select
                    value={selectedDistance}
                    onValueChange={setSelectedDistance}
                    defaultValue="Any Distance"
                  >
                    <SelectTrigger
                      className="xl:w-[200px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue>{selectedDistance}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="Any Distance">Any Distance</SelectItem>
                      <SelectItem value="10">10 KM</SelectItem>
                      <SelectItem value="21">21 KM</SelectItem>
                      <SelectItem value="42">42 KM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <div className="xs:flex xs:flex-col xs:space-y-2">
                    <Button style={{ backgroundColor: COLORS.BUTTON }}>
                      Submit
                    </Button>
                    <Button style={{ backgroundColor: COLORS.DANGER }}>
                      Cancel
                    </Button>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="xs:flex xs:flex-col xs:pb-5 lg:flex lg:flex-row lg:w-[80%] lg:space-x-5 xl:flex xl:flex-row xl:w-[80%] xl:pb-5">
        <div className="lg:w-[25%] xl:w-[25%]">
          <div className="flex flex-col space-y-4 md:w-[100%] xl:w-full">
            <div className="xs:hidden lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[100%] xl:flex xl:flex-col xl:justify-start xl:items-start xl:w-[100%] space-y-1">
              <h2 className="font-bold">Country</h2>
              <Select
                // value={selectedCountry}
                value={`${selectedDistance.min} - ${selectedDistance.max} KM`}
                onValueChange={setSelectedCountry}
                defaultValue="Anywhere"
              >
                <SelectTrigger
                  className="lg:w-[80%] xl:w-[80%] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <SelectValue>{selectedCountry}</SelectValue>
                </SelectTrigger>
                <SelectContent onClick={(e) => e.stopPropagation()}>
                  <SelectItem value="Anywhere">Anywhere</SelectItem>
                  {nationality?.length > 0 &&
                    nationality?.map((nation, index) => (
                      <SelectItem key={index} value={nation}>
                        {nation}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="xs:hidden lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[100%] xl:flex xl:flex-col xl:justify-start xl:items-start xl:w-[100%] space-y-1">
              <h2 className="font-bold">Distance</h2>
              <Select
                value={selectedDisname}
                onValueChange={handleDistanceChange}
                defaultValue="Any Distance"
              >
                <SelectTrigger
                  className="lg:w-[80%] xl:w-[80%] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <SelectValue>{selectedDisname}</SelectValue>
                </SelectTrigger>
                <SelectContent onClick={(e) => e.stopPropagation()}>
                  <SelectItem value="Any Distance">Any Distance</SelectItem>
                  <SelectItem value="1-10">1 KM-10 KM</SelectItem>
                  <SelectItem value="11-21">11 KM-21 KM</SelectItem>
                  <SelectItem value="22-42">22 KM-42 KM</SelectItem>
                  <SelectItem value="43-200">43 KM Above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="lg:w-[75%] xl:w-[75%] xs:w-[100%] flex justify-center">
          <div className="xl:flex xl:flex-col xs:flex xs:flex-col xs:justify-center xs:w-[90%] lg:w-[100%] xl:w-[100%] space-y-2">
            {filteredEventsSearch && filteredEventsSearch.length > 0 ? (
              filteredEventsSearch
                .slice(0, eventsToShow)
                .map((event, index) => (
                  <Link
                    key={index}
                    to={`/EventsYear/${event.id}`}
                    className="xl:w-full xs:w-full"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex flex-row space-x-5">
                          <div className="xs:w-[50%] xs:h-full md:w-[50%] xl:w-[40%] xl:h-full">
                            <img
                              src={event.logo_img}
                              alt={event.name}
                              className="w-full h-48 object-contain"
                            />
                          </div>
                          <div className="xs:w-[50%] xs:h-full md:w-[50%] flex flex-col justify-start items-start space-y-2">
                            <CardTitle className="xs:text-start">
                              {event.name}
                            </CardTitle>
                            <CardDescription>{event.country}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))
            ) : (
              <h1>No Events Found</h1>
            )}
          </div>
        </div>
      </div>
      {events.length > eventsToShow && (
        <div className="flex justify-center pb-4">
          <Button onClick={handleLoadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}

const EventCardWithNavigation = withEventCardNavigation(EventCard);

export { EventCardWithNavigation as EventCard };
