import React, { useState, useEffect } from "react";
import { RankingCard } from "@/components/RankingCard.tsx";
import RankingGraph from "@/components/RankingGraph.tsx";


import bgHeader from "../assets/bg_home.png";
import RankingBG from "../assets/RankingBG.png";

import { Skeleton } from "@/components/ui/skeleton";

import { Search, CalendarDays } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import _ from "lodash";

import "../App.css";
import FilterSVG from "../assets/filter.svg";

// import { edenTreaty } from "@elysiajs/eden";
// import type { App } from "../../../src/server.ts";

import CardEventList, {
  TypeEventListData,
} from "../components/CardEventList.tsx";

import TableRunnerRanking, {
  TypeRunnersListData,
} from "../components/TableRunnersRanking.tsx";
import TableRunnerRankingTop3 from "@/components/TableRunnerRankingTop3.tsx";

function Ranking() {
  // const client = edenTreaty<App>(import.meta.env.VITE_API_URL) as any;

  const runnerMockupTop3: TypeRunnersListData[] = [
    {
      firstname: "Kampanat",
      lastname: "Chonsawad",
      nation: "THA",
      age: 35,
      gender: "M",
      points: 6000,
    },
    {
      firstname: "Phonlawatana",
      lastname: "Suksuwan",
      nation: "THA",
      age: 35,
      gender: "M",
      points: 5500,
    },
    {
      firstname: "Songyos",
      lastname: "Phetlerd",
      nation: "THA",
      age: 35,
      gender: "M",
      points: 5000,
    },
  ];

  const runnerMockupTop2: TypeRunnersListData[] = [
    {
      firstname: "Kiptum",
      lastname: "Kelvin",
      nation: "Kenya",
      age: "20-24",
      gender: "M",
      points: 1651734,
    },
    {
      firstname: "Kipruto",
      lastname: "Benson",
      nation: "Kenya",
      age: "30-34",
      gender: "M",
      points: 1605790.85,
    },
    {
      firstname: "Abdi",
      lastname: "Bashir",
      nation: "Belgium",
      age: "30-34",
      gender: "M",
      points: 1599343.61,
    },
  ];

  const runnerMockup4to20: TypeRunnersListData[] = [
    {
      firstname: "Korir",
      lastname: "John",
      nation: "Kenya",
      age: "25-29",
      gender: "M",
      points: 1591462.98,
    },
    {
      firstname: "Tura",
      lastname: "Abdiwak",
      nation: "Ethiopia",
      age: "25-29",
      gender: "M",
      points: 1587235.42,
    },
    {
      firstname: "Mantz",
      lastname: "Conner",
      nation: "USA",
      age: "25-29",
      gender: "M",
      points: 1558666.43,
    },
    {
      firstname: "Young",
      lastname: "Clayton",
      nation: "USA",
      age: "30-34",
      gender: "M",
      points: 1556028.06,
    },
    {
      firstname: "Rupp",
      lastname: "Galen",
      nation: "USA",
      age: "35-39",
      gender: "M",
      points: 1546363.29,
    },
    {
      firstname: "Chelanga",
      lastname: "Sam",
      nation: "USA",
      age: "35-39",
      gender: "M",
      points: 1545963.19,
    },
    {
      firstname: "Ichida",
      lastname: "Takashi",
      nation: "Japan",
      age: "30-34",
      gender: "M",
      points: 1544564.49,
    },
    {
      firstname: "Shrader",
      lastname: "Brian",
      nation: "USA",
      age: "30-34",
      gender: "M",
      points: 1534844.01,
    },
    {
      firstname: "Kiptoo",
      lastname: "Wesley",
      nation: "Kenya",
      age: "20-24",
      gender: "M",
      points: 1526609.03,
    },
    {
      firstname: "McDonald",
      lastname: "Matt",
      nation: "USA",
      age: "30-34",
      gender: "M",
      points: 1525439.81,
    },
    {
      firstname: "Reichow",
      lastname: "Joel",
      nation: "USA",
      age: "30-34",
      gender: "M",
      points: 1524855.87,
    },
    {
      firstname: "Colley",
      lastname: "Andrew",
      nation: "USA",
      age: "30-34",
      gender: "M",
      points: 1516150.15,
    },
    {
      firstname: "Salvano",
      lastname: "Kevin",
      nation: "USA",
      age: "25-29",
      gender: "M",
      points: 1515381.12,
    },
    {
      firstname: "Wolde",
      lastname: "Dawit",
      nation: "Ethiopia",
      age: "30-34",
      gender: "M",
      points: 1514037.18,
    },
    {
      firstname: "Lara",
      lastname: "Frank",
      nation: "USA",
      age: "25-29",
      gender: "M",
      points: 1498093.96,
    },
    {
      firstname: "Gusman",
      lastname: "Jordan",
      nation: "Malta",
      age: "25-29",
      gender: "M",
      points: 1495095.14,
    },
    {
      firstname: "Kiselev",
      lastname: "Stepan",
      nation: "Russia",
      age: "25-29",
      gender: "M",
      points: 1492667.44,
    },
  ];

  // const filterRacesQuery = async (obj: object) => {
  //   setLoading(false);
  //   setTimeout(async () => {
  //     const { data: value, error: errorInfo } = await client.api.events.get({
  //       $query: obj,
  //     });
  //     if (value && !errorInfo) {
  //       setEvents(value.data);
  //       setLoading(true);
  //     }
  //   }, 1000);
  // };

  const [isLoading, setLoading] = React.useState<Boolean>(false);
  const [events, setEvents] = React.useState<TypeEventListData[]>([]);
  const [eventsTmp, setEventsTmp] = React.useState<TypeEventListData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const setTitleFnSearch = (e: React.BaseSyntheticEvent) => {
    console.log(e.target.value);
    let titleTime;
    clearTimeout(titleTime);
    titleTime = setTimeout(() => {
      setTitleEventFilter(e.target.value as String);
    }, 2000);
  };

  // useEffect(() => {
  //   filterRacesQuery({});
  // }, []);

  return (
    <div className="flex flex-col w-[100%] h-[100%]">
      <div className="relative flex flex-col flex-wrap items-center lg:min-h-fit xs:bg-[#000] lg:bg-none sm:h-[20%] xl:h-[40%]">
        <div
          className="w-full xs:overlayimg-black lg:overlayimg-black sm:h-auto xs:h-auto md:h-auto"
          style={{ overflow: "hidden" }}
        >
          <img className="w-full h-full" src={bgHeader} />
        </div>
        <div className="absolute xs:top-[30%] lg:top-[40%] w-3/4 text-left text-white">
          <p className="xs:text-[6vw] lg:text-[6vw] leading-tight font-bold">
            Top 50 Runners
          </p>
          <span className="opacity-[0.6] text-[14px]">
            Your running story, perfectly archived. Chart your progress,
            celebrate your triumphs.
          </span>
        </div>
      </div>
      <div className="relative flex flex-col xl:w-[100%] h-[100%]">
        <img src={RankingBG} className="w-screen h-[100%]" />
        <div className="absolute w-full h-full flex flex-col justify-center items-center space-y-4 pt-10 pb-10">
          <RankingGraph />
          <RankingCard />
        </div>
      </div>
    </div>
  );
}

export default Ranking;
