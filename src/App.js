import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Chart from "./Chart.js";

const App = () => {
  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split("/");
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
  };

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "countriesAndTerritories",
      rowGroup: true,
      hide: false,
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Date",
      field: "dateRep",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
    },
    { field: "cases", aggFunc: "sum", headerName: "Cases" },
    { field: "deaths", aggFunc: "sum", headerName: "Deaths" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      filter: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback(() => {
    fetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data.records));
  }, []);

  return (
    <>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            animateRows={true}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={20}
          ></AgGridReact>
          <Chart />
        </div>
      </div>
    </>
  );
};

export default App;
