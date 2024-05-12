import React, { useEffect } from "react";
import RaceBG from "../assets/RaceBG.png";
import axios from "axios";
import { EventCard } from "@/components/EventCard.tsx";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import _ from "lodash";

import "../App.css";
import FilterSVG from "../assets/filter.svg";

// import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../../../src/server.ts";

import CardEventList, {
  TypeEventListData,
} from "../components/CardEventList.tsx";

import Map from "@/components/Worldmap.tsx";
import { FilterDrawer } from "@/components/FilterDrawer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { E } from "node_modules/@elysiajs/eden/dist/types-d1b334ad";

const FormSchema = z.object({
  title: z.string().default(""),
  location: z.string().default("Anywhere"),
  startPeriod: z.date().default(new Date("1991-01-10")),
});

function Home() {
  // const client = edenTreaty<App>(import.meta.env.VITE_API_URL) as any;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [dateEventFilter, setDateEventFilter] = React.useState<Date>();
  const [countryEventFilter, setCountryEventFilter] =
    React.useState<String>("Anywhere");
  const [titleEventFilter, setTitleEventFilter] = React.useState<String>("");

  const filterRacesQuery = async (obj: object) => {
    // setLoading(false);
    // setTimeout(async () => {
    //   const { data: value, error: errorInfo } = await client.api.events.get({
    //     $query: obj,
    //   });
    //   if (value && !errorInfo) {
    //     setEvents(value.data);
    //     setLoading(true);
    //   }
    // }, 1000);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = {
      title: data.title,
      location: data.location,
      startPeriod: data.startPeriod.toISOString(),
    };

    await filterRacesQuery(formData);
  }

  interface filterRangeInterface {
    min: number;
    max: number;
  }

  const [filterRangeValue, setFilterRangeValue] = React.useState<string[]>([]);
  const [filterValueSend, setFilterValueSend] =
    React.useState<filterRangeInterface>({
      min: 0,
      max: 999,
    });
  const [isLoading, setLoading] = React.useState<Boolean>(false);
  // const [events, setEvents] = React.useState<TypeEventListData[]>([]);
  // const [eventsTmp, setEventsTmp] = React.useState<TypeEventListData[]>([]);

  const setTitleFnSearch = (e: React.BaseSyntheticEvent) => {
    console.log(e.target.value);
    let titleTime;
    clearTimeout(titleTime);
    titleTime = setTimeout(() => {
      setTitleEventFilter(e.target.value as String);
    }, 2000);
  };

  const filterSelect = (e: React.BaseSyntheticEvent) => {
    const isSelect =
      e.target.getAttribute("data-state") === "off" ? "on" : "off";
    const jsonIsRange = e.target.getAttribute("data-range");

    const selectedRange = e.currentTarget.getAttribute("data-range");
    console.log("Selected Range:", selectedRange);
    // next day fix on click change //

    if (isSelect === "on") {
      setFilterRangeValue([...filterRangeValue, jsonIsRange]);
      console.log("Button click");
    } else {
      const filterRemove = filterRangeValue.filter((item) => {
        return item != jsonIsRange;
      });
      setFilterRangeValue(filterRemove);
    }
  };

  const filterChange = () => {
    const filterEndValue: filterRangeInterface[] = filterRangeValue.map(
      (item) => {
        const nc = item.split("-");

        const next = {
          min: parseInt(nc[0]),
          max: parseInt(nc[1]),
        };
        return next;
      }
    );

    if (filterEndValue.length > 0) {
      const minValue = filterEndValue.reduce(
        (acc, current) => (current.min < acc.min ? current : acc),
        filterEndValue[0]
      ).min;
      const maxValue = filterEndValue.reduce(
        (acc, current) => (current.max > acc.max ? current : acc),
        filterEndValue[0]
      ).max;

      const eventFilterDistance: TypeEventListData[] = _.reduce(
        events,
        (result: TypeEventListData[], item) => {
          const filteredRaces = item.races.filter((race) => {
            const distanceFloat = race.distance;
            return distanceFloat >= minValue && distanceFloat < maxValue;
          });

          if (filteredRaces.length > 0) {
            result.push({
              ...item,
              races: filteredRaces,
            });
          }

          return result;
        },
        []
      );

      setEventsTmp(eventFilterDistance);

      setFilterValueSend({
        min: minValue,
        max: maxValue,
      });
    } else {
      setFilterValueSend({
        min: 0,
        max: 999,
      });
    }
  };

  const filterRanges: filterRangeInterface[] = [
    {
      min: 1,
      max: 5,
    },
    {
      min: 5,
      max: 10,
    },
    {
      min: 10,
      max: 21,
    },
    {
      min: 21,
      max: 42,
    },
    {
      min: 42,
      max: 998,
    },
  ];

  useEffect(() => {
    filterChange();
  }, [filterRangeValue]);

  useEffect(() => {}, [filterValueSend]);

  useEffect(() => {
    filterRacesQuery({});
  }, []);

  useEffect(() => {
    if (dateEventFilter || countryEventFilter || titleEventFilter) {
      const formData = {
        ...(titleEventFilter && { title: titleEventFilter }),
        ...(countryEventFilter && { location: countryEventFilter }),
        ...(dateEventFilter && { startPeriod: dateEventFilter.toISOString() }),
      };
      filterRacesQuery(formData);
    }
  }, [dateEventFilter, countryEventFilter, titleEventFilter]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddFilter = (e: React.BaseSyntheticEvent) => {
    const currentFilterRangeValue = filterRangeValue;

    const isSelect =
      e.target.getAttribute("data-state") === "off" ? "on" : "off";
    const jsonIsRange = e.target.getAttribute("data-range");
    const filterData = {
      filterRangeValue: currentFilterRangeValue,
      // Include other filter data as needed
    };
    if (isSelect === "on") {
      setFilterRangeValue([...filterRangeValue, jsonIsRange]);

      console.log("Button click");
    } else {
      const filterRemove = filterRangeValue.filter((item) => {
        return item != jsonIsRange;
      });

      setFilterRangeValue(filterRemove);
    }
    console.log("Filter Data:", filterData);
    console.log("Selected Filter Ranges:", currentFilterRangeValue);
  };

  // const [events, setEvents] = React.useState<any[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const postData = {
  //         country: "Thai",
  //         distance: "",
  //         year: "",
  //         title: "",
  //       };

  //       const response = await axios.post(
  //         "http://localhost:3000/events/filter",
  //         postData
  //       );

  //       setEvents(response.data.data);
  //       console.log("Data:", response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
        <div className="flex flex-col lg:flex-row">
          <div className="z-0 p-3">
            <Map />
          </div>
          {isMobile ? (
            // <FilterDrawer onAddFilter={handleAddFilter} />

            <div className="px-3">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-[350px]">
                    Filter
                  </Button>
                </DrawerTrigger>
                <DrawerContent style={{ padding: "20px" }}>
                  <div className="lg:w-1/4 lg:pl-4">
                    <div className="flex flex-col">
                      <div className="flex items-center font-semibold">
                        <img src={FilterSVG} className="h-6 mr-2" />
                        <p className="text-xl">Filter</p>
                      </div>
                      <div className="flex items-center font-semibold mt-2">
                        <p className="text-sm mr-2">Distance</p>
                        <Badge className="px-2.5" variant={"tealBadge"}>
                          {filterRangeValue.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap mt-2">
                        {filterRanges.map((item, i) => (
                          <Toggle
                            key={i}
                            variant="outline"
                            className="rounded-full text-[#777777] mr-1 mt-2"
                            aria-label="Toggle italic"
                            data-range={`${item.min}-${item.max}`}
                            onClick={filterSelect}
                          >
                            {item.min} ~ {item.max != 998 && item.max}K
                          </Toggle>
                        ))}
                      </div>
                      <div className="flex items-center font-semibold mt-2">
                        <p className="text-sm">Country</p>
                      </div>
                      <div className="xs:-full lg:w-[90%] p-1 mt-2 bg-[#F5F5F5] rounded-md">
                        <p className="text-left px-2 mt-1 text-xs text-[#777777]">
                          Country
                        </p>
                        <Select
                          onValueChange={setCountryEventFilter}
                          defaultValue="Anywhere"
                        >
                          <SelectTrigger className="w-full h-fit py-0 px-2 bg-[#F5F5F5]">
                            <SelectValue placeholder="Anywhere" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Anywhere">Anywhere</SelectItem>
                            <SelectItem value="Thailand">Thailand</SelectItem>
                            <SelectItem value="Chonburi">Chonburi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center font-semibold mt-2">
                        <p className="text-sm">Date</p>
                      </div>
                      <div className="xs:w-full lg:w-[90%] p-1 mt-2 bg-[#F5F5F5] rounded-md">
                        <p className="text-left px-2 mt-1 text-xs text-[#777777]">
                          Date
                        </p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal h-fit py-0 border-0 px-2 bg-[#F5F5F5]"
                            >
                              {dateEventFilter ? (
                                format(dateEventFilter, "P", { locale: th })
                              ) : (
                                <span className="text-sm">Any time</span>
                              )}
                              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateEventFilter}
                              onSelect={setDateEventFilter}
                              disabled={(date) => date < new Date("01-01-1980")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <DrawerClose asChild>
                        <Button onClick={handleAddFilter}>Add Filter</Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          ) : (
            <div
              style={{
                justifyContent: "center",
                paddingTop: "70px",
                paddingLeft: "30px",
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center font-semibold">
                  <img src={FilterSVG} className="h-6 mr-2" />
                  <p className="text-xl">Filter</p>
                </div>
                <div className="flex items-center font-semibold mt-2">
                  <p className="text-sm mr-2">Distance</p>
                  <Badge className="px-2.5" variant={"tealBadge"}>
                    {filterRangeValue.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap mt-2">
                  {filterRanges.map((item, i) => (
                    <Toggle
                      key={i}
                      variant="outline"
                      className="rounded-full text-[#777777] mr-1 mt-2"
                      aria-label="Toggle italic"
                      data-range={`${item.min}-${item.max}`}
                      onClick={filterSelect}
                    >
                      {item.min} ~ {item.max != 998 && item.max}K
                    </Toggle>
                  ))}
                </div>
                <div className="flex items-center font-semibold mt-2">
                  <p className="text-sm">Country</p>
                </div>
                <div className="xs:-full lg:w-[90%] p-1 mt-2 bg-[#F5F5F5] rounded-md">
                  <p className="text-left px-2 mt-1 text-xs text-[#777777]">
                    Country
                  </p>
                  <Select
                    onValueChange={setCountryEventFilter}
                    defaultValue="Anywhere"
                  >
                    <SelectTrigger className="w-full h-fit py-0 px-2 bg-[#F5F5F5]">
                      <SelectValue placeholder="Anywhere" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anywhere">Anywhere</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Chonburi">Chonburi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center font-semibold mt-2">
                  <p className="text-sm">Date</p>
                </div>
                <div className="xs:w-full lg:w-[90%] p-1 mt-2 bg-[#F5F5F5] rounded-md">
                  <p className="text-left px-2 mt-1 text-xs text-[#777777]">
                    Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal h-fit py-0 border-0 px-2 bg-[#F5F5F5]"
                      >
                        {dateEventFilter ? (
                          format(dateEventFilter, "P", { locale: th })
                        ) : (
                          <span className="text-sm">Any time</span>
                        )}
                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateEventFilter}
                        onSelect={setDateEventFilter}
                        disabled={(date) => date < new Date("01-01-1980")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> */}
      <div className="xs:w-screen xs:h-screen xl:w-[100%] flex flex-row flex-wrap items-center justify-center  lg:mt-0 sm:p-0 ">
        <img src={RaceBG} alt="RaceBG" className="w-full h-full object-cover" />
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-row flex-wrap justify-center "
          style={{ height: "screen", overflowY: "auto" }}
        >
          {/* <Map /> */}
          <EventCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
