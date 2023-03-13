import React, { useEffect, useState } from 'react'
import { useFormik, Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import WaterApiList from '../../../api/WaterApiList'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const WaterApplyIndex = () => {
    const [ulbList, setUlbList] = useState()



    const [propertyTypeStatusToggle, setpropertyTypeStatusToggle] = useState(false)
    const [holdingtoggle, setHoldingtoggle] = useState(false)
    const [safToggle, setSafToggle] = useState(false)
    const [safHolding, setSafHolding] = useState()
    const [barLoader, setBarLoader] = useState(false)
    const [fetchedSafHoldingData, setFetchedSafHoldingData] = useState()

    const [ownerRecord, setOwnerRecord] = useState([])
    // const [finalOwnerData, setFinalOwnerData] = useState()

    const [formApplyError, setFormApplyError] = useState()
    const [ownerFieldError, setOwnerFieldError] = useState()
    const [isTenant, setIsTenant] = useState(false)

    const { header, api_ulbList } = WaterApiList();

    const navigate = useNavigate()

    const inputContainerStyle = `form-group col-span-4 md:col-span-1 mb-6 md:px-4`
    const inputLabelStyle = `form-label inline-block mb-1 text-gray-900 text-sm font-semibold`
    // const commonInputStyle = `form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-sm`

    const commonInputStyle = `bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer`



    //Formik Start
    const validationSchema = yup.object({

        typeofConnection: yup.string().required('Require'),
    })

    const initialValues = {

    }

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, resetForm) => {


            console.log("Value.....", values)
            // finalSubmitData(values)
        },
        // validationSchema
    })

    const handleOnChange = (event) => {
    }

    // Formik End


    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value



        { name === 'propertyType' && ((value == '1') ? setpropertyTypeStatusToggle(true) : setpropertyTypeStatusToggle(false)) }
        { name === 'connectionThrough' && ((value == '1') ? setHoldingtoggle(true) : setHoldingtoggle(false)) }
        { name === 'connectionThrough' && ((value == '2') ? setSafToggle(true) : setSafToggle(false)) }
        { name === 'ownerType' && ((value == '2') ? setIsTenant(true) : setIsTenant(false)) }


        // //allow restricted inputs

        { name == 'pincode' && formik.setFieldValue("pincode", allowNumberInput(value, formik.values.pincode, 6)) }
        { name == 'ownerName' && formik.setFieldValue("ownerName", allowCharacterInput(value, formik.values.ownerName, 60)) }
        { name == 'guardianName' && formik.setFieldValue("guardianName", allowCharacterInput(value, formik.values.guardianName, 60)) }
        { name == 'mobileNo' && formik.setFieldValue("mobileNo", allowNumberInput(value, formik.values.mobileNo, 10)) }

    };



    useEffect(() => {
        fetchULBList();
    }, [])



    const fetchULBList = () => {
        axios.get(`${api_ulbList}`, header)
            .then((res) => {
                console.log("LIst of ULB", res)
                setUlbList(res.data.data)
            })
            .catch((err) => console.log("Exception while feting ULB LIst", err))
    }

    return (

        <>
            <div className='text-center font-bold text-gray-700 text-lg border-b-2 border-gray-700 mx-4 mb-4'>
                <p> Applying For New Water Connection </p>
            </div>

            <form className='border-2 border-blue-700 bg-blue-50 mb-4 m-2' onChange={handleOnChange} onSubmit={formik.handleSubmit} >
                <h1 className='text-center font-semibold bg-blue-700 text-white uppercase text-lg'>Application Form</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 p-6">
                    <div className="col-span-4 grid grid-cols-1 md:grid-cols-4">

                        <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                            <label className='col-span-12 font-semibold mb-2'>Select ULB<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                            <span className='col-span-12'>
                                <select type='date' {...formik.getFieldProps('ulb')} value={formik.values.ulb} className='bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer'>
                                    <option value="">Select</option>
                                    {
                                        ulbList?.map((item) => (
                                            <option value={item.id}>{item.ulb_name}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.ulb && formik.errors.ulb ? formik.errors.ulb : null}</span>
                            </span>
                        </div>

                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Connection Through</label>
                            <select {...formik.getFieldProps('connectionThrough')} className={`${commonInputStyle} cursor-pointer `}>
                                <option value=""> Select </option>
                                <option value="1">Holding No.</option>
                                <option value="2">SAF No.</option>
                            </select>
                            <p className='text-red-500 text-xs'>{formik.touched.connectionThrough && formik.errors.connectionThrough ? formik.errors.connectionThrough : null}</p>
                        </div>


                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*
                            </small>
                                {!holdingtoggle && !safToggle && "Select Connection Through"}
                                {holdingtoggle && "Enter Holding No."}
                                {safToggle && "Enter SAF No."}
                            </label>

                            {safToggle || holdingtoggle ?
                                <input type="text" required value={safHolding} onBlur={handleSafHolding} onChange={(e) => setSafHolding(e.target.value)} name="holdingNo" className={`${commonInputStyle} `} />
                                : <input type="text" disabled className={`${commonInputStyle} bg-gray-100 `} />
                            }
                            <p className='text-red-500 text-xs'>{formik.touched.holdingNo && formik.errors.holdingNo ? formik.errors.holdingNo : null}</p>
                            {fetchedSafHoldingData && <p className='text-red-400 text-sm'>{fetchedSafHoldingData?.message}</p>}
                        </div>


                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Type of Request</label>
                            <select {...formik.getFieldProps('typeofConnection')} className={`${commonInputStyle} cursor-pointer `}>
                                <option value="">select</option>
                                <option value="1">New Connection</option>
                                <option value="2">Regularization</option>
                            </select>
                            <p className='text-red-500 text-xs'>{formik.touched.typeofConnection && formik.errors.typeofConnection ? formik.errors.typeofConnection : null}</p>
                        </div>

                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Owner Type</label>

                            {fetchedSafHoldingData?.tenanted ?
                                <select {...formik.getFieldProps('ownerType')} className={`${commonInputStyle} `}>
                                    <option value="">select</option>
                                    <option value="1">Owner</option>
                                    <option value="2">Tenant</option>
                                </select>
                                :
                                <div>
                                    <input type="text" disabled value="Owner" className={`${commonInputStyle} bg-gray-100`} />
                                </div>

                            }
                            <p className='text-red-500 text-xs'>{formik.touched.ownerType && formik.errors.ownerType ? formik.errors.ownerType : null}</p>
                        </div>

                    </div>

                    <div className="col-span-4 grid grid-cols-3">
                        <div className={`${inputContainerStyle}`}>

                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Property Type</label>
                            <select {...formik.getFieldProps('propertyType')} className={`${commonInputStyle} cursor-pointer `}>
                                <option value="">Select</option>
                                {
                                    fetchedSafHoldingData?.usageType?.length > 0 &&
                                    fetchedSafHoldingData?.usageType?.map((item) => (
                                        <option value={item.id}>{item.usageType}</option>
                                    ))
                                }
                                <option value="7">Apartment / Multistory Building</option>

                            </select>
                            <p className='text-red-500 text-xs'>{formik.touched.propertyType && formik.errors.propertyType ? formik.errors.propertyType : null}</p>
                        </div>

                        {/* {flatCountToggle ?
            <div className={`${inputContainerStyle}`}>
                <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Flat Count</label>
                <input type="text" {...formik.getFieldProps('flatCount')} className={`${commonInputStyle}`} />

                <p className='text-red-500 text-xs'>{formik.touched.flatCount && formik.errors.flatCount ? formik.errors.flatCount : null}</p>
            </div>                                : */}

                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Category Type</label>
                            <select disabled={!propertyTypeStatusToggle} {...formik.getFieldProps('categoryType')} type="text" className={`${commonInputStyle} ${!propertyTypeStatusToggle && 'bg-gray-300 opacity-30'}`}  >
                                <option value="">Select</option>
                                <option value="APL">APL</option>
                                <option value="BPL">BPL</option>
                            </select>
                            <p className='text-red-500 text-xs'>{formik.touched.categoryType && formik.errors.categoryType ? formik.errors.categoryType : null}</p>
                        </div>

                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small>Pipeline Type</label>
                            <select disabled={!propertyTypeStatusToggle} {...formik.getFieldProps('pipelineType')} type="date" className={`${commonInputStyle} ${!propertyTypeStatusToggle && 'bg-gray-300 opacity-30'}`}  >
                                <option value="">Select</option>
                                <option value="2">New Pipeline</option>
                                <option value="1">Old Pipeline</option>
                            </select>
                            <p className='text-red-500 text-xs'>{formik.touched.pipelineType && formik.errors.pipelineType ? formik.errors.pipelineType : null}</p>
                        </div>
                    </div>


                    <div className="col-span-4 grid grid-cols-3">
                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>Ward No.</label>

                            <div>
                                <input disabled type="text" {...formik.getFieldProps('old_ward_no')} className={`${commonInputStyle} bg-gray-100 `} />
                                <input type="hidden" {...formik.getFieldProps('wardNo')} className={`${commonInputStyle} bg-gray-100 `} />
                            </div>

                        </div>
                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>Total Area(Sq.Ft.)</label>
                            <input disabled type="text" {...formik.getFieldProps('totalArea')} className={`${commonInputStyle} bg-gray-100 `} />
                            <p className='text-red-500 text-xs'>{formik.touched.totalArea && formik.errors.totalArea ? formik.errors.totalArea : null}</p>
                        </div>

                        {/* <div className={`${inputContainerStyle}`}>
            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>Landmark</label>
            <input type="text" {...formik.getFieldProps('landmark')} className={`${commonInputStyle}`} />
            <p className='text-red-500 text-xs'>{formik.touched.landmark && formik.errors.landmark ? formik.errors.landmark : null}</p>
        </div> */}
                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>Pincode</label>
                            <input type="text" disabled {...formik.getFieldProps('pincode')} className={`${commonInputStyle} bg-gray-100`} />
                            <p className='text-red-500 text-xs'>{formik.touched.pincode && formik.errors.pincode ? formik.errors.pincode : null}</p>
                        </div>
                    </div>
                    <div className="col-span-4 grid grid-cols-1">
                        <div className={`${inputContainerStyle}`}>
                            <label className={`${inputLabelStyle}`}><small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>Address</label>
                            <textarea type="text" disabled {...formik.getFieldProps('address')} className={`${commonInputStyle} bg-gray-100`} />
                            <p className='text-red-500 text-xs'>{formik.touched.address && formik.errors.address ? formik.errors.address : null}</p>
                        </div>
                    </div>

                    {/* List of Property Owners */}
                    {fetchedSafHoldingData?.owners &&
                        <div className="col-span-4 grid grid-cols-1">
                            <div className={`${inputContainerStyle}`}>
                                <div className='p-2 bg-indigo-500 rounded text-white'>
                                    <p className='font-semibold text-gray-200 flex text-xs'> <span className='mt-0.5 mr-1'>< GoInfo /></span> List of Owner(s) from Property</p>
                                    {/* <p className='font-semibold text-gray-200 text-xs'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                                </div>
                                <table class="table-auto w-full mt-4 border rounded-md shadow-md">
                                    <thead class="text-xs text-left text-gray-900 bg-indigo-300">
                                        <tr>
                                            <th></th>
                                            <th class="p-2">
                                                <div class="">Sl</div>
                                            </th>

                                            <th class="p-2">
                                                <div class="">Applicant Name</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Applicant Father</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Phone No</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Email</div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody class="text-sm divide-y divide-gray-100">
                                        <>
                                            {
                                                fetchedSafHoldingData?.owners?.map((items, index) => (
                                                    <tr>
                                                        <td></td>
                                                        <td class="p-2">
                                                            <div class="font-semibold text-gray-800 text-left text-xs">
                                                                {index + 1}.
                                                            </div>
                                                        </td>

                                                        <td class="p-2">
                                                            <div class="font-medium text-gray-800 text-left text-xs">
                                                                {items?.ownerName ? items?.ownerName : "N/A"}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="text-left">
                                                                {items?.guardianName ? items?.guardianName : "N/A"}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="text-left font-medium text-gray-800  text-xs">
                                                                {items?.mobileNo ? items?.mobileNo : "N/A"}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="font-medium text-gray-800 text-left text-xs">
                                                                {items?.email ? items?.email : "N/A"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    }

                    <div className="col-span-4 grid grid-cols-1">
                        {ownerRecord.length == 0 ? <p className='text-center font-semibold text-sm  text-red-500'></p> :
                            <div className={`${inputContainerStyle}`}>
                                <div className='p-2 bg-yellow-200 rounded'>
                                    <p className='font-semibold text-gray-800 flex'> <span className='mt-0.5 mr-1'>< GoInfo /></span> List of Tenet</p>
                                    <p className='text-sm font-semibold text-gray-700'>You can add or remove water Tenet from below actions.</p>
                                </div>
                                <table class="table-auto w-full mt-4 border rounded-md shadow-md">
                                    <thead class="text-xs text-left text-gray-900 bg-sky-300">
                                        <tr>
                                            <th></th>
                                            <th class="p-2">
                                                <div class="">Sl</div>
                                            </th>

                                            <th class="p-2">
                                                <div class="">Applicant Name</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Applicant Father</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Phone No</div>
                                            </th>
                                            <th class="p-2">
                                                <div class="">Email</div>
                                            </th>
                                            <th class="p-2">
                                                <div class=" text-center">Delete</div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody class="text-sm divide-y divide-gray-100">
                                        <>
                                            {
                                                ownerRecord?.map((items, index) => (
                                                    <tr>
                                                        <td></td>
                                                        <td class="p-2">
                                                            <div class="font-semibold text-gray-800 text-left text-xs">
                                                                {index + 1}.
                                                            </div>
                                                        </td>

                                                        <td class="p-2">
                                                            <div class="font-medium text-gray-800 text-left text-xs">
                                                                {items?.ownerName}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="text-left">
                                                                {items?.guardianName}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="text-left font-medium text-gray-800  text-xs">
                                                                {items?.mobileNo}
                                                            </div>
                                                        </td>
                                                        <td class="p-2">
                                                            <div class="font-medium text-gray-800 text-left text-xs">
                                                                {items?.email}
                                                            </div>
                                                        </td>
                                                        <td class="">
                                                            <div class="flex justify-center">
                                                                <button type='button' onClick={() => handleRemove(index)} >
                                                                    {/* <button type='button' > */}
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-red-500 hover:text-red-700">
                                                                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))}
                                        </>
                                    </tbody>

                                </table>
                            </div>
                        }
                    </div>


                    {/* Tenet Applicant Details */}
                    {isTenant &&
                        <div className="col-span-4 grid grid-cols-4">
                            <div className={`${inputContainerStyle}`}>
                                <label className={`${inputLabelStyle}`}>Applicant Name <small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input type="text" {...formik.getFieldProps('ownerName')} className={`${commonInputStyle} `} onChange={formik.handleChange} />
                                {/* <p className='text-red-500 text-xs'>{formik.touched.ownerName && formik.errors.ownerName ? formik.errors.ownerName : null}</p> */}
                                <p className='text-red-500 text-xs'>{ownerFieldError?.ownerName && ownerFieldError?.ownerName}</p>
                            </div>
                            <div className={`${inputContainerStyle}`}>
                                <label className={`${inputLabelStyle}`}>Guardian Name <small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input type="text" {...formik.getFieldProps('guardianName')} className={`${commonInputStyle}`} onChange={formik.handleChange} />
                                <p className='text-red-500 text-xs'>{ownerFieldError?.guardianName && ownerFieldError?.guardianName}</p>
                            </div>
                            <div className={`${inputContainerStyle}`}>
                                <label className={`${inputLabelStyle}`}>Mobile No <small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input type="text" {...formik.getFieldProps('mobileNo')} className={`${commonInputStyle}`} onChange={formik.handleChange} />
                                <p className='text-red-500 text-xs'>{ownerFieldError?.mobileNo && ownerFieldError?.mobileNo}</p>
                            </div>
                            <div className={`${inputContainerStyle}`}>
                                <label className={`${inputLabelStyle}`}>Email Id </label>
                                <input {...formik.getFieldProps('email')} className={`${commonInputStyle}`} onChange={formik.handleChange} />
                                <p className='text-red-500 text-xs'>{formik.touched.email && formik.errors.email ? formik.errors.email : null}</p>
                            </div>

                            <div className='col-span-4 grid grid-cols-1'>
                                <div className='col-span-4'>
                                    <div className='float-right mr-4 -mt-4 mb-5'>
                                        <button type="button" onClick={handleMultipleOwner} className="bg-cyan-500 hover:bg-cyan-400 text-sm text-white px-3 py-1 rounded" >Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="col-span-4 mb-3">
                        <div className='text-center text-red-600 font-semibold'>
                            {formApplyError && "Error : " + formApplyError}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className='flex justify-center'>
                            <div className='space-x-8 flex'>
                                <button type="button" onClick={() => navigate("/view-water")} className=" px-5 py-2 bg-red-600 text-white font-medium text-sm leading-tight  rounded  hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out">Cancel</button>

                                <button type="submit" className=" px-5 py-2 bg-indigo-600 text-white font-medium text-sm leading-tight  rounded  hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">Submit Form</button>
                            </div>
                        </div>
                    </div>

                </div>
            </form>

            {/* <form className='border-2 border-blue-700 bg-blue-50 mb-4 m-2' onChange={handleOnChange} onSubmit={formik.handleSubmit} >
                <h1 className='text-center font-semibold bg-blue-700 text-white uppercase text-lg'>Application Form</h1>

                <div className='p-6'>

                    <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                        <label className='col-span-12 font-semibold mb-2'>Select ULB<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                        <span className='col-span-12'>
                            <select type='date' {...formik.getFieldProps('ulb')} value={formik.values.ulb} className='bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer'>
                                <option value="">Select</option>
                                {
                                    ulbList?.map((item) => (
                                        <option value={item.id}>{item.ulb_name}</option>
                                    ))
                                }
                            </select>
                            <span className="text-red-600 text-xs">{formik.touched.ulb && formik.errors.ulb ? formik.errors.ulb : null}</span>
                        </span>
                    </div>


                </div>

                <div className='text-center space-x-5 my-5'>
                    <button onClick={() => navigate(-1)} type='button' className='bg-red-500 hover:bg-red-600 px-2 py-1 text-white text-sm'>Cancel</button>
                    <button type='submit' className='bg-indigo-500 hover:bg-indigo-600 px-2 py-1 text-white text-sm'>Submit</button>
                </div>

            </form> */}
        </>
    )
}

export default WaterApplyIndex
