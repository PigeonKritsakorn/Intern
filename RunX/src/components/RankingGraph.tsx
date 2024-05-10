import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

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

const RankingGraph: React.FC = () => {
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
  const [barchartData, setBarChartData] = useState<barchartData | undefined>();
  const [pieChartData, setPieChartData] = useState<piechartData | undefined>();

  useEffect(() => {
    async function fetchRunnerData() {
      try {
        const response = await axios.get("http://localhost:3000/runner/graph");
        console.log("Country: ", response.data.result);
        const data = response.data.result;
        const countries = data.map((item) => item.country);

        const numCountries = data.map((item) => item.total);
        setRunnerData(response.data.result);
        setCountrydata(countries);
        setNumcountrydata(numCountries);
      } catch (error) {
        console.error("Error fetching runner data:", error);
      }
    }
    fetchRunnerData();
  }, []);

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
          categories: countryData,
        },
      },
      series: [
        {
          name: "Number of runners",
          data: numCountryData,
        },
      ],
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
    });
  }, [runnerData, numCountryData]);

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

  return (
    <div className="w-[80%]">
      <div className="flex flex-row space-x-3">
        <div className="w-[50%] bg-white rounded-xl">
          {barchartData && (
            <Chart
              options={barchartData.options}
              series={barchartData.series}
              type="bar"
            />
          )}
        </div>
        <div className="w-[50%] bg-white rounded-xl">
          {pieChartData && (
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="donut"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingGraph;
