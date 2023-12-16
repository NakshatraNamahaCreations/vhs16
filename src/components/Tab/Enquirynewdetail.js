import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { useNavigate, useParams } from "react-router-dom";
import Enquiryadd from "./Enquiryadd";
import Enquirysearch from "./Enquirysearch";
import Enquirynew from "./Enquirynew";
import Header from "../layout/Header";
import { Link, } from "react-router-dom";
import moment from "moment";
import axios from "axios";


function Enquirynewdetail() {
  const { EnquiryId } = useParams();

  const admin = JSON.parse(sessionStorage.getItem("admin"));

  const navigate = useNavigate();

  const [staffname, setstaffname] = useState("pankaj");
  const [folldate, setfolldate] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [desc, setdesc] = useState("");
  const [colorcode, setcolorcode] = useState("");
  const [nxtfoll, setnxtfoll] = useState("00/00/0000");
  const [value, setvalue] = useState("00.00");
  const [filterdata, setfilterdata] = useState([]);
  const [responsedata, setresponsedata] = useState([]);
  const [flwdata, setflwdata] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const getresponse = async () => {
      try {
        let res = await axios.get(apiURL + "/getresponse");
        if (res.status === 200) {
          setresponsedata(res.data?.response);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getresponse();
  }, []);

  useEffect(() => {
    const getenquiryadd = async () => {
      try {
        let res = await axios.get(apiURL + "/getenquiry");
        if ((res.status = 200)) {
          setfilterdata(
            res.data?.enquiryadd.filter((item) => item.EnquiryId == EnquiryId)
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getenquiryadd();
  }, []);

  useEffect(() => {
    const getenquiryfollowup = async () => {
      try {
        let res = await axios.get(apiURL + "/getenquiryfollowup");
        if ((res.status = 200)) {
          setflwdata(
            res.data?.enquiryfollowup.filter(
              (item) => item.EnquiryId == EnquiryId
            )
          );
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    getenquiryfollowup();
  }, []);

  let i = 1;

  // new and not interested
  const addenquiryfollowup1 = async (e) => {
    e.preventDefault();

    try {
      const config = {
        url: `/addenquiryfollowup`,
        method: "post",
        baseURL: apiURL,
        // data: formdata,
        headers: { "content-type": "application/json" },
        data: {
          EnquiryId: EnquiryId,
          staffname: admin.displayname,
          category: filterdata[0]?.category,
          folldate: moment().format("llll"),
          response: whatsappTemplate?.response,
          desc: desc,
          value: value,
          colorcode: colorcode,
          nxtfoll: nxtfoll,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          makeApiCall(whatsappTemplate, filterdata[0]?.contact1);

          // window.location.assign(`/enquirydetail/${EnquiryId}`);
        }
      });
    } catch (error) {
      console.error(error);
      alert(" Not Added");
    }
  };

  // call later
  const addcalllater = async (e) => {
    e.preventDefault();

    if (!desc || !whatsappTemplate || !nxtfoll || !colorcode) {
      alert("Fill all feilds");
    } else {
      try {
        const config = {
          url: `/addenquiryfollowup`,
          method: "post",
          baseURL: apiURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            EnquiryId: EnquiryId,
            staffname: admin.displayname,
            category: filterdata[0]?.category,
            folldate: moment().format("llll"),
            response: whatsappTemplate?.response,
            desc: desc,
            value: value,
            colorcode: colorcode,
            nxtfoll: nxtfoll,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            // console.log("success");
            alert(" Added");
            makeApiCall(whatsappTemplate, filterdata[0]?.contact1);

            window.location.assign(`/enquirydetail/${EnquiryId}`);
          }
        });
      } catch (error) {
        console.error(error);
        alert(" Not Added");
      }
    }
  };

  // survey
  const addsurvey = async (e) => {
    e.preventDefault();
    if (!desc || !nxtfoll) {
      alert("Fill all feilds");
    } else {
      try {
        const config = {
          url: `/addenquiryfollowup`,
          method: "post",
          baseURL: apiURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            EnquiryId: EnquiryId,
            staffname: admin.displayname,
            category: filterdata[0]?.category,
            folldate: moment().format("llll"),
            response: whatsappTemplate?.response,
            desc: desc,
            value: value,
            colorcode: colorcode,
            nxtfoll: nxtfoll,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            console.log("success");
            alert(" Added");
            makeApiCall(whatsappTemplate, filterdata[0]?.contact1);

            window.location.assign(`/enquirydetail/${EnquiryId}`);
          }
        });
      } catch (error) {
        console.error(error);
        alert("Not Added");
      }
    }
  };
  // confirm
  const postconvertcustomer = async (e) => {
    e.preventDefault();

    if (!desc || !value) {
      alert("fill all fields");
    } else {
      try {
        const config = {
          url: `/addenquiryfollowup`,
          method: "post",
          baseURL: apiURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            EnquiryId: EnquiryId,
            category: filterdata[0]?.category,
            staffname: admin.displayname,
            folldate: moment().format("llll"),
            response: whatsappTemplate?.response,
            desc: desc,
            value: value,
            nxtfoll: nxtfoll,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            makeApiCall(whatsappTemplate, filterdata[0]?.contact1);

            navigate(`/convertcustomer/${EnquiryId}`);
          }
        });
      } catch (error) {
        console.error(error);
        alert(" Not Added");
      }
    }
  };

  // Quote
  const postcreatequote = async (e) => {
    e.preventDefault();

    if (!desc || !nxtfoll) {
      alert("fill all fields");
    } else {
      try {
        const config = {
          url: `/addenquiryfollowup`,
          method: "post",
          baseURL: apiURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            EnquiryId: EnquiryId,
            category: filterdata[0]?.category,
            staffname: admin.displayname,
            folldate: moment().format("llll"),
            response: whatsappTemplate?.response,
            desc: desc,
            value: value,
            nxtfoll: nxtfoll,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            makeApiCall(whatsappTemplate, filterdata[0]?.contact1);

            navigate(`/createquote/${EnquiryId}`);
            // window.location.assign("/convertcustomer",{data});
          }
        });
      } catch (error) {
        console.error(error);
        alert(" Not Added");
      }
    }
  };

  const deleteenquiry = async () => {
    let Ask = window.confirm("Are you sure you want to delete this message?");
    // alert("Are you sure want delete")
    if (Ask === true) {
      axios({
        method: "post",
        url: apiURL + "/deleteteenquiry/" + filterdata[0]?._id,
      })
        .then(function (response) {
          //handle success
          console.log(response);
          window.alert("Deleted successfully");
          window.location.assign("/enquirynew");
        })
        .catch(function (error) {
          //handle error
          console.log(error.response.data);
        });
    } else {
      window.location.assign("/enquirynew");
    }
  };
  const editdetails = (data) => {
    navigate(`/editenquiry/${data}`);
  };
  const createQuote = (data) => {
    navigate(`/createquote/${data}`);
  };

  function getColor(colorcode) {
    if (colorcode === "easy") {
      return "#ffb9798f";
    } else if (colorcode === "medium") {
      return "#0080002e";
    } else if (colorcode === "different") {
      return '#ffb9798f"';
    } else {
      return "transparent";
    }
  }

  const makeApiCall = async (selectedResponse, contactNumber) => {
    const apiURL =
      "https://wa.chatmybot.in/gateway/waunofficial/v1/api/v2/message";
    const accessToken = "c7475f11-97cb-4d52-9500-f458c1a377f4";

    const contentTemplate = selectedResponse?.template || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      filterdata[0]?.name
    );
    const contentWithNames = content.replace(
      /\{Executive_name\}/g,
      filterdata[0]?.executive
    );
    const contentWithMobile = contentWithNames.replace(
      /\{Executive_contact\}/g,
      admin?.contactno
    );

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = contentWithMobile
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/<strong>(.*?)<\/strong>/g, "<b>$1</b>")
      .replace(/<[^>]*>/g, "");

    const requestData = [
      {
        dst: "91" + contactNumber,
        messageType: "0",
        textMessage: {
          content: convertedText,
        },
      },
    ];
    try {
      const response = await axios.post(apiURL, requestData, {
        headers: {
          "access-token": accessToken,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setWhatsappTemplate(response.data);
        alert("Sent");
      } else {
        console.error("API call unsuccessful. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  return (
    <div className="row">
      <Header />

      <div className="row m-auto">
        <div className="col-md-12">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={12}>
                <Nav variant="pills" className="flex-row">
                  <Nav.Item>
                    <Nav.Link eventKey="">
                      <Link to="/enquiryadd"> Enquiry Add</Link>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      <Link to="/enquirynew">Enquiry New</Link>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">
                      <Link to="/new">New</Link>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">
                      <Link to="/enquirysearch">Enquiry Search</Link>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="first"></Tab.Pane>
                  <Tab.Pane eventKey="second"></Tab.Pane>
                  <Tab.Pane eventKey="third"></Tab.Pane>
                  <Tab.Pane eventKey="fourth"></Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>

      <div className="row m-auto">
        <div className="col-md-12">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="row mt-3">
                          <div className="col-md-5">
                            <div className="vhs-sub-heading">
                              Enquiry Detail
                            </div>
                            <div className="mt-1">
                              <div
                                className="row m-auto"
                                style={{
                                  backgroundColor: "#e2e3e5",
                                  padding: "8px",
                                }}
                              >
                                <div
                                  className="text-center "
                                  style={{ color: "black" }}
                                >
                                  <span onClick={() => editdetails(EnquiryId)}>
                                    Modify
                                  </span>
                                  |<Link onClick={deleteenquiry}>Delete </Link>
                                  {/* <span onClick={() => createQuote(EnquiryId)}>
                                    Create Quote
                                  </span> */}
                                </div>
                              </div>
                              <table class="table table-hover table-bordered">
                                <tbody>
                                  <tr className="user-tbale-body">
                                    <td className="text-center">Enquiry ID</td>
                                    <td>{filterdata[0]?.EnquiryId}</td>
                                  </tr>
                                  <tr className="user-tbale-body">
                                    <td className="text-center">Category</td>
                                    <td> {filterdata[0]?.category}</td>
                                  </tr>
                                  <tr className="user-tbale-body">
                                    <td className="text-center">
                                      Enquiry Date
                                    </td>
                                    <td> {filterdata[0]?.enquirydate}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Executive</td>
                                    <td>{filterdata[0]?.executive}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Name</td>
                                    <td>{filterdata[0]?.name}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Contact 1</td>
                                    <td>
                                      {filterdata[0]?.contact1} {""}{" "}
                                      <a
                                        href={`https://wa.me/+91${filterdata[0]?.contact1}`}
                                        target="_blank"
                                      >
                                        <i
                                          class="fa-brands fa-whatsapp"
                                          style={{
                                            fontSize: "25px",
                                            color: "green",
                                          }}
                                        ></i>
                                      </a>
                                    </td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Contact 2</td>
                                    <td>{filterdata[0]?.contact2} </td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Email Id</td>
                                    <td>{filterdata[0]?.email}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Address</td>
                                    <td>{filterdata[0]?.address}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Reference</td>
                                    <td>{filterdata[0]?.reference1}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">Reference 2</td>
                                    <td>{filterdata[0]?.reference2}</td>
                                  </tr>

                                  <tr className="user-tbale-body">
                                    <td className="text-center">
                                      Interested For
                                    </td>
                                    <td>{filterdata[0]?.intrestedfor}</td>
                                  </tr>
                                  <tr className="user-tbale-body">
                                    <td className="text-center">Comment</td>
                                    <td>{filterdata[0]?.comment}</td>
                                  </tr>
                                </tbody>
                              </table>{" "}
                              <div
                                className="row"
                                style={{
                                  backgroundColor: "#e2e3e5",
                                  padding: "8px",
                                  marginTop: "-17px",
                                  marginLeft: "0px",
                                  marginRight: "0px",
                                }}
                              >
                                <div className="text-center"></div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-7">
                            <div className="vhs-sub-heading">
                              Follow-Up Detail
                            </div>
                            <table class=" mt-1">
                              <thead className="">
                                <tr className="bg">
                                  <th className="bor" scope="col">
                                    Sr
                                  </th>
                                  <th className="bor" scope="col">
                                    Date
                                  </th>
                                  <th className="bor" scope="col">
                                    Staff
                                  </th>
                                  <th className="bor" scope="col">
                                    Response
                                  </th>
                                  <th className="bor" scope="col">
                                    Description
                                  </th>
                                  <th className="bor" scope="col">
                                    Value
                                  </th>
                                  <th className="bor" scope="col">
                                    Next Foll.
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {flwdata?.map((item) => (
                                  <tr
                                    key={item.id}
                                    className="user-tbale-body tbl1"
                                    style={{
                                      backgroundColor: getColor(item.colorcode),
                                      color: "black",
                                    }}
                                  >
                                    <td>{i++}</td>
                                    <td>{item?.folldate}</td>
                                    <td>{item?.staffname}</td>
                                    <td>{item?.response}</td>
                                    <td>{item?.desc}</td>
                                    <td>{item?.value}</td>
                                    <td>{item?.nxtfoll}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="card" style={{ marginTop: "20px" }}>
                              <div className="card-body p-4">
                                <form>
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="vhs-input-label">
                                        Staff Name
                                      </div>
                                      <div className="group pt-1 vhs-non-editable">
                                        {admin.displayname}
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="vhs-input-label">
                                        Foll. Date
                                      </div>
                                      <div className="group pt-1 vhs-non-editable">
                                        <p style={{ fontSize: "12px" }}>
                                          {moment().format("llll")}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="vhs-input-label">
                                        Response
                                        <span className="text-danger">*</span>
                                      </div>
                                      <div className="group pt-1">
                                        <select
                                          className="col-md-12 vhs-input-value"
                                          onChange={(e) => {
                                            const selectedResponse =
                                              responsedata?.find(
                                                (item) =>
                                                  item?.response ===
                                                  e.target.value
                                              );
                                           
                                            setWhatsappTemplate(
                                              selectedResponse
                                            );
                                          }}
                                        >
                                          <option>--select--</option>
                                          {responsedata?.map((i) => (
                                            <option value={i?.response}>
                                              {i.response}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row pt-3">
                                    <div className="col-md-4">
                                      <div className="vhs-input-label">
                                        Description
                                        <span className="text-danger"> *</span>
                                      </div>
                                      <div className="group pt-1">
                                        <textarea
                                          rows={20}
                                          cols={20}
                                          className="col-md-12 vhs-input-value"
                                          onChange={(e) =>
                                            setdesc(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {whatsappTemplate &&
                                  whatsappTemplate?.response === "New" ? (
                                    <>
                                      <div className="row pt-3">
                                        <div className="col-md-4"></div>
                                        <div className="col-md-2">
                                          <button
                                            className="vhs-button mx-5"
                                            onClick={addenquiryfollowup1}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {whatsappTemplate &&
                                  whatsappTemplate.response ===
                                    "Not Interested" ? (
                                    <>
                                      <div className="row pt-3">
                                        <div className="col-md-4"></div>
                                        <div className="col-md-2">
                                          <button
                                            className="vhs-button mx-5"
                                            onClick={addenquiryfollowup1}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {whatsappTemplate &&
                                  whatsappTemplate.response === "Quote" ? (
                                    <>
                                      <div className="col-md-4">
                                        <div className="vhs-input-label">
                                          color code
                                          <span className="text-danger">*</span>
                                        </div>
                                        <div className="group pt-1">
                                          <select
                                            className="col-md-12 vhs-input-value"
                                            onChange={(e) =>
                                              setcolorcode(e.target.value)
                                            }
                                          >
                                            <option>--select--</option>
                                            <option value="easy">Easy</option>
                                            <option value="medium">
                                              Medium
                                            </option>
                                            <option value="different">
                                              Different
                                            </option>
                                          </select>
                                        </div>

                                        <div className="col-md-12 mt-2">
                                          <div className="vhs-input-label">
                                            Nxt Foll date
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </div>
                                          <div className="group pt-1">
                                            <input
                                              type="date"
                                              className="col-md-12 vhs-input-value"
                                              onChange={(e) =>
                                                setnxtfoll(e.target.value)
                                              }
                                              placeholder={moment().format("L")}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row pt-3">
                                        <div className="col-md-4"></div>
                                        <div className="col-md-5">
                                          <button
                                            className="vhs-button mx-5"
                                            onClick={postcreatequote}
                                          >
                                            Create Quote
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {whatsappTemplate &&
                                  whatsappTemplate.response === "Survey" ? (
                                    <>
                                      <div className="row pt-3">
                                        <div className="col-md-4">
                                          <div className="vhs-input-label">
                                            Nxt Foll date
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </div>
                                          <div className="group pt-1">
                                            <input
                                              type="date"
                                              className="col-md-12 vhs-input-value"
                                              onChange={(e) =>
                                                setnxtfoll(e.target.value)
                                              }
                                              placeholder={moment().format("L")}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-2">
                                          <button
                                            className="vhs-button mx-5"
                                            onClick={addsurvey}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {whatsappTemplate &&
                                  whatsappTemplate.response === "Call Later" ? (
                                    <>
                                      {" "}
                                      <div className="row pt-3">
                                        <div className="col-md-4">
                                          <div className="vhs-input-label">
                                            color code
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </div>
                                          <div className="group pt-1">
                                            <select
                                              className="col-md-12 vhs-input-value"
                                              onChange={(e) =>
                                                setcolorcode(e.target.value)
                                              }
                                            >
                                              <option>--select--</option>
                                              <option value="easy">Easy</option>
                                              <option value="medium">
                                                Medium
                                              </option>
                                              <option value="different">
                                                Different
                                              </option>
                                            </select>
                                          </div>

                                          <div className="col-md-12 mt-2">
                                            <div className="vhs-input-label">
                                              Nxt Foll date
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </div>
                                            <div className="group pt-1">
                                              <input
                                                type="date"
                                                className="col-md-12 vhs-input-value"
                                                onChange={(e) =>
                                                  setnxtfoll(e.target.value)
                                                }
                                                placeholder={moment().format(
                                                  "L"
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-2">
                                          <button
                                            className="vhs-button mx-5"
                                            onClick={addcalllater}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {whatsappTemplate &&
                                  whatsappTemplate.response === "Confirmed" ? (
                                    <div className="col-md-12 mt-2">
                                      <div className="vhs-input-label">
                                        Value
                                        <span className="text-danger">*</span>
                                      </div>
                                      <div className="group pt-1">
                                        <input
                                          type="text"
                                          className="col-md-4 vhs-input-value"
                                          onChange={(e) =>
                                            setvalue(e.target.value)
                                          }
                                        />
                                      </div>

                                      <div className="col-md-1 mt-2">
                                        <button
                                          className="vhs-button mx-5"
                                          style={{ width: "150px" }}
                                          onClick={postconvertcustomer}
                                        >
                                          Convert to Customer{" "}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-md-2">
                                     
                                    </div>
                                  )}
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>

                       
                      </div>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="second">
                    <Enquiryadd />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Enquirynew />
                  </Tab.Pane>
                  <Tab.Pane eventKey="four">
                    <Enquirysearch />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}

export default Enquirynewdetail;
