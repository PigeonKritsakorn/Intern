import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RNTableBG from "../assets/RNTableBG.png";
import { COLORS } from "../components/colors";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Checked = boolean;

const RNTable = () => {
  const { name } = useParams();
  const [raceData, setRaceData] = useState([]);
  const [runnerData, setRunnerData] = useState(null);
  const [numRunner, setNumRunner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterData = {
          country: "",
          distance: "",
          year: "",
          title: name,
        };

        const queryString = Object.keys(filterData)
          .map((key) => `${key}=${encodeURIComponent(filterData[key])}`)
          .join("&");

        const filterResponse = await axios.get(
          `http://localhost:3000/events/filter?${queryString}`
        );
        const eventId = name;
        console.log("Event ID:", eventId);

        if (eventId) {
          const queryParams = new URLSearchParams({
            raceId: eventId,
          });

          const raceResponse = await axios.get(
            `http://localhost:3000/races/${eventId}`
          );

          console.log("Race response:", raceResponse);
          console.log(eventId);
          console.log("Race data", raceResponse.data);
          setRaceData([raceResponse.data.race]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [name]);

  const raceDate = raceData[0]?.date;
  console.log(raceDate);
  const dateStr = raceDate;
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-indexed
  const year = date.getFullYear().toString();
  const formattedDate = `${day} / ${month} / ${year}`;
  console.log(formattedDate);

  const raceId = raceData[0]?.id;
  const raceIdString = raceId?.toString();
  console.log(raceIdString);
  console.log(typeof raceIdString);
  useEffect(() => {
    async function fetchRunnerData() {
      const queryParams = new URLSearchParams({
        raceId: raceIdString,
      });
      try {
        if (!raceIdString) return;
        const response = await axios.get(
          // `http://localhost:3000/runner?raceId=${raceIdString}`
          `http://localhost:3000/races/result/runner`,
          { params: queryParams }
        );
        console.log("Runner data:", response.data);
        // console.log(response.data.count());
        setRunnerData(response.data);
        setNumRunner(response.data.length);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }

    fetchRunnerData();

    return () => {};
  }, [raceIdString]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };

  const filteredRunners =
    runnerData && runnerData.length > 0
      ? runnerData.filter(
          (runner) =>
            `${runner.firstname} ${runner.lastname}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) &&
            (selectedGender === "All gender" ||
              (selectedGender ? runner.gender === selectedGender : true))
        )
      : [];

  return (
    <div className="xs:h-[100%] sm:h-screen md:h-[100%] lg:h-screen xl:h-screen xs:flex xs:flex-col sm:flex sm:flex-col md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col">
      {raceData && raceData.length > 0 && (
        <div className="xs:h-auto sm:h-[40%] md:h-[40%] lg:h-[50%] xl:h-[50%]">
          {raceData.map((race, index) => (
            <div
              key={index}
              style={{
                objectFit: "contain",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${race.cover_img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(1)",
              }}
              className="xs:h-[100%] sm:h-[100%] md:h-[636px] lg:h-[100%] xl:h-[100%]"
            >
              <div
                className="xs:flex xs:flex-col xs:justify-start xs:items-start xs:text-base xs:p-10 sm:flex sm:flex-col sm:justify-start sm:items-start sm:text-base sm:p-10 md:flex md:flex-col md:justify-start md:items-start md:text-xl md:p-20 lg:flex lg:flex-col lg:justify-start lg:items-start lg:text-xl xl:flex xl:flex-col xl:justify-start xl:items-start xl:text-xl "
                // style={{ color: COLORS.WHITE }}
              >
                <h1 style={{ color: "white" }} className="font-bold">
                  {race.name}
                </h1>
                <h1 style={{ color: "white" }} className="font-bold">
                  {race.state}
                </h1>
                <h1 style={{ color: "white" }} className="sm:flex sm:flex-wrap">
                  {formattedDate}
                </h1>
                <h1 style={{ color: "white" }}>{race.distance} KM</h1>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          backgroundImage: `url(${RNTableBG})`,
          backgroundSize: "cover",
        }}
        className="xs:h-[100%] sm:h-[100%] md:h-[60%] lg:h-[100%] xl:h-[100%]"
      >
        <div className="flex flex-row xs:flex xs:flex-col xs:p-10 sm:flex sm:flex-row sm:p-10 md:w-[100%] md:h-[60%] md:flex md:flex-row md:justify-between md:p-20 lg:w-[100%] lg:flex lg:flex-row lg:p-20 xl:w-[100%] xl:flex xl:flex-row xl:p-20">
          <div className="md:w-auto lg:w-[30%] xl:w-[30%] ">
            {raceData &&
              raceData.map((race, index) => (
                // <div
                //   key={index}
                //   style={{
                //     color: "black",
                //   }}
                //   className="
                //   sm:flex sm:flex-col sm:justify-start sm:items-start sm:space-y-3
                //   md:flex md:flex-col md:justify-start md:items-start md:space-y-3
                //   lg:flex lg:flex-col lg:justify-start lg:items-start lg:space-y-3
                //   xl:flex xl:flex-col xl:justify-start xl:items-start xl:space-y-3"
                // >
                //   <h1 style={{ fontWeight: 700 }}>Race Detail</h1>
                //   <div className="flex flex-col justify-start items-start">
                //     <h1 style={{ color: COLORS.GREY }}>Race Date</h1>
                //     <h1>{formattedDate}</h1>
                //   </div>
                //   <div className="flex flex-col justify-start items-start">
                //     <h1 style={{ color: COLORS.GREY }}>Distance</h1>
                //     <h1>{race.distance}</h1>
                //   </div>
                //   <div className="flex flex-col justify-start items-start">
                //     <h1 style={{ color: COLORS.GREY }}>Start Time</h1>
                //     <h1>{race.start_time}</h1>
                //   </div>
                //   <div className="flex flex-col justify-start items-start">
                //     <h1 style={{ color: COLORS.GREY }}>
                //       Number of Participants
                //     </h1>
                //     <h1>{numRunner}</h1>
                //   </div>
                //   <div className="flex flex-col justify-start items-start">
                //     <h1 style={{ color: COLORS.GREY }}>Maximum point gained</h1>
                //     <h1>1000 Points</h1>
                //   </div>
                // </div>
                <div
                  key={index}
                  style={{
                    color: "black",
                  }}
                  className="xs:w-[100%] xs:flex xs:flex-col "
                >
                  <h1
                    className="flex justify-start items-start"
                    style={{ fontWeight: 700 }}
                  >
                    Race Detail
                  </h1>

                  <div className="xs:w-[100%] xs:flex xs:flex-row xs:justify-between sm:w-[100%] sm:flex sm:flex-col">
                    <div className="xs:w-[50%] sm:w-[100%] flex flex-col justify-start items-start">
                      <h1 style={{ color: COLORS.GREY }}>Race Date</h1>
                      <h1>{formattedDate}</h1>
                    </div>
                    <div className="xs:w-[50%] flex flex-col justify-start items-start">
                      <h1 style={{ color: COLORS.GREY }}>Distance</h1>
                      <h1>{race.distance}</h1>
                    </div>
                  </div>
                  <div className="xs:w-[100%] xs:flex xs:flex-row xs:justify-between sm:w-[100%] sm:flex sm:flex-col">
                    <div className="xs:w-[50%] flex flex-col justify-center items-start">
                      <h1 style={{ color: COLORS.GREY }}>Start Time</h1>
                      <h1>{race.start_time}</h1>
                    </div>

                    <div className="xs:w-[50%] flex flex-col justify-start items-start">
                      <h1 style={{ color: COLORS.GREY }}>
                        Number of
                        <br />
                        Participants
                      </h1>
                      <h1>{numRunner}</h1>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1 style={{ color: COLORS.GREY }}>Maximum point gained</h1>
                    <h1>1000 Points</h1>
                  </div>
                </div>
              ))}
          </div>
          <div className="md:w-auto lg:w-[70%] xl:w-[70%] space-y-4">
            <div className="flex flex-row justify-between items-center">
              <h1>Race Result</h1>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Gender</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-30 right-0">
                    <DropdownMenuLabel>Gender</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedGender === "All gender"}
                      onCheckedChange={() => handleGenderFilter("All gender")}
                    >
                      All gender
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedGender === "Male"}
                      onCheckedChange={() => handleGenderFilter("Male")}
                    >
                      Male
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedGender === "Female"}
                      onCheckedChange={() => handleGenderFilter("Female")}
                    >
                      Female
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-end items-end">
                <Input
                  placeholder="Search Runners"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="sm:w-[50%] border-0 bg-[#F5F5F5] placeholder:text-sm sm:h-[50%] md:h-[50%] lg:h-[50%] xl:h-[50%]"
                />
              </div>
              <div style={{ height: "70vh", overflowY: "auto" }}>
                <Table style={{ backgroundColor: COLORS.WHITE }}>
                  <TableHeader>
                    <TableRow className="bg-headTableData">
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>Runner</TableHead>
                      <TableHead>Point Gained</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Gender</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRunners && filteredRunners.length > 0 ? (
                      filteredRunners.map((runner, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {/* {runner.rank} */}
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            {runner.firstname} {runner.lastname}
                          </TableCell>
                          <TableCell>{runner.score}</TableCell>
                          <TableCell>{runner.time}</TableCell>
                          <TableCell className="text-right">
                            {runner.gender}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>No data available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNTable;
