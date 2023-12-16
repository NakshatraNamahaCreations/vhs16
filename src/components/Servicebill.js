import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { da } from "date-fns/locale";
import numberToWords from "number-to-words";

function Servicebill() {
  const [tcdata, settcdata] = useState([]);
  const [headerimgdata, setheaderimgdata] = useState([]);
  const [footerimgdata, setfooterimgdata] = useState([]);
  const [bankdata, setbankdata] = useState([]);
  const [treatmentdata, settreatmentdata] = useState([]);
  const location = useLocation();
  const { data } = location.state || null;

  const apiURL = process.env.REACT_APP_API_URL;
  const imgURL = process.env.REACT_APP_IMAGE_API_URL;

  const [section2data, setsection2data] = useState([]);
  const [filtcdata, setfiltcdata] = useState([]);
  const [filsecdata, setsec2data] = useState([]);
  const [cgstRate, setCgstRate] = useState(2.5);
  const [sgstRate, setSgstRate] = useState(2.5);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [termsAndCondition, setTemsAndCondition] = useState([]);
  console.log(data);

  useEffect(() => {
    gettermsgroup();
    gettermsgroup2();
  }, []);

  const gettermsgroup = async () => {
    let res = await axios.get(apiURL + "/master/gettermgroup");
    if ((res.status = 200)) {
      settcdata(res.data?.termsgroup);
      const a = res.data?.termsgroup.filter((i) => i.type === "INVOICE");
      const filteredTcdata = a.filter(
        (item) => item.category === data?.category
      );
      setfiltcdata(filteredTcdata);
    }
  };
  const gettermsgroup2 = async () => {
    try {
      let res = await axios.get(apiURL + "/master/gettermgroup2");
      if (res.status === 200) {
        setTemsAndCondition(res.data?.termsgroup2);
        setsection2data(res.data?.termsgroup2);
        const a1 = res.data?.termsgroup2.filter((i) => i.type === "INVOICE"); // Corrected line
        const filteredsec2data = a1.filter(
          (item) => item.category === data.category
        );
        setsec2data(filteredsec2data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  console.log("termsAndCondition", termsAndCondition);
  let i = 1;

  useEffect(() => {
    getheaderimg();
    getfooterimg();
    getbank();
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

  useEffect(() => {
    const calculatedCgstAmount = (data?.serviceCharge * cgstRate) / 100;
    const calculatedSgstAmount = (data?.serviceCharge * sgstRate) / 100;
    setCgstAmount(calculatedCgstAmount);
    setSgstAmount(calculatedSgstAmount);
  }, [data?.serviceCharge, cgstRate, sgstRate]);
  return (
    <div className="row">
      {/* <Header /> */}

      <div className="row justify-content-center mt-3">
        <div className="col-md-11">
          <div
            className="card shadow  bg-white rounded"
            style={{ border: "none" }}
          >
            <div className="d-flex  mt-2 w-100">
              <div className="">
                {headerimgdata.map((item) => (
                  <img
                    src={imgURL + "/quotationheaderimg/" + item.headerimg}
                    height="120px"
                  />
                ))}
              </div>
              <div
                className=""
                style={{
                  justifyContent: "end",
                  textAlign: "end",
                  width: "100%",
                  marginRight: "10px",
                }}
              >
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
                <b> GSTIN :</b>
              </div>
              <div className="col-md-6 b-col" style={{ marginLeft: "9px" }}>
                <div className="" style={{ fontWeight: "bold" }}>
                  BILLED TO
                </div>

                <h5>{data?.customerData[0]?.customerName}</h5>
                <p className="mb-0">
                  {data?.customerData[0]?.lnf}
                  {data?.customerData[0]?.rbhf}
                  {data?.customerData[0]?.mainArea}
                  {data?.customerData[0]?.pinCode}
                </p>
                <p className="mb-0">{data?.customerData[0]?.mainContact}</p>
                <b> GSTIN :{data?.customerData[0]?.gst}</b>
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
                        {data.category}
                      </td>
                      <td scope="row" className="text-center">
                        {data.desc}
                      </td>

                      <td className="text-center">{data?.contractType}</td>
                      {data?.contractType === "AMC" ? (
                        <td>
                          {data.dividedDates.map((item) => (
                            <div>
                              <p className="text-center">
                                {new Date(item).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td>{data?.dateofService}</td>
                      )}

                      {data?.contractType === "AMC" ? (
                        <td>
                          {data.dividedamtDates.map((item) => (
                            <div>
                              <p className="text-end">
                                {new Date(item).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td>{data?.dateofService}</td>
                      )}

                      {data?.contractType === "AMC" ? (
                        <td>
                          {data.dividedamtCharges.map((item) => (
                            <div>
                              <p className="text-end">{item}</p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td>{data?.serviceCharge}</td>
                      )}
                    </tr>
                  </tbody>
                </table>

                <div
                  className="row col-12 "
                  style={{ justifyContent: "flex-end", marginTop: "10px" }}
                >
                  <div className="col-2">
                    <h5 style={{ textAlign: "right" }}> Taxable Amount :</h5>
                  </div>
                  <div className="col-1">
                    <h5>{data.serviceCharge - (sgstAmount + cgstAmount)}</h5>
                  </div>
                </div>

                <div
                  className="row col-12 "
                  style={{ justifyContent: "flex-end", marginTop: "10px" }}
                >
                  <div className="col-2">
                    <h5 style={{ textAlign: "right" }}> CGST(2.5%) :</h5>
                  </div>
                  <div className="col-1">
                    <h5>{cgstAmount}</h5>
                  </div>
                </div>
                <div
                  className="row col-12 "
                  style={{ justifyContent: "flex-end", marginTop: "10px" }}
                >
                  <div className="col-2">
                    <h5 style={{ textAlign: "right" }}> SGST(2.5%) :</h5>
                  </div>
                  <div className="col-1">
                    <h5>{sgstAmount}</h5>
                  </div>
                </div>
                <div
                  className="row col-12 "
                  style={{ justifyContent: "flex-end", marginTop: "10px" }}
                >
                  <div className="col-2">
                    <h5 style={{ textAlign: "right", fontWeight: "bold" }}>
                      {" "}
                      Total :
                    </h5>
                  </div>
                  <div className="col-1">
                    <h5>
                      <b> {data.serviceCharge}</b>
                    </h5>
                  </div>
                </div>

                {/* <div className="row m-auto mt-3 hclr">Terms & Condition</div> */}
              </div>
            </div>
            <div
              className="text-end px-2"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Amount In Words :{" "}
              <span style={{ fontWeight: 400, fontSize: "20px" }}>
                {numberToWords.toWords(data.serviceCharge) + " Only"}
              </span>
            </div>

            {/* <div className="p-3">
              <h3>Terms & Conditions</h3>
              <ul>
                <li>100% Payment Post Work Completion Immediately.</li>
                <li>In Cleaning Any Hard Stain Will Not Be Resolved 100%.</li>
                <li>
                  If Any Compliant On Service Quality, Customer Need To Notify
                  Within 24 Hours.
                </li>
                <li>
                  Customer Need To Verify The Work Before Service Team Leaves
                  The Premises.
                </li>
                <li>
                  For GPC Warranty Would Be 90 Days From The Date Of First
                  Service.
                </li>
                <li>
                  For BBMS Warranty Would Be 60 Days From The Date Of First
                  Service.
                </li>

                <li>
                  In Case Of Any Renovation Happened In The Premises Then The
                  Warranty Will Not Be Applicable.{" "}
                </li>
                <li>
                  Result Of Pest Control Service Is Based On Weather Variation,
                  House Maintenance And House Surrounding Environments.
                </li>
                <li>
                  This Is A Computer Generated Invoice, No Need Of Signature.
                </li>
              </ul>
            </div> */}
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
            {filtcdata.map((item) => (
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
                      {/* <td className="">{item.content}</td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div>
              {filsecdata.map((item) => (
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
                      <div className="mt-2">
                        <div
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                    </tbody>
                    <hr />
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Servicebill;
