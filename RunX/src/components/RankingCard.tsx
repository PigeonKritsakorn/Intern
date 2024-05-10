import { useState, useEffect } from "react";
import {
  NavLink,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { COLORS } from "../components/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import GoldMedal from "../assets/GoldMedal.png";
import SilverMedal from "../assets/SilverMedal.png";
import BronzeMedal from "../assets/BronzeMedal.png";

interface Runner {
  id: number;
  name: string;
  totalscore: number;
  gender: string;
  nationality: string;
  age: number;
  user_img: string;
  time: string;
}

export function RankingCard() {
  const { id } = useParams();
  const [runnerData, setRunnerData] = useState<Runner[] | null>(null);
  const [selectedGender, setSelectedGender] = useState("All Gender");
  const [selectedNationality, setSelectedNationality] =
    useState("All Nationality");
  const [numRunner, setNumRunner] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgegroup, setSelectedAgegroup] = useState("All Age Group");
  const [minAge, setMinAge] = useState<Number>(0);
  const [maxAge, setMaxAge] = useState<Number>(999);
  const navigateTo = useNavigate();

  useEffect(() => {
    async function fetchRunnerData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/runx/rank`
        );
        console.log("Runner data:", response.data);
        setRunnerData(response.data);
        setNumRunner(response.data.length);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }
    fetchRunnerData();
    return () => {};
  }, []);

  useEffect(() => {
    async function fetchRunnerByAge() {
      const queryParams = new URLSearchParams({
        min: minAge.toString(),
        max: maxAge.toString(),
      });
      try {
        const response = await axios.get(
          `http://localhost:3000/users/runx/rank`,
          { params: queryParams }
        );
        console.log("Runner data by age:", response.data);
        setRunnerData(response.data);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }
    fetchRunnerByAge();
    return () => {};
  }, [minAge, maxAge]);

  const handleAgeGroupChange = (selectedValue: string) => {
    setSelectedAgegroup(selectedValue);
    switch (selectedValue) {
      case "Under 18":
        setMinAge(0);
        setMaxAge(17);
        break;
      case "18-39":
        setMinAge(18);
        setMaxAge(39);
        break;
      case "40-49":
        setMinAge(40);
        setMaxAge(49);
        break;
      case "50-59":
        setMinAge(50);
        setMaxAge(59);
        break;
      case "60 Over":
        setMinAge(60);
        setMaxAge(100);
        break;
      case "All Age Group":
        setMinAge(0);
        setMaxAge(200);
        break;
      default:
        setMinAge(0);
        setMaxAge(0);
        break;
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredRunners =
    runnerData && runnerData.length > 0
      ? runnerData.filter((runner) => {
          return (
            runner?.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedGender === "All Gender" ||
              runner?.gender === selectedGender) &&
            (selectedNationality === "All Nationality" ||
              runner?.nationality === selectedNationality)
          );
        })
      : [];

  const onClickCard = (id: number) => {
    console.log(id);
    navigateTo(`RankingRNProfile/${id}`);
  };

  const [nationality, setNationality] = useState();

  const UserRunxData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/runx/rank");
      console.log("Nationality", response.data);
      setNationality(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    UserRunxData();
  }, []);

  return (
    <div className="flex flex-col w-[100%]  items-center justify-between space-y-4">
      <div className="xs:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] flex flex-row bg-[#F5F5F5] rounded-lg h-auto">
        <div className="flex flex-wrap content-center pl-2">
          <Search className="opacity-[0.6]" />
        </div>
        <Input
          onChange={handleSearchInputChange}
          value={searchQuery}
          type="text"
          placeholder="Search for runners..."
          className="border-0 placeholder:text-sm bg-[#F5F5F5]"
        />
      </div>
      <div className="flex flex-col justify-center items-center xs:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] h-[100%] space-y-10">
        {runnerData && runnerData.length > 0 && (
          <div className="flex flex-row justify-center w-[100%] xs:h-[180px] lg:h-[150px] xl:h-[200px] space-x-10">
            {runnerData.slice(0, 3).map((runner, index) => (
              <Card
                key={index}
                onClick={() => onClickCard(runner.id)}
                className="flex flex-col justify-center items-center xs:w-[30%] sm:w-[30%] md:w-[30%] md:h-auto lg:w-[30%] lg:h-auto xl:w-[30%] xl:h-auto"
              >
                <div className="relative flex justify-center items-center h-[100%]">
                  <div className="flex flex-col justify-center items-center">
                    {runner?.user_img ? (
                      <Avatar className="w-[35%] h-auto">
                        <AvatarImage
                          src={runner.user_img}
                          alt={runner.user_img}
                        />
                      </Avatar>
                    ) : (
                      <Avatar className="w-[40%] h-[40%] md:w-[30%] md:h-[30%]">
                        <AvatarImage
                          src={"https://github.com/shadcn.png"}
                          alt={runner.name}
                        />
                      </Avatar>
                    )}

                    {index === 0 && (
                      <img
                        src={GoldMedal}
                        className="absolute xs:top-9 xs:left-16 sm:left-24 sm:top-12 md:left-28 md:top-12 md:w-[20%] md:h-[40%] lg:left-32 lg:top-16 xl:left-44 xl:top-24 top-20 left-36 w-[30%] h-[50%]"
                      />
                    )}
                    {index === 1 && (
                      <img
                        src={SilverMedal}
                        className="absolute xs:top-9 xs:left-16 sm:left-24 sm:top-12 md:left-28 md:top-12 md:w-[20%] md:h-[40%] lg:left-32 lg:top-16 xl:left-44 xl:top-24 top-20 left-36 w-[30%] h-[50%]"
                      />
                    )}
                    {index === 2 && (
                      <img
                        src={BronzeMedal}
                        className="absolute xs:top-9 xs:left-16 sm:left-24 sm:top-12 md:left-28 md:top-12 md:w-[20%] md:h-[40%] lg:left-32 lg:top-16 xl:left-44 xl:top-24 top-20 left-36 w-[30%] h-[50%]"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col h-[30%] justify-center items-center">
                  <h1 className="xs:text-sm text-base">{runner.name}</h1>
                  <h1 className="xs:text-sm text-base">
                    {runner.totalscore} pts
                  </h1>
                </div>
              </Card>
            ))}
          </div>
        )}
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
                <DrawerDescription>Apply filter for Runners</DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col space-y-4 xs:w-[100%] xl:w-full">
                <div className="xl:flex xl:flex-col xl:justify-start xl:items-start w-[50%] xs:w-full xs:px-4">
                  <h2 className="font-bold">Nationality</h2>
                  <Select
                    value={selectedNationality}
                    onValueChange={setSelectedNationality}
                    defaultValue="All Nationality"
                  >
                    <SelectTrigger
                      className="xl:w-[200px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue>{selectedNationality}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="All Nationality">
                        All Nationality
                      </SelectItem>
                      <SelectItem value="Thai">Thailand</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="xl:flex xl:flex-col xl:justify-start xl:items-start w-[50%] xs:w-full xs:px-4">
                  <h2 className="font-bold">Age Group</h2>
                  <Select
                    value={selectedAgegroup}
                    onValueChange={handleAgeGroupChange}
                    defaultValue="Any Age Group"
                  >
                    <SelectTrigger
                      className="xl:w-[200px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue>{selectedAgegroup}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="All Age Group">
                        All Age Group
                      </SelectItem>
                      <SelectItem value="Under 18">Under 18</SelectItem>
                      <SelectItem value="18-39">18-39</SelectItem>
                      <SelectItem value="40-49">40-49</SelectItem>
                      <SelectItem value="50-59">50-59</SelectItem>
                      <SelectItem value="60 Over">60 and over</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="xl:flex xl:flex-col xl:justify-start xl:items-start w-[50%] xs:w-full xs:px-4">
                  <h2 className="font-bold">Gender</h2>
                  <Select
                    value={selectedGender}
                    onValueChange={setSelectedGender}
                    defaultValue="All Gender"
                  >
                    <SelectTrigger
                      className="xl:w-[200px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue>{selectedGender}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="All Gender">All Gender</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
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
      <div className="flex flex-row justify-center xs:w-[100%] sm:w-[100%] md:w-[100%] lg:w-[80%] xl:w-[80%] lg:justify-between xl:justify-between">
        <div className="xs:hidden lg:flex flex-col space-y-3 lg:w-[25%] xl:w-[30%]">
          <div className="flex flex-col justify-start items-start w-full xs:w-full xs:px-4 ">
            <h2 className="font-bold">Nationality</h2>
            <Select
              value={selectedNationality}
              onValueChange={setSelectedNationality}
              defaultValue=""
            >
              <SelectTrigger
                className="xl:w-[280px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <SelectValue>{selectedNationality}</SelectValue>
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                <SelectItem value="All Nationality">All Nationality</SelectItem>
                {nationality?.length > 0 && (
                  <>
                    {Array.from(
                      new Set(nationality.map((nation) => nation.nationality))
                    )
                      .sort((a, b) => a.localeCompare(b))
                      .map((nation, index) => (
                        <SelectItem key={index} value={nation}>
                          {nation}
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-start items-start w-auto xs:w-full xs:px-4">
            <h2 className="font-bold">Age-Group</h2>
            <Select
              value={selectedAgegroup}
              onValueChange={handleAgeGroupChange}
              defaultValue=""
            >
              <SelectTrigger
                className="xl:w-[280px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <SelectValue>{selectedAgegroup}</SelectValue>
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                <SelectItem value="All Age Group">All Age Group</SelectItem>
                <SelectItem value="Under 18">Under 18</SelectItem>
                <SelectItem value="18-39">18-39</SelectItem>
                <SelectItem value="40-49">40-49</SelectItem>
                <SelectItem value="50-59">50-59</SelectItem>
                <SelectItem value="60 Over">60 and over</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-start items-start xs:w-[80%] md:w-[80%] lg:w-[100%] xl:w-[80%] xs:px-4">
            <h2 className="font-bold">Gender</h2>
            <Select
              value={selectedGender}
              onValueChange={setSelectedGender}
              defaultValue=""
            >
              <SelectTrigger
                className="xl:w-[280px] h-[50px] py-0 px-2 bg-[#F5F5F5]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <SelectValue>{selectedGender}</SelectValue>
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                <SelectItem value="All Gender">All Gender</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[100%] w-[50%] xs:w-[90%] lg:w-[75%] xl:w-[70%]">
          {filteredRunners.length > 0 ? (
            <Table
              className="border rounded-lg table-fixed"
              style={{ backgroundColor: COLORS.WHITE }}
            >
              <TableHeader>
                <TableRow className="bg-headTableData">
                  <TableHead className="text-center w-[20%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                    Rank
                  </TableHead>
                  <TableHead className="text-center w-[20%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                    Runner
                  </TableHead>
                  <TableHead className="text-center w-[20%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                    Point gained
                  </TableHead>
                  <TableHead className="text-center w-[20%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                    Time
                  </TableHead>
                  <TableHead className="text-center w-[20%] text-[#000000] font-semibold xs:text-xs sm:text-sm">
                    Gender
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRunners &&
                  filteredRunners.map((runner, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center xs:text-xs sm:text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center xs:text-xs sm:text-sm">
                        {runner.name}
                      </TableCell>
                      <TableCell className="text-center xs:text-xs sm:text-sm">
                        {runner.totalscore} pts
                      </TableCell>
                      <TableCell className="text-center xs:text-xs sm:text-sm">
                        {runner.time[0]}
                      </TableCell>
                      <TableCell className="text-center xs:text-xs sm:text-sm">
                        {runner.gender}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p>No matching runners found</p>
          )}
        </div>
      </div>
    </div>
  );
}
