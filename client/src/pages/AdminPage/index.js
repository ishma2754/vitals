import React, { useState, useContext, useEffect } from "react";
import "./index.css";
import { useCookies } from "react-cookie";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js`;

export default function AdminFetchUser() {
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["AuthToken"]);



  const handleFetch = async () => {
    setError(null);
    setUserData(null);

    const token = cookies.AuthToken;

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    sessionStorage.removeItem("userData");
 

    try {
      const formDataResponse = await fetch(
        `${process.env.REACT_APP_SERVERURL}/AdminPage/${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formData = await formDataResponse.json();

      if (!formDataResponse.ok) {
        setError(
          formData.error || "An error occurred while fetching user data."
        );
        return;
      }

      const inputValuesResponse = await fetch(
        `${
          process.env.REACT_APP_SERVERURL
        }/AdminPage/InputValues/${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const inputValues = await inputValuesResponse.json();

      if (!inputValuesResponse.ok) {
        setError(
          inputValues.error ||
            "An error occurred while fetching input values data."
        );
        return;
      }

      const pdfDataResponse = await fetch(
        `${process.env.REACT_APP_SERVERURL}/AdminPage/PDFData/${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pdfData = await pdfDataResponse.json();

      if (!pdfDataResponse.ok) {
        setError(pdfData.error || "An error occurred while fetching PDF data.");
        return;
      }

      const sortedInputValues = inputValues.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const fetchedData = {
        formData: formData,
        inputValues: sortedInputValues,
        pdfData: pdfData,
      };

      
      sessionStorage.setItem("userData", JSON.stringify(fetchedData));

      setUserData(fetchedData);
    } catch (err) {
      setError("An error occurred while fetching user data.");
    }
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="admin-fetch-user mx-4 flex-grow">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-RussianViolet md:text-2xl dark:text-white mb-5 mt-5">
            FETCH USER DATA
          </h2>
          <input
            type="email"
            placeholder="Enter user email"
            className="bg-gray-50 border-2 border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-RussianViolet focus:border-RussianViolet
            block w-full md:w-1/4 p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <button
            className="text-white bg-buttonColor hover:bg-hoverButtonColor focus:ring-4 focus:outline-none focus:ring-RussianViolet font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 block mt-4"
            onClick={handleFetch}
          >
            Fetch Data
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {userData && (
            <div>
              <div className="max-w-md mx-auto border-4 border-RussianViolet rounded-lg p-4 mt-8">
              <h2 className="text-lg text-inputTextColor font-semibold mb-4">USER DETAILS</h2>
                <div>
                  {userData.formData.map((userDataItem) => (
                    <div
                      key={userDataItem.id}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <div className="font-semibold text-underlineHome">Name</div>
                        <div className="text-inputTextColor">{userDataItem.name}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome ">Age</div>
                        <div className="text-inputTextColor">{userDataItem.age}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome ">Blood Group</div>
                        <div className="text-inputTextColor">{userDataItem.bloodgroup}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">Emergency Contact</div>
                        <div className="text-inputTextColor">{userDataItem.emergencycontact}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">Gender</div>
                        <div className="text-inputTextColor">{userDataItem.gender}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="font-semibold text-underlineHome">Medical Conditions And Prescriptions</div>
                        <div className="text-inputTextColor">{userDataItem.medicalconditions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {userData.inputValues.length > 0 && (
                <div className="max-w-md mx-auto border-4 border-RussianViolet rounded-lg p-4 mt-8">
                  <div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-3">
                        <div className="font-semibold text-underlineHome">DATE</div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].date}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">BP SYS / mmHg</div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].bpsys}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">BP DIA / mmHg</div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].bpdia}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          Pulse Rate beats/min
                        </div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].pulserate}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          Total Cholesterol mg/dL
                        </div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].totalcholesterol}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          HDL Cholesterol mg/dL
                        </div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].hdlcholesterol}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          LDL Cholesterol mg/dL
                        </div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].ldlcholesterol}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          Blood Glucose(F) mg/dL
                        </div>
                        <div className="text-inputTextColor" >{userData.inputValues[0].bloodglucosefasting}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">
                          Blood Glucose(PP) mg/dL
                        </div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].bloodglucosepp}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-underlineHome">Creatinine µmol/l</div>
                        <div  className="text-inputTextColor">{userData.inputValues[0].creatinine}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-10">
                {userData.pdfData.map((report) => (
                  <div
                    key={report.id}
                    className="pdf-item relative rounded-lg border-RussianViolet bg-white border-4  shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="pdf-details p-5 relative">
                      <h3 className="font-bold text-underlineHome">{report.file_name}</h3>
                      <div className="pdf-container relative w-full h-64 overflow-hidden">
                        <Document file={report.signedurl}>
                          <Page pageNumber={1} scale={0.8} />
                        </Document>
                      </div>
                      <div className="mt-2">
                        <a
                          href={report.signedurl}
                           className="text-white bg-buttonColor hover:bg-hoverButtonColor focus:ring-4 focus:outline-none focus:ring-RussianViolet font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          style={{ display: "inline-block" }}
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="bg-RussianViolet mt-8">
          <div className="px-4 py-6 bg-RussianViolet dark:bg-gray-700 md:flex md:items-center md:justify-between">
            <span className="text-sm text-white sm:text-center">
              © 2024 <a href="#">VitalOrgans</a> By ISHMA KHAN
            </span>
            <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
              <a
                href="mailto:your_ishmakhan1995@gmail.com"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="w-6 h-6 text-white hover:text-hoverColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                  <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
                </svg>

                <span className="sr-only">Email</span>
              </a>
              <a
                href="https://x.com/Ishma2754"
                className="text-white hover:text-hoverColor"
              >
                <svg
                  className="w-6 h-6 text-white hover:text-hoverColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                </svg>

                <span className="sr-only">Twitter page</span>
              </a>
              <a
                href="https://github.com/ishma2754"
                className="text-white hover:text-hoverColor"
              >
                <svg
                  className="w-6 h-6 hover:text-hoverColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ishma-khan-3765992a5/"
                className="text-white hover:text-hoverColor"
              >
                <svg
                  className="w-6 h-6 hover:text-hoverColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                    clipRule="evenodd"
                  />
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                </svg>

                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
