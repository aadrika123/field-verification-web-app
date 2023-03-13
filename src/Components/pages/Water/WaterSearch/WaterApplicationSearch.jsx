import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { RiFilter2Line } from "react-icons/ri";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import WaterApiList from "../../../api/WaterApiList";
import CommonLoader from "../../Common/CommonLoader";

function WaterApplicationSearch() {
  const [searchBy, setSearchBy] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState()
  const [headerData, setHeaderData] = useState()

  // const { notify } = useContext(contextVar)


  const { api_waterSearchActiveApplication, header } = WaterApiList();


  const navigate = useNavigate();

  //Fetch Data API

  const fetchData = (data) => {

    setIsLoading(true)
    const payload = {
      filterBy: formik.values.filterBy,
      applicationNo: formik.values.parameter,
    };


    console.log('payload...', payload)
    axios
      .post(api_waterSearchActiveApplication, payload, header)
      .then((res) => {
        console.log('search application water list', res?.data?.data)
        if (res?.data?.status) {
          setFetchedData(res?.data?.data)
        } else {
          // notify('Something went wrong!!', 'error')
        }

        setIsLoading(false)
      })
      .catch((err) => {
        console.log("Error while fetching Filter Data", err)
        // notify('Something went wrong!!', 'error')
        setIsLoading(false)
      });
  };


  const validationSchema = yup.object({
    filterBy: yup.string().required("This is a required field !"),
    // wardNo: yup.string().required("This is a required field !"),
    parameter: yup.string().required("This is a required field !"),
  });

  const formik = useFormik({
    initialValues: {
      filterBy: "",
      // wardNo: "",
      parameter: "",
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      fetchData(values);
    },
    validationSchema,
  });

  const handleFilterBy = (e) => {
    formik.values.filterBy = e.target.value;

    if (e.target.value == "holdingNo") {
      setSearchBy("Holding No");
    }
    if (e.target.value == "ownerDetails") {
      setSearchBy("Owner Details");
    }
    if (e.target.value == "address") {
      setSearchBy("Address");
    }
  };


  return (


    <>

      {
        isLoading && <CommonLoader />
      }


      <div className='text-center font-bold text-gray-700 text-lg border-b-2 border-gray-700 mx-4 mb-4'>
        <p>  Search Water Application </p>
      </div>
      <div className="mt-6">
        <div className="flex ml-5 mt-2 ">

        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="justify-center my-5 m-10">
            <div>
              <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                Filter By<span className="text-red-500">*</span>
              </label>
              <select
                name="filterBy"
                // onChange={formik.handleChange}
                // onClick={(e) => setSearchBy(e.target.values)}
                onChange={handleFilterBy}
                className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
              >
                <option value="">Select</option>
                <option value="newConnection">New Connection</option>
                <option value="regularization">Regularization</option>
              </select>
              <p className="text-red-500 text-xs">
                {formik.touched.filterBy && formik.errors.filterBy
                  ? formik.errors.filterBy
                  : null}
              </p>
            </div>

            <div>
              <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                Search By {searchBy} <span className="text-red-500">*</span>
              </label>
              <input type="text" name="parameter" onChange={formik.handleChange}
                className=" w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
              />
              <p className="text-red-500 text-xs">{formik.touched.parameter && formik.errors.parameter ? formik.errors.parameter : null}</p>
            </div>

            <div className="mt-4">
              <button type="submit"
                className="w-full border border-indigo-600 bg-indigo-600 hover:bg-indigo-700 text-gray-200 hover:text-white shadow-lg rounded-sm text-base font-semibold  py-1"              >
                <p className="flex justify-center"> <span className="mt-1 mx-2"> <RiFilter2Line /> </span> Search record </p>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-10 mx-4">

          {fetchedData ?
            <div className='w-full relative bg-indigo-50 shadow-md  rounded-sm pb-2 border-2 border-indigo-600 mb-4 select-none cursor-pointer' >
              <div className='font-semibold bg-indigo-600 px-4 text-white'>Consumer Details</div>
              <div className='w-full rounded-lg space-b-2'>
                <div className=''>

                  {fetchedData && fetchedData.map((item, i) => (
                    <div>
                      <div key={i} className='w-full md:w-[40%] grid grid-cols-12 p-4'>

                        <>
                          <div className='col-span-6 text-xs text-gray-600'>Application No</div>
                          <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.application_no}</div>
                        </>
                        {item?.holding_no &&
                          <>
                            <div className='col-span-6 text-xs text-gray-600'>Holding No</div>
                            <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.holding_no}</div>
                          </>
                        }
                        {item?.saf_no &&
                          <>
                            <div className='col-span-6 text-xs text-gray-600'>Saf No</div>
                            <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.saf_no}</div>
                          </>
                        }
                        <>
                          <div className='col-span-6 text-xs text-gray-600'>Applicant Name</div>
                          <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.applicantname}</div>
                        </>
                        <>
                          <div className='col-span-6 text-xs text-gray-600'>Guardian Name</div>
                          <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.guardian_name}</div>
                        </>
                        <>
                          <div className='col-span-6 text-xs text-gray-600'>Mobile No</div>
                          <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.mobileno}</div>
                        </>
                        <>
                          <div className='col-span-6 text-xs text-gray-600'>Address</div>
                          <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.address}</div>
                        </>

                      </div>
                      <div className="float-right -mt-4 -pl-1">
                        <button className="px-3 mt-1 rounded-l-sm -mr-0.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Click to View</button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
            :
            <div>
            </div>
          }
        </div>

      </div>

    </>
  );
}

export default WaterApplicationSearch;