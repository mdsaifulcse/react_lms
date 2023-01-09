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
      </div>
    </>
  );
}
