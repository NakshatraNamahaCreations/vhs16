import React from "react";

function Pmaterial() {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card" style={{ marginTop: "30px" }}>
          <div className="card-body p-3">
            <form>
              <div className="row">
                <div className="col-md-4">
                  <div className="vhs-input-label">
                    Materia <span className="text-danger"> *</span>
                  </div>
                  <div className="group pt-1">
                    <input type="text" className="col-md-12 vhs-input-value" />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="vhs-input-label">
                    Benefits <span className="text-danger"> *</span>
                  </div>
                  <div className="group pt-1">
                    <textarea
                      rows={5}
                      cols={10}
                      className="col-md-12 vhs-input-value"
                    />
                  </div>
                </div>

                <div className="col-md-4"></div>
              </div>

              <div className="row pt-3 justify-content-center">
                <div className="col-md-2">
                  <button className="vhs-button">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5">
          Page{" "}
          <span>
            <select className="vh-user-select">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </span>{" "}
          of 4
        </div>{" "}
        <table class="table table-hover table-bordered mt-2">
          <thead className="">
            <tr>
              <th style={{ width: "10%" }} scope="col">
                <input type="text" className="vhs-table-input" />
              </th>
              <th style={{ width: "30%" }} scope="col">
                <input type="text" className="vhs-table-input" />
              </th>
              <th style={{ width: "50%" }} scope="col">
                <input type="text" className="vhs-table-input" />
              </th>

              <th style={{ width: "10%" }} scope="col">
                <input type="text" className="vhs-table-input" />
              </th>
            </tr>

            <tr className="table-secondary">
              <th style={{ width: "10%" }} className="table-head" scope="col">
                Sr
              </th>
              <th style={{ width: "30%" }} className="table-head" scope="col">
                Material
              </th>
              <th style={{ width: "50%" }} className="table-head" scope="col">
                Benefits
              </th>
              <th style={{ width: "10%" }} className="table-head" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="user-tbale-body">
              <td className="text-center">1</td>
              <td>Ace Emulsion</td>
              <td>
                <p className="mb-0">
                  * Better Performance
                  <br />
                  * Anti-Algal Performance
                  <br />
                  * Lasts 3-4 Years
                  <br />* 1600+ Shades
                </p>
              </td>
              <td>
                <div className="d-flex">
                  <a href="#" className="hyperlink">
                    Edit
                  </a>

                  <span className="mx-2">|</span>

                  <a href="#" className="hyperlink mx-1">
                    Delete
                  </a>
                </div>
              </td>
            </tr>

            <tr className="user-tbale-body">
              <td className="text-center">2</td>
              <td>Air Care VG (Nippon)</td>
              <td>
                <p className="mb-0">
                  * Anti Formaldehyde, Anti-Bacterial & Anti-Viral.
                  <br />
                  * Anti Stain Technology.
                  <br />
                  * High Shine Finish.
                  <br />
                  * 1600+ Shades
                  <br />
                  * Near To Zero Voc & Highly Durable.
                  <br />
                  * Excellent Flow & Leveling.
                  <br />
                  * Resist Fungal Growth & Soft Feel Effect(Product Comes With
                  Dual Finisher Matt & Sheen).
                  <br />* Warranty For 5yrs .
                </p>
              </td>
              <td>
                <div className="d-flex">
                  <a href="#" className="hyperlink">
                    Edit
                  </a>

                  <span className="mx-2">|</span>

                  <a href="#" className="hyperlink mx-1">
                    Delete
                  </a>
                </div>
              </td>
            </tr>

            <tr className="user-tbale-body">
              <td className="text-center">3</td>
              <td>Apcolite Advanced Heavy Duty Emulsion</td>
              <td>
                <p className="mb-0">
                  * Matt Finish
                  <br />
                  * Fungus Resistance
                  <br />
                  * Burnish Resistance
                  <br />* Abrasion Resistance
                </p>
              </td>
              <td>
                <div className="d-flex">
                  <a href="#" className="hyperlink">
                    Edit
                  </a>

                  <span className="mx-2">|</span>

                  <a href="#" className="hyperlink mx-1">
                    Delete
                  </a>
                </div>
              </td>
            </tr>

            <tr className="user-tbale-body">
              <td className="text-center">4</td>
              <td>Apcolite Premium Enamel</td>
              <td>
                <p className="mb-0">
                  *Enamel Makes It One Of The Toughest & Most Durable Paints
                  Which Forms A Protective Armour Around Surfaces.
                  <br />
                  *Highly Washable Paint, Thus You Can Wipe Off Most Common
                  Household Stains Easily.
                </p>
              </td>
              <td>
                <div className="d-flex">
                  <a href="#" className="hyperlink">
                    Edit
                  </a>

                  <span className="mx-2">|</span>

                  <a href="#" className="hyperlink mx-1">
                    Delete
                  </a>
                </div>
              </td>
            </tr>

            <tr className="user-tbale-body">
              <td className="text-center">5</td>
              <td>Apex Emulsion</td>
              <td>
                <p className="mb-0">
                  * Weather Guard
                  <br />
                  * Excellent Uv Protection
                  <br />
                  * Anti-Algal Performance
                  <br />* Fantastic Shades Range
                </p>
              </td>
              <td>
                <div className="d-flex">
                  <a href="#" className="hyperlink">
                    Edit
                  </a>

                  <span className="mx-2">|</span>

                  <a href="#" className="hyperlink mx-1">
                    Delete
                  </a>
                </div>
              </td>
            </tr>

            <tr
              className="user-tbale-body"
              style={{ backgroundColor: "#eee", height: "40px" }}
            >
              <td className="text-center"></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>{" "}
      </div>
    </div>
  );
}

export default Pmaterial;
