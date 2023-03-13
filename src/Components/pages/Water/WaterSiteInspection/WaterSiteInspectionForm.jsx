import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { MdTag } from 'react-icons/md'
import moment from 'moment'
import { useFormik } from "formik";
import * as yup from "yup";
import imgMapNorth from './Map_North_new.png'
import imgMapSouth from './Map_South_new.png'
import WaterApiList from '../../../api/WaterApiList'
import CommonLoader from '../../Common/CommonLoader'



function WaterSiteInspectionForm() {


  const { id } = useParams()


  const navigate = useNavigate()

  const todayDate = moment(new Date()).format('DD-MM-YYYY')


  const { api_getPendingApplicationDetails, api_waterMasterData, api_waterSiteInspectionSaveData, api_waterInspectionDetails, api_waterCancelSiteInspection, header } = WaterApiList()

  const [applicationFullData, setApplicationFullData] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMap, setSelectedMap] = useState()
  const [masterData, setMasterData] = useState()
  const [successMessage, setSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [inspectionDateTime, setInspectionDateTime] = useState()

  const validationSchema = yup.object({
    propertyType: yup.string().required("This is a required field !"),
    areaSqFt: yup.string().required("This is a required field !"),
    distributionPipelineType: yup.string().required("This is a required field !"),
    pipelineSize: yup.string().required("This is a required field !"),
    pipelineType: yup.string().required("This is a required field !"),
    regularization: yup.string().required("This is a required field !"),
    diameter: yup.string().required("This is a required field !"),
    pipeQuality: yup.string().required("This is a required field !"),
    feruleSize: yup.string().required("This is a required field !"),
    roadType: yup.string().required("This is a required field !"),
    category: yup.string().required("This is a required field !"),
    applicationId: yup.string().required("This is a required field !"),

  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      propertyType: "",
      areaSqFt: "",
      distributionPipelineType: "",
      pipelineSize: "",
      pipelineType: "",
      regularization: "",
      diameter: "",
      pipeQuality: "",
      feruleSize: "",
      roadType: "",
      category: "",
      applicationId: id,
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      saveData(values)
    },
    validationSchema,
  });

  const saveData = (data) => {
    setSuccessMessage(false)
    setErrorMessage(false)

    const payload = {
      "propertyTypeId": data.propertyType,
      "areaSqft": data.areaSqFt,
      "pipelineTypeId": data.distributionPipelineType,
      "pipelineSize": data.pipelineSize,
      "pipelineSizeType": data.pipelineType,
      "connectionTypeId": data.regularization,
      "diameter": data.diameter,
      "pipeQuality": data.pipeQuality,
      "feruleSize": data.feruleSize,
      "roadType": data.roadType,
      "category": data.category,
      "tsmap": selectedMap,
      "applicationId": data.applicationId
    }

    axios.post(api_waterSiteInspectionSaveData, payload, header)
      .then((res) => {
        if (res.data.status) {
          console.log("Site Inspection data saved..", res)
          setSuccessMessage("Site Inspection Done.")
        } else {
          console.log("Site Inspection error data NOT saved..", res)
          setErrorMessage("Error While Data Saving.")
        }

      })
      .catch((err) => {
        setErrorMessage("Exception : While Data Saving.")
        console.log("Exception While Site Inspection Save Data", err)
      })

    console.log("This is final Payload..", payload)

  }


  const handleChange = (event) => {
    let name = event.target.name
    let value = event.target.value

    // { name === 'searchBy' && ((value == 'byDate') ? setSearchByDate(true) : setSearchByDate(false)) }
    // { name === 'searchBy' && ((value == 'byApplication') ? setSearchByApplication(true) : setSearchByApplication(false)) }

  }




  const getApplicationDetail = () => {

    setIsLoading(true)

    axios.post(`${api_getPendingApplicationDetails}`, { applicationId: id }, header)
      .then(function (response) {
        // console.log('view Water full details ...', response.data.data)
        setApplicationFullData(response.data.data)
        setIsLoading(false)
      })
      .catch(function (error) {
        console.log('==2 details by id error...', error)
        setIsLoading(false)
      })
  }

  const fetchMasterData = () => {
    axios.post(`${api_waterMasterData}`, {}, header)
      .then((res) => {
        // console.log("Site Inspection Mater Data", res)
        setMasterData(res.data.data)
      })
      .catch((err) => {
        console.log("Exception While Master Data Fetch", err)
      })
  }

  const fetchDataTime = () => {
    axios.post(api_waterInspectionDetails, { applicationId: id }, header)
      .then((res) => {
        setInspectionDateTime(res.data.data)
        console.log("==", res.data.data)
      })
      .catch((err) => {
        console.log("Exception While Fetch Date Time", err)
      })
  }


  useEffect(() => {
    fetchMasterData()
    getApplicationDetail()
    fetchDataTime()
  }, [id])


  const handleCancelInspection = () => {
    console.log("handleCancelInspection clicked..")

    axios.post(api_waterCancelSiteInspection, { applicationId: id }, header)
      .then((res) => {
        console.log("Site Inspection Cancelled Successfully..", res)
        navigate(-1)
      })
      .catch((err) => {
        console.log("Exception While Cancelling Site Inspection", err)
      })

  }


  return (
    <>
      {isLoading && <CommonLoader />}

      <div className='grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-2 container mx-auto w-full'>



        <div className="col-span-12 rounded-lg p-4">
          <form onSubmit={formik.handleSubmit} onChange={handleChange}>


            <div className='p-4'>
              <h1 className='px-1 font-semibold font-serif  text-gray-500'><MdTag className="inline" />Scheduled Site Inspection Details</h1>
              <div className=' bg-indigo-500 rounded-lg shadow-xl p-4'>
                <div className='space-y-2 font-semibold'>
                  <p className='text-sm text-white'><span className=''>Inspection Date :</span> <span className='text-gray-100 font-semibold text-xl'>{inspectionDateTime?.inspectionDate ? moment(inspectionDateTime?.inspectionDate).format('DD-MMM-yy') : "N/A"}</span></p>
                  <p className='text-sm text-white'><span className=''>Inspection Time :</span> <span className='text-gray-100 font-semibold text-xl'>{inspectionDateTime?.inspectionTime ? moment(inspectionDateTime?.inspectionTime, "h:mm:ss A").format("HH:mm A") : "N/A"}</span></p>
                  <p className='flex flex-row-reverse'><button type='button' onClick={handleCancelInspection} className='bg-red-700 hover:bg-red-600 text-sm font-normal px-2 py-1 text-gray-300'>Cancel Inspection</button></p>
                </div>
              </div>
            </div>

            {/* Basic  details */}
            <div className='p-4'>
              <div className=''>
                <h1 className='px-1 font-semibold font-serif  text-gray-500'><MdTag className="inline" /> Basic Details</h1>
                <div className='py-6 mt-2 bg-white rounded-lg shadow-xl p-4'>
                  <div className=" space-y-3 pl-4 ">
                    <div className='flex-1'>
                      <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.ulb_name ? applicationFullData?.applicationDetails?.ulb_name : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>ULB Name</div>
                    </div>
                    <div className='flex-1'>
                      <div className='font-semibold text-lg'>{applicationFullData?.applicationDetails?.ward_name ? applicationFullData?.applicationDetails?.ward_name : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Ward No</div>
                    </div>
                    <div className='flex-1'>
                      <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.application_no ? applicationFullData?.applicationDetails?.application_no : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Application No</div>
                    </div>
                    <div className='flex-1'>
                      <div className='font-semibold text-md'>{applicationFullData?.applicationDetails?.owner_char_type ? applicationFullData?.applicationDetails?.owner_char_type : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Ownership Type</div>
                    </div>
                    <div className='flex-1'>
                      <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.property_type ? applicationFullData?.applicationDetails?.property_type : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Property Type</div>
                    </div>

                    <div className='flex-1'>
                      <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.pipeline_type ? applicationFullData?.applicationDetails?.pipeline_type : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Pipeline Type</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property  details */}
              <h1 className='px-1 font-semibold font-serif mt-10 text-gray-500'><MdTag className="inline" /> Property Address & Details</h1>
              <div className='py-6 mt-2 bg-white rounded-lg shadow-xl p-4'>
                <div className="space-y-5 pl-4 ">
                  <div className='flex-1'>
                    <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.connection_through ? applicationFullData?.applicationDetails?.connection_through : "N/A"}</div>
                    <div className='text-gray-500 text-xs'>Connection Through</div>
                  </div>
                  {applicationFullData?.connection_through == 'SAF' ?
                    <div className='flex-1'>
                      <div className='font-semibold text-md'>{applicationFullData?.applicationDetails?.saf_no ? applicationFullData?.applicationDetails?.saf_no : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>SAF No</div>
                    </div> :
                    <div className='flex-1'>
                      <div className='font-semibold text-md'>{applicationFullData?.applicationDetails?.holding_no ? applicationFullData?.applicationDetails?.holding_no : "N/A"}</div>
                      <div className='text-gray-500 text-xs'>Holding No</div>
                    </div>
                  }
                  <div className='flex-1'>
                    <div className='font-semibold text-md'>{applicationFullData?.applicationDetails?.connection_type ? applicationFullData?.applicationDetails?.connection_type : "N/A"}</div>
                    <div className='text-gray-500 text-xs'>Connection Type</div>
                  </div>
                  <div className='flex-1'>
                    <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.area_sqft ? applicationFullData?.applicationDetails?.area_sqft : "N/A"}</div>
                    <div className='text-gray-500 text-xs'>Area (Sqft.)</div>
                  </div>
                  <div className='flex-1'>
                    <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.category ? applicationFullData?.applicationDetails?.category : "N/A"}</div>
                    <div className='text-gray-500 text-xs'>Category</div>
                  </div>
                </div>

                <div className="flex space-x-10  pl-4 mt-4">
                  <div className='flex-1'>
                    <div className='font-bold text-sm'>{applicationFullData?.applicationDetails?.address ? applicationFullData?.applicationDetails?.address : "N/A"} , {applicationFullData?.applicationDetails?.prop_state}</div>
                    <div className='text-gray-500 text-xs'>Property Address</div>
                  </div>
                </div>
              </div>


              {/* owner details */}
              {/* <div className='mt-10'>
              <h1 className='px-1 font-semibold font-serif text-gray-500'><MdTag className="inline" /> Owner Details</h1>

              <table className='min-w-full leading-normal mt-2 bg-white rounded-lg shadow-xl p-4'>
                <thead className='font-bold text-left text-sm border text-gray-800 bg-white'>
                  <tr>
                    <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">#</th>
                    <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Owner Name</th>
                    <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Guardian Name</th>
                    <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Mobile No.</th>
                    <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">email </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <>
                    {applicationFullData?.ownerDetails?.map((items) => (
                      <tr className="bg-white shadow-xl border-b border-gray-200">
                        <td className="px-2 py-2 text-left text-gray-500 text-xs">#</td>
                        <td className="px-2 py-2 text-left text-gray-500 text-xs">{items?.owner_name ? items?.owner_name : "N/A"}</td>
                        <td className="px-2 py-2 text-left text-gray-500 text-xs">{items?.guardian_name ? items?.guardian_name : "N/A"}</td>
                        <td className="px-2 py-2 text-left text-gray-500 text-xs">{items?.mobile_no ? items?.mobile_no : "N/A"}</td>
                        <td className="px-2 py-2 text-left text-gray-500 text-xs">{items?.email ? items?.email : "N/A"}</td>

                      </tr>
                    ))}
                  </>
                </tbody>
              </table>
            </div> */}

              <div className='mt-10'>
                <h1 className='px-1 font-semibold font-serif  text-gray-500'><MdTag className="inline" /> Select TS Map</h1>
                <div className='py-6 mt-2 bg-white rounded-lg shadow-xl'>
                  <div className="flex space-x-5 pl-4 ">

                    <div onClick={() => setSelectedMap(0)} className={` ${selectedMap == 0 ? 'border-2 border-indigo-500' : 'border-2 border-gray-200'}  p-5 cursor-pointer`}>
                      <div className='flex-1'>
                        <img className='w-60' src={imgMapNorth} alt="" srcset="" />
                        <div className='font-semibold text-sm'>Map Without Road Cutting</div>
                        <div className='text-gray-500 text-xs'>Map Without Road Cutting</div>
                      </div>
                    </div>

                    <div onClick={() => setSelectedMap(1)} className={` ${selectedMap == 1 ? 'border-2 border-indigo-500' : 'border-2 border-gray-200'}  p-5 cursor-pointer`}>
                      <div className='flex-1'>
                        <img className='w-60' src={imgMapSouth} alt="" srcset="" />
                        <div className='font-semibold text-sm'>Map With Road Cutting</div>
                        <div className='text-gray-500 text-xs'>Map With Road Cutting</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Site Inspection */}
              <div className='mt-10 border rounded shadow-lg p-2'>
                <h1 className='px-1 font-semibold font-serif text-gray-500'><MdTag className="inline" />Verification Report</h1>
                {/* <table className='min-w-full leading-normal mt-2 bg-white rounded-lg shadow-xl'>
                  <thead className='font-bold text-left text-sm border text-gray-800 bg-white'>
                    <tr>
                      <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Sl No.</th>
                      <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Particulars</th>
                      <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Proposed By Applicant</th>
                      <th className="px-2 py-3 border-b border-gray-200  text-xs uppercase text-left">Inspection Report</th>
                    </tr>
                  </thead>

                </table> */}


                <div className='space-y-3 text-sm'>

                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>01.</div>
                    <div className='col-span-4'>Property Type</div>
                    <div className='col-span-3'>{applicationFullData?.applicationDetails?.property_type ? applicationFullData?.applicationDetails?.property_type : "N/A"}</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="propertyType"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.water_property_type_mstr?.map((item, i) => (
                            <option value={item.id}>{item.property_type}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.propertyType && formik.errors.propertyType ? formik.errors.propertyType : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>02.</div>
                    <div className='col-span-4'>Total Area in Sq.Ft.</div>
                    <div className='col-span-3'>{applicationFullData?.applicationDetails?.area_sqft ? applicationFullData?.applicationDetails?.area_sqft : "N/A"}</div>
                    <div className='col-span-4'>
                      <div>
                        <input
                          type="text"
                          name="areaSqFt"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        />
                        <p className="text-red-500 text-xs">
                          {formik.touched.areaSqFt && formik.errors.areaSqFt ? formik.errors.areaSqFt : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>03.</div>
                    <div className='col-span-4'>Distribution Pipeline Report</div>
                    <div className='col-span-3'>{applicationFullData?.applicationDetails?.pipeline_type ? applicationFullData?.applicationDetails?.pipeline_type : "N/A"}</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="distributionPipelineType"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.water_param_pipeline_type?.map((item, i) => (
                            <option value={item.id}>{item.pipeline_type}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.distributionPipelineType && formik.errors.distributionPipelineType ? formik.errors.distributionPipelineType : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>04.</div>
                    <div className='col-span-4'>Distribution Pipeline Size (In MM)</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <input
                          type="text"
                          name="pipelineSize"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        />
                        <p className="text-red-500 text-xs">
                          {formik.touched.pipelineSize && formik.errors.pipelineSize ? formik.errors.pipelineSize : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>05.</div>
                    <div className='col-span-4'>Distribution Pipeline Size Type</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="pipelineType"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.pipeline_size_type?.map((item, i) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.pipelineType && formik.errors.pipelineType ? formik.errors.pipelineType : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>06.</div>
                    <div className='col-span-4'>Is Application Comes Under Regularization</div>
                    <div className='col-span-3'>{applicationFullData?.applicationDetails?.connection_type ? applicationFullData?.applicationDetails?.connection_type : "N/A"}</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="regularization"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.water_connection_type_mstr?.map((item, i) => (
                            <option value={item.id}>{item.connection_type}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.regularization && formik.errors.regularization ? formik.errors.regularization : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>07.</div>
                    <div className='col-span-4'>Permissible Pipe Diameter</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="diameter"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.pipe_diameter?.map((item, i) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.diameter && formik.errors.diameter ? formik.errors.diameter : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>08.</div>
                    <div className='col-span-4'>Permissible Pipe Quality</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="pipeQuality"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.pipe_quality?.map((item, i) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.pipeQuality && formik.errors.pipeQuality ? formik.errors.pipeQuality : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>09.</div>
                    <div className='col-span-4'>Permissible Ferrule Size</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="feruleSize"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.ferule_size?.map((item, i) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.feruleSize && formik.errors.feruleSize ? formik.errors.feruleSize : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>10.</div>
                    <div className='col-span-4'>Road Type</div>
                    <div className='col-span-3'>N/A</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="roadType"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          {masterData?.road_type?.map((item, i) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.roadType && formik.errors.roadType ? formik.errors.roadType : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-12'>
                    <div className='col-span-1'>11.</div>
                    <div className='col-span-4'>Applicant Category</div>
                    <div className='col-span-3'>{applicationFullData?.applicationDetails?.category ? applicationFullData?.applicationDetails?.category : "N/A"}</div>
                    <div className='col-span-4'>
                      <div>
                        <select
                          name="category"
                          onChange={formik.handleChange}
                          className="cursor-pointer w-full px-1 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                        >
                          <option value="">Select</option>
                          <option value="APL">APL</option>
                          <option value="BPL">BPL</option>
                        </select>
                        <p className="text-red-500 text-xs">
                          {formik.touched.category && formik.errors.category ? formik.errors.category : null}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>


              <div>
                <p className='py-5'>
                  I, .............................. being a Municipal PLI/JE, inspected the site for the provision of water supply system indicate above. I certify that this inspection was done within the guidelines established by RMC and was completed in a through and completed manner. I recommend this for technical approval.</p>
              </div>

              <div className='pb-5'>
                <p className='float-left'>
                  Date of Inspection : <span className='font-semibold'>{todayDate}</span>
                </p>
                {/* <p className='float-right'>                  Signature                </p> */}
              </div>
            </div>


            {successMessage && <div className='text-center mb-3 font-semibold text-base border mx-5'> <p className='text-green-700'>{successMessage}</p> </div>}
            {errorMessage && <div className='text-center mb-3 font-semibold text-base border mx-5'> <p className='text-red-700'>{errorMessage}</p> </div>}


            <div className='flex justify-center space-x-3  mt-5'>
              <button type='button' onClick={() => navigate(-1)} className='px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded'>Cancel</button>
              <button type="submit" className='px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded'>Save</button>
              <button type='button' className='px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded'>Print</button>
            </div>

          </form>
        </div>


      </div >
      <div className='w-full h-10'></div>
    </>
  )
}

export default WaterSiteInspectionForm