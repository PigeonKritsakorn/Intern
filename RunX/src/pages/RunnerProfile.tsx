import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import "../App.css";
import { useEffect, useState } from "react";
import React from "react";

import _ from "lodash";
import { Button } from "@/components/ui/button";
import { COLORS } from "../components/colors.ts";

import ProfilePageBG from "../assets/ProfilePageBG.png";
import RaceResultsChart from "@/components/Raceresult.tsx";
import StatisticsGraph from "@/components/StatisticsGraph.tsx";
import ProfileModal from "@/components/ProfileModal.tsx";

export interface ObjectSort {
  [key: string]: string | number | object;
}

export interface RunnerType {
  firstname: string;
  lastname: string;
  nation: string;
  gender: string;
}

export interface EventType {
  title: string;
}

// export interface RacesType {
//   title: string;
//   racerunners: RunnerType[];
//   startTime: string;
//   events: EventType;
//   eventId: string;
//   distance: number;
// }

export interface RacesType {
  date: string;
  name: string;
  distance: string;
  point: number;
  time: string;
  rank: string;
}

export interface ProfileDataType {
  lastRace: RacesType;
  filterOnYear: RacesType[];
}

interface Profile {
  totalPoint: string;
  user: {
    id: number;
    firstname_eng: string;
    lastname_eng: string;
    firstname_thai: string;
    lastname_thai: string;
    birth_date: string;
    gender: string;
    email: string;
    nationality: string;
    id_passport: string;
    user_img: string;
  };
}
interface Raceclaim {
  claim_status: boolean;
  name: string;
}

function RunnerProfile() {
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [dataWithYear, setDataWithYear] = useState<Object[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [ageUser, setAgeuser] = useState<number>(0);

  useEffect(() => {
    if (profileData) {
      const sortedData = Object.keys(profileData.filterOnYear)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .filter((item) => {
          return item.toString();
        });
      setDataWithYear(sortedData);
    }
  }, [profileData]);

  const ceck = () => {
    if (profileData) {
    }
  };

  const [data, setData] = useState<Profile>();
  const [error, setError] = useState<string | null>(null);
  const [raceData, setraceData] = useState("");
  const [allraceData, setAllracedata] = useState("");
  const [raceResult, setRaceResult] = useState();
  const [isClaimed, setIsClaimed] = useState<boolean>();
  const [isClicked, setIsClicked] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
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
      .then((data) => {
        console.log("Load", data);
        setData(data);
        setAgeuser(data.user.birth_date);
        const userId = data.user.id;
        fetchAllRaceResult(userId);
      })
      .catch((error) => {
        setError(
          "There was a problem with the fetch operation: " + error.message
        );
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    // console.log(data.user.queryUser);
  }, [data]);

  useEffect(() => {
    fetchLatestRaceresult();
  }, []);

  const fetchLatestRaceresult = (limit, method) => {
    const authToken = localStorage.getItem("Login");
    const queryParams = new URLSearchParams({
      method: "desc",
      limit: 1,
      id: 2,
    });

    axios
      .get(`http://localhost:3000/races/result?${queryParams}`, {
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
        setraceData(data);
        console.log("Race Data:", data);
      });
  };

  // useEffect(() => {
  //   fetchAllRaceResult(data?.user.id);
  // }, [id]);

  const fetchAllRaceResult = (id: number) => {
    const authToken = localStorage.getItem("Login");
    console.log("id receive " + id);
    const queryParams = new URLSearchParams({
      id: id.toString(),
      method: "desc",
    });

    axios
      .get(`http://localhost:3000/races/result?${queryParams}`, {
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
        console.log("Race result: ", data);
        setRaceResult(data);
        setAllracedata(data);

        data.map((race: Raceclaim) => {
          if (race.claim_status === true) {
            setIsClaimed(race.claim_status);
            console.log("Claimed :", race.name);
          } else if (race.claim_status === false) {
            setIsClaimed(race.claim_status);
            console.log("Unclaimed :", race.name);
          }
        });

        console.log("Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching race results:", error);
      });
  };

  function calculateAge(birthDate: Date): number {
    const today = new Date();
    // console.log("Today:", today);
    let age = today.getFullYear() - birthDate.getFullYear();
    // console.log("Birthdate:", birthDate.getFullYear());
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const timestamp = ageUser;
  const birthDate = new Date(timestamp);
  const age = calculateAge(birthDate);

  const raceDate = raceResult?.[0]?.date;
  const dateStr = raceDate;
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-indexed
  const year = date.getFullYear().toString();
  const formattedDate = `${day} / ${month} / ${year}`;

  async function handleClaim(resultId: string) {
    const authToken = localStorage.getItem("Login");
    const queryParams = new URLSearchParams({
      resultId: resultId,
      runxId: data.user.id,
    });
    try {
      const response = await axios.post(
        `http://localhost:3000/currentusers/claim/score`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: queryParams,
        }
      );
      console.log("Claim successful:", response.data);
      toast({
        variant: "success",
        title: "Claim successfully",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return response.data;
    } catch (error) {
      console.error("Error claiming score:", error);
      throw error;
    }
  }

  function onClickNotme() {
    setIsClicked(false);
  }

  return (
    <>
      <div className="relative flex flex-row flex-wrap items-center md:justify-center xl:h-screen">
        <div className="bgProfile xs:h-screen sm:h-screen md:h-screen md:w-screen lg:h-screen lg:w-screen xl:h-auto xl:w-[100%]">
          <div className="flex flex-col space-y-10 justify-start items-start sm:w-full md:w-[100%] md:h-[100%] lg:w-[100%] lg:h-[100%] xl:w-[100%] xl:h-auto p-10">
            {error && <div>{error}</div>}
            {data && (
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-start space-x-4">
                  {data.user.user_img === null ? (
                    <Avatar className="w-[20%] h-[20%]">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="w-[30%] h-auto">
                      <img
                        src={data?.user.user_img}
                        alt="Profile image"
                        className="xs:w-[80%] md:w-[70%] md:h-[50%] lg:w-[60%] lg:h-[60%] xl:w-[100%] rounded-xl"
                      />
                    </Avatar>
                  )}
                  <h1 className="xs:text-2xl sm:text-lg md:text-xl lg:text-xl font-semibold text-left">
                    <div className="xl:flex xl:flex-col space-y-4">
                      <h1 className="text-sm">ID# : {data?.user.id}</h1>
                      {data?.user.firstname_thai === null ? (
                        <div className="flex flex-col space-y-8">
                          <h1>{data?.user.firstname_eng}</h1>
                          <h1>{data?.user.lastname_eng}</h1>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          <h1>{data?.user.firstname_thai}</h1>
                          <h1>{data?.user.lastname_thai}</h1>
                        </div>
                      )}
                    </div>
                  </h1>
                  <ProfileModal />
                </div>
                <div className="flex flex-row space-x-5">
                  <div className="flex flex-col justify-start items-start">
                    <h1>Total Points</h1>
                    <h1>{data?.totalPoint}</h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1>Nationality</h1>
                    <h1>{data?.user.nationality}</h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1>Age</h1>
                    <h1>{age}</h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1>Gender</h1>
                    <h1>{data?.user.gender}</h1>
                  </div>
                </div>
              </div>
            )}

            <div className="xs:w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[90%]">
              <Tabs
                defaultValue="claim"
                className="flex w-[100%] xl:h-screen space-x-10"
              >
                <div className="xs:w-full lg:w-[24%] xs:mb-6 lg:mb-0 flex flex-wrap items-start">
                  <TabsList className="w-full md:w-[100%] md:flex md:flex-row  lg:flex lg:flex-col lg:flex-wrap lg:items-start xl:flex xl:flex-row ">
                    <TabsTrigger
                      value="claim"
                      className="xs:w-[25%] sm:w-[33%] md:w-[33%] lg:w-full"
                    >
                      Claim
                    </TabsTrigger>
                    <TabsTrigger
                      value="statistics"
                      className="xs:w-[37%] sm:w-[33%] md:w-[33%] lg:w-full"
                    >
                      Statistics
                    </TabsTrigger>
                    <TabsTrigger
                      value="allrace_tab"
                      className="xs:w-[38%] sm:w-[33%] md:w-[33%] lg:w-full"
                    >
                      All race results
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="xs:w-full lg:w-[76%] h-[30%]">
                  <TabsContent
                    value="claim"
                    className="flex flex-wrap flex-col items-start w-full"
                  >
                    <h1 className="xs:text-lg lg:text-3xl font-semibold leading-none">
                      Claim
                    </h1>
                    <div className="mt-3 w-full">
                      <Table className="border rounded-lg table-fixed">
                        <TableHeader>
                          <TableRow style={{ backgroundColor: COLORS.WHITE }}>
                            <TableHead className="text-center w-[17%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              {" "}
                            </TableHead>
                            <TableHead className="text-left w-[30%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Event name
                            </TableHead>
                            <TableHead className="text-left text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Point gain
                            </TableHead>
                            <TableHead className="text-left text-[#000000] font-semibold xs:text-xs sm:text-sm"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody style={{ backgroundColor: COLORS.WHITE }}>
                          {Array.isArray(raceResult) &&
                          raceResult.length > 0 ? (
                            raceResult.map((race) => (
                              <TableRow key={race.id}>
                                <TableCell
                                  variant={"emptyClass"}
                                  className="xs:text-xs sm:text-sm"
                                >
                                  <img
                                    src={race.logoImg}
                                    alt={`${race.name} logo`}
                                    width={"100%"}
                                    height={"100%"}
                                  />
                                </TableCell>
                                <TableCell>
                                  <h2>{race.name}</h2>
                                </TableCell>
                                <TableCell>
                                  <h2>{race.score}</h2>
                                </TableCell>

                                <TableCell>
                                  {race.claim_status ? (
                                    <Button
                                      style={{
                                        borderRadius: "10px",
                                        backgroundColor: COLORS.GREEN,
                                      }}
                                    >
                                      Success
                                    </Button>
                                  ) : (
                                    <div className="space-x-2">
                                      <Button
                                        onClick={() =>
                                          handleClaim(race.ResultId)
                                        }
                                      >
                                        Claim
                                      </Button>
                                      {isClicked ? (
                                        <Button
                                          style={{
                                            backgroundColor: COLORS.DANGER,
                                          }}
                                          onClick={onClickNotme}
                                        >
                                          Not Me
                                        </Button>
                                      ) : null}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4}>
                                No race results available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="allrace_tab"
                    className="flex flex-wrap flex-col items-start w-full"
                  >
                    <StatisticsGraph />
                    <div className="w-full space-y-3">
                      {allraceData && allraceData.length > 0 ? (
                        Object.entries(
                          allraceData.reduce((acc, data) => {
                            const raceDate = data.date;
                            const date = new Date(raceDate);
                            const year = date.getFullYear();

                            if (!acc[year]) {
                              acc[year] = [];
                            }
                            acc[year].push(data);

                            return acc;
                          }, {})
                        )
                          .sort(
                            ([yearA], [yearB]) =>
                              parseInt(yearB) - parseInt(yearA)
                          )
                          .map(([year, yearData]) => (
                            <React.Fragment key={year}>
                              <div className="flex flex-start text-lg font-bold">
                                {year}
                              </div>
                              <Table
                                key={year} // Use year as the key for each table
                                className="border rounded-lg table-fixed"
                                style={{ backgroundColor: COLORS.WHITE }}
                              >
                                <TableHeader>
                                  <TableRow className="bg-headTableData">
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Date
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Race name
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Distance
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Point gained
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Time
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Ranking
                                    </TableHead>
                                    <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                      Claimed status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {yearData.map((data, index) => {
                                    const raceDate = data.date;
                                    const date = new Date(raceDate);
                                    const day = date
                                      .getDate()
                                      .toString()
                                      .padStart(2, "0");
                                    const month = (date.getMonth() + 1)
                                      .toString()
                                      .padStart(2, "0");
                                    const formattedDate = `${day} / ${month} / ${year}`;

                                    return (
                                      <TableRow key={index}>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {formattedDate}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.name}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.distance}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.score}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.time}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.rank}
                                        </TableCell>
                                        <TableCell className="text-center xs:text-xs sm:text-sm">
                                          {data.claim_status === false ? (
                                            <h1>Unclaimed</h1>
                                          ) : (
                                            <h1>Claimed</h1>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </React.Fragment>
                          ))
                      ) : (
                        <h1>No race results available.</h1>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="statistics"
                    className="flex flex-wrap flex-col items-start w-full"
                  >
                    <div className="w-full text-left">
                      <h1 className="xs:text-lg lg:text-3xl font-semibold leading-none">
                        Latest race results
                      </h1>
                    </div>
                    <div className="mt-3 w-full">
                      <Table
                        className="border rounded-lg table-fixed"
                        style={{ backgroundColor: COLORS.WHITE }}
                      >
                        <TableHeader>
                          <TableRow className="bg-headTableData">
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Date
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Race name
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Distance
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Point gained
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Time
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Ranking
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {raceResult && (
                            <TableRow>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {formattedDate}
                              </TableCell>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {raceResult[0]?.name}
                              </TableCell>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {raceResult[0]?.distance}
                              </TableCell>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {raceResult[0]?.score}
                              </TableCell>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {raceResult[0]?.time}
                              </TableCell>
                              <TableCell className="text-center xs:text-xs sm:text-sm">
                                {raceResult[0]?.rank}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-10 w-full text-left">
                      <h1 className="xs:text-lg lg:text-3xl font-semibold leading-none">
                        Achievement
                      </h1>
                    </div>
                    <div className="mt-3 w-full">
                      <Table
                        className="border rounded-lg table-fixed"
                        style={{ backgroundColor: COLORS.WHITE }}
                      >
                        <TableHeader>
                          <TableRow className="bg-headTableData">
                            <TableHead className="text-center w-[50%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                              Time
                            </TableHead>
                            <TableHead className="text-center w-[50%] text-[#000000]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              Best finishing rank
                            </TableCell>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              1
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              Best pace
                            </TableCell>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              5:20
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              Race finished
                            </TableCell>
                            <TableCell className="text-center xs:text-xs sm:text-sm">
                              7/7
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-10 w-full text-left">
                      <h1 className="xs:text-lg lg:text-3xl font-semibold leading-none">
                        Ranking overview
                      </h1>
                    </div>
                    <div className="mt-3 w-full">
                      <div className="flex flex-row flex-wrap lg:justify-around">
                        <div className="xs:w-[100%] lg:w-[33%] xs:mb-5 lg:mb-0">
                          <Table
                            className="border rounded-lg table-fixed"
                            style={{ backgroundColor: COLORS.WHITE }}
                          >
                            <TableHeader>
                              <TableRow className="bg-headTableData">
                                <TableHead
                                  className="text-center text-[#000000] font-semibold"
                                  colSpan={2}
                                >
                                  World
                                </TableHead>
                              </TableRow>
                              <TableRow className="bg-headTableData">
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  Overview
                                </TableHead>
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  <span className="block">Category</span> (F
                                  35-39)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  60
                                </TableCell>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  1
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div className="xs:w-[100%] lg:w-[33%] xs:mb-5 lg:mb-0">
                          <Table
                            className="border rounded-lg table-fixed"
                            style={{ backgroundColor: COLORS.WHITE }}
                          >
                            <TableHeader>
                              <TableRow className="bg-headTableData">
                                <TableHead
                                  className="text-center text-[#000000] font-semibold"
                                  colSpan={2}
                                >
                                  Asia
                                </TableHead>
                              </TableRow>
                              <TableRow className="bg-headTableData">
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  Overview
                                </TableHead>
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  <span className="block">Category</span> (F
                                  35-39)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  60
                                </TableCell>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  1
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div className="xs:w-[100%] lg:w-[33%] xs:mb-5 lg:mb-0">
                          <Table
                            className="border rounded-lg table-fixed"
                            style={{ backgroundColor: COLORS.WHITE }}
                          >
                            <TableHeader>
                              <TableRow className="bg-headTableData">
                                <TableHead
                                  className="text-center text-[#000000] font-semibold"
                                  colSpan={2}
                                >
                                  Thailand
                                </TableHead>
                              </TableRow>
                              <TableRow className="bg-headTableData">
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  Overview
                                </TableHead>
                                <TableHead className="text-center text-[#000000] font-semibold xs:text-xs sm:text-sm">
                                  <span className="block">Category</span> (F
                                  35-39)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  60
                                </TableCell>
                                <TableCell className="text-center xs:text-xs sm:text-sm">
                                  1
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RunnerProfile;
