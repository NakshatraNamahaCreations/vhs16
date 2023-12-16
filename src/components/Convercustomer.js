import React, { useState, useEffect } from "react";
import Customernav from "../components/Customernav";
import Header from "../components/layout/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Convertcustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setdata] = useState([]);
  const [citydata, setcitydata] = useState([]);
  const [customertypedata, setcustomertypedata] = useState([]);

  const [customername, setcustomername] = useState(data[0]?.name);
  const [contactperson, setcontactperson] = useState("");
  const [maincontact, setmaincontact] = useState(data[0]?.contact1);
  const [alternatenumber, setalternate] = useState("");
  const [email, setemail] = useState();
  const [gst, setgst] = useState("");
  const [rbhf, setrbhf] = useState("");
  const [cnap, setcnap] = useState("");
  const [lnf, setlnf] = useState(data[0]?.address);
  const [mainarea, setarea] = useState("");
  const [city, setcity] = useState(data[0]?.city);
  const [pincode, setpincode] = useState("");
  const [customertype, setcustomertype] = useState("");
  const [size, setsize] = useState("");
  const [color, setcolor] = useState("");
  const [instructions, setinstructions] = useState("");
  const [approach, setapproach] = useState("");
  const [serviceexecutive, setserviceexc] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;
  const imgURL = process.env.REACT_APP_IMAGE_API_URL;

  const [referecetypedata, setreferecetypedata] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [customerdata, setcustomerdata] = useState([]);
  const [categorydata, setcategorydata] = useState([]);
  const [category, setcategory] = useState("");

  useEffect(() => {
    getenquiryadd();
  }, []);

  const getenquiryadd = async () => {
    let res = await axios.get(apiURL + "/getenquiry");
    if ((res.status = 200)) {
      setdata(res.data?.enquiryadd.filter((item) => item.EnquiryId == id));
    }
  };
console.log(contactperson,rbhf,cnap,lnf,customertype)
  const addcustomer = async (e) => {
    e.preventDefault();

    if (
      !contactperson ||
      !rbhf ||
      !cnap ||
      !lnf ||
      !customertype
  
    ) {
      alert("fill all necessary fileds");
    } else {
      try {
        const config = {
          url: "/addcustomer",
          method: "post",
          baseURL: apiURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            EnquiryId: id,
            cardNo: customerdata ? customerdata + 1 : 1,
            category: category ? category : data[0]?.category,
            customerName: customername ? customername : data[0]?.name,
            contactPerson: contactperson
              ? contactperson
              : data[0]?.contactperson,
            mainContact: maincontact ? maincontact : data[0]?.contact1,
            alternateContact: alternatenumber,
            email: email ? email : data[0]?.email,
            gst: gst,
            rbhf: rbhf,
            cnap: cnap,
            lnf: lnf,
            deliveryAddress:{
              landmark:cnap,
              platNo:rbhf,
              saveAs:mainarea,
              address:lnf

            },
            mainArea: mainarea,
            city: city ? city : data[0]?.city,
            pinCode: pincode,
            customerType: customertype,
            size: size,
            color: color,
            instructions: instructions,
            approach: approach,
            serviceExecute: serviceexecutive,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            const data=response.data.user

            navigate(`/customersearchdetails/${data?._id}`);
          }
        });
      } catch (error) {

        if (error.response) {
          alert(error.response.data.error); // Display error message from the API response
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  useEffect(() => {
    getcity();
    getcustomertype();
    getreferencetype();
    getuser();
    getcustomer();
    getcategory();
  }, []);

  const getcity = async () => {
    let res = await axios.get(apiURL + "/master/getcity");
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };
  const getcustomertype = async () => {
    let res = await axios.get(apiURL + "/master/getcustomertype");
    if ((res.status = 200)) {
      setcustomertypedata(res.data?.mastercustomertype);
    }
  };

  const getreferencetype = async () => {
    let res = await axios.get(apiURL + "/master/getreferencetype");
    if ((res.status = 200)) {
      setreferecetypedata(res.data?.masterreference);
    }
  };
  const getuser = async () => {
    let res = await axios.get(apiURL + "/master/getuser");
    if ((res.status = 200)) {
      setuserdata(res.data?.masteruser);
    }
  };

  const getcustomer = async () => {
    let res = await axios.get(apiURL + "/getcustomer");
    if ((res.status = 200)) {
      setcustomerdata(res.data?.customers[0]?.cardNo);
    }
  };
  const getcategory = async () => {
    let res = await axios.get(apiURL + "/getcategory");
    if ((res.status = 200)) {
      setcategorydata(res.data?.category);
    }
  };

  return (
    <div className="">
      <Header />
      <Customernav />
      <div></div>
      <div className="row m-auto">
        <div className="col-md-12">
          <div className="card" style={{ marginTop: "32px" }}>
            <div className="card-body p-4">
              <form>
                <div className="row">
                  <div className="vhs-sub-heading">
                    <h5>Customer Basic Information</h5>
                  </div>
                  <div className="col-md-4 pt-2">
                    <div className="vhs-input-label">Card No: </div>
                    <div className="group pt-1 vhs-non-editable">
                      {customerdata ? customerdata + 1 : 1}
                    </div>
                  </div>
                  <div className="col-md-4 pt-2">
                    <div className="vhs-input-label">Customer Name</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        value={data[0]?.name}
                        onChange={(e) => setcustomername(e.target.value)}
                        defaultValue={data[0]?.name}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-2">
                    <div className="vhs-input-label">
                      {" "}
                      Contact Person<span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcontactperson(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row pt-2">
                  <div className="vhs-sub-heading">
                    <h5>Customer Contact & GST Information</h5>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Main Contact <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="number"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setmaincontact(e.target.value)}
                        defaultValue={data[0]?.contact1}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">Alternate Contact</div>
                    <div className="group pt-1">
                      <input
                        type="number"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setalternate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Email
                    </div>
                    <div className="group pt-1">
                      <input
                        type="email"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setemail(e.target.value)}
                        defaultValue={data[0]?.email}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">GSTIN Id</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setgst(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row pt-2 mt-3">
                  <div className="vhs-sub-heading">
                    <h5>Customer Detail Address</h5>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Room / Bunglow / House / Flat No.
                      <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setrbhf(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
               Landmark
                      <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <textarea
                        rows={4}
                        cols={6}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcnap(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                     Address
                      <span className="text-danger">*</span>
                    </div>
                    <div className="group pt-1">
                      <textarea
                        rows={4}
                        cols={6}
                        className="col-md-12 vhs-input-value"
                        defaultValue={data[0]?.address}
                        onChange={(e) => setlnf(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">Office/Home</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setarea(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      City <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcity(e.target.value)}
                      >
                        <option>{data[0]?.city}</option>
                        {citydata.map((item) => (
                          <option value={item.city}>{item.city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Pincode 
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setpincode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row pt-2">
                  <div className="vhs-sub-heading">
                    <h5>Customer Other Information</h5>
                  </div>
                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Customer Type
                      <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcustomertype(e.target.value)}
                      >
                        <option>-select-</option>
                        {customertypedata.map((item) => (
                          <option value={item.customertype}>
                            {item.customertype}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 pt-3">
                    <div className="vhs-input-label">
                      Approach
                     
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setapproach(e.target.value)}
                      >
                        <option>-select all-</option>
                        {referecetypedata.map((item) => (
                          <option value={item.referencetype}>
                            {item.referencetype}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row pt-3 justify-content-center">
                  <div className="col-md-2">
                    <button className="vhs-button" onClick={addcustomer}>
                      Save
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button className="vhs-button mx-3">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Convertcustomer;
