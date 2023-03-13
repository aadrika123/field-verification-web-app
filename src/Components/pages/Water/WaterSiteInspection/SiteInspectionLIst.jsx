import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { RiFilter2Line } from "react-icons/ri";
// import ListTable from "Components/Common/ListTable/ListTable";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import ApiHeader from "Components/ApiList/ApiHeader";
// import BarLoader from "Components/Common/BarLoader";
// import WaterApiList from "Components/ApiList/WaterApiList";
// import useSetTitle from "Components/GlobalData/useSetTitle";
import moment from 'moment'
import WaterApiList from "../../../api/WaterApiList";
import CommonLoader from "../../Common/CommonLoader";
import WaterSiteInspectionDateTimeModal from "./WaterSiteInspectionDateTimeModal";

function SiteInspectionLIst() {
    const [readymadeListData, setreadymadeListData] = useState();
    const [readymadeListStatus, setreadymadeListStatus] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [searchByDate, setSearchByDate] = useState(false)
    const [searchByApplication, setSearchByApplication] = useState(false)
    const [openModal, setOpenModal] = useState(0)
    const [applicationId, setApplicationId] = useState()

    const { api_waterSiteInspectionList, header } = WaterApiList()

    // useSetTitle("Water Site Inspection List")


    const validationSchema = yup.object({
        // fromDate: yup.string().required("This is a required field !"),

        fromDate: yup.string().when('searchBy', {
            is: 'byDate',
            then: yup.string().required('Field is required')
        }),
        toDate: yup.string().when('searchBy', {
            is: 'byDate',
            then: yup.string().required('Field is required')
        }),

        // toDate: yup.string().required("This is a required field !"),
        searchBy: yup.string().required("This is a required field !"),

        // categoryType: yup.string().when('propertyType', {
        //     is: '1',
        //     then: yup.string().required('Field is required')
        // }),

    });
    const formik = useFormik({
        initialValues: {
            fromDate: "",
            toDate: "",
            searchBy: "",
        },
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            fetchData(values);
        },
        validationSchema,
    });

    const navigate = useNavigate();

    //Fetch Data API

    const fetchData = (data) => {

        setisLoading(true)
        setreadymadeListStatus(false)
        const requestBody = {
            fromDate: moment(data.fromDate).format('DD-MM-YYYY'),
            toDate: moment(data.toDate).format('DD-MM-YYYY'),
            filterBy: data.searchBy,
            parameter: data.applicationNo
        };


        console.log('Payload..', requestBody)

        // return

        axios
            .post(api_waterSiteInspectionList, requestBody, header)
            .then((res) => {
                console.log('this ==== List of site inspection...', res?.data)

                setreadymadeListData(res?.data?.data)
                setreadymadeListStatus(true)
                setisLoading(false)
            })
            .catch((err) => {
                console.log("Error while fetching Filter Data", err)
                setreadymadeListStatus(false)
                setisLoading(false)

            });
    };


    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value

        { name === 'searchBy' && ((value == 'byDate') ? setSearchByDate(true) : setSearchByDate(false)) }
        { name === 'searchBy' && ((value == 'byApplication') ? setSearchByApplication(true) : setSearchByApplication(false)) }

    }

    const handleViewBtn = (id, date) => {
        console.log("Handle View Button Clicked..", date)

        if (date) {
            navigate(`/water-site-inspection-form/${id}`)
        } else {
            setApplicationId(id)
            setOpenModal(prev => prev + 1)
        }
    }

    const refetch = () => {
        console.log("Refetch Called..")
        formik.handleSubmit()
    }


    console.log("readymadeListreadymadeListDataStatus", readymadeListData)


    return (
        <>
            <WaterSiteInspectionDateTimeModal refetch={refetch} openModal={openModal} id={applicationId} />

            {isLoading && <CommonLoader />}
            <div className="border shadow-xl bg-white mt-6">
                <div className="flex justify-between mx-5 my-3">
                    <div className="flex ">
                        <p className="font-bold text-2xl text-gray-600">List of Site Inspection</p>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} onChange={handleChange}>
                    <div className="justify-center m-10 space-y-5">

                        <div className="">
                            <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                Search By
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="searchBy"
                                onChange={formik.handleChange}
                                className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                            >
                                <option value="">Select</option>
                                <option value="byDate">Date</option>
                                <option value="byApplication">Application No</option>
                            </select>
                            <p className="text-red-500 text-xs">
                                {formik.touched.searchBy && formik.errors.searchBy ? formik.errors.searchBy : null}
                            </p>
                        </div>

                        {searchByDate &&
                            <div className="space-y-5">
                                <div>
                                    <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                        From Data<span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="date"
                                        name="fromDate"
                                        onChange={formik.handleChange}
                                        className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                    />
                                    <p className="text-red-500 text-xs">
                                        {formik.touched.fromDate && formik.errors.fromDate ? formik.errors.fromDate : null}
                                    </p>
                                </div>
                                <div>
                                    <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                        To Data<span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="date"
                                        name="toDate"
                                        onChange={formik.handleChange}
                                        className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                    />
                                    <p className="text-red-500 text-xs">
                                        {formik.touched.toDate && formik.errors.toDate ? formik.errors.toDate : null}
                                    </p>
                                </div>
                            </div>
                        }

                        {searchByApplication &&
                            <div>
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                    Application No<span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="applicationNo"
                                    onChange={formik.handleChange}
                                    className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                />
                                <p className="text-red-500 text-xs">
                                    {formik.touched.applicationNo && formik.errors.applicationNo ? formik.errors.applicationNo : null}
                                </p>
                            </div>
                        }

                        <div className="text-center ">
                            <button
                                type="submit"
                                className="mt-3 w-full border border-indigo-600 bg-indigo-600 hover:bg-indigo-400 text-white hover:text-black shadow-lg rounded-sm text-base font-semibold px-5 py-1"
                            >
                                <p className=""> Search record </p>
                            </button>
                        </div>
                    </div>
                </form>
                {/* View Search Result in List Table */}
                <div className="m-10">
                    {/* {readymadeListData == false && data?.data?.status == true ? <ListTable columns={COLUMNS} dataList={data?.data?.data} /> : readymadeListData == false && <p className='text-center font-semibold'> No data Found!</p>} */}
                    {/* {readymadeListStatus && readymadeListData?.length != 0 &&
                        <ListTable columns={COLUMNS} dataList={readymadeListData} />
                    }
                    {
                        readymadeListStatus && readymadeListData?.length == 0 &&
                        <div className="text-xl font-semibold text-red-400 text-center">Data Not Found</div>
                    } */}




                </div>


                <div className="mt-10 mx-4">

                    {readymadeListData ?
                        <div className='w-full relative bg-indigo-50 shadow-md  rounded-sm pb-2 border-2 border-indigo-600 mb-4 select-none cursor-pointer' >
                            <div className='font-semibold bg-indigo-600 px-4 text-white'>Consumer Details</div>
                            <div className='w-full rounded-lg space-b-2'>
                                <div className=''>

                                    {readymadeListData && readymadeListData.map((item, i) => (
                                        <div>
                                            <div key={i} className='w-full md:w-[40%] grid grid-cols-12 p-4'>

                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Application No</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.application_no}</div>
                                                </>
                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Ward No</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.ward_name}</div>
                                                </>
                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Apply Date</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.apply_date ? moment(item?.apply_date, 'YYYY-MM-DD').format('DD-MMM-yy') : "N/A"}</div>
                                                </>
                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Scheduled Date</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.SiteInspectionDate?.inspection_date ? moment(item?.SiteInspectionDate?.inspection_date, 'YYYY-MM-DD').format('DD-MMM-yy') : "N/A"}</div>
                                                </>
                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Scheduled Time</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.SiteInspectionDate?.inspection_time ? moment(item?.SiteInspectionDate?.inspection_time, "h:mm:ss A").format("HH:mm A") : "N/A"}</div>
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
                                                    <div className='col-span-6 text-xs text-gray-600'>Property Type</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.property_type}</div>
                                                </>
                                                <>
                                                    <div className='col-span-6 text-xs text-gray-600'>Address</div>
                                                    <div className='col-span-6 font-semibold text-gray-700 2xl:text-base text-sm'>{item?.address}, {item?.pin}</div>
                                                </>

                                            </div>
                                            <div className="float-right -mt-4 -pl-1">
                                                <button type="button" onClick={() => handleViewBtn(item.id, item?.SiteInspectionDate?.inspection_date)} className="px-3 mt-1 rounded-l-sm -mr-0.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                                                    {item?.SiteInspectionDate?.site_verify_status ? "Start Re-Inspection" : (item?.SiteInspectionDate?.inspection_date ? "View Details" : "Schedule Inspection")}
                                                </button>
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

export default SiteInspectionLIst
