import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import BackendUrl from '../../../api/BackendUrl'

const Remarks = (props) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validationSchema = yup.object({
    remarks : yup.string().required('required field !!!')
  })

  const formik = useFormik({
    initialValues: {
      remarks: props?.preData?.remarks
    },
    onSubmit: (values) => {
      props.collectData('remarks', values)
      props.next()
    }, validationSchema
  })

  const role = localStorage.getItem('roles')

  return (
    <>

{role == '["ULB Tax Collector"]' && <div className='w-full'>
    
<div className='border-2 border-blue-700 bg-blue-50 mb-4'>
                <h1 className='text-center font-semibold bg-blue-700 text-white uppercase text-lg'>Images</h1>

            {props?.tcData?.map((data) => <>
            
            <div className='bg-indigo-50 border-2 border-indigo-500 my-2 mx-1'>
                <div className='text-white bg-indigo-500 px-2 font-semibold'>{data?.direction_type} Image</div>
                <div className='px-2 py-2'>
                    <div className="grid grid-cols-12 text-sm pb-2 px-2">
                        <span className=' col-span-12 font-semibold flex justify-center items-center mb-2'>
                        <img src={`${BackendUrl}/${data?.relative_path}/${data?.image_path}`} alt="Front Image" srcset="" className='w-32' />
                        </span>
                        <span className='col-span-12 grid grid-cols-12'>
                            <span className="col-span-6 text-sm flex items-center">Latitude :</span>
                            <span className="col-span-6 text-sm"><span className='font-semibold text-sm'>{data?.latitude}</span></span>
                        </span>
                        <span className='col-span-12 grid grid-cols-12'>
                            <span className="col-span-6 text-sm flex items-center">Longitude :</span>
                            <span className="col-span-6 text-sm"><span className='font-semibold text-sm'>{data?.longitude}</span></span>
                        </span>
                    </div>
                    
                    
                </div>
            </div>

            </>)}
            

            </div>
        </div>}
  
    
    <form className='border-2 border-blue-700 bg-blue-50 mb-4 animate__animated animate__fadeInRight animate__faster' onChange={formik.handleChange} onSubmit={formik.handleSubmit}>
                <h1 className='text-center font-semibold bg-blue-700 text-white uppercase text-lg'>Remarks</h1>
            <div className='bg-indigo-50 border-2 border-indigo-500 my-2 mx-1'>
                <textarea name="remarks" value={formik.values.remarks} id="" rows="3" className='w-full px-2 py-1' placeholder='Enter your remarks here...'></textarea>
               </div>
               <div className='mx-2'>{formik.touched.remarks && formik.errors.remarks && <><span className="text-red-600 text-xs">{formik.errors.remarks}</span></>}</div>
            </form>

            {/* ==========Button========= */}
     <div className='w-full flex justify-between m-2'>
                <div onClick={props?.back} className='px-4 py-1.5 text-sm text-white rounded-sm shadow-md bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 cursor-pointer'>
                    Back
                </div>
            <button onClick={formik.handleSubmit} type='submit' className="px-4 py-1.5 mr-4 text-sm text-white rounded-sm shadow-md bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600">Next & Preview</button>
            </div>
    
    </>
  )
}

export default Remarks