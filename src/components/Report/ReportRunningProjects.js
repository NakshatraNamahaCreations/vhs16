import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx";

function Report_RunningProjects() {
  const apiURL = process.env.REACT_APP_API_URL;
  const [runningProjectData, setRunningProject] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [daysToComplete, setDaysToComplete] = useState("");
  const [executive, setExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [closeWindow, setCloseWindow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [backOfficeExe, setBackOfficeExe] = useState("");
  const [closedProjects, setClosedProjects] = useState("");
  const [services, setServices] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [pendingPayment, setPendingPayment] = useState("");

  // removing duplicate value from the select option
  const [duplicateSaleExecutive, setDuplicateSaleExecutive] = useState(
    new Set()
  );
  const [duplicateCity, setDuplicateCity] = useState(new Set());
  const [duplicatePaymentType, setDuplicatePaymentType] = useState(new Set());
  const [duplicateProjectManager, setDuplicateProjectManager] = useState(
    new Set()
  );
  const [duplicateCategory, setDuplicateCategory] = useState(new Set());
  const [duplicateServices, setDuplicateServices] = useState(new Set());
  const [duplicateBackOfficeExe, setDuplicateBackOfficeExe] = useState(
    new Set()
  );

  useEffect(() => {
    const uniqueSalesExecutive = new Set(
      runningProjectData
        .map((item) => item.customer[0]?.serviceExecute)
        .filter(Boolean)
    );

    const uniqueCity = new Set(
      runningProjectData.map((item) => item.customer[0]?.city).filter(Boolean)
    );

    const uniquePaymentType = new Set(
      runningProjectData
        .map((item) => item.paymentData[0]?.paymentType)
        .filter(Boolean)
    );

    const uniqueProjectManager = new Set(
      runningProjectData
        .map((item) => item.dsrdata[0]?.techName)
        .filter(Boolean)
    );

    const uniqueBackOfficeExe = new Set(
      runningProjectData.map((item) => item.BackofficeExecutive).filter(Boolean)
    );

    const uniqueService = new Set(
      runningProjectData.map((item) => item.service).filter(Boolean)
    );

    const uniqueCategory = new Set(
      runningProjectData.map((item) => item.category).filter(Boolean)
    );

    setDuplicateSaleExecutive(uniqueSalesExecutive);
    setDuplicateCity(uniqueCity);
    setDuplicatePaymentType(uniquePaymentType);
    setDuplicateProjectManager(uniqueProjectManager);
    setDuplicateBackOfficeExe(uniqueBackOfficeExe);
    setDuplicateServices(uniqueService);
    setDuplicateCategory(uniqueCategory);
  }, [runningProjectData]);

  const getRunningProject = async () => {
    let res = await axios.get(apiURL + "/getrunningdata");
    if (res.status === 200) {
      const data = res.data?.runningdata;
      console.log("RunningProjects", data);
      setRunningProject(data);
      setFilteredData(data);
    }
  };

  useEffect(() => {
    getRunningProject();
  }, []);

  const handleSearch = () => {
    setFilteredData(runningProjectData);
    setSearchValue("");
    setShowMessage(true);
    const filteredResults = runningProjectData.filter((item) => {
      // const itemType =
      //   item.enquirydata?.[0]?.intrestedfor
      //     ?.toLowerCase()
      //     .includes(category.toLowerCase()) ?? true;

      const itemCity =
        item.customer[0]?.city?.toLowerCase().includes(city.toLowerCase()) ??
        true;

      const itemCategory =
        item.category?.toLowerCase().includes(category.toLowerCase()) ?? true;

      const itemExcuitive =
        item.customer[0]?.serviceExecute
          ?.toLowerCase()
          .includes(executive.toLowerCase()) ?? true;

      const itemFromDate =
        item.date?.toLowerCase().includes(fromDate.toLowerCase()) ?? true;

      const itemToDate =
        item.date?.toLowerCase().includes(toDate.toLowerCase()) ?? true;

      const itemProjectManager =
        item.dsrdata[0]?.techName
          ?.toLowerCase()
          .includes(projectManager.toLowerCase()) ?? true;

      const itemDaysToComplete =
        item.dsrdata[0]?.daytoComplete
          ?.toLowerCase()
          .includes(daysToComplete.toLowerCase()) ?? true;

      // const itemWorker =
      //   item.dsrdata[0]?.workerName
      //     ?.toLowerCase()
      //     .includes(backOfficeExe.toLowerCase()) ?? true;

      const itemPaymentType =
        item.paymentData[0]?.paymentType
          .toLowerCase()
          .includes(paymentType.toLowerCase()) ?? true;

      const itemBackOffice =
        item.BackofficeExecutive.toLowerCase().includes(
          backOfficeExe.toLowerCase()
        ) ?? true;
      return (
        itemProjectManager &&
        itemDaysToComplete &&
        itemFromDate &&
        itemToDate &&
        itemExcuitive &&
        itemCity &&
        // itemType &&
        // itemWorker &&
        itemPaymentType &&
        itemCategory &&
        itemBackOffice
      );
    });
    setFilteredData(filteredResults);
    setSearchValue(
      city ||
        executive ||
        fromDate ||
        toDate ||
        projectManager ||
        daysToComplete ||
        backOfficeExe ||
        category
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



  // Function to calculate the total amount from the paymentData array
  function calculateTotalPaymentAmount(paymentData) {
    let totalAmount = 0;
    for (const payment of paymentData) {
      const amountString = payment.amount;
      const cleanedAmountString = amountString.replace(/[^\d.-]/g, "");
      const amount = parseFloat(cleanedAmountString);
      if (!isNaN(amount)) {
        totalAmount += amount;
      }
    }
    return totalAmount.toFixed(2); // Format the total amount with two decimal places
  }

 // Function to calculate the total vendor payment amount
function calculateTotalvendorAmount(paymentData) {
  let totalAmount = 0;

  // Loop through the payment data and sum up the amounts where the payment type is "Vendor"
  paymentData.forEach((payment) => {
    if (payment.paymentType === "Vendor") {
      totalAmount += parseFloat(payment.amount); // Assuming the amount is a string representing a number
    }
  });

  return totalAmount.toFixed(2); // You can adjust the number of decimal places as needed
}

  // Function to calculate the pending amount (assuming the total amount is constant)
  function calculatePendingPaymentAmount(paymentData, serviceCharge) {
    const totalAmount = calculateTotalPaymentAmount(paymentData);
    const pendingAmount = totalAmount - parseFloat(serviceCharge);
    return pendingAmount.toFixed(2); // Format the pending amount with two decimal places
  }
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
                    <b>Running Project Report &gt; Filter</b>{" "}
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
                    <div className="col-md-4">Days To Complete</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <input
                        className="report-select"
                        onChange={(e) => setDaysToComplete(e.target.value)}
                        type="date"
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Project Manager </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setProjectManager(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateProjectManager].map((techName) => (
                          <option key={techName}>{techName}</option>
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
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateCategory].map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Pending Payment *</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={(e) => setPendingPayment(e.target.value)}
                      >
                        <option value="">All</option>
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Payment Type </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={(e) => setPaymentType(e.target.value)}
                      >
                        <option value="">All</option>
                        {[...duplicatePaymentType].map((paymentType) => (
                          <option key={paymentType}>{paymentType} </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                </div>
                {/* next column===================================================================================== */}
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
                    <div className="col-md-4 ">Service </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setServices(e.target.value)}
                      >
                        <option>All</option>
                        {[...duplicateServices].map((service) => (
                          <option key={service}>{service}</option>
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
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">Sales Executive </div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onClick={(e) => setExecutive(e.target.value)}
                      >
                        <option>Select</option>
                        {[...duplicateSaleExecutive].map((serviceExecute) => (
                          <option key={serviceExecute}>
                            {" "}
                            {serviceExecute}
                          </option>
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
                        onChange={(e) => setBackOfficeExe(e.target.value)}
                      >
                        <option> Select</option>{" "}
                        {[...duplicateBackOfficeExe].map(
                          (BackofficeExecutive) => (
                            <option key={BackofficeExecutive}>
                              {" "}
                              {BackofficeExecutive}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4"> Closed Projects *</div>
                    <div className="col-md-1 ms-4">:</div>
                    <div className="col-md-5 ms-4">
                      <select
                        className="report-select"
                        onChange={(e) => setClosedProjects(e.target.value)}
                      >
                        <option> closed projecrs</option>{" "}
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
            <h5>
              Vijay Home Services | Running Project Report {`, ${searchValue}`}
            </h5>
          </Card>
        </div>{" "}
        <br />
        {/* <DataTable
          columns={columns}
          data={filteredData}
          pagination
          fixedHeader
          selectableRowsHighlight
          subHeaderAlign="left"
          highlightOnHover
        /> */}
          <>
              <table class="table table-hover table-bordered mt-1">
                <thead className="">
                

                  <tr className="table-secondary">
                    <th className="table-head" scope="col">
                      Sr.No
                    </th>
                    <th className="table-head" scope="col">
                      Cr.Date
                    </th>
                    <th className="table-head" scope="col">
                      Category
                    </th>
                    <th className="table-head" scope="col">
                      Project Manager
                    </th>
                    <th scope="col" className="table-head">
                      Sales Executive
                    </th>
                    <th scope="col" className="table-head">
                      Customer
                    </th>
                    <th scope="col" className="table-head">
                      Contact No.
                    </th>
                    <th scope="col" className="table-head">
                      Address
                    </th>
                    <th scope="col" className="table-head">
                      City
                    </th>
                    <th scope="col" className="table-head">
                      Quote No.
                    </th>
                    <th scope="col" className="table-head">
                      Project Type
                    </th>
                    <th scope="col" className="table-head">
                      Day To Complete
                    </th>
                    <th scope="col" className="table-head">
                      Worker
                    </th>
                    <th scope="col" className="table-head">
                      Vendor Payment
                    </th>
                    <th scope="col" className="table-head" style={{minWidth:"160px"}}>
                      Charges
                    </th>
                    <th scope="col" className="table-head">
                      Quote Value
                    </th>
                    <th scope="col" className="table-head" style={{minWidth:"160px"}}>
                      Payment
                    </th>
                    <th scope="col" className="table-head">
                      TYPE
                    </th>

                  
                  </tr>
                </thead>
                <tbody>
                  {runningProjectData.map((item, index) => (
                    <tr className="user-tbale-body">
                      <td>{index + 1}</td>
                      <td>{item.date}</td>
                      <td>{item.category}</td>
                      <td>{item.dsrdata[0]?.techName}</td>
                      <td>{item.quotedata[0]?.salesExecutive}</td>
                      <td>{item.customerData[0]?.customerName}</td>
                      <td>{item.customerData[0]?.mainContact}</td>
                      <td>
                        {item.customerData[0]?.lnf} {item.customerData[0]?.rbhf}{" "}
                        {item.customerData[0]?.cnap}
                      </td>
                      <td>{item.customerData[0]?.city}</td>
                      <td>{item.quotedata[0]?.quoteId}</td>
                      <td>{item.desc}</td>
                      <td>{item.dsrdata[0]?.daytoComplete}</td>
                      <td>{item.dsrdata[0]?.workerName}</td>
                      <td>
                        {item.paymentData.some(
                          (i) => i.paymentType === "Vendor" && i.serviceId === item._id
                        ) ? (
                          <div>
                            {item.paymentData
                              .filter((i) => i.paymentType === "Vendor" && i.serviceId === item._id)
                              .map((i) => (
                                <p key={i._id}>
                                 {i.amount}
                                </p>
                              ))}
                           
                          </div>
                        ) : (
                          <p>0.0</p>
                        )}
                      </td>
                      <td>
                        {item.paymentData.some(
                          (i) => i.paymentType === "Vendor" && i.serviceId === item._id
                        ) ? (
                          <div>
                            {item.paymentData
                              .filter((i) => i.paymentType === "Vendor" && i.serviceId === item._id)
                              .map((i) => (
                                <p key={i._id} className="mb-0 text-right">
                                  ({i.paymentDate}) {i.amount}
                                </p>
                              ))}
                            <div >
                              <hr className="mb-0 mt-0"/>
                              <p className="mb-0 text-right">
                                <b> Total:{" "}
                                {calculateTotalvendorAmount(item.paymentData.filter((i)=>i.serviceId === item._id))}</b>
                               
                              </p>
                             
                            </div>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </td>
                      <td>{item.serviceCharge}</td>
                      <td>
                        {item.paymentData.some(
                          (i) => i.paymentType === "Customer" && i.serviceId === item._id
                        ) ? (
                          <div>
                            {item.paymentData
                              .filter((i) => i.paymentType === "Customer" && i.serviceId === item._id)
                              .map((i) => (
                                <p key={i._id} className="mb-0 text-right" >
                                  ({i.paymentDate}) {i.amount}
                                </p>
                              ))}
                            <div>
                              <hr className="mb-0 mt-0"/>
                              <p className="mb-0 text-right">
                                <b>
                                Total:{" "}
                                {calculateTotalPaymentAmount(item.paymentData.filter((i)=>i.serviceId === item._id))}
                                </b>
                              
                              </p>
                              <p className="text-right">
                              <b>
                              Pending:{" "}
                                {calculatePendingPaymentAmount(
                                  item.paymentData.filter(
                                    (i) => i.paymentType === "Customer" && i.serviceId === item._id
                                  ),
                                  item.serviceCharge
                                )}
                                </b>  
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </td>

                      <td>
                        <div>RUNNING PROJECTS</div>
                      </td>

                     
                    </tr>
                  ))}
                </tbody>
              </table>{" "}
            </>
      </div>
    </div>
  );
}

export default Report_RunningProjects;
