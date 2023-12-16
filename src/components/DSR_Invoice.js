import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { da } from "date-fns/locale";
import numberToWords from "number-to-words";

function DSR_Invoice() {
  const [tcdata, settcdata] = useState([]);
  const [headerimgdata, setheaderimgdata] = useState([]);
  const [footerimgdata, setfooterimgdata] = useState([]);
  const [bankdata, setbankdata] = useState([]);
  const location = useLocation();
  const getURLDATA = new URLSearchParams(location.search)?.get("id");
  const [treatmentData, settreatmentData] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;
  const imgURL = process.env.REACT_APP_IMAGE_API_URL;

  // const [section2data, setsection2data] = useState([]);
  const [termsAndCondition, setTemsAndCondition] = useState([]);
  // useEffect(() => {
  //   gettermsgroup();
  // }, []);

  // const gettermsgroup = async () => {
  //   let res = await axios.get(apiURL + "/master/gettermgroup");
  //   if ((res.status = 200)) {
  //     setTemsAndCondition(res.data?.termsgroup);
  //     const invoicType = res.data?.termsgroup.filter(
  //       (i) => i.type === "INVOICE"
  //     );
  //     const filterByCategory = invoicType.filter(
  //       (item) => item.category === data.category
  //     );
  //     settcdata(filterByCategory);
  //   }
  // };

  // console.log("termsAndCondition", termsAndCondition);
  let i = 1;

  useEffect(() => {
    getheaderimg();
    getfooterimg();
    getbank();

    // gettermsgroup2();
  }, []);

  const getheaderimg = async () => {
    let res = await axios.get(apiURL + "/master/getheaderimg");
    if ((res.status = 200)) {
      setheaderimgdata(res.data?.headerimg);
    }
  };

  const getfooterimg = async () => {
    let res = await axios.get(apiURL + "/master/getfooterimg");
    if ((res.status = 200)) {
      setfooterimgdata(res.data?.footerimg);
    }
  };

  const getbank = async () => {
    let res = await axios.get(apiURL + "/getbank");
    if ((res.status = 200)) {
      setbankdata(res.data?.bankacct);
    }
  };

  const getServiceData = async () => {
    try {
      let res = await axios.get(apiURL + "/getrunningdata");
      if (res.status === 200) {
        const data = res.data?.runningdata;
        const filteredService = data.find((item) => item._id === getURLDATA);
        settreatmentData(filteredService);
      } else {
        settreatmentData([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // console.log(
  //   "filteredService",
  //  const  treatmentData?.customerData?.flat().map((ele) => ele.approach)
  // );

  useEffect(() => {
    getServiceData();
  }, []);

  return (
    <div className="row">
      {/* <Header />s */}

      <div className="row justify-content-center mt-3">
        <div className="col-md-11">
          <div
            className="card shadow  bg-white rounded"
            style={{ border: "none" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {headerimgdata.map((item) => (
                  <img
                    src={imgURL + "/quotationheaderimg/" + item.headerimg}
                    height="120px"
                  />
                ))}
              </div>
              <div className="p-1">
                <h2>GST INVOICE</h2>
                <p>Original For Recipient</p>
                <p>
                  <b>Invoice# , Date :</b> {moment().format("L")}
                </p>
              </div>
            </div>

            <div className="row  mt-2">
              <div className="col-md-6 b-col">
                <div className="" style={{ fontWeight: "bold" }}>
                  BILLED BY
                </div>
                <div className="" style={{ fontWeight: "bold" }}>
                  Vijay Home Services
                </div>
                <p>
                  #21, 4th Cross. Baddi Krishnappa Layout, Near Gangama Temple
                  Road, Mahadevpura Outer Ring Road, Bangalore - 560048
                </p>
              </div>
              <div className="col-md-6 b-col" style={{ marginLeft: "9px" }}>
                <div className="" style={{ fontWeight: "bold" }}>
                  BILLED TO
                </div>

                <h5> {treatmentData?.customerData?.customerName} </h5>

                {treatmentData?.customerData?.flat().map((ele) => {
                  return (
                    <p className="mb-0">
                      {ele.lnf} {ele.rbhf} {ele.mainArea} - {ele.pinCode}
                    </p>
                  );
                })}
                {/* {treatmentData?.customerData?.rbhf}
                  {treatmentData?.customerData?.mainArea}
                  {treatmentData?.customerData?.pinCode} */}
                {treatmentData?.customerData?.flat().map((ele) => {
                  return <p className="mb-0">{ele.mainContact}</p>;
                })}
                <b> GSTIN</b>
              </div>
            </div>

            <div className="row m-auto mt-2 w-100">
              <div className="col-md-12">
                <table class="table table-bordered border-danger">
                  <thead>
                    <tr className="hclr">
                      <th className="text-center">S.No</th>
                      <th className="text-center">Category</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Contract</th>
                      <th className="text-center">Service Date</th>
                      <th className="text-center">Amount Paid Date</th>

                      <th className="text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row" className="text-center">
                        {i++}
                      </td>
                      <td scope="row" className="text-center">
                        {treatmentData.category}
                      </td>
                      <td scope="row" className="text-center">
                        {treatmentData.desc}
                      </td>

                      <td className="text-center">
                        {treatmentData?.contractType}
                      </td>
                      {treatmentData?.contractType === "AMC" ? (
                        <td>
                          {treatmentData.dividedDates.map((item) => (
                            <div>
                              <p className="text-center">
                                {new Date(item).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td> {treatmentData?.dateofService} </td>
                      )}

                      {treatmentData?.contractType === "AMC" ? (
                        <td>
                          {treatmentData.dividedamtDates.map((item) => (
                            <div>
                              <p className="text-end">
                                {new Date(item).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td>{treatmentData?.dateofService}</td>
                      )}

                      {treatmentData?.contractType === "AMC" ? (
                        <td>
                          {treatmentData.dividedamtCharges.map((item) => (
                            <div>
                              <p className="text-end"> {item} </p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td>{treatmentData?.serviceCharge} </td>
                      )}
                    </tr>
                  </tbody>
                </table>
                <div className="float-end px-1">
                  <h5>Total : {treatmentData.serviceCharge} </h5>
                </div>
              </div>
            </div>
            <div className="text-end px-2" style={{ fontWeight: "bold" }}>
              Amount In Words :{" "}
              <span style={{ fontWeight: 400 }}>
                {/* {numberToWords.toWords(treatmentData.serviceCharge) + " Only"} */}
              </span>
            </div>

            <div className="mx-5">
              <div>
                <div className="" style={{ fontWeight: "bold" }}>
                  BANK DETAILS
                </div>
              </div>

              {bankdata.map((item) => (
                <div>
                  <div className="pt-2" style={{ fontWeight: "bold" }}>
                    Account Name :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.accname}
                    </span>
                  </div>

                  <div className="" style={{ fontWeight: "bold" }}>
                    Account Number :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.accno}
                    </span>
                  </div>

                  <div className="" style={{ fontWeight: "bold" }}>
                    IFSC :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.ifsccode}
                    </span>
                  </div>

                  <div className="" style={{ fontWeight: "bold" }}>
                    BANK NAME :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.bankname}
                    </span>
                  </div>
                  <div className="" style={{ fontWeight: "bold" }}>
                    Branch Name :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.branch}
                    </span>
                  </div>

                  <div className="mt-3" style={{ fontWeight: "bold" }}>
                    Gpay / Phonepe Details
                  </div>

                  <div className="pb-3" style={{ fontWeight: "bold" }}>
                    Mobile No. :{" "}
                    <span style={{ color: "black", fontWeight: 400 }}>
                      {item.upinumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="p-3">
              <h3>Terms & Conditions</h3>
              {section2data.map((e) => (
                <>{e.content}</>
              ))}
            </div> */}

            {tcdata.map((item) => (
              <div>
                <div
                  className="row m-auto mt-3"
                  style={{
                    backgroundColor: "#a9042e",
                    color: "white",
                    fontWeight: "bold",
                    justifyContent: "center",
                    padding: "8px",
                  }}
                >
                  {item.header}
                </div>
                <table class="table table-bordered border-danger">
                  <tbody>
                    <tr>
                      <td scope="row">
                        <div class="form-check">
                          <div className="mt-2">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.content,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DSR_Invoice;
