import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface Profile {
  totalPoint: string;
  user: {
    id: number;
    firstname_eng: string;
    lastname_eng: string;
    birth_date: string;
    gender: string;
    email: string;
    nationality: string;
    id_passport: string;
    user_img: string;
  };
}
interface barchartData {
  options: {
    chart: {
      width: number;
      height: number;
      type: string;
    };
    plotOptions: {
      bar: {
        vertical: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      width: number;
      colors: string[];
    };
    xaxis: {
      categories: string[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
  legend: {
    position: string;
    verticalAlign: string;
    containerMargin: {
      left: number;
      right: number;
    };
  };
  responsive: {
    breakpoint: number;
    options: {
      plotOptions: {
        bar: {
          horizontal: boolean;
        };
      };
      legend: {
        position: string;
      };
    };
  }[];
}

interface piechartData {
  options: {
    chart: {
      id: string;
    };
    labels: Continent;
  };
  series: Continent;
}

interface linechartData {
  series: { name: string; data: Pace }[];
  options: {
    chart: {
      id: string;
    };
  };
}

interface RunnerData {
  x_axis: string[];
  y_axis: number[];
}
interface Month {
  x_axis: string[];
}
interface Distances {
  y_axis: number[];
}
interface Continent {
  x_axis: string[];
  y_axis: number[];
}
interface Pace {
  x_axis: string[];
}

const StatisticsGraph: React.FC = () => {
  const [runnerData, setRunnerData] = useState<RunnerData>({
    x_axis: [],
    y_axis: [],
  });
  const [month, setMonth] = useState<Month>({
    x_axis: [],
  });
  const [continentData, setContinentdata] = useState<Continent>({
    x_axis: [],
    y_axis: [],
  });
  const [totalDistance, setTotaldistance] = useState<Distances>({
    y_axis: [],
  });
  const [numContinentData, setNumcontinentdata] = useState<Continent>({
    x_axis: [],
    y_axis: [],
  });
  const [barchartData, setBarChartData] = useState<barchartData | undefined>();
  const [pieChartData, setPieChartData] = useState<piechartData | undefined>();
  const [linechartData, setLineChartData] = useState<
    linechartData | undefined
  >();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [data, setData] = useState<Profile>();
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const [pace, setPace] = useState<Pace>({ x_axis: [] });
  const [raceData, setRaceData] = useState();

  // const handleYearChange = (year: string) => {
  //   setSelectedYear(year);
  //   if (data) {
  //     fetchDistance(data.user.id, year);
  //   }
  // };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };
  useEffect(() => {
    if (data && selectedYear) {
      fetchDistance(data.user.id, selectedYear);
    }
  }, [data, selectedYear]);

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
        setData(data);
        console.log("Profile data", data.user.id);
        fetchDistance(data?.user.id);
      })
      .catch((error) => {
        setError(
          "There was a problem with the fetch operation: " + error.message
        );
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchDistance = async (id: number, year: string) => {
    const queryParams = new URLSearchParams({
      id: id.toString(),
      year: year,
    });

    try {
      const response = await axios.get(
        `http://localhost:3000/runners/distances?${queryParams}`
      );

      console.log("Response: ", response);
      const monthDistance = response.data.result;
      console.log("monthDistance:", monthDistance);

      const month = monthDistance.map((item) => monthNames[item.Month]);
      month.sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));
      const totalDistance = monthDistance.map((item) => item.totalDistances);
      totalDistance.sort((a, b) => a - b);

      // setMonth([...month]);
      // setTotaldistance([...totalDistance]);
      setMonth(month);
      setTotaldistance(totalDistance);
    } catch (error) {
      console.error("Error fetching runner data:", error);
    }
  };

  const fetchPace = async (id: number) => {
    const queryParams = new URLSearchParams({
      id: id.toString(),
      method: "desc",
    });
    axios
      .get(`http://localhost:3000/races/result?${queryParams}`)
      .then((response) => {
        console.log("Pace response:", response.data);
        const pace = response.data;
        const paceEachYear = pace.map((item) => item.pace);
        console.log("Pace each year:", paceEachYear);
        setRaceData(response.data);
        setPace(paceEachYear);
      });
  };
  useEffect(() => {
    fetchPace(data?.user.id);
  }, [data]);

  useEffect(() => {
    setBarChartData({
      options: {
        chart: {
          width: 500,
          height: 500,
          type: "bar",
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        xaxis: {
          categories: month,
        },
      },
      series: [
        {
          name: "Distances",
          type: "column",
          data: totalDistance,
        },
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      legend: {
        position: "right",
        verticalAlign: "top",
        containerMargin: {
          left: 35,
          right: 60,
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    });
  }, [month, totalDistance]);

  useEffect(() => {
    async function fetchRunnerData() {
      const queryParams = new URLSearchParams({
        continent: "Continent",
      });
      try {
        const response = await axios.get("http://localhost:3000/runner/graph", {
          params: queryParams,
        });
        const data = response.data.result;
        const continents = data.map((item) => item.continent);
        const numContinents = data.map((item) => item.total);
        console.log("Continent:", response.data);
        setContinentdata(continents);
        setNumcontinentdata(numContinents);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }
    fetchRunnerData();
  }, []);

  useEffect(() => {
    setPieChartData({
      options: {
        chart: {
          id: "basic-pie",
        },
        labels: continentData,
      },
      series: numContinentData,
    });
  }, [continentData, numContinentData]);

  // useEffect(() => {
  //   setLineChartData({
  //     series: [
  //       {
  //         name: "Distances",
  //         data: pace,
  //       },
  //     ],
  //     options: {
  //       chart: {
  //         id: "line",
  //       },
  //     },
  //   });
  // }, [pace]);

  useEffect(() => {
    if (raceData && raceData.length > 0) {
      setLineChartData({
        series: [
          {
            name: "Distances",
            data: [
              {
                x: raceData[0].name,
                y: pace[0],
                goals: [
                  {
                    name: "Expected",
                    value: 3.27,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: "round",
                    strokeColor: "#775DD0",
                  },
                ],
              },
              {
                x: raceData[1].name,
                y: pace[1],
                goals: [
                  {
                    name: "Expected",
                    value: 13.27,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: "round",
                    strokeColor: "#775DD0",
                  },
                ],
              },
              {
                x: raceData[1].name,
                y: pace[2],
                goals: [
                  {
                    name: "Expected",
                    value: 13.23,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: "round",
                    strokeColor: "#775DD0",
                  },
                ],
              },
              {
                x: "2014",
                y: pace[3],
                goals: [
                  {
                    name: "Expected",
                    value: 3.42,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: "round",
                    strokeColor: "#775DD0",
                  },
                ],
              },
            ],
          },
        ],
        options: {
          chart: {
            type: "bar",
          },
          xaxis: {
            labels: {
              rotate: -20,
            },
          },
        },
      });
    }
  }, [pace]);

  return (
    <div className="w-[100%] flex flex-row space-x-4">
      <div className="w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Select Year</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleYearChange("2021")}>
                2021
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearChange("2022")}>
                2022
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearChange("2023")}>
                2023
              </DropdownMenuItem>
              {/* Add more years as needed */}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-[40%]">
        <div className="flex flex-col">
          <h1 className="flex flex-col justify-start items-start">
            Total Distances
          </h1>
          <div className="w-full bg-white rounded-xl flex flex-row">
            {barchartData && (
              <Chart
                options={barchartData.options}
                series={barchartData.series}
                type="bar"
                style={{ width: "100%", height: "50%" }}
              />
            )}
            {/* {barchartData && (
            <Chart
              options={barchartData.options}
              series={barchartData.series}
              type="bar"
            />
          )} */}
          </div>
        </div>
      </div>
      <div className="w-[40%]">
        <div className="flex flex-col">
          <h1 className="flex flex-col justify-start items-start">Pace</h1>
          <div className="w-full bg-white rounded-xl flex flex-row">
            {linechartData && (
              <Chart
                options={linechartData.options}
                series={linechartData.series}
                type="bar"
                style={{ width: "100%", height: "50%" }}
              />
            )}
            {/* {barchartData && (
            <Chart
              options={barchartData.options}
              series={barchartData.series}
              type="bar"
            />
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsGraph;
