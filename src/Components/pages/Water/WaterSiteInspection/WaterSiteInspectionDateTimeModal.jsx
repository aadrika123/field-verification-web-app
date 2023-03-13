//////////////////////////////////////////////////////////////////////////////////////
//    Author - Dipu Singh
//    Version - 1.0
//    Date - 06 Dec 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - 
//    DESCRIPTION - 
//////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
// import WaterApiList from '../../../Components/ApiList/WaterApiList';
import { useNavigate } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner'
import { string } from 'yup'
import moment from 'moment'
import { useFormik } from 'formik'
import * as yup from 'yup'
import WaterApiList from "../../../api/WaterApiList";
// import { allowNumberInput, getCurrentDate } from "Components/Common/PowerUps/PowerupFunctions";
// import WaterApiList from "Components/ApiList/WaterApiList";

const customStyles = {
    overlay: {
        // background: "rgba(0, 0, 0, 0.5)",
        background: "#e6e6fc",
        // overflowY: "scroll"
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-40%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "transparent",
        border: "none",
        height: "500px", //or maxHeight
    },
};

function WaterSiteInspectionDateTimeModal(props) {
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [errorMsg, setErrorMsg] = useState(false)

    const id = props.id;
    const navigate = useNavigate()

    const { api_waterInspectionSaveDate, header } = WaterApiList()


    //Formik Start

    const validationSchema = yup.object({
        inspectionTime: yup.string().required('Enter Meter Reading'),
        inspectionDate: yup.string().required('Select Connection Date'),
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            inspectionTime: '',
            inspectionDate: '',
            applicationId: id
        },

        onSubmit: (values, resetForm) => {
            console.log("The Final Data is...", values)
            submitForm(values)
        }
        , validationSchema
    })


    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // let file = e.target.files[0];


        // { (name == 'connectionType') && setConnectionType(value) }

        //allow restricted inputs
        // { name == 'inspectionTime' && formik.setFieldValue("inspectionTime", allowNumberInput(value, formik.values.inspectionTime, 20)) }
        // { name == 'meterNo' && formik.setFieldValue("meterNo", allowNumberInput(value, formik.values.inspectionTime, 20)) }
        // { name == 'meterNo' && formik.setFieldValue("meterNo", getCurrentDate(value, formik.values.meterNo, 20)) }
        // { name == 'meterImage' && setDocPath(e.currentTarget.files[0]) }
    }

    //Formik End

    const submitForm = (data) => {
        setErrorMsg(false)

        const payload = {
            "applicationId": data?.applicationId,
            "inspectionDate": moment(data?.inspectionDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
            "inspectionTime": data?.inspectionTime
        }

        axios.post(api_waterInspectionSaveDate, payload, header)
            .then((res) => {
                if (res.data.status) {
                    console.log("Data Saved", res)
                    if (res.data.data.canView) {  // If same date it will redirect to Site Inspection else close the Modal
                        console.log(res.data.data.canView)
                        navigate(`/water-site-inspection-form/${id}`)
                    } else {
                        closeModal()
                    }
                } else {
                    console.log("Data Not Saved..", res)
                    setErrorMsg("Failed to Save")
                }
            })
            .catch((err) => {
                setErrorMsg("Exception While Saving..")
                console.log("Exception While Time Save..", err)
            })
    }



    useEffect(() => {
        if (props.openModal > 0) setIsOpen(true);
    }, [props.openModal]);


    function afterOpenModal() { }

    function closeModal() {
        setIsOpen(false);
        props.refetch()
    }


    return (
        <div className="">
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div >

                    <div class="relative w-full h-full max-w-3xl md:h-auto border-indigo-600 shadow-indigo-200 shadow-sm rounded">
                        <div class="relative bg-white rounded-lg shadow ">
                            <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    Set Date and Time 
                                    <p className="text-sm font-light">For Site Inspection</p>
                                </h3>
                                <button onClick={closeModal} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className=' bg-white rounded-lg shadow-xl p-4'>
                                <form onSubmit={formik.handleSubmit} onChange={handleChange} className="p-4 relative">
                                    <div className="">

                                        <div className='flex-1'>
                                            <div className="form-group mb-3 col-span-12 md:col-span-6 md:px-4">
                                                <label className="form-label inline-block mb-1 text-gray-900 text-sm font-semibold">Date <small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                                <input {...formik.getFieldProps('inspectionDate')} type="date" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer" />
                                                <span className="text-red-600 absolute text-xs">{formik.touched.inspectionDate && formik.errors.inspectionDate ? formik.errors.inspectionDate : null}</span>
                                            </div>
                                        </div>
                                        <div className='flex-1'>
                                            <div className="form-group mb-3 col-span-12 md:col-span-6 md:px-4">
                                                <label className="form-label inline-block mb-1 text-gray-900 text-sm font-semibold">Time <small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                                <input {...formik.getFieldProps('inspectionTime')} type="time" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                                                    placeholder="Enter Meter Reading" />
                                                <span className="text-red-600 absolute text-xs">{formik.touched.inspectionTime && formik.errors.inspectionTime ? formik.errors.inspectionTime : null}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {errorMsg &&
                                        <div>
                                            <div className=" absolute text-red-500">
                                                <p className="text-center">{errorMsg}</p>
                                            </div>
                                        </div>
                                    }
                                    <div className='flex justify-center p-2 border-t border-gray-200 rounded-b'>
                                        <button type="button" onClick={closeModal} class="mx-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded border border-red-200 text-sm font-medium px-5 py-1 focus:z-10 ">Cancel</button>
                                        <button type='submit' class="mx-2 text-white disabled:bg-gray-500 disabled:scale-100 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>
    );
}

// ReactDOM.render(<App />, appElement);


export default WaterSiteInspectionDateTimeModal