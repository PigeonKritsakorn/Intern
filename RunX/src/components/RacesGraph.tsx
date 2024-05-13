import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { XAxis } from "recharts";

interface RacesGraphProps {
  eventName: string;
}

interface linechartData {
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

interface linechartPaceData {
  series: [
    {
      name: string;
      data: number[];
    }
  ];
  chart: {
    height: number;
    type: string;
  };
  xaxis: {
    categories: string[];
  };
}

interface RunnerData {
  x_axis: string[];
  y_axis: number[];
}
interface Country {
  x_axis: string[];
  y_axis: number[];
}
interface Continent {
  x_axis: string[];
  y_axis: number[];
}

const RacesGraph: React.FC<RacesGraphProps> = ({ eventName }) => {
  const [runnerData, setRunnerData] = useState<RunnerData>({
    x_axis: [],
    y_axis: [],
  });
  const [countryData, setCountrydata] = useState<Country>({
    x_axis: [],
    y_axis: [],
  });
  const [continentData, setContinentdata] = useState<Continent>({
    x_axis: [],
    y_axis: [],
  });
  const [numCountryData, setNumcountrydata] = useState<Country>({
    x_axis: [],
    y_axis: [],
  });
  const [numContinentData, setNumcontinentdata] = useState<Continent>({
    x_axis: [],
    y_axis: [],
  });
  const [linechartData, setLineChartData] = useState<
    linechartData | undefined
  >();
  const [linepaceData, setLinepaceData] = useState<
    linechartPaceData | undefined
  >();
  const [racesPace, setRacesPace] = useState();
  const [racesData, setRacesData] = useState();

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
    async function racesPace() {
      try {
        const response = await axios.get(
          `http://localhost:3000/races/data/${eventName}`
        );
        console.log(response.data);
        const data = response.data;
        const pace = data.map((item) => item.paceAvg);
        const raceName = data.map((item) => item.name);
        console.log(raceName);
        console.log(pace);
        setRacesData(raceName);
        setRacesPace(pace);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }
    racesPace();
  }, []);

  useEffect(() => {
    setLinepaceData({
      series: [
        {
          name: "Average Pace",
          data: racesPace,
        },
      ],
      options: {
        chart: {
          height: 600,
          type: "line",
        },
        xaxis: {
          categories: racesData,
        },
      },
    });
  }, [racesPace]);

  return (
    <div className="w-[100%] h-auto">
      <div className="w-[100%] h-[100%] bg-white rounded-xl">
        {/* {linechartData && (
            <Chart
              options={linechartData.options}
              series={linechartData.series}
              type="bar"
            />
          )} */}
        {linepaceData && (
          <Chart
            options={linepaceData.options}
            series={linepaceData.series}
            type="line"
          />
        )}
      </div>
    </div>
  );
};

export default RacesGraph;
