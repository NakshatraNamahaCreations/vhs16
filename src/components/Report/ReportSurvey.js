import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";
import moment from "moment";
import { parse, isBefore, isAfter, isSameDay } from "date-fns";

function Report_Survey() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [surveyData, setSurveyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [interestFor, setInterestFor] = useState("");
  const [city, setCity] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [backOffice, setBackOffice] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  // removing duplicate value from the select option
  const [duplicateCity, setduplicateCity] = useState(new Set());
  const [duplicateService, setduplicateService] = useState(new Set());
  const [duplicateBackOffice, setduplicateBackOffice] = useState(new Set());
  const [duplicateCategory, setduplicateCategory] = useState(new Set());
  const [duplicateTechnicianName, setduplicateTechnicianName] = useState(
    new Set()
  );
  const [duplicateStatus, setduplicateStatus] = useState(new Set());

  useEffect(() => {
    const uniqueCities = new Set(
      surveyData?.map((item) => item.enquirydata[0]?.city).filter(Boolean)
    );

    const uniqueService = new Set(
      surveyData
        ?.map((item) => item.enquirydata[0]?.intrestedfor)
        .filter(Boolean)
    );
    const uniqueBackoffice = new Set(
      surveyData?.map((item) => item.staffname).filter(Boolean)
    );
    const uniqueCatagories = new Set(
      surveyData?.map((item) => item.category).filter(Boolean)
    );
    const uniqueTechnicianName = new Set(
      surveyData?.map((item) => item.technicianname).filter(Boolean)
    );
    // const uniqueStatus = new Set(
    //   surveyData?.map((item) => item.enquirydata[0]?.city).filter(Boolean)
    // );

    setduplicateCity(uniqueCities);
    setduplicateTechnicianName(uniqueTechnicianName);
    setduplicateCategory(uniqueCatagories);
    setduplicateBackOffice(uniqueBackoffice);
    setduplicateService(uniqueService);
  }, [surveyData]);

  const getSurveyDetails = async () => {
    try {
      const res = await axios.get(apiURL + "/getsurveyaggredata");
      if (res.status === 200) {
        const data = res.data.enquiryfollowup.filter(
          (item) => item.response === "Survey"
        );
        console.log("SurveyData", data);
        setSurveyData(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching DSR details:", error);
    }
  };

  useEffect(() => {
    getSurveyDetails();
  }, []);

  const handleSearch = () => {
    setFilteredData(surveyData);
    setSearchValue("");
    setShowMessage(true);
    const filteredResults = surveyData.filter((item) => {
      const enquiryDate = parse(item.nxtfoll, "yyyy-MM-dd", new Date());
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
      const itemInterest =
        item.enquirydata?.[0]?.intrestedfor
          ?.toLowerCase()
          .includes(interestFor.toLowerCase()) ?? true;

      const itemTechnician =
        item.technicianname
          ?.toLowerCase()
          .includes(technicianName.toLowerCase()) ?? true;

      const itemCategory =
        item.category?.toLowerCase().includes(category.toLowerCase()) ?? true;

      const itemStaffName =
        item.enquirydata[0]?.staffname
          ?.toLowerCase()
          .includes(backOffice.toLowerCase()) ?? true;

      const itemService =
        item.staffname?.toLowerCase().includes(service.toLowerCase()) ?? true;

      return (
        itemFromDate &&
        itemToDate &&
        itemInterest &&
        itemCity &&
        itemTechnician &&
        itemCategory &&
        itemStaffName &&
        itemService
      );
    });
    setFilteredData(filteredResults);
    setSearchValue(
      interestFor || city || technicianName || fromDate || toDate || category
    );
    setShowMessage(false);
  };

  const handleSearchClick = () => {
    handleSearch();
    setButtonClicked(true);
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
      name: "Category",
      selector: (row) =>
        row.enquirydata[0]?.category ? row.enquirydata[0]?.category : "-",
    },
    {
      name: "	Enq Date Time",
      selector: (row) => (
        <>
          {row.enquirydata[0]?.enquirydate
            ? row.enquirydata[0]?.enquirydate
            : "-"}{" "}
          <br />
          {row.enquirydata[0]?.time ? row.enquirydata[0]?.time : "-"}
        </>
      ),
    },
    {
      name: "Name",
      selector: (row, index) =>
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
      name: "Backoffice Executive",
      selector: (row) => (row.staffname ? row.staffname : "-"),
    },
    {
      name: "Appo. Date Time	",
      selector: (row) => (row.nxtfoll ? row.nxtfoll : "-"),
    },
    {
      name: "Note",
      selector: (row) =>
        row.enquirydata[0]?.comment ? row.enquirydata[0]?.comment : "-",
    },
    {
      name: "Technician Name",
      selector: (row) => (row.technicianname ? row?.technicianname : "-"),
      // (row.enquirydata[0]?.comment ? row.enquirydata[0]?.comment : "-"),
    },
    {
      name: "TYPE",
      selector: (row) => "-",
    },
  ];
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    console.log(selectedCity); // Check the selected city value
    setCity(selectedCity);
  };
  const handleTechnicianChange = (e) => {
    const selectedTechnician = e.target.value;
    console.log(selectedTechnician); // Check the selected technician value
    setTechnicianName(selectedTechnician);
  };
  const handleCategoryChange = (e) => {
    const selectedcategory = e.target.value;
    console.log(selectedcategory); // Check the selected technician value
    setCategory(selectedcategory);
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
                    <b>Survey Report &gt; Filter</b>{" "}
                  </p>
                  <div className="row">
                    <div className="col-md-4">
                      Next Followup Date (From Date){" "}
                    </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        onChange={(e) => setFromDate(e.target.value)}
                        type="date"
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
                    <div className="col-md-4">Service </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // style={{ width: "100%" }}
                        onChange={(e) => setInterestFor(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateService].map((service) => (
                          <option key={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Back office Executive </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // style={{ width: "100%" }}
                        onChange={(e) => setBackOffice(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateBackOffice].map((staffname) => (
                          <option key={staffname}>{staffname}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-md-4"> Interested For </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <textarea
                        className="report-select"
                        onChange={(e) => setInterestFor(e.target.value)}
                      />
                    </div>
                  </div> */}
                  <br />
                </div>
                <div className="col-md-5">
                  <br />
                  <div className="row"></div>
                  <div className="row mt-3">
                    <div className="col-md-4">
                      {" "}
                      Next Followup Date (To Date){" "}
                    </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        onChange={(e) => setToDate(e.target.value)}
                        type="date"
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4 ">Category </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={handleCategoryChange} 
                      >
                        <option>All</option>
                        {[...duplicateCategory].map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Technician Name </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        value={technicianName} // Set the selected value from state
                        onChange={handleTechnicianChange} // Call the new handler
                      >
                        <option>Select</option>
                        {[...duplicateTechnicianName].map((executive) => (
                          <option key={executive}>{executive}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Status</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setService(e.target.value)}
                      >
                        <option>Select</option>
                        <option>Attended</option>
                        <option>Quotation prepared</option>
                        <option>quotation sent</option>
                        {/* {surveyData.map((item) => (
                          <option>{item.enquirydata[0]?.technicianname}</option>
                        ))} */}
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
            <h5>Vijay Home Services | Survey Reports {`, ${searchValue}`}</h5>
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

export default Report_Survey;
