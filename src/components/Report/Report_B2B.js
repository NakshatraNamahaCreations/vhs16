import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";

function Report_B2B() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [b2bData, setb2bdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [city, setCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusData, setStatus] = useState("");
  const [sentMails, setSentMails] = useState("");
  const [b2bType, setB2BType] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  // removing duplicate value from the select option
  const [duplicateCity, setduplicateCity] = useState(new Set());
  const [duplicateB2BType, setduplicateB2BType] = useState(new Set());

  useEffect(() => {
    const uniqueCities = new Set(
      b2bData?.map((item) => item.city).filter(Boolean)
    );

    const uniqueB2BType = new Set(
      b2bData?.map((item) => item.b2btype).filter(Boolean)
    );

    setduplicateCity(uniqueCities);
    setduplicateB2BType(uniqueB2BType);
  }, [b2bData]);

  const getb2b = async () => {
    try {
      const res = await axios.get(apiURL + "/getB2B");
      if (res.status === 200) {
        const data = res.data?.B2B;
        console.log("B2b", data);
        setb2bdata(data);
        setFilteredData(data); // Initialize filteredData with the fetched data
      }
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };

  useEffect(() => {
    getb2b();
  }, []);

  const handleSearch = () => {
    setFilteredData(b2bData);
    setSearchValue("");
    setShowMessage(true);
    const filteredResults = b2bData.filter((item) => {
      const itemCity =
        item.city?.toLowerCase().includes(city.toLowerCase()) ?? true;

      const itemFromDate =
        item.createdAt?.toLowerCase().includes(fromDate.toLowerCase()) ?? true;

      const itemToDate =
        item.createdAt?.toLowerCase().includes(toDate.toLowerCase()) ?? true;

      // const itemStatus =
      //   item.status?.toLowerCase().includes(statusData.toLowerCase()) ?? true;

      const itemB2BType =
        item.b2btype?.toLowerCase().includes(b2bType.toLowerCase()) ?? true;

      return itemFromDate && itemToDate && itemCity && itemB2BType;
    });
    setFilteredData(filteredResults);
    setSearchValue(city || fromDate || toDate || b2bType);
    setShowMessage(false);
  };

  const handleSearchClick = () => {
    handleSearch();
    setButtonClicked(true);
  };

  const exportData = () => {
    const fileName = "b2b_details.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "B2B_details");
    XLSX.writeFile(workbook, fileName);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Date",
      selector: (row) => row.createdAt,
    },
    {
      name: "Name",
      selector: (row) => row.b2bname,
    },
    {
      name: "Contact Person",
      selector: (row) => row.contactperson,
    },
    {
      name: "Contact 1",
      selector: (row) => row.maincontact,
    },
    {
      name: "Contact 2",
      selector: (row) => row.alternateno,
    },
    {
      name: "Email Id",
      selector: (row) => row.email,
    },
    // {
    //   name: "Gst",
    //   selector: (row) => row.gst,
    // },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "B2B type",
      selector: (row) => row.b2btype,
    },
    {
      name: "city",
      selector: (row) => row.city,
    },
    // {
    //   name: "Instructions",
    //   selector: (row) => row.instructions,
    // },
    {
      name: "Approach",
      selector: (row) => row.approach,
    },
    {
      name: "Executive",
      selector: (row) => row.executiveName,
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
                        onClick={(e) => setCity(e.target.value)}
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
                    <div className="col-md-4">Type </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // style={{ width: "100%" }}
                        onChange={(e) => setB2BType(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateB2BType].map((typeOfB2B) => (
                          <option key={typeOfB2B}>{typeOfB2B}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                </div>
                {/* next column=========================== */}
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
                    <div className="col-md-4 ">Status *</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // onClick={(e) => setStatus(e.target.value)}
                      >
                        <option>All</option>
                        {/* {[...duplicateCategory].map((statusData) => (
                          <option key={statusData}>{statusData}</option>
                        ))} */}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">
                      How many mails / Messages sent *
                    </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        // onClick={(e) => setSentMails(e.target.value)}
                      >
                        <option>Select</option>
                        {/* <option>Attended</option>
                        <option>Quotation prepared</option>
                        <option>quotation sent</option> */}
                      </select>
                    </div>
                  </div>
                  <br />
                  {/* <div className="row">
                    <div className="col-md-4"> Reference 2</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <textarea
                        className="report-select"
                        onChange={(e) => setReference2(e.target.value)}
                      />
                    </div>
                  </div>
                  <br /> */}
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
                      Please select option to search!
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
            <h5>Vijay Home Services | B2B Reports {`, ${searchValue}`}</h5>
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

export default Report_B2B;
