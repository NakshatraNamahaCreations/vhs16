import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";

function Report_DSR() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [dsrData, setDsrData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paymentMode, setPaymentMode] = useState("");
  const [fromData, setFromData] = useState("");
  const [toData, setToData] = useState("");
  const [backOffice, setBackOffice] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [jobComplete, setJobComplete] = useState("");
  const [reference, setReference] = useState("");
  const [service, setService] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [city, setCity] = useState("");
  const [jobCatagory, setJobCatagory] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);

  // removing duplicate value from the select option
  const [duplicateCity, setduplicateCity] = useState(new Set());
  const [duplicateCategories, setduplicateCategories] = useState(new Set());
  const [duplicatePaymentMode, setduplicatePaymentMode] = useState(new Set());
  const [duplicateReference, setduplicateReference] = useState(new Set());
  const [duplicateJobComplete, setduplicateJobComplete] = useState(new Set());
  const [duplicateService, setduplicateService] = useState(new Set());
  const [duplicateBackofficeExe, setduplicateBackofficeExe] = useState(
    new Set()
  );
  const [duplicateTechnicianName, setduplicateTechnicianName] = useState(
    new Set()
  );

  useEffect(() => {
    const uniqueCities = new Set(
      dsrData?.map((item) => item.customer[0]?.city).filter(Boolean)
    );
    const uniquePaymentMode = new Set(
      dsrData?.map((item) => item.contractType).filter(Boolean)
    );
    const uniqueCatagories = new Set(
      dsrData?.map((item) => item.category).filter(Boolean)
    );
    const uniqueReference = new Set(
      dsrData?.map((item) => item.category).filter(Boolean) //check reference
    );
    const uniqueJobComplete = new Set(
      dsrData?.map((item) => item.jobComplete).filter(Boolean) //check jobComplete
    );
    const uniqueService = new Set(
      dsrData?.map((item) => item.backofficerExe).filter(Boolean) //check Services
    );
    const uniqueBackOfficeExe = new Set(
      dsrData?.map((item) => item.customer[0]?.serviceExecute).filter(Boolean) //check BackofficeExe
    );
    const uniqueTechnicianName = new Set(
      dsrData?.map((item) => item.techName).filter(Boolean) //check BackofficeExe
    );
    setduplicateCity(uniqueCities);
    setduplicatePaymentMode(uniquePaymentMode);
    setduplicateCategories(uniqueCatagories);
    setduplicateReference(uniqueReference);
    setduplicateJobComplete(uniqueJobComplete);
    setduplicateService(uniqueService);
    setduplicateBackofficeExe(uniqueBackOfficeExe);
    setduplicateTechnicianName(uniqueTechnicianName);
  }, [dsrData]);

  const getDsrDetails = async () => {
    try {
      const res = await axios.get(apiURL + "/getrunningdata");
      if (res.status === 200) {
        const data = res.data.runningdata;
        console.log("DSR", data);
        setDsrData(data);
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
    setFilteredData(dsrData);
    setSearchInput("");
    setShowMessage(true);

    const filteredResults = dsrData.filter((item) => {
      const itemClassification =
        item.servicedetails?.[0]?.contractType
          ?.toLowerCase()
          .includes(paymentMode.toLowerCase()) ?? true;

      const itemBackOffice =
        item.backofficerExe?.toLowerCase().includes(backOffice.toLowerCase()) ??
        true;

      const itemTechnicianName =
        item.techName?.toLowerCase().includes(technicianName.toLowerCase()) ??
        true;

      const itemJobComplete =
        item.jobComplete?.toLowerCase().includes(jobComplete.toLowerCase()) ??
        true;

      const itemJobCatagory =
        item.category?.toLowerCase().includes(jobCatagory.toLowerCase()) ??
        true;

      const itemCity =
        item.customer?.[0]?.city?.toLowerCase().includes(city.toLowerCase()) ??
        true;

      return (
        itemClassification &&
        itemBackOffice &&
        itemTechnicianName &&
        itemJobComplete &&
        itemJobCatagory &&
        itemCity
      );
    });

    setFilteredData(filteredResults);
    setShowMessage(false);
  };

  const handleSearchClick = () => {
    // Call the search function here
    handleSearch();
    setButtonClicked(true);
  };

  // useEffect(() => {
  //   filterData();
  // }, [
  //   paymentMode,
  //   backOffice,
  //   technicianName,
  //   jobComplete,
  //   city,
  //   jobCatagory,
  // ]);

  const exportData = () => {
    const fileName = "dsr_data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DSR Data");
    XLSX.writeFile(workbook, fileName);
  };

  const columns = [
    {
      name: "Sl  No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Card No",
      selector: (row) => (row.cardNo ? row.cardNo : "-"),
    },
    {
      name: "Cr.Date",
      selector: (row) => (row.createdAt ? row.createdAt : "-"),
    },
    {
      name: "Classification",
      selector: (row) => (row?.contractType ? row?.contractType : "-"),
    },
    {
      name: "Customer Name",
      selector: (row) =>
        row.customer[0]?.customerName ? row.customer[0]?.customerName : "-",
    },
    {
      name: "Contact",
      selector: (row) =>
        row.customer[0]?.mainContact ? row.customer[0]?.mainContact : "-",
    },
    {
      name: "City",
      selector: (row) => (row.customer[0]?.city ? row.customer[0]?.city : "-"),
    },
    {
      name: "Reference",
      selector: (row) =>
        row.enquiryData[0]?.reference1 ? row.enquiryData[0]?.reference1 : "-",
    },
    {
      name: "Job Category",
      selector: (row) => (row.service ? row.service : "-"),
    },
    {
      name: "Technician",
      selector: (row) => (row.techName ? row.techName : "-"),
    },
    {
      name: "Repair Remark",
      selector: (row) => "-",
    },
    {
      name: "Amount",
      selector: (row) => (row.amount ? row.amount : "-"),
    },
    {
      name: "Complete",
      selector: (row) => (row.jobComplete ? row.jobComplete : "_"),
    },
    {
      name: "BackOffice Exe",
      selector: (row) => (row.backofficerExe ? row.backofficerExe : "-"),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.customer[0]?.color === "ORANGE",
      style: {
        backgroundColor: "orange",
      },
    },
    {
      when: (row) => row.customer[0]?.color === "RED",
      style: {
        backgroundColor: "red",
      },
    },
    {
      when: (row) => row.customer[0]?.color === "GREEN Company",
      style: {
        backgroundColor: "green",
      },
    },
  ];
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
                    <b>Call Report &gt; Filter</b>{" "}
                  </p>
                  <div className="row">
                    <div className="col-md-4"> From Date </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        type="date"
                        onClick={(e) => setFromData(e.target.value)}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Payment mode </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setPaymentMode(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicatePaymentMode].map((contractType) => (
                          <option value={contractType}>{contractType}</option>
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
                        onClick={(e) => setTechnicianName(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateTechnicianName].map((techName) => (
                          <option key={techName}>{techName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Backoffice Exe </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setBackOffice(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateBackofficeExe].map((serviceExecute) => (
                          <option value={serviceExecute}>
                            {serviceExecute}
                          </option>
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
                        onClick={(e) => setService(e.target.value)}
                      >
                        <option>Select</option>
                        {dsrData.map((item) => (
                          <option>{item.backofficerExe}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Job Status </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setJobStatus(e.target.value)}
                      >
                        <option vallue="">Select</option>
                        <option value="Open">Open</option>
                        <option value="Close">Close</option>
                      </select>
                    </div>
                  </div>{" "}
                  <br />
                </div>
                {/* next Row=================================== */}
                <div className="col-md-5">
                  <br />
                  <div className="row"></div>
                  <div className="row mt-3">
                    <div className="col-md-4 "> To Date </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        type="date"
                        // style={{ width: "70%" }}
                        onClick={(e) => setToData(e.target.value)}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4 ">Job Complete </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // style={{ width: "70%" }}
                        onClick={(e) => setJobComplete(e.target.value)}
                      >
                        <option>All</option>
                        {[...duplicateJobComplete].map((jobComplete) => (
                          <option value={jobComplete}>{jobComplete}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">City </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setCity(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateCity].map((city) => (
                          <option value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Category</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setJobCatagory(e.target.value)}
                        // style={{ width: "70%" }}
                      >
                        <option>Select</option>
                        {[...duplicateCategories].map((category) => (
                          <option value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Reference</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setReference(e.target.value)}
                        // style={{ width: "70%" }}
                      >
                        <option>Select</option>
                        {[...duplicateReference].map((category) => (
                          <option value={category}>{category}</option>
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
            <h5>Vijay Home Services | DSR Reports {`, ${searchInput}`}</h5>
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
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
    </div>
  );
}

export default Report_DSR;
