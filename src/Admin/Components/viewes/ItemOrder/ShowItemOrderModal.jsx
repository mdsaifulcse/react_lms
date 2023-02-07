import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

export default function ShowItemModal({
  data,
  show,
  onHide,
  modalTitle,
  cardHeader,
}) {
  console.log(data);
  return (
    <>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalTitle}
          </Modal.Title>
          <span onClick={onHide} role="button" className="text-danger">
            X
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header">
              <h5 className="card-header-text">
                {cardHeader} ({data.title})
              </h5>
              <Link to={`/admin/items/edit/${data.id}`} title="Edit Item">
                <button
                  id="edit-btn"
                  type="button"
                  className="btn btn-sm btn-primary waves-effect waves-light f-right"
                >
                  <i className="icofont icofont-edit"></i>
                </button>
              </Link>
            </div>
            <div className="card-block">
              <div className="view-info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="general-info">
                      <div className="row">
                        <div className="col-lg-3 col-xl-3">
                          <div className="card">
                            <div className="card-header contact-user">
                              {data.itemThumbnails ? (
                                <img
                                  className="img img-circle"
                                  src={data.itemThumbnails[0].medium}
                                  alt="contact-user"
                                  style={{ width: "100%" }}
                                />
                              ) : (
                                <img
                                  className="img-circle"
                                  src=""
                                  alt="contact-user"
                                />
                              )}

                              <h4>{data.title}</h4>
                            </div>
                          </div>
                        </div>
                        {/* <!-- end of table col-lg-6 --> */}
                        <div className="col-lg-9 col-xl-9">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="row">Title</th>
                                <td>{data.title}</td>
                              </tr>
                              <tr>
                                <th scope="row">Isbn</th>
                                <td>{data.isbn}</td>
                              </tr>
                              <tr>
                                <th scope="row">Edition</th>
                                <td>{data.edition}</td>
                              </tr>
                              <tr>
                                <th scope="row">Number of Page</th>
                                <td>{data.number_of_page}</td>
                              </tr>

                              <tr>
                                <th scope="row">Authors</th>
                                <td>
                                  {data.relItemAuthorsName
                                    ? data.relItemAuthorsName.map(
                                        (authorData, i) => (
                                          <span
                                            key={i}
                                            className="badge badge-success"
                                          >
                                            {authorData.name}
                                          </span>
                                        )
                                      )
                                    : ""}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Publisher</th>
                                <td>{data.publisher}</td>
                              </tr>
                              <tr>
                                <th scope="row">Language</th>
                                <td>{data.language}</td>
                              </tr>
                              <tr>
                                <th scope="row">Country</th>
                                <td>{data.country}</td>
                              </tr>
                              <tr>
                                <th scope="row">Category</th>
                                <td>{data.category}</td>
                              </tr>
                              <tr>
                                <th scope="row">SubCategory</th>
                                <td>{data.sub_category}</td>
                              </tr>
                              <tr>
                                <th scope="row">Third SubCategory</th>
                                <td>{data.third_category}</td>
                              </tr>
                              <tr>
                                <th scope="row">Summary</th>
                                <td>
                                  {
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: data.summary,
                                      }}
                                    />
                                  }
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Video Url</th>
                                <td>
                                  <a href={data.video_url} target="_blank">
                                    Watch
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Brochure</th>
                                <td>
                                  <a href={data.brochure} target="_blank">
                                    Read Brochure
                                  </a>
                                </td>
                              </tr>

                              <tr>
                                <th scope="row">Status</th>
                                <td>
                                  {data.status === 1 ? (
                                    <>
                                      <span className="text-primary">
                                        Active
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-danger">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Status</th>
                                <td>
                                  {data.publish_status === 1 ? (
                                    <>
                                      <span className="text-primary">
                                        PUblished
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-danger">
                                      Unpublished
                                    </span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Status</th>
                                <td>
                                  {data.show_home === 1 ? (
                                    <>
                                      <span className="text-primary">Yes</span>
                                    </>
                                  ) : (
                                    <span className="text-danger">No</span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* <!-- end of table col-lg-6 --> */}
                      </div>
                      {/* <!-- end of row --> */}
                    </div>
                    {/* <!-- end of general info --> */}
                  </div>
                  {/* <!-- end of col-lg-12 --> */}
                </div>
                {/* <!-- end of row --> */}
              </div>
              {/* <!-- end of view-info --> */}
            </div>
            {/* <!-- end of card-block --> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={onHide} className="btn btn-danger">
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
