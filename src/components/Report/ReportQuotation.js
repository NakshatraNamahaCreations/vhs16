import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";
import { parse, isBefore, isAfter, isSameDay } from "date-fns";
import moment from "moment";

function Report_Quotation() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [quotationData, setQuotationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [saleExecutive, setSalesExcuitive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [category, setCategory] = useState("");
  const [backOfExcuitive, setBackOfExcuitive] = useState("");
  const [staus, setStatus] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  // removing duplicate value from the select option
  const [duplicateCity, setduplicateCity] = useState(new Set());
  const [duplicateService, setduplicateService] = useState(new Set());
  const [duplicateBackOffice, setduplicateBackOffice] = useState(new Set());
  const [duplicateCategory, setduplicateCategory] = useState(new Set());
  const [duplicateSaleExecutive, setduplicateSaleExecutive] = useState(
    new Set()
  );

  useEffect(() => {
    const uniqueCities = new Set(
      quotationData?.map((item) => item.enquirydata[0]?.city).filter(Boolean)
    );
    const uniqueService = new Set(
      quotationData
        ?.map((item) => item.enquirydata[0]?.intrestedfor)
        .filter(Boolean)
    );
    const uniqueBackoffice = new Set(
      quotationData
        ?.map((item) => item.enquirydata[0]?.executive) //backoffice
        .filter(Boolean)
    );
    const uniqueCatagories = new Set(
      quotationData
        ?.map((item) => item.enquirydata[0]?.category)
        .filter(Boolean)
    );
    const uniqueSalesExecutive = new Set( //sales Executive or booked by
      quotationData?.map((item) => item.Bookedby).filter(Boolean)
    );
    setduplicateCity(uniqueCities);
    setduplicateService(uniqueService);
    setduplicateBackOffice(uniqueBackoffice);
    setduplicateCategory(uniqueCatagories);
    setduplicateSaleExecutive(uniqueSalesExecutive);
  }, [quotationData]);

  const getQuotationDetails = async () => {
    try {
      const res = await axios.get(apiURL + "/getallquote");
      if (res.status === 200) {
        const data = res.data.quote;
        console.log("QuotationData", data);
        setQuotationData(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching DSR details:", error);
    }
  };

  useEffect(() => {
    getQuotationDetails();
  }, []);

  const handleSearch = () => {
    setFilteredData(quotationData);
    setSearchValue("");
    setShowMessage(true);

    const filteredResults = quotationData.filter((item) => {
      const enquiryDate = parse(item.date, "MM/dd/yyyy", new Date());

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

      const itemServices =
        item.enquirydata?.[0]?.intrestedfor
          ?.toLowerCase()
          .includes(service.toLowerCase()) ?? true;

      const itemExcuitive = //Sales Executive or booked by
        item.Bookedby?.toLowerCase().includes(saleExecutive.toLowerCase()) ??
        true;

      const itemCategory =
        item.enquirydata[0]?.category
          ?.toLowerCase()
          .includes(category.toLowerCase()) ?? true;

      const itemBackOfficeExe = //back office excutive
        item.enquirydata[0]?.executive
          ?.toLowerCase()
          .includes(backOfExcuitive.toLowerCase()) ?? true;

      const isFiltered =
        itemFromDate &&
        itemToDate &&
        itemServices &&
        itemCity &&
        itemExcuitive &&
        itemCategory &&
        itemBackOfficeExe;

      console.log("Final Filter Result:", isFiltered);

      return isFiltered;
    });
    setFilteredData(filteredResults);
    setSearchValue(
      service ||
        city ||
        saleExecutive ||
        fromDate ||
        toDate ||
        category ||
        backOfExcuitive
    );
    setShowMessage(false);
  };

  const handleSearchClick = () => {
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
      name: "	En.Date",
      selector: (row) =>
        row.enquirydata[0]?.enquirydate ? row.enquirydata[0]?.enquirydate : "-",
    },
    {
      name: "Q Dt-Tm",
      selector: (row) => (
        <>
          {row.date ? row.date : "-"} <br />
          {row.time ? row.time : "-"}
        </>
      ),
    },
    {
      name: "Name",
      selector: (row, index) =>
        row.enquirydata[0]?.name ? row.enquirydata[0]?.name : "-",
    },
    {
      name: "Contact No",
      selector: (row) =>
        row.enquirydata[0]?.contact1 ? row.enquirydata[0]?.contact1 : "-",
    },
    {
      name: "Address",
      selector: (row) =>
        row.enquirydata[0]?.address ? row.enquirydata[0]?.address : "-",
    },
    {
      name: "City",
      selector: (row) =>
        row.enquirydata[0]?.city ? row.enquirydata[0]?.city : "-",
    },
    {
      name: "Service",
      selector: (row) =>
        row.enquirydata[0]?.intrestedfor
          ? row.enquirydata[0]?.intrestedfor
          : "-",
    },
    {
      name: "Q Amt	",
      selector: (row) =>
        row.enquirydata[0]?.city ? row.enquirydata[0]?.city : "-",
    },
    {
      name: "Sales Executive",
      selector: (row) =>
        row?.enquirydata[0]?.executive ? row?.enquirydata[0]?.executive : "-",
    },
    {
      name: "Booked By",
      selector: (row) => (row.Bookedby ? row.Bookedby : "-"),
    },
    {
      name: "Last F/W Dt",
      selector: (row) => (row.appoDate ? row.appoDate : "-"),
    },
    {
      name: "Nxt F/W Dt",
      selector: (row) =>
        row.quotefollowup[0]?.nxtfoll ? row.quotefollowup[0]?.nxtfoll : "-",
    },
    {
      name: "Description",
      selector: (row) =>
        row.enquirydata[0]?.comment ? row.enquirydata[0]?.comment : "-",
    },
    {
      name: "TYPE",
      selector: (row) => "-",
    },
  ];

  const handleExecutiveChange = (e) => {
    const selectedExecutive = e.target.value;
    console.log(selectedExecutive); // Check the selected executive value
    setBackOfExcuitive(selectedExecutive);
  };

  const handleSalesExecutiveChange = (e) => {
    const saleExecutive = e.target.value;
    console.log(saleExecutive); // Check the selected reference value
    setSalesExcuitive(saleExecutive);
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
                    <b>Quotation Report &gt; Filter</b>{" "}
                  </p>
                  <div className="row">
                    <div className="col-md-4">From Date</div>
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
                        onChange={(e) => setCity(e.target.value)}
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
                        onChange={handleServiceChange}
                      >
                        <option>Select</option>
                        {[...duplicateService].map((Service) => (
                          <option key={Service}>{Service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4"> Back office Executive</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={handleExecutiveChange}
                      >
                        <option>Select</option>
                        {[...duplicateBackOffice].map((BackOffice) => (
                          <option key={BackOffice}>{BackOffice}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <br />

                  <br />
                </div>
                <div className="col-md-5">
                  <br />
                  <div className="row"></div>
                  <div className="row mt-3">
                    <div className="col-md-4"> To Date</div>
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
                        onChange={(e) => setCategory(e.target.value)}
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
                    <div className="col-md-4"> Sales Executive</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={handleSalesExecutiveChange}
                      >
                        <option>Select</option>
                        {[...duplicateSaleExecutive].map((Bookedby) => (
                          <option key={Bookedby}>{Bookedby}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4"> Status</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option>Select</option>

                        <option value="Call Later">call later</option>
                        <option value="Confirmed">confirmed</option>
                        <option value="Cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
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
            <h5>
              Vijay Home Services | Quotation Reports {`, ${searchValue}`}
            </h5>
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

export default Report_Quotation;
