import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import RacesGraph from "@/components/RacesGraph";
import { COLORS } from "../components/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventBG from "../assets/EventBG.png";

const EventsYear = () => {
  const [event, setEvent] = useState<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const { name } = useParams();

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterData = {
          country: "",
          distance: "",
          year: "",
          title: name,
        };

        // Convert filterData object to a query string
        const queryString = Object.keys(filterData)
          .map((key) => `${key}=${encodeURIComponent(filterData[key])}`)
          .join("&");

        const filterResponse = await axios.get(
          `http://localhost:3000/events/filter?${queryString}`
        );

        // const eventId = filterResponse.data.data[0]?.id;
        const eventId = name;
        console.log("Event ID:", eventId);

        if (eventId) {
          const queryParams = new URLSearchParams({
            id: eventId,
          });

          const raceResponse = await axios.get(
            `http://localhost:3000/events/${eventId}`
          );

          console.log("Race response:", raceResponse);
          console.log(eventId);
          console.log(raceResponse.data);
          setEvent(raceResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [name, searchTerm]);

  const filteredRaces = event?.Races?.filter((race) =>
    race.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [eventIdRace, setEventidrace] = useState();
  const [raceData, setRaceData] = useState([]);
  const [runnerData, setRunnerData] = useState(null);
  const [numRunner, setNumRunner] = useState(0);
  const [numMale, setNummale] = useState(0);
  const [numFemale, setNumfemale] = useState(0);
  const [maleRunnerData, setMaleRunnerData] = useState([]);
  const [femaleRunnerData, setFemaleRunnerData] = useState([]);

  const raceId = raceData.map((key, index) => {
    return key.id;
  }, []);

  const raceIdString = raceId?.toString();

  useEffect(() => {
    async function fetchMaleRacebyEventID() {
      console.log(eventIdRace);
      try {
        const queryParams = new URLSearchParams({
          event_id: name,
          gender: "Male",
        });
        const response = await axios.get(
          "http://localhost:3000/races/result/toprunner",
          { params: queryParams }
        );
        console.log("fetchRacebyEventID: ", response.data);
        setMaleRunnerData(response.data.queryToprunnerRace[0]);
        setNummale(response.data.queryToprunnerRace.length);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
    fetchMaleRacebyEventID();
  }, []);

  useEffect(() => {
    async function fetchFemaleRacebyEventID() {
      try {
        const queryParams = new URLSearchParams({
          event_id: name,
          gender: "Female",
        });
        const response = await axios.get(
          "http://localhost:3000/races/result/toprunner",
          { params: queryParams }
        );
        console.log("fetchRacebyEventID: ", response.data);
        setFemaleRunnerData(response.data.queryToprunnerRace[0]);
        setNumfemale(response.data.queryToprunnerRace.length);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
    fetchFemaleRacebyEventID();
  }, []);

  return (
    <>
      {event && (
        <div className="xs:h-[100%] md:w-[100%] md:h-[100%] lg:w-[100%] lg:h-screen xl:h-[100%] xs:flex xs:flex-col md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col">
          <div className="xs:h-[40%] md:h-[60%] lg:w-[100%] lg:h-auto xl:h-[50%]">
            <div className="eventYear xl:w-[100%] xl:h-[100%]">
              <div className="xs:h-[100%] md:h-[100%] lg:h-[100%] lg:w-[100%] p-5 xl:h-[100%] xl:w-[100%] xs:flex xs:flex-col lg:flex lg:flex-col xl:flex xl:flex-col ">
                <div className="xs:h-[20%] md:h-[15%] lg:h-[40%] xl:h-[20%]">
                  <h1
                    className="xs:text-base xs:font-bold md:text-xl md:font-bold lg:text-6xl lg:font-bold xl:flex xl:justify-start xl:p-10 xl:text-xl xl:font-bold"
                    style={{
                      color: COLORS.WHITE,
                    }}
                  >
                    {event.name}
                  </h1>
                </div>
                <div className="xs:h-[80%] md:h-[85%] lg:h-[60%] xl:h-[100%] xs:flex xs:flex-row md:flex md:flex-row lg:flex lg:flex-row xl:flex xl:flex-row xl:justify-center xl:items-center">
                  <div className="xs:h-[100%] md:w-[40%] md:h-auto lg:w-[35%] lg:h-[100%] xl:h-[100%] xl:w-[33%] xs:flex xs:flex-col xs:justify-center xs:items-center xl:flex xl:flex-col xl:justify-center xl:items-center lg:flex lg:flex-col lg:justify-center lg:items-center md:flex md:flex-col md:justify-center md:items-center">
                    <h1
                      className="xs:text-base lg:h-[15%] xl:h-[15%] md:text-lg md:font-semibold lg:text-lg lg:font-semibold xl:text-lg xl:font-semibold"
                      style={{
                        color: COLORS.WHITE,
                      }}
                    >
                      Top Runner
                      <br />
                      Male
                    </h1>
                    {maleRunnerData &&
                    maleRunnerData.length !== 0 &&
                    maleRunnerData.runner_img !== null ? (
                      <Avatar className="w-[70%] h-[70%]">
                        <img
                          src={maleRunnerData?.runner_img}
                          alt="Top Male Runner"
                          className="xs:w-[80%] md:w-[70%] md:h-[50%] lg:w-[60%] lg:h-[60%] xl:w-[100%] xl:h-[340px] rounded-xl"
                        />
                      </Avatar>
                    ) : (
                      <Avatar className="w-[60%] h-[100%]">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}

                    <h1
                      className="xs:text-base  xl:flex xl:justify-start xl:h-[15%] md:text-lg md:font-semibold lg:text-lg lg:font-semibold xl:text-lg xl:font-semibold"
                      style={{
                        color: COLORS.WHITE,
                      }}
                    >
                      {maleRunnerData && maleRunnerData.length !== 0 ? (
                        <>
                          {maleRunnerData?.firstname} {maleRunnerData?.lastname}
                          <br />
                          {maleRunnerData?.time}
                        </>
                      ) : null}
                    </h1>
                  </div>
                  <div className="md:w-[40%] md:h-auto lg:w-[35%] lg:h-[100%] xl:h-[100%] xl:w-[34%]  xs:flex xs:flex-col xs:justify-center xs:items-center md:flex md:flex-col md:justify-center md:items-center lg:flex lg:flex-col lg:justify-center lg:items-center xl:flex xl:flex-col xl:justify-center xl:items-center">
                    <h1
                      className="xs:text-base  lg:h-[15%] xl:h-[15%] md:text-lg md:font-semibold lg:text-lg lg:font-semibold xl:text-lg xl:font-semibold"
                      style={{
                        color: COLORS.WHITE,
                      }}
                    >
                      Top Runner
                      <br />
                      Female
                    </h1>
                    {femaleRunnerData &&
                    femaleRunnerData.length !== 0 &&
                    femaleRunnerData?.runner_img !== null ? (
                      <>
                        <Avatar className="w-[70%] h-[80%]">
                          <img
                            src={femaleRunnerData?.runner_img}
                            alt="Top Female Runner"
                            className="xs:w-[80%] md:w-[70%] md:h-[50%] lg:w-[60%] lg:h-[60%] xl:w-[100%] xl:h-[340px] rounded-xl"
                          />
                        </Avatar>
                      </>
                    ) : (
                      <Avatar className="w-[60%] h-[100%]">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <h1
                      className="xs:text-base  xl:flex xl:justify-start xl:h-[15%] md:text-lg md:font-semibold lg:text-lg lg:font-semibold xl:text-lg xl:font-semibold"
                      style={{
                        color: COLORS.WHITE,
                      }}
                    >
                      {maleRunnerData && maleRunnerData.length !== 0 ? (
                        <>
                          {femaleRunnerData?.firstname}{" "}
                          {femaleRunnerData?.lastname}
                          <br />
                          {femaleRunnerData?.time}{" "}
                        </>
                      ) : null}
                    </h1>
                  </div>
                  <div className="md:w-auto lg:w-[30%] lg:h-[100%] xl:h-[100%] xl:w-[33%] xs:flex xs:flex-col xs:justify-center md:flex md:justify-center md:items-center lg:flex lg:justify-center lg:items-center xl:flex xl:flex-col xl:justify-center xl:items-center">
                    <div>
                      <RacesGraph eventName={name} />
                      <h1
                        className="xs:text-base  md:text-lg md:font-bold lg:text-lg lg:font-semibold xl:text-xl xl:font-semibold"
                        style={{ color: COLORS.WHITE }}
                      >
                        Total Participants
                        <br />
                        {numMale + numFemale}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xs:h-auto md:h-auto lg:w-[100%] lg:h-[60%] xl:h-[50%]">
            <div
              style={{
                backgroundImage: `url(${EventBG})`,
                overflowY: "-moz-hidden-unscrollable",
              }}
              className="h-[50%]"
            >
              <div className="md:h-[100%] xl:h-[100%] xl:w-[100%]">
                <div className="xs:w-full xl:w-full pt-[5%] xl:pb-[5%] flex justify-center items-center">
                  <div className="w-screen flex flex-col justify-center items-center">
                    <div className="xl:flex xl:flex-row xl:bg-[#F5F5F5] rounded-xl xl:w-[70%] lg:w-[60%] lg:flex lg:flex-row lg:bg-[#F5F5F5] md:w-[80%] md:flex md:flex-row md:bg-[#F5F5F5] xs:w-[80%] xs:flex xs:flex-row xs:bg-[#F5F5F5]">
                      <div className="flex flex-wrap content-center pl-2">
                        <Search className="opacity-[0.6]" />
                      </div>
                      <Input
                        onChange={handleSearchInputChange}
                        value={searchTerm}
                        type="text"
                        placeholder="Search for races..."
                        className="border-0 placeholder:text-sm bg-[#F5F5F5]"
                      />
                    </div>

                    {filteredRaces && filteredRaces.length > 0 && (
                      <div className="lg:w-[60%] xl:w-[70%] xl:py-5 xl:space-y-5 xs:w-[80%] xs:py-5 xs:space-y-5">
                        {filteredRaces.map((race: any, index: number) => (
                          <div key={index} className="flex flex-col w-[100%]">
                            <Link
                              to={`/EventsYear/eventId=${name}/${race.id}/RNTable`}
                            >
                              <Card >
                                <div className="flex flex-row">
                                  <div className="w-[25%] h-auto">
                                    <img
                                      src={race.logo_img}
                                      alt={race.name}
                                      style={{ width: "100%", height: "100%" }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <CardHeader className="xs:text-base xs:font-bold md:text-lg md:font-bold lg:text-lg lg:font-bold xl:text-3xl xl:font-bold">
                                      {race.name}
                                    </CardHeader>
                                    <CardDescription className="xs:text-base md:text-base lg:text-base xl:text-base xs:flex md:flex lg:flex xl:flex  xs:justify-center md:justify-start lg:justify-start xl:justify-start xs:pl-0 md:pl-6 lg:pl-6 xl:pl-6">
                                      {race.state}
                                    </CardDescription>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsYear;
