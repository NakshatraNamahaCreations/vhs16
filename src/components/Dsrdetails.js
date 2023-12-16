import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import DSRnav from "../components/DSRnav";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function Dsrdetails() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const location = useLocation();
  const { data, data1, TTname } = location.state || {};

  const id = data?._id;
  const [dsrdata, setdsrdata] = useState([]);
  const [dsrloader, setdsrloader] = useState(true);
  const [newcity, setnewcity] = useState(data?.city);
  const [techniciandata, settechniciandata] = useState([]);
  const [PMdata, setPMdata] = useState([]);
  const [vddata, setvddata] = useState([]);
  const [Reason, setReason] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;
  const [bookingDate, setbookingDate] = useState(data.bookingDate);
  const [jobCategory, setjobCategory] = useState(data.jobCategory);
  const [priorityLevel, setpriorityLevel] = useState(
    data.dsrdata[0]?.priorityLevel
  );
  const [appoDate, setappoDate] = useState(dsrdata[0]?.appoDate);
  const [appoTime, setappoTime] = useState(dsrdata[0]?.appoTime);
  const [customerFeedback, setcustomerFeedback] = useState(
    dsrdata[0]?.customerFeedback
  );
  const [jobType, setjobType] = useState(data.jobType);
  const [techComment, settechComment] = useState(dsrdata[0]?.techComment);
  const [techName, settechName] = useState(dsrdata[0]?.techName);
  const [complaintRef, setcomplaintRefo] = useState([]);
  const [vendordata, setvendordata] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const [Showinapp, setShowinapp] = useState(
    data.dsrdata[0]?.showinApp || "YES"
  );

  const [sendSms, setsendSms] = useState(dsrdata[0]?.sendSms);
  const [workerAmount, setworkerAmount] = useState(dsrdata[0]?.workerAmount);
  const [workerName, setworkerName] = useState(dsrdata[0]?.workerName);
  const [daytoComplete, setdaytoComplete] = useState(
    dsrdata[0]?.daytoComplete || ""
  );

  let defaultChecked1 = "NO";
  if (data?.dsrdata.length > 0) {
    defaultChecked1 = data.dsrdata.find((item) => item.serviceDate === data1)
      ? data.dsrdata.find((item) => item.serviceDate === data1).jobComplete
      : "";
  }

  const [jobComplete, setjobComplete] = useState(defaultChecked1);

  // Initialize the type state based on the initialType value
  let defaultChecked = "";
  if (data?.dsrdata.length > 0) {
    defaultChecked = data.dsrdata.find((item) => item.serviceDate === data1)
      ? data.dsrdata.find((item) => item.serviceDate === data1).type
      : "";
  }

  const [type, settype] = useState(defaultChecked);
  // const [type, settype] = useState(vddata.length > 0 ? vddata[0]?.Type : "");

  const [selectedTechName, setSelectedTechName] = useState(
    data.dsrdata.find((dsrItem) => dsrItem.serviceDate === data1)
      ? data.dsrdata.find((itemAmount) => itemAmount.serviceDate === data1)
          .TechorPMorVendorName
      : ""
  );

  const [selectedTechId, setSelectedTechId] = useState("");

  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [whatsappdata, setwhatsappdata] = useState([]);

  useEffect(() => {
    gettechnician();

    getServiceManagement();
  }, []);

  const gettechnician = async () => {
    let res = await axios.get(apiURL + "/getalltechnician");
    if ((res.status = 200)) {
      const TDdata = res.data?.technician;
      const filteredTechnicians = TDdata.filter((technician) => {
        return technician.category.some((cat) => cat.name === data?.category);
      });
      settechniciandata(
        filteredTechnicians.filter(
          (i) => i.city === data?.city && i.Type === "technician"
        )
      );
      setPMdata(
        filteredTechnicians.filter(
          (i) => i.city === data?.city && i.Type === "pm"
        )
      );
      setvendordata(
        filteredTechnicians.filter(
          (i) => i.city === data?.city && i.Type === "Vendor"
        )
      );
      setvddata(
        filteredTechnicians.filter(
          (i) => i._id == dsrdata[0]?.TechorPMorVenodrID
        )
      );
    }
  };

  useEffect(() => {
    getnameof();
  }, [dsrdata]);

  const [slotesdata, setslotesdata] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(
    data?.selectedSlotText || ""
  );

  useEffect(() => {
    getslots();
  }, []);

  const getslots = async () => {
    let res = await axios.get(
      "https://api.vijayhomeservicebengaluru.in/api/userapp/getslots"
    );
    if ((res.status = 200)) {
      setslotesdata(res.data?.slots);
    }
  };

  const getnameof = async () => {
    let res = await axios.get(apiURL + "/getalltechnician");
    if ((res.status = 200)) {
      const TDdata = res.data?.technician;
      const filteredTechnicians = TDdata.filter((technician) => {
        return technician.category.some(
          (cat) => cat.name === data.customerData[0].category
        );
      });

      setvddata(
        filteredTechnicians.filter(
          (i) => i._id == dsrdata[0]?.TechorPMorVenodrID
        )
      );
    }
  };

  const handleChange1 = (event) => {
    setjobComplete(event.target.value);
  };
  const handleChange2 = (event) => {
    // console.log("Radio button changed:", event.target.value);
    settype(event.target.value);
  };

  const handleTechNameChange = (event) => {
    const selectedTech = techniciandata.find(
      (item) => item._id === event.target.value
    );

    setSelectedTechId(event.target.value);

    if (type === "technician") {
      setSelectedTechName(selectedTech ? selectedTech.vhsname : "");
    } else if (type === "PM") {
      const selectedPM = PMdata.find((item) => item._id === event.target.value);
      setSelectedTechName(selectedPM ? selectedPM.vhsname : "");
    } else if (type === "Vendor") {
      const selectedVendor = vendordata.find(
        (item) => item._id === event.target.value
      );
      setSelectedTechName(selectedVendor ? selectedVendor.vhsname : "");
    }
  };
  const [SV, setSV] = useState(false);
  const [loading, setLoading] = useState(false);
  const checking = () => {
    if (jobComplete === "CANCEL") {
      setSV(true);
      setShow(true);
    } else {
      newdata();
    }
  };

  const newdata = async () => {
    // e.preventDefault();
    setSV(true);
    setLoading(true);
    try {
      const config = {
        url: "/adddsrcall",
        method: "post",
        baseURL: apiURL,
        // data: formdata,
        headers: { "content-type": "application/json" },
        data: {
          serviceDate: data1,
          serviceInfo: {
            _id: data._id,
            customerData: data.customerData,
            dCategory: data.dCategory,
            cardNo: data.cardNo,
            contractType: data.contractType,
            service: data.service,
            planName: data.planName,
            slots: data.slots,
            serviceId: data.serviceId,
            serviceCharge: data.serviceCharge,
            serviceDate: data.serviceDate,
            desc: data.desc,

            category: data.category,
            expiryDate: data.expiryDate,

            dividedDates: data.dividedDates,
            dividedCharges: data.dividedCharges,
            dividedamtDates: data.dividedamtDates,
            dividedamtCharges: data.dividedamtCharges,
            oneCommunity: data.oneCommunity,
            communityId: data.communityId,
            BackofficeExecutive: data.BackofficeExecutive,
            deliveryAddress: data.deliveryAddress,
            type: data.type,
            userId: data.userId,
            selectedSlotText: data.selectedSlotText,
            AddOns: data.AddOns,
            TotalAmt: data.TotalAmt,
            GrandTotal: data.GrandTotal,

            city: data.city,
          },
          serviceId: data?._id,
          cardNo: data.cardNo,
          category: data.category,
          bookingDate: moment().format("DD-MM-YYYY"),
          priorityLevel: priorityLevel,
          appoDate: data1,
          appoTime: appoTime,
          customerFeedback: customerFeedback,
          techComment: techComment,
          workerName: workerName,
          workerAmount: workerAmount,
          daytoComplete: daytoComplete,
          backofficerno: admin.contactno,
          techName: techName,
          TechorPMorVendorID: selectedTechId,
          TechorPMorVendorName: selectedTechName,
          showinApp: Showinapp,
          sendSms: sendSms,
          jobType: jobType,
          type: type,
          jobComplete: jobComplete,
          amount: data.serviceCharge,
          cancelOfficerName: admin.displayname,
          cancelOfferNumber: admin.contactno,
          reason: Reason,
          techName: techName,
          cancelDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          console.log("success");
          alert(" Added");
          setLoading(false);
          setSV(false);
          window.location.assign(`/dsrcallist/${data1}/${data.category}`);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSV(false);
      alert(" Not Added");
    }
  };

  // 16-9
  const Update = async (e) => {
    e.preventDefault();

    try {
      const config = {
        url: `/updatedsrdata/${dsrdata[0]?._id}`,
        method: "post",
        baseURL: apiURL,
        // data: formdata,
        headers: { "content-type": "application/json" },
        data: {
          bookingDate: bookingDate,
          serviceInfo: {
            _id: data._id,
            customerData: data.customerData,
            dCategory: data.dCategory,
            cardNo: data.cardNo,
            contractType: data.contractType,
            service: data.service,
            planName: data.planName,
            slots: data.slots,
            serviceId: data.serviceId,
            serviceCharge: data.serviceCharge,
            serviceDate: data.serviceDate,
            desc: data.desc,

            category: data.category,
            expiryDate: data.expiryDate,

            dividedDates: data.dividedDates,
            dividedCharges: data.dividedCharges,
            dividedamtDates: data.dividedamtDates,
            dividedamtCharges: data.dividedamtCharges,
            oneCommunity: data.oneCommunity,
            communityId: data.communityId,
            BackofficeExecutive: data.BackofficeExecutive,
            deliveryAddress: data.deliveryAddress,
            type: data.type,
            userId: data.userId,
            selectedSlotText: data.selectedSlotText,
            AddOns: data.AddOns,
            TotalAmt: data.TotalAmt,
            GrandTotal: data.GrandTotal,

            city: data.city,
          },
          jobCategory: jobCategory,
          complaintRef: data.complaintRef,
          priorityLevel: priorityLevel,
          appoDate: data1,
          appoTime: appoTime,
          customerFeedback: customerFeedback,
          jobType: jobType,
          techComment: techComment,
          backofficerExe: admin.displayname,
          backofficerno: admin.contactno,
          techName: techName,
          showinApp: Showinapp,
          sendSms: sendSms,
          type: type,
          jobComplete: jobComplete,
          workerAmount: workerAmount,
          workerName: workerName,
          daytoComplete: daytoComplete,
          TechorPMorVendorID: selectedTechId
            ? selectedTechId
            : dsrdata[0]?.selectedTechId,
          TechorPMorVendorName: selectedTechName,
          cancelOfficerName: admin.displayname,
          cancelOfferNumber: admin.contactno,
          reason: Reason,
          techName: techName,
          cancelDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          setShow(false);

          window.location.assign(`/dsrcallist/${data1}/${data.category}`);
        }
      });
    } catch (error) {
      console.error(error);
      alert("Somthing went wrong");
    }
  };

  const getServiceManagement = async () => {
    let res = await axios.get(apiURL + "/userapp/getservices");
    if (res.status === 200) {
      setServiceData(
        res.data?.service.filter((i) => i.serviceName === data?.service)
      );
      // console.log(res.data?.service);
    }
  };

  useEffect(() => {
    getreschdatauser();
  }, []);

  const [reshduleData, setreshduleData] = useState([]);
  const getreschdatauser = async () => {
    let res = await axios.get(apiURL + `/filterwithserviceId/${data?._id}`);
    if (res.status === 200) {
      setreshduleData(res.data?.recheduledata);

      // console.log(res.data?.service);
    }
  };

  const customerCity = data.city;

  const filteredSlots = serviceData[0]?.store_slots.filter(
    (slot) => slot.slotCity === customerCity
  );

  // console.log("getCitySlots", filteredSlots);
  const dateToMatch = new Date(data1);
  const matchingData = [];

  let charge = 0;
  data.dividedamtDates.forEach((dateObj, index) => {
    const dividedDate = new Date(dateObj.date);
    if (dividedDate.getDate() === dateToMatch.getDate()) {
      matchingData.push({
        date: dateObj.date,
        charge: data.dividedamtCharges[index].charge,
      });
    }
  });

  useEffect(() => {
    getAlldata();
  }, [data]);

  const getAlldata = async () => {
    try {
      const res = await axios.get(
        apiURL + `/filteredserviceIDanddate/${data1}/${data?._id}`
      );

      if (res.status === 200) {
        setdsrdata(res.data.filterwithservicedata);
        setdsrloader(false);
      } else {
        setdsrdata([]);
        setdsrloader(false);
      }
    } catch (error) {
      setdsrloader(false);
      // Handle error
    }
  };

  const isoToFormattedDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    if (isNaN(date)) {
      return "0000-00-00 00:00:00";
    }
    return date.toLocaleDateString("en-US", options);
    // return date.toLocaleDateString("en-US", options);
  };

  const updatedStartTime = isoToFormattedDate(data.dsrdata[0]?.startJobTime);
  const updatedEndTime = isoToFormattedDate(data.dsrdata[0]?.endJobTime);

  const renderStartDate = updatedStartTime || "0000-00-00 00:00:00";
  const renderEndDate = updatedEndTime || "0000-00-00 00:00:00";

  // console.log("Formatted Start Date:", renderStartDate);
  // console.log("Formatted End Date:", renderEndDate);

  let i = 1;
  const dataByCity = {};

  useEffect(() => {
    getwhatsapptemplate();
  }, []);

  const getwhatsapptemplate = async () => {
    try {
      let res = await axios.get(apiURL + "/getwhatsapptemplate");
      if (res.status === 200) {
        // console.log("whatsapp template", res.data);
        let getTemplateDatails = res.data?.whatsapptemplate?.filter(
          (item) => item.templatename === "Send Invoice Link"
        );
        setwhatsappdata(getTemplateDatails);
      }
    } catch (error) {
      console.error("err", error);
    }
  };

  const GoToInvoice = () => {
    if (whatsappdata.length > 0) {
      const selectedResponse = whatsappdata[0];
      const invoiceLink = `dsr invoice bill?id=${id}`;
      makeApiCall(
        selectedResponse,
        data.customerData[0]?.mainContact,
        invoiceLink
      );
    } else {
      console.error("whatsappdata is empty. Cannot proceed.");
      alert("Not Added");
    }
    // Navigate(`/dsrquote/${data}`);
  };

  // const invoiceURL = Navigate(`dsr invoice bill?id=${id}`);

  const makeApiCall = async (selectedResponse, contactNumber, invoiceId) => {
    const apiURL =
      "https://wa.chatmybot.in/gateway/waunofficial/v1/api/v2/message";
    const accessToken = "c7475f11-97cb-4d52-9500-f458c1a377f4";

    const contentTemplate = selectedResponse?.template || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }
    console.log("91" + data.customerData[0]?.mainContact);
    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      data.customerData[0]?.customerName
    );
    const serviceName = content.replace(/\{Service_name\}/g, data.service);
    const serivePrice = serviceName.replace(
      /\{Service_amount\}/g,
      data.serviceCharge
    );

    const invoiceUrl = `https://vijayhomeservicebengaluru.in/dsr_invoice_bill?id=${id}`;

    console.log("invoiceUrl", invoiceUrl);
    const invoiceLink = serivePrice.replace(
      /\{Invoice_link\}/g,
      `[Click to view invoice](${invoiceUrl})`
    );
    const plainTextContent = stripHtml(invoiceLink);

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = invoiceLink
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

  function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent || "";
    return plainText.replace(/\r?\n/g, " ");
  }

  const date = new Date(data?.createdAt);

  // Get the individual components of the date and time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Create a formatted date and time string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const date1 = new Date(dsrdata[0]?.updatedAt);

  // Get the individual components of the date and time
  const year1 = date1.getFullYear();
  const month1 = String(date1.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day1 = String(date1.getDate()).padStart(2, "0");
  const hours1 = String(date1.getHours()).padStart(2, "0");
  const minutes1 = String(date1.getMinutes()).padStart(2, "0");
  const seconds1 = String(date1.getSeconds()).padStart(2, "0");

  // Create a formatted date and time string
  const formattedDateTime1 = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}`;

  const [reasonforresh, setreasonforresh] = useState("");

  const recheduledate = async (id) => {
    if (!reasonforresh) {
      alert("Please enter a reason");
    } else {
      try {
        const config = {
          url: `/recheduledate/${data?._id}`,
          method: "post",
          baseURL: apiURL,
          headers: { "content-type": "application/json" },
          data: {
            appoDate: appoDate,
            appoTime: appoTime,
            ResheduleUser: admin.displayname,
            ResheduleUsernumber: admin.contactno,
            reason: reasonforresh,
            newappoDate: data1,
            resDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
          },
        };

        const response = await axios(config);

        if (response.status === 200) {
          setShow1(false);
          alert("Updated");
          window.location.assign(`/dsrcallist/${data1}/${data.category}`);
        }
      } catch (error) {
        if (error.response) {
          alert(`Server error: ${error.response.data.message}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          alert("No response from the server");
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error", error.message);
          alert("Something went wrong");
        }
      }
    }
  };
  const [citydata, setcitydata] = useState([]);

  useEffect(() => {
    getcity();
  }, []);

  const getcity = async () => {
    let res = await axios.get(apiURL + "/master/getcity");
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };

  const editservicedetails = async (e) => {
    e.preventDefault();
    try {
      const config = {
        url: `/changeappotime/${data._id}/${dsrdata[0]?._id}`,
        method: "post",
        baseURL: apiURL,
        headers: { "content-type": "application/json" },
        data: {
          selectedSlotText: selectedSlot,

          city: newcity,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Successfully Added");
          window.location.assign(`/dsrcallist/${data1}/${data.category}`);
        }
      });
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="web">
      <Header />
      <DSRnav />

      <div className="row m-auto ">
        <div className="col-md-12">
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-body p-4">
              <h5>Job Information</h5>
              <hr />

              <div className="row pt-3">
                <div className="col-md-4">
                  <div className="vhs-input-label">Booking Date & Time</div>
                  <div className="group pt-1">
                    <input
                      type="text"
                      className="col-md-12 vhs-input-value"
                      defaultValue={formattedDateTime}
                      onChange={(e) => setbookingDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">Priority Level</div>
                  <div className="group pt-1">
                    <select
                      className="col-md-12 vhs-input-value"
                      onChange={(e) => setpriorityLevel(e.target.value)}
                    >
                      {data.dsrdata[0]?.priorityLevel ? (
                        <option>{data.dsrdata[0]?.priorityLevel}</option>
                      ) : (
                        <option>--select--</option>
                      )}
                      <option>High</option>
                      <option>Low</option>
                      <option>Normal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-md-4">
                  <div className="vhs-input-label">Appointment Date</div>
                  <div className="group pt-1">
                    <input
                      type="date"
                      className="col-md-12 vhs-input-value"
                      defaultValue={data1}
                      onChange={(e) => setappoDate(e.target.value)}
                      min={today}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="vhs-input-label">Appointment Time</div>
                  <div className="group pt-1">
                    <select
                      className="col-md-12 vhs-input-value"
                      onChange={(e) => {
                        setSelectedSlot(e.target.value);

                        const selectedSlotData = slotesdata.filter(
                          (slot) => slot.startTime === e.target.value
                        );
                      }}
                      value={selectedSlot}
                    >
                      {filteredSlots && filteredSlots.length > 0 ? (
                        <>
                          <option value={data?.selectedSlotText}>
                            {data?.selectedSlotText}
                          </option>
                          {filteredSlots?.map((slot, index) => (
                            <option key={index} value={`${slot.startTime}`}>
                              {`${slot.startTime} `}
                            </option>
                          ))}
                        </>
                      ) : (
                        slotesdata?.map((slot, index) => (
                          <option key={index} value={`${slot.startTime}`}>
                            {`${slot.startTime} `}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">City</div>
                  <div className="group pt-1">
                    <select
                      className="col-md-12 vhs-input-value"
                      onChange={(e) => setnewcity(e.target.value)}
                      defaultValue={data.city}
                    >
                      <option>{data.city}</option>
                      {citydata?.map((data, index) => (
                        <option key={index} value={data.city}>
                          {data.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-md-4">
                  {dsrdata[0]?.jobComplete === "NO" ||
                  dsrdata[0]?.jobComplete === undefined ||
                  dsrdata[0]?.jobComplete === null ? (
                    <>
                      <button onClick={() => setShow1(true)}>
                        Reschedule date
                      </button>
                      {reshduleData ? (
                        reshduleData.map((item) => (
                          <div>
                            <p style={{ color: "orange" }}>
                              Rescheduled this services
                            </p>
                            <div style={{ fontWeight: "bold" }}>
                              OPM Details
                            </div>
                            <p style={{ marginBottom: 0 }}>{item.name}</p>
                            <p style={{ marginBottom: 0 }}>{item.number}</p>
                            <p style={{ marginBottom: 0 }}>{item.reason}</p>
                            <p>
                              {moment(item.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </p>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-md-4">
                  <button
                    onClick={editservicedetails}
                    style={{ width: "150px" }}
                  >
                    Update Appo/City
                  </button>
                </div>
              </div>
              <h5 className="mt-3">Customer Information</h5>
              <hr />

              <div className="row pt-3 ">
                <div className="col-md-4">
                  <div className="vhs-input-label">Customer Name</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.customerName}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">Card No</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.cardNo}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">Contact 1</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.mainContact}{" "}
                      <a
                        href={`https://wa.me/+91${data.customerData[0]?.mainContact}`}
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-md-4">
                  <div className="vhs-input-label"> Contact 2</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.alternateContact}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">Address</div>
                  <div className="group pt-1">
                    <div
                      className="vhs-non-editable"
                      style={{ height: "fit-content" }}
                    >
                      {data.deliveryAddress === null ||
                      data.deliveryAddress === undefined ? (
                        <>
                          {data.customerData[0]?.cnap},
                          {data.customerData[0]?.rbhf},
                          {data.customerData[0]?.lnf}
                        </>
                      ) : (
                        <>
                          {data.deliveryAddress?.platNo},
                          {data.deliveryAddress?.landmark},
                          {data.deliveryAddress?.address}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label"> Email Id</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-md-4">
                  <div className="vhs-input-label">City</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.city === null ||
                      data.customerData[0]?.city === undefined ? (
                        <>{data.customerData[0]?.city}</>
                      ) : (
                        <>{data.city}</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="vhs-input-label">Customer Type</div>
                  <div className="group pt-1">
                    <div className="vhs-non-editable">
                      {data.customerData[0]?.customerType
                        ? data.customerData[0]?.customerType
                        : data?.type}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h6>Treatment Details</h6>
                <table class="table table-hover table-bordered mt-1">
                  <thead className="">
                    <tr className="table-secondary">
                      <th className="table-head" scope="col">
                        Sr
                      </th>
                      <th className="table-head" scope="col">
                        Category
                      </th>
                      <th className="table-head" scope="col">
                        Cont.Type
                      </th>
                      <th className="table-head" scope="col">
                        Treatment
                      </th>
                      <th className="table-head" scope="col">
                        Service Freq.
                      </th>
                      <th className="table-head" scope="col">
                        Contract Period
                      </th>
                      <th className="table-head" scope="col">
                        Service Date
                      </th>
                      <th className="table-head" scope="col">
                        Payment Date
                      </th>
                      <th className="table-head" scope="col">
                        Description
                      </th>
                      <th className="table-head" scope="col">
                        Charges
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i++}</td>
                      <td>{data?.category}</td>
                      <td>{data?.contractType}</td>
                      <td>{data?.service}</td>
                      <td>{data?.serviceFrequency}</td>

                      <td>
                        {data?.dateofService}/{data?.expiryDate}
                      </td>
                      <td>{data1}</td>
                      <td>
                        {data.contractType === "AMC" ? (
                          <>
                            {" "}
                            {matchingData.length > 0
                              ? moment(matchingData[0]?.date).format(
                                  "DD/MM/YYYY"
                                )
                              : ""}
                          </>
                        ) : (
                          <> {data.dateofService}</>
                        )}
                      </td>
                      <td>{data?.desc}</td>

                      <td>
                        {data.type === "userapp" ? (
                          <>{data.GrandTotal}</>
                        ) : (
                          <>
                            {matchingData?.length > 0
                              ? matchingData[0]?.charge
                              : ""}
                          </>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <h5 className="mt-5">Service & Repair Information</h5>
        <hr />

        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Customer Feedback</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <textarea
                  name="postContent"
                  rows={5}
                  cols={20}
                  className="col-md-12 vhs-input-label"
                  onChange={(e) => setcustomerFeedback(e.target.value)}
                  defaultValue={dsrdata[0]?.customerFeedback}
                />
              </div>
            </div>

            <div className="col-6 d-flex">
              <div className="col-4">Technician Comment </div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <textarea
                  name="postContent"
                  rows={2}
                  cols={40}
                  className="col-md-12 vhs-input-label"
                  defaultValue={dsrdata[0]?.techComment}
                  onChange={(e) => settechComment(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Worker Names</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <textarea
                  name="postContent"
                  rows={4}
                  cols={40}
                  className="col-md-12 vhs-input-label"
                  defaultValue={dsrdata[0]?.workerName}
                  onChange={(e) => setworkerName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 d-flex">
              <div className="col-4">Worker Amount </div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <textarea
                  name="postContent"
                  rows={4}
                  cols={40}
                  className="col-md-12 vhs-input-label"
                  defaultValue={dsrdata[0]?.workerAmount}
                  onChange={(e) => setworkerAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Day To Complete</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <input
                  type="date"
                  className="col-md-12 vhs-input-value"
                  defaultValue={dsrdata[0]?.daytoComplete}
                  onChange={(e) => setdaytoComplete(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Logged User</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <p style={{ marginBottom: 0 }}> {admin.displayname}</p>
                <p>{admin.contactno}</p>
              </div>
            </div>
            {dsrdata[0]?.jobAmount ? (
              <div className="col-6 ">
                <div className="d-flex">
                  <div className="col-4">Payment amount</div>
                  <div className="col-1">:</div>
                  <div className="group pt-1 col-7">
                    <p style={{ marginBottom: 0 }}> {dsrdata[0]?.jobAmount}</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col-4">Payment Mode</div>
                  <div className="col-1">:</div>
                  <div className="group pt-1 col-7">
                    <p style={{ marginBottom: 0 }}>
                      {" "}
                      {dsrdata[0]?.paymentType}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-6 d-flex"></div>
            )}
          </div>
        </div>

        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Backoffice Executive</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <p style={{ marginBottom: 0 }}> {data.BackofficeExecutive}</p>
                {/* <p>{data.backofficerno}</p> */}
              </div>
            </div>

            <div className="col-6 d-flex">
              <div className="group pt-1 col-6">
                <label>
                  <input
                    type="radio"
                    value="PM"
                    className="custom-radio mx-2"
                    checked={type === "PM"}
                    onChange={handleChange2}
                  />
                  PM
                </label>
                <label className="mx-3">
                  <input
                    type="radio"
                    value="technician"
                    className="custom-radio mx-2"
                    checked={type === "technician"}
                    onChange={handleChange2}
                  />
                  TECH
                </label>
                <label className="mx-3">
                  <input
                    type="radio"
                    value="Vendor"
                    className="custom-radio mx-2"
                    checked={type === "Vendor"}
                    onChange={handleChange2}
                  />
                  Vendor
                </label>
              </div>

              <div className="group pt-1 col-6">
                {TTname}
                <select
                  className="col-md-12 vhs-input-value"
                  onChange={handleTechNameChange}
                  defaultValue={TTname}
                >
                  <option>--select--</option>

                  {type === "technician" &&
                    techniciandata.map((item) => (
                      <option key={item.id} value={item._id}>
                        {item.vhsname}
                      </option>
                    ))}
                  {type === "PM" &&
                    PMdata.map((item) => (
                      <option key={item.id} value={item._id}>
                        {item.vhsname}
                      </option>
                    ))}
                  {type === "Vendor" &&
                    vendordata.map((item) => (
                      <option key={item.id} value={item._id}>
                        {item.vhsname}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">Send SMS</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                <select
                  className="col-md-12 vhs-input-value"
                  onChange={(e) => setsendSms(e.target.value)}
                >
                  {dsrdata[0]?.sendSms ? (
                    <option>{dsrdata[0]?.sendSms}</option>
                  ) : (
                    <option>--select--</option>
                  )}
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-3">
          <div className="row">
            <div className="col-6 d-flex">
              <div className="col-4">(IN) Sign Date & Time</div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                {data.dsrdata.find((dsrItem) => dsrItem.serviceDate === data1)
                  ? renderStartDate
                  : "0000-00-00 00:00:00"}
              </div>
            </div>

            <div className="col-6 d-flex">
              <div className="col-4">
                (OUT) Sign Date & Time
                <span className="text-danger">*</span>
              </div>
              <div className="col-1">:</div>
              <div className="group pt-1 col-7">
                {data.dsrdata.find((dsrItem) => dsrItem.serviceDate === data1)
                  ? renderEndDate
                  : "0000-00-00 00:00:00"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 d-flex">
          <div className="col-4">
            Job Complete
            <span className="text-danger">*</span>
          </div>
          <div className="col-1">:</div>
          <div className="group pt-1 col-7">
            <label>
              <input
                type="radio"
                value="YES"
                className="custom-radio mx-2"
                checked={jobComplete === "YES"}
                onChange={handleChange1}
              />
              YES
            </label>
            <label className="mx-3">
              <input
                type="radio"
                value="NO"
                className="custom-radio mx-2"
                checked={jobComplete === "NO"}
                onChange={handleChange1}
              />
              NO
            </label>
            <label className="mx-3">
              <input
                type="radio"
                value="CANCEL"
                className="custom-radio mx-2"
                checked={jobComplete === "CANCEL"}
                onChange={handleChange1}
              />
              CANCEL
            </label>
          </div>
        </div>

        {dsrdata[0]?.jobComplete === "CANCEL" ? (
          <div>
            <h4 style={{ color: "red", textAlign: "center" }}>
              SERVICE CANCELLED
            </h4>

            <div className="row pt-3">
              <div className="row">
                <div className="col-6 ">
                  <div className="d-flex">
                    <div className="col-4">Cancel Person</div>
                    <div className="col-1">:</div>
                    <div className="group pt-1 col-7">
                      <p style={{ marginBottom: 0 }}>
                        {" "}
                        {dsrdata[0]?.cancelOfficerName}
                      </p>
                      <p>{dsrdata[0]?.cancelOfferNumber}</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="col-4">Cancel Reason</div>
                    <div className="col-1">:</div>
                    <div className="group pt-1 col-7">
                      <p style={{ marginBottom: 0 }}> {dsrdata[0]?.reason}</p>
                    </div>
                  </div>
                  <div>
                    <p>{formattedDateTime1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row pt-3  m-auto justify-content-center mt-4">
            <>
              {dsrdata[0]?.jobComplete === "YES" ? (
                <div>
                  <h4 style={{ color: "GREEN", textAlign: "center" }}>
                    SERVICE COMPLETED
                  </h4>
                  <div className="row pt-3">
                    <div className="row">
                      <div className="col-6 ">
                        <div className="d-flex">
                          <div className="col-4">COMPLETED Person</div>
                          <div className="col-1">:</div>
                          <div className="group pt-1 col-7">
                            <p style={{ marginBottom: 0 }}>
                              {dsrdata[0]?.backofficerExe}
                            </p>
                            <p>{dsrdata[0]?.backofficerno}</p>
                          </div>
                        </div>

                        <div>
                          <p>{formattedDateTime1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  {dsrloader ? (
                    <Spinner animation="border" role="status"></Spinner>
                  ) : (
                    <>
                      <div className="col-md-2">
                        {loading ? (
                          <Spinner animation="border" role="status"></Spinner>
                        ) : !dsrdata[0] ? (
                          <button
                            className="vhs-button"
                            onClick={SV ? undefined : checking}
                          >
                            Save
                          </button>
                        ) : (
                          <button className="vhs-button" onClick={Update}>
                            Update
                          </button>
                        )}
                      </div>
                      <div className="col-md-2">
                        <button className="vhs-button" onClick={handleShow}>
                          Cancel
                        </button>
                      </div>
                    </>
                  )}

                  <div className="col-md-2">
                    {!data?.quotedata ? (
                      <button className="vhs-button">Invoice</button>
                    ) : (
                      <Link
                        to={`/dsrquote/${id}`}
                        state={{ data: data, data1: data1 }}
                      >
                        <button className="vhs-button">Invoice</button>
                      </Link>
                    )}
                  </div>
                  <div className="col-md-2">
                    <button className="vhs-button">Quotation</button>
                  </div>
                  <div className="col-md-2">
                    <button className="vhs-button" onClick={GoToInvoice}>
                      Bill Whatsapp
                    </button>{" "}
                  </div>
                </div>
              )}
            </>
          </div>
        )}

        {}
        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          size="sm"
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Cancel the service
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className=" pt-3">
              <div className="col-6">
                <h4>Reason</h4>
              </div>

              <div>
                <textarea
                  rows={4}
                  cols={40}
                  className="col-md-12 vhs-input-label"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="vhs-button" onClick={handleClose}>
              No
            </button>
            {!dsrdata[0] ? (
              <button className="vhs-button" onClick={Reason ? newdata : ""}>
                Yes
              </button>
            ) : (
              <button className="vhs-button" onClick={Reason ? Update : ""}>
                Yes
              </button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal show={show1} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Reschedule reason</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <textarea
                rows={4}
                cols={40}
                className="col-md-12 vhs-input-label"
                onChange={(e) => setreasonforresh(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
              Close
            </Button>
            <Button variant="primary" onClick={recheduledate}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Dsrdetails;
