import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";
import { parse, isBefore, isAfter, isSameDay } from "date-fns";

import moment from "moment";
function Report_Enquiry() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [enquiryData, setEnquiryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [interestFor, setInterestFor] = useState("");
  const [reference2, setReference2] = useState("");
  const [reference1, setReference1] = useState("");
  const [response, setResponse] = useState("");
  const [city, setCity] = useState("");
  const [excuitive, setExcuitive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  // removing duplicate from select options
  const [duplicateCity, setDuplicateCity] = useState(new Set());
  const [duplicateReference, setDuplicateReference] = useState(new Set());
  const [duplicateCategory, setDuplicateCategory] = useState(new Set());
  const [duplicateExecutive, setDuplicateExecutive] = useState(new Set());
  const [duplicateStatus, setDuplicateStatus] = useState(new Set());
  const [duplicateServices, setDuplicateServices] = useState(new Set());

  console.log(fromDate);
  useEffect(() => {
    const uniqueCity = new Set(
      enquiryData.map((item) => item.enquirydata[0]?.city).filter(Boolean)
    );
    const uniqueReference = new Set(
      enquiryData.map((item) => item.enquirydata[0]?.reference1).filter(Boolean)
    );
    const uniqueCategory = new Set(
      enquiryData.map((item) => item.category).filter(Boolean)
    );
    const uniqueExecutive = new Set(
      enquiryData.map((item) => item.enquirydata[0]?.executive).filter(Boolean)
    );
    const uniqueStatus = new Set(
      enquiryData.map((item) => item.response).filter(Boolean)
    );
    const uniqueServices = new Set(
      enquiryData
        .map((item) => item.enquirydata[0]?.intrestedfor)
        .filter(Boolean)
    );

    setDuplicateCity(uniqueCity);
    setDuplicateReference(uniqueReference);
    setDuplicateCategory(uniqueCategory);
    setDuplicateExecutive(uniqueExecutive);
    setDuplicateStatus(uniqueStatus);
    setDuplicateServices(uniqueServices);
  }, [enquiryData]);

  const getDsrDetails = async () => {
    try {
      const res = await axios.get(apiURL + "/getallflwdata");
      if (res.status === 200) {
        const data = res.data.enquiryfollowup;
        console.log("enquiryfollowup", data);
        setEnquiryData(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching DSR details:", error);
    }
  };

  useEffect(() => {
    getDsrDetails();
  }, []);

  const handleSearch = () => {
  
    setFilteredData(enquiryData);
    setSearchValue("");
    setShowMessage(true);
  

    const filteredResults = enquiryData.filter((item) => {
     

      const enquiryDate = parse(
        item.enquirydata[0]?.enquirydate,
        "MM-dd-yyyy",
        new Date()
      );
      const fromDateObj = fromDate
        ? parse(fromDate, "yyyy-MM-dd", new Date())
        : null;
      const toDateObj = toDate ? parse(toDate, "yyyy-MM-dd", new Date()) : null;

      const itemCity =
        city.toLowerCase() === "all" ||
        item.enquirydata[0]?.city.toLowerCase().includes(city.toLowerCase());
      const itemFromDate =
        !fromDate ||
        isAfter(enquiryDate, fromDateObj) ||
        isSameDay(enquiryDate, fromDateObj);
      const itemToDate =
        !toDate ||
        isBefore(enquiryDate, toDateObj) ||
        isSameDay(enquiryDate, toDateObj);

      // Apply filters for status and executive
      const itemResponse =
        response.toLowerCase() === "all" ||
        item.response.toLowerCase().includes(response.toLowerCase());
      const itemExcuitive =
        excuitive.toLowerCase() === "all" ||
        item.enquirydata[0]?.executive
          .toLowerCase()
          .includes(excuitive.toLowerCase());

      // Apply other filters
      const itemInterest =
        interestFor.toLowerCase() === "all" ||
        item.enquirydata[0]?.intrestedfor
          .toLowerCase()
          .includes(interestFor.toLowerCase());
      const itemReference1 =
        reference1.toLowerCase() === "all" ||
        item.enquirydata[0]?.reference1
          .toLowerCase()
          .includes(reference1.toLowerCase());
      const itemReference2 =
        reference2.toLowerCase() === "all" ||
        item.enquirydata[0]?.reference2
          .toLowerCase()
          .includes(reference2.toLowerCase());
      const itemCategory =
        category.toLowerCase() === "all" ||
        item.category.toLowerCase().includes(category.toLowerCase());
      const itemServices =
        service.toLowerCase() === "all" ||
        item.enquirydata[0]?.intrestedfor
          .toLowerCase()
          .includes(service.toLowerCase());

      const statusAndExecutiveFilter =
        (item.response.toLowerCase().includes(response.toLowerCase()) ||
          response.toLowerCase() === "all") &&
        (item.enquirydata[0]?.executive
          .toLowerCase()
          .includes(excuitive.toLowerCase()) ||
          excuitive.toLowerCase() === "all");

      console.log("Status and Executive Filter:", statusAndExecutiveFilter);

      const isFiltered =
        itemCity &&
        itemFromDate &&
        itemToDate &&
        statusAndExecutiveFilter &&
        itemInterest &&
        itemReference1 &&
        itemReference2 &&
        itemCategory &&
        itemServices;

      console.log("Final Filter Result:", isFiltered);

      return isFiltered;
    });
    console.log("filteredResults:", filteredResults);
    setFilteredData(filteredResults);
    setSearchValue(
      interestFor ||
        reference2 ||
        reference1 ||
        response ||
        city ||
        excuitive ||
        fromDate ||
        toDate ||
        category ||
        service
    );
    setShowMessage(false);
    // }
  };

  console.log("fromDate, toDate", fromDate, toDate);

  const handleSearchClick = () => {
    // Call the search function here

    handleSearch();
    setButtonClicked(true);
    setFromDate(""); // Add this line
    setToDate(""); // Add this line
  };

  const exportData = () => {
    const fileName = "dsr_data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Data");
    XLSX.writeFile(workbook, fileName);
  };

  const columns = [
    {
      name: "Sl  No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Date",
      selector: (row) =>
        row.enquirydata[0]?.enquirydate ? row.enquirydata[0]?.enquirydate : "-",
    },
    {
      name: "Time",
      selector: (row, index) =>
        row.enquirydata[0]?.time ? row.enquirydata[0]?.time : "-",
    },
    {
      name: "Name",
      selector: (row) =>
        row.enquirydata[0]?.name ? row.enquirydata[0]?.name : "-",
    },
    {
      name: "Contact",
      selector: (row) =>
        row.enquirydata[0]?.contact1 ? row.enquirydata[0]?.contact1 : "-",
    },
    {
      name: "Address",
      selector: (row) =>
        row.enquirydata[0]?.address ? row.enquirydata[0]?.address : "-",
    },
    {
      name: "Reference",
      selector: (row) =>
        row.enquirydata[0]?.reference1 ? row.enquirydata[0]?.reference1 : "-",
    },
    {
      name: "Reference 2",
      selector: (row) =>
        row.enquirydata[0]?.reference2 ? row.enquirydata[0]?.reference2 : "-",
    },
    {
      name: "City",
      selector: (row) =>
        row.enquirydata[0]?.city ? row.enquirydata[0]?.city : "-",
    },
    {
      name: "Interested For",
      selector: (row) =>
        row.enquirydata[0]?.intrestedfor
          ? row.enquirydata[0]?.intrestedfor
          : "-",
    },
    {
      name: "Comment",
      selector: (row) =>
        row.enquirydata[0]?.comment ? row.enquirydata[0]?.comment : "-",
    },
    {
      name: "Followup Remark",
      selector: (row) => (row.desc ? row.desc : "-"),
    },
    {
      name: "Executive",
      selector: (row) =>
        row.enquirydata[0]?.executive ? row.enquirydata[0]?.executive : "-",
    },
    {
      name: "Status",
      selector: (row) => (row.response ? row.response : "-"),
    },
    {
      name: "Value",
      selector: (row) => (row.value ? row.value : "-"),
    },
  ];

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    console.log(selectedCity); // Check the selected city value
    setCity(selectedCity);
  };
  const handleExecutiveChange = (e) => {
    const selectedExecutive = e.target.value;
    console.log(selectedExecutive); // Check the selected executive value
    setExcuitive(selectedExecutive);
  };

  const handleReferenceChange = (e) => {
    const selectedReference = e.target.value;
    console.log(selectedReference); // Check the selected reference value
    setReference1(selectedReference);
  };
  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    console.log(selectedService); // Check the selected service value
    setService(selectedService);
  };
  return (
    <div style={{ backgroundColor: "#f9f6f6" }} className="web">
      <div>
        <Header />
      </div>
      <div className="p-5 border">
        {closeWindow && (
          <>
            <Card className="p-2">
              <div
                className="pt-2 pe-3"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <i
                  class="fa-solid fa-circle-xmark report-font-hover"
                  title="Close"
                  style={{ color: "#bdbdbd", fontSize: "27px" }}
                  onClick={() => setCloseWindow(!closeWindow)}
                ></i>
              </div>
              <div className="p-4 row">
                <div className="col-md-1"></div>
                <div className="col-md-6">
                  <p>
                    <b>Enquiry Report &gt; Filter</b>{" "}
                  </p>
                  <div className="row">
                    <div className="col-md-4">From </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        onChange={(e) => setFromDate(e.target.value)}
                        type="date"
                        value={fromDate}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">City </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={handleCityChange}
                      >
                        <option>Select</option>
                        {[...duplicateCity].map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Reference </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={handleReferenceChange} // Use the handleReferenceChange function
                      >
                        <option>Select</option>
                        {[...duplicateReference].map((reference) => (
                          <option key={reference}>{reference}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />

                  <div className="row">
                    <div className="col-md-4">Service </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={handleServiceChange} // Use the handleServiceChange function
                      >
                        <option>Select</option>
                        {[...duplicateServices].map((service) => (
                          <option key={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                </div>
                <div className="col-md-5">
                  <br />
                  <div className="row"></div>
                  <div className="row mt-3">
                    <div className="col-md-4">To </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        onChange={(e) => setToDate(e.target.value)}
                        type="date"
                        value={toDate}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4 ">Status </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setResponse(e.target.value)}
                      >
                        <option>All</option>
                        {[...duplicateStatus].map((response) => (
                          <option>{response}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Executive </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={handleExecutiveChange} // Use the handleExecutiveChange function
                      >
                        <option>Select</option>
                        {[...duplicateExecutive].map((executive) => (
                          <option key={executive}>{executive}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />

                  <div className="row">
                    <div className="col-md-4">Category </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // style={{ width: "100%" }}
                        onClick={(e) => setCategory(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateCategory].map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                </div>
                <p style={{ justifyContent: "center", display: "flex" }}>
                  <button
                    className="ps-3 pt-2 pb-2 pe-3"
                    style={{
                      border: 0,
                      color: "white",
                      backgroundColor: "#a9042e",
                      borderRadius: "5px",
                    }}
                    // onClick={() => {
                    //   filterData();
                    //   setButtonClicked(true);
                    // }}
                    onClick={handleSearchClick}
                  >
                    Show
                  </button>
                  {"   "}
                  <button
                    className="ps-3 pt-2 pb-2 pe-3 ms-2"
                    style={{
                      border: 0,
                      color: "white",
                      backgroundColor: "#a9042e",
                      borderRadius: "5px",
                    }}
                    onClick={exportData}
                  >
                    <i
                      class="fa-solid fa-download"
                      title="Download"
                      // style={{ color: "white", fontSize: "27px" }}
                    ></i>{" "}
                    Export
                  </button>
                </p>
                <p>
                  {showMessage && buttonClicked && (
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        color: "#a9042e",
                      }}
                    >
                      Please enter a category to search!
                    </div>
                  )}
                </p>
              </div>
            </Card>
            <br />
          </>
        )}
        <div>
          <div
            className="p-2"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "white",
            }}
          >
            <div className="ms-3">
              <i
                class="fa-solid fa-print report-font-hover"
                title="Print"
                style={{ color: "#bdbdbd", fontSize: "27px" }}
                onClick={() => window.print()}
              ></i>
            </div>{" "}
            <div className="ms-3">
              <i
                class="fa-solid fa-house report-font-hover"
                title="Home"
                style={{ color: "#bdbdbd", fontSize: "27px" }}
                onClick={() => window.location.assign("/home")}
              ></i>
            </div>{" "}
            <div className="ms-3">
              <i
                class="fa-solid fa-rotate-right report-font-hover"
                title="Reload"
                style={{ color: "#bdbdbd", fontSize: "27px" }}
                onClick={() => window.location.reload()}
              ></i>
            </div>
          </div>
          <br />
        </div>
        <div>
          <Card
            className="ps-3 p-2"
            style={{ color: "white", backgroundColor: "#a9042e" }}
          >
            <h5>Vijay Home Services | Enquiry Reports {`, ${searchValue}`}</h5>
          </Card>
        </div>{" "}
        <br />
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          fixedHeader
          selectableRowsHighlight
          subHeaderAlign="left"
          highlightOnHover
        />
      </div>
    </div>
  );
}

export default Report_Enquiry;
