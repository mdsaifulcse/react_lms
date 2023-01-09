//import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="row">
        <div className="col-md-12 col-xl-4">
          {/* <!-- table card start --> */}
          <div className="card table-card">
            <div className="">
              <div className="row-table">
                <div className="col-sm-6 card-block-big br">
                  <div className="row">
                    <div className="col-sm-4">
                      <i className="icofont icofont-eye-alt text-success"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>10k</h5>
                      <span>Visitors</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 card-block-big">
                  <div className="row">
                    <div className="col-sm-4">
                      <i className="icofont icofont-ui-music text-danger"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>100%</h5>
                      <span>Volume</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="row-table">
                <div className="col-sm-6 card-block-big br">
                  <div className="row">
                    <div className="col-sm-4">
                      <i className="icofont icofont-files text-info"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>2000 +</h5>
                      <span>Files</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 card-block-big">
                  <div className="row">
                    <div className="col-sm-4">
                      <i className="icofont icofont-envelope-open text-warning"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>120</h5>
                      <span>Mails</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- table card end --> */}
        </div>
        <div className="col-md-12 col-xl-4">
          {/* <!-- table card start --> */}
          <div className="card table-card">
            <div className="">
              <div className="row-table">
                <div className="col-sm-6 card-block-big br">
                  <div className="row">
                    <div className="col-sm-4">
                      <div
                        id="barchart"
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                      ></div>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>1000</h5>
                      <span>Shares</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 card-block-big">
                  <div className="row ">
                    <div className="col-sm-4">
                      <i className="icofont icofont-network text-primary"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>600</h5>
                      <span>Network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="row-table">
                <div className="col-sm-6 card-block-big br">
                  <div className="row ">
                    <div className="col-sm-4">
                      <div
                        id="barchart2"
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                      ></div>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>350</h5>
                      <span>Returns</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 card-block-big">
                  <div className="row ">
                    <div className="col-sm-4">
                      <i className="icofont icofont-network-tower text-primary"></i>
                    </div>
                    <div className="col-sm-8 text-center">
                      <h5>100%</h5>
                      <span>Connections</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- table card end --> */}
        </div>
        <div className="col-md-12 col-xl-4">
          {/* <!-- widget primary card start --> */}
          <div className="card table-card widget-primary-card">
            <div className="">
              <div className="row-table">
                <div className="col-sm-3 card-block-big">
                  <i className="icofont icofont-star"></i>
                </div>
                <div className="col-sm-9">
                  <h4>4000 +</h4>
                  <h6>Ratings Received</h6>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- widget primary card end -->
                                                <!-- widget-success-card start --> */}
          <div className="card table-card widget-success-card">
            <div className="">
              <div className="row-table">
                <div className="col-sm-3 card-block-big">
                  <i className="icofont icofont-trophy-alt"></i>
                </div>
                <div className="col-sm-9">
                  <h4>17</h4>
                  <h6>Achievements</h6>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- widget-success-card end --> */}
        </div>
      </div>
    </>
  );
}
