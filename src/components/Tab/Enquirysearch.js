import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import Enquirynav from "../Enquirynav";
import axios from "axios";
// import Table from "react-bootstrap/Table";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

function Enquirysearch() {
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const navigate = useNavigate();
  const [citydata, setcitydata] = useState([]);
  const [enquiryAddData, setenquiryadddata] = useState([]);
  const [name, setname] = useState("");
  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState("");
  const [city, setcity] = useState("");
  const [contact, setcontact] = useState("");
  const [status, setstatus] = useState("");
  const [executive, setexecutive] = useState("");
  const [filterdata, setfilterdata] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;

  // console.log(enquiryadddata);

  const getcity = async () => {
    let res = await axios.get(apiURL + "/master/getcity");
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };
  const getenquiryadd = async () => {
    let res = await axios.get(apiURL + "/getenquiry");
    if (res.status === 200) {
      // console.log("enquiryadddata", res);
      setenquiryadddata(res.data?.enquiryadd);
    }
  };

  useEffect(() => {
    getcity();
    getenquiryadd();
  }, []);

  const filterData = () => {
    const result = enquiryAddData.filter((item) => {
      const itemName = item.name ? item.name.toLowerCase() : "";
      const itemCity = item.city ? item.city.toLowerCase() : "";
      const itemEnquiryFromDate = item.enquirydate ? item.enquirydate : "";
      const itemEnquiryToDate = item.enquirydate ? item.enquirydate : "";
      const itemExecutive = item.executive ? item.executive.toLowerCase() : "";
      const itemContact = item.contact1 ? item.contact1.toLowerCase() : "";

      const filterName = name ? name.toLowerCase() : "";
      const filterCity = city ? city.toLowerCase() : "";
      const filterEnquiryFromDate = item.fromdate ? item.fromdate : "";
      const filterEnquiryToDate = item.todate ? item.todate : "";
      const filterExecutive = executive ? executive.toLowerCase() : "";
      const filterContact = contact ? contact.toLowerCase() : "";

      return itemName.includes(filterName) &&
        itemCity.includes(filterCity) &&
        // itemEnquiryFromDate == fromdate || todate===""? true: false&&
        itemEnquiryFromDate.includes(filterEnquiryFromDate) &&
        itemEnquiryToDate.includes(filterEnquiryToDate) &&
        // itemEnquiryToTime.includes(filterEnquiryToTime)||toTime===" "?true:false&&
        itemExecutive.includes(filterExecutive) &&
        itemContact.includes(filterContact)
        ? true
        : false;
    });
    setfilterdata(result);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    filterData();
  };

  const columns = [
    {
      name: "Sl  No",
      cell: (row, i) => <div>{i + 1}</div>,
    },
    {
      name: "Date",
      selector: (row) => row.enquirydate,
    },
    {
      name: "Time",
      selector: (row) => row.time,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Contact",
      selector: (row) => row.contact1,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Reference1",
      selector: (row) => row.reference1,
    },
    {
      name: "Reference2",
      selector: (row) => row.reference2,
    },
    {
      name: "Reference3",
      selector: (row) => row.reference3,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "Interested for",
      selector: (row) => row.intrestedfor,
    },
    {
      name: "Executive",
      selector: (row) => row.executive,
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/enquirydetail/${row.EnquiryId}`);
  };

  return (
    <div className="web">
      <Header />
      <Enquirynav />

      <div className="row m-auto">
        <div className="col-md-12">
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-body p-4">
              <div className="vhs-sub-heading pb-2">Enquiry Search :</div>
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <div className="vhs-input-label">Name</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        value={name}
                        onChange={(e) => {
                          setname(e.target.value);
                          // console.log("name", name);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">From Date</div>
                    <div className="group pt-1">
                      <input
                        type="date"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setfromdate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label"> To Date</div>
                    <div className="group pt-1">
                      <input
                        type="date"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => settodate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Contact
                      <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        value={contact}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcontact(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">City</div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcity(e.target.value)}
                      >
                        <option>--select--</option>
                        {admin?.city.map((item) => (
                          <option value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">Status</div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setstatus(e.target.value)}
                      >
                        <option>--select--</option>
                        <option>Annapurna</option>
                        <option>Bharath</option>
                        <option>Bhavya</option>
                        <option>Bindu</option>
                        <option>Gururaj</option>
                        <option>Hemanth</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label"> Executive</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        value={executive}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setexecutive(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row pt-3 justify-content-center">
                  <div className="col-md-2">
                    <button className="vhs-button" onClick={handleSearchClick}>
                      Search
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button className="vhs-button mx-3">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* {searchClicked && !hasResults && (
            <p style={{ textAlign: "center", marginTop: "18px" }}>
              {" "}
              No matching results found.
            </p>
          )} */}
          {/* {searchClicked && hasResults && ( */}
          <DataTable
            columns={columns}
            data={filterdata}
            pagination
            fixedHeader
            selectableRowsHighlight
            subHeaderAlign="left"
            highlightOnHover
            onRowClicked={handleRowClick}
          />
          {/* )} */}
          {/* {searchClicked && hasResults && ( */}
          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Reference1</th>
                <th>Reference2</th>
                <th>Reference3</th>
                <th>City</th>

                <th>Interested for</th>
                <th>Executive</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr>
                  <td>{i++}</td>
                  <td>{item.enquirydate}</td>
                  <td>{item.time}</td>
                  <td>{item.name}</td>
                  <td>{item.contact1}</td>
                  <td>{item.address}</td>
                  <td>{item.reference1}</td>
                  <td>{item.reference2}</td>
                  <td>{item.reference3}</td>
                  <td>{item.city}</td>
                  <td>{item.intrestedfor}</td>
                  <td>{item.executive}</td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        </div>
      </div>
    </div>
  );
}

export default Enquirysearch;
