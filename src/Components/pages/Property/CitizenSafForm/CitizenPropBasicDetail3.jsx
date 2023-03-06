//////////////////{*****}//////////////////////////////////////////
// >Author - swati sharma
// >Version - 1.0
// >Date - 7 oct 2022
// >Revision - 1
// >Project - JUIDCO
// >Component  - CitizenPropBasicDetail
// >DESCRIPTION - CitizenPropBasicDetail Component
//////////////////{*****}//////////////////////////////////////////

import { useState, useEffect } from 'react'
import { FaHome } from 'react-icons/fa'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { getCurrentDate, allowFloatInput } from '../../Common/PowerUps/PowerupFunctions'
// import { inputContainerStyle, commonInputStyle, inputErrorStyle, inputLabelStyle } from '../../Common/CommonTailwind/CommonTailwind'
import { useNavigate } from 'react-router-dom'
import CitizenApplyApiList from '../../../api/CitizenApplyApiList'
import axios from 'axios'
import ApiHeader from '../../../api/ApiHeader'
import { AiFillInfoCircle } from 'react-icons/ai'

function CitizenPropBasicDetail3(props) {

    const navigate = useNavigate()

    const [mobileTowerStatusToggle, setMobileTowerStatusToggle] = useState(false)
    const [hoardingStatusToggle, setHoardingStatusToggle] = useState(false)
    const [petrolPumpStatusToggle, setPetrolPumpStatusToggle] = useState(false)
    const [wardByUlb, setwardByUlb] = useState()
    const [newWardList, setnewWardList] = useState()
    const [selectedUlbId, setselectedUlbId] = useState()
    const [holdingNoList, setholdingNoList] = useState([])

    const [apartmentList, setapartmentList] = useState()
    const [apartmentName, setapartmentName] = useState('')
    const [holdingVerificationStatus, setholdingVerificationStatus] = useState(false)

    const [basicViewForm, setbasicViewForm] = useState({ mobileTowerStatus: '0', hoardingStatus: '0', petrolPumpStatus: '0', waterHarvestingStatus: '0' })

    const { api_wardByUlb, api_newWardByOldWard, api_zoneByUlb, api_verifyHolding, api_getApartmentListByWard } = CitizenApplyApiList()

    console.log("passing master data to basic detail form", props.preFormData)
    const validationSchema = yup.object({
        dateOfPurchase: yup.string(),
        transferMode: yup.string(),
        ulbId: yup.string().required('Select ULB'),
        wardNo: yup.string().required('Select ward'),
        newWardNo: yup.string().required('Select new ward'),
        ownerShiptype: yup.string().required('Select ownership type'),
        propertyType: yup.string().required('Select property'),
        apartment: yup.string(),
        landOccupationDate: yup.string()
    })

    const initialValues = {
        transferMode: '',
        dateOfPurchase: '',
        ulbId: '',
        wardNo: '',
        newWardNo: '',
        ownerShiptype: '',
        propertyType: '',
        landOccupationDate: '',
        apartment: ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, resetForm) => {

            // INJECTING HOLDING NO ARRAY IF AMALGAMATION CASE 
            if (props?.safType == 'am') {
                values.holdingNoLists = holdingNoList
            }

            // APT-5 INJECTING APARTMENT NAME IN CASE OF FLATS 
            if (props?.apartmentStatus == true) {
                values.appartmentName = apartmentName //NOT NEED TO SET APARTMENT ID AS IT IS ALREADY IN APARTMENT KEY
            }



            console.log('basic deatils ', values)
            props.collectFormDataFun('basicDetails', values, basicViewForm) //sending BasicDetails data to parent to store all form data at one container
            props.nextFun(1) //forwarding to next form level
        }
        , validationSchema
    })

    console.log("formik values", initialValues);

    const seleOptions = [
        { option: 'one', value: 1 },
        { option: 'two', value: 2 },
        { option: 'three', value: 3 },
        { option: 'four', value: 4 },
        { option: 'five', value: 5 },
        { option: 'six', value: 6 },
    ]
    const handleOnChange = (event) => {
        // console.log('input type', event.target[event.target.selectedIndex].text)
        let name = event.target.name
        let value = event.target.value
        { name == 'ulbId' && props?.getLocationByUlb(value) }
        { name == 'ulbId' && fetchWardByUlb(value) }
        { name == 'ulbId' && fetchZoneByUlb(value) }
        { name == 'wardNo' && fetchNewWardByOldWard(value) }
        { name == 'wardNo' && fetchApartmentByOldWard(value) }

        // 1 VACCANT LAND DIRECT CASE
        { name == 'propertyType' && props?.setpropertyTypeState(value) }

        // APT-2 SHOW APARtMENT INPUT IF FLATS SELECTED
        if (name == 'propertyType') {
            { value == 3 ? props?.setapartmentStatus(true) : props?.setapartmentStatus(false) }
        }

        // APT-3 SET APARTMENT NAME
        if (name == 'apartment') {
            setapartmentName(event.target[event.target.selectedIndex].text)
        }



        //* Collecting basic details to preview
        if (event.target.type == 'select-one') {
            setbasicViewForm({ ...basicViewForm, [name]: event.target[event.target.selectedIndex].text })
        } else {
            setbasicViewForm({ ...basicViewForm, [name]: value })
        }

    };


    useEffect(() => {

        if (props?.safType == 're' || props?.safType == 'mu' || props?.safType == 'cedit') {
            feedPropertyData()
        }
        if (props?.safType == 'new') {
            feedUlbDetails()
        }
    }, [props?.existingPropertyDetails])

    console.log('existing property details...', props?.existingPropertyDetails?.data?.data)

    // SETTING ULBID FROM WELCOME SCREEN
    const feedUlbDetails = () => {
        formik.setFieldValue('ulbId', props?.choosedUlbId)
        props?.getLocationByUlb(props?.choosedUlbId)
        fetchWardByUlb(props?.choosedUlbId)
        fetchZoneByUlb(props?.choosedUlbId)
    }

    const feedPropertyData = () => {

        let previewDetails
        let basicDetails

        //* FEEDING PROPERTY DATA
        formik.setFieldValue('ulbId', props?.existingPropertyDetails?.data?.data?.ulb_id)
        // FETCH THOSE LIST WHICH COMES ONCHANGE EVEN OF ULB AND WARD AND THEN SET WARD,NEWWARD,ZONE AFTER RESPONSE
        fetchWardByUlb(props?.existingPropertyDetails?.data?.data?.ulb_id)
        setselectedUlbId(props?.existingPropertyDetails?.data?.data?.ulb_id)
        fetchZoneByUlb(props?.existingPropertyDetails?.data?.data?.ulb_id)
        fetchNewWardByOldWard(JSON.stringify(props?.existingPropertyDetails?.data?.data?.ward_mstr_id))


        formik.setFieldValue('ownerShiptype', props?.existingPropertyDetails?.data?.data?.ownership_type_mstr_id)
        formik.setFieldValue('propertyType', props?.existingPropertyDetails?.data?.data?.prop_type_mstr_id)
        // formik.setFieldValue('zone', props?.existingPropertyDetails?.data?.data?.zone_mstr_id)

        // 2 VACCANT LAND REASSESSMENT / MUTATION CASE
        props?.setpropertyTypeState(props?.existingPropertyDetails?.data?.data?.prop_type_mstr_id)

        //* ARRANGING MAIN DATA
        basicDetails = {
            ulbId: props?.existingPropertyDetails?.data?.data?.ulb_id,
            wardNo: props?.existingPropertyDetails?.data?.data?.ward_mstr_id,
            newWardNo: props?.existingPropertyDetails?.data?.data?.new_ward_mstr_id,
            ownerShiptype: props?.existingPropertyDetails?.data?.data?.ownership_type_mstr_id,
            propertyType: props?.existingPropertyDetails?.data?.data?.prop_type_mstr_id,
            // zone: props?.existingPropertyDetails?.data?.data?.zone_mstr_id,

        }
        //* ARRANGING PREVIEW DATA
        previewDetails = {
            ulbId: props?.existingPropertyDetails?.data?.data?.ulb_id,
            wardNo: props?.existingPropertyDetails?.data?.data?.ward_mstr_id,
            newWardNo: props?.existingPropertyDetails?.data?.data?.new_ward_mstr_id,
            ownerShiptype: props?.existingPropertyDetails?.data?.data?.ownership_type,
            propertyType: props?.existingPropertyDetails?.data?.data?.property_type,
            // zone: props?.existingPropertyDetails?.data?.data?.zone_mstr_id,

        }

        console.log('auto feed data.....basic...', basicDetails, previewDetails)
        props.collectFormDataFun('basicDetails', basicDetails, previewDetails) //sending BasicDetails data to parent to store all form data at one container
        setbasicViewForm(previewDetails)
    }

    let safType = props.safType
    console.log("saf type...", props.safType)
    console.log('preview basic detals....', basicViewForm)


    const fetchWardByUlb = (ulbId) => {
        console.log('before fetch wardby ulb...')
        setselectedUlbId(ulbId)
        axios.post(api_wardByUlb, { ulbId: ulbId }, ApiHeader())
            .then(function (response) {
                console.log('wardlist by ulb ....', response.data.data)
                setwardByUlb(response.data.data)
                formik.setFieldValue('wardNo', props?.existingPropertyDetails?.data?.data?.ward_mstr_id)

            })
            .catch(function (error) {
                console.log('errorrr.... ', error);
            })
    }
    const fetchZoneByUlb = (ulbId) => {
        console.log('before fetch zone by ulb...')
        setselectedUlbId(ulbId)
        axios.post(api_zoneByUlb, { ulbId: ulbId }, ApiHeader())
            .then(function (response) {
                console.log('zone list by ulb ....', response.data.data)
                props?.setzoneList(response.data.data)
            })
            .catch(function (error) {
                console.log('zone list error errorrr.... ', error);
            })
    }
    const fetchNewWardByOldWard = (oldWardId) => {
        let requestBody = {
            oldWardMstrId: oldWardId,
            ulbId: selectedUlbId
        }
        console.log('before fetch wardby old ward...', requestBody)

        axios.post(api_newWardByOldWard, requestBody, ApiHeader())
            .then(function (response) {
                console.log('wardlist by oldward list ....', response.data.data)
                setnewWardList(response.data.data)
                formik.setFieldValue('newWardNo', props?.existingPropertyDetails?.data?.data?.new_ward_mstr_id)
            })
            .catch(function (error) {
                console.log('errorrr.... ', error);
            })
    }

    // APT-4 FETCHING APARTMENTLIST IN CASE OF FLATS BY WARD NO
    const fetchApartmentByOldWard = (oldWardId) => {
        let requestBody = {
            wardMstrId: oldWardId,
            ulbId: selectedUlbId
        }
        console.log('before fetch apartment by old ward...', requestBody)

        axios.post(api_getApartmentListByWard, requestBody, ApiHeader())
            .then(function (response) {
                console.log('apartment list ....', response.data.data)
                setapartmentList(response.data.data)
            })
            .catch(function (error) {
                console.log('apartment error.... ', error);
            })
    }

    // FUNCTION TO REMOVE HOLDING ROW INPUT
    const removeHoldingNo = (index) => {
        setholdingNoList(current =>
            current.filter((ct, cIndex) => {
                return cIndex != index
            }),
        );
    }

    // FUNCTION TO ADD HOLDING ROW INPUT
    const addHoldingRow = () => {
        let tempHoldingRowCount = [...holdingNoList]
        let modifiedRowCount = [...tempHoldingRowCount, formik.values?.holdingNo]
        setholdingNoList(modifiedRowCount)
        formik.setFieldValue('holdingNo', '')
    }

    const verifyHolding = () => {
        let requestBody = {
            holdingNo: formik.values.holdingNo,
            ulbId: 2
        }
        axios.post(api_verifyHolding, requestBody, ApiHeader())
            .then(function (response) {
                console.log('verify holding response..', response.data)
                setholdingVerificationStatus(response?.data?.status)

            })
            .catch(function (error) {
                console.log('verify holding error.... ', error);
            })
    }

    const containerStyle = 'grid grid-cols-12 text-sm text-gray-700 mb-6 '
    const commonInputStyle = 'bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer '

    return (
        <>
             <form className='border-2 border-blue-700 bg-blue-50 mb-4 m-2'  onChange={handleOnChange} onSubmit={formik.handleSubmit} >
                <h1 className='text-center font-semibold bg-blue-700 text-white uppercase text-lg'>Basic Detatils</h1>



                        <div className="p-6">

                            {props?.safType == 'mu' && <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>Transfer Mode<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <select id='basic_details_1' {...formik.getFieldProps('transferMode')} value={formik.values.transferMode} className='bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer'>
                                    <option value="" disabled selected>Select Transfer Mode</option>
                                    {
                                        props?.preFormData?.transfer_mode.map((data) => (
                                            <option value={data.id}>{data.transfer_mode}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.transferMode && formik.errors.transferMode ? formik.errors.transferMode : null}</span>
                                </span>
                            </div>
                            }

                            {props?.safType == 'mu' && <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>Date of Purchase<small className="block mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <input type='date' {...formik.getFieldProps('dateOfPurchase')} value={formik.values.dateOfPurchase} className='bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer' />
                                <span className="text-red-600 text-xs">{formik.touched.dateOfPurchase && formik.errors.dateOfPurchase ? formik.errors.dateOfPurchase : null}</span>
                                </span>
                            </div>
                            }

                            <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>ULB<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                    <select id='basic_details_1' {...formik.getFieldProps('ulbId')} value={formik.values.ulbId} className='bg-white px-2 py-1 w-full rounded-sm shadow-md border-[1px] border-gray-400 cursor-pointer'>
                                    <option value="" disabled selected>select ULB</option>
                                    <option value="2" >Ranchi Nagar Nigam</option>
                                    {/* {
                                            props?.ulbList?.map((data) => (
                                                <option value={data.id}>{data.ulb_name}</option>
                                            ))
                                        } */}
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.ulbId && formik.errors.ulbId ? formik.errors.ulbId : null}</span>
                                </span>
                                
                            </div>

                            <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>Old Ward No<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <select {...formik.getFieldProps('wardNo')} value={formik.values.wardNo} className={`${commonInputStyle} cursor-pointer cypress_ward`}>
                                    <option value="" disabled selected>select ward</option>
                                    {/* <option value="50" selected>50</option> */}
                                    {
                                        wardByUlb?.map((data) => (
                                            <option value={data.id}>{data.ward_name}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.wardNo && formik.errors.wardNo ? formik.errors.wardNo : null}</span>
                                </span>
                                <div className='col-span-12 mt-2'> <label className={`form-label text-xs mb-1 text-gray-400  font-semibold flex items-center`}><AiFillInfoCircle className="inline" />Select ulb to get ward list</label></div>

                            </div>

                            <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>New Ward No<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <select {...formik.getFieldProps('newWardNo')} value={formik.values.newWardNo} className={`${commonInputStyle} cursor-pointer cypress_new_ward`} >
                                    <option value="" disabled selected>select new ward</option>
                                    {/* <option value="50" selected>50</option> */}

                                    {
                                        newWardList?.map((data) => (
                                            <option value={data.id}>{data.ward_name}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.newWardNo && formik.errors.newWardNo ? formik.errors.newWardNo : null}</span>
                                </span>
                                <div className='col-span-12 mt-2'> <label className={`form-label text-xs mb-1 text-gray-400  font-semibold flex items-center`}><AiFillInfoCircle className="inline" />Select old ward to get new ward list</label>
                            </div>
                            </div>

                            <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>Ownership Type<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <select  {...formik.getFieldProps('ownerShiptype')} value={formik.values.ownerShiptype} className={`${commonInputStyle} cursor-pointer cypress_ownership_type`}
                                >
                                    <option value="" disabled selected>select ownership type--</option>
                                    {
                                        props?.preFormData?.ownership_types.map((data) => (
                                            <option value={data.id}>{data.ownership_type}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.ownerShiptype && formik.errors.ownerShiptype ? formik.errors.ownerShiptype : null}</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                                <label className='col-span-12 font-semibold mb-2'>Property Type<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <span className='col-span-12'>
                                <select {...formik.getFieldProps('propertyType')} value={formik.values.propertyType} className={`${commonInputStyle} cursor-pointer cypress_property_type`}
                                >
                                    <option value="" disabled selected>select property type</option>
                                    {
                                        props?.preFormData?.property_type.map((data) => (
                                            <option value={data.id}>{data.property_type}</option>
                                        ))
                                    }
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.propertyType && formik.errors.propertyType ? formik.errors.propertyType : null}</span>
                                </span>
                            </div>

                            {props?.apartmentStatus && <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                            <label className='col-span-12 font-semibold mb-2'>Apartment<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                                                <span className='col-span-12'>
                                <select {...formik.getFieldProps('apartment')} className={`${commonInputStyle} cursor-pointer cypress_property_type`}
                                >
                                    <option value="" >Select</option>
                                    {
                                        apartmentList?.map((data) => (
                                            <option value={data.id}>{data.apartment_name}</option>
                                        ))
                                    }
                                </select></span>
                                <span className="text-red-600  text-xs">{formik.touched.apartment && formik.errors.apartment ? formik.errors.apartment : null}</span>
                            </div>}
                            {props?.propertyTypeState == 4 && <div className="grid grid-cols-12 text-sm text-gray-700 mb-6">
                            <label className='col-span-12 font-semibold mb-2'>Land Purchase Date<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                                                <span className='col-span-12'>
                                <input {...formik.getFieldProps('landOccupationDate')} type='date' className={`${commonInputStyle} cursor-pointer cypress_property_type`}
                                /></span>
                                <span className="text-red-600  text-xs">{formik.touched.landOccupationDate && formik.errors.landOccupationDate ? formik.errors.landOccupationDate : null}</span>
                            </div>}

                            <div className=' text-center col-span-12 mt-10'>
                                <button type="submit" className="cypress_next1_button px-4 py-1.5 bg-indigo-500 text-white font-medium text-xs leading-tight  rounded  hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">Save & Next</button>
                            </div>

                        </div>

                </form>

           
        </>
    )
}

export default CitizenPropBasicDetail3