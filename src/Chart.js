import React, { cloneElement, Component } from "react";
import CanvasJSReact from "./canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dataPoints = [];
class Chart extends Component {
  render() {
    const options = {
      theme: "light2",
      title: {
        text: "COVID 19 Cases",
      },
      axisY: {
        title: "Cases",
        prefix: "",
      },
      data: [
        {
          type: "line",
          xValueFormatString: "MMM YYYY",
          yValueFormatString: "#,##0.00",
          dataPoints: dataPoints,
        },
      ],
    };
    return (
      <div>
        <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />
      </div>
    );
  }

  componentDidMount() {
    var chart = this.chart;
    fetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json")
      .then((resp) => resp.json())
      .then((data) => data.records)
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].countriesAndTerritories == "Afghanistan") {
            var dateParts = data[i].dateRep.split("/");
            dataPoints.push({
              x: new Date(
                Number(dateParts[2]),
                Number(dateParts[1]),
                Number(dateParts[0])
              ),
              y: data[i].cases,
            });
          }
        }
        chart.render();
      });
  }
}

export default Chart;
