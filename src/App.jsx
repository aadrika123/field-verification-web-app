import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { contextVar } from "./Components/services/contextVar";
import Login from "./Components/pages/Login";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "./Components/pages/TopBar";
import NewDashboardRoutes from "./Components/pages/Dashboard/NewDashboardRoutes";
import CommonLoader from "./Components/pages/Common/CommonLoader";
// import PropertyVerificationForm from "./Components/pages/Property/PropertyVerificationForm";
import SearchApplications from "./Components/pages/Common/SearchApplications";
import VerifyForm from "./Components/pages/Property/FieldVerification/VerifyForm";
import GeoIndex from "./Components/pages/Property/GeoTagging/GeoIndex";
import CitizenPropSafApplicationFormIndex from "./Components/pages/Property/CitizenSafForm/CitizenPropSafApplicationFormIndex";
import HarvestingVerificationIndex from "./Components/pages/Property/HarvestingVerification/HarvestingVerificationIndex";
import WaterApplyIndex from "./Components/pages/Water/ApplyNewConnection/WaterApplyIndex";
import WaterConsumerSearch from "./Components/pages/Water/WaterSearch/WaterConsumerSearch";
import ProtectedRoutes from "./Components/pages/ProtectedRoutes";
import LandingDashboardNew from "./Components/pages/Dashboard/LandingDashboardNew";
import SiteInspectionLIst from "./Components/pages/Water/WaterSiteInspection/SiteInspectionLIst";
import WaterSiteInspectionForm from "./Components/pages/Water/WaterSiteInspection/WaterSiteInspectionForm";
import WaterApplicationSearch from "./Components/pages/Water/WaterSearch/WaterApplicationSearch";
// import CitizenPropSafApplicationIndex from "./Components/pages/Property/ApplyForm/CitizenPropSafApplicationIndex";

const App = () => {
  const [loader, setloader] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false)

  const contextData = {
    notify: (toastData, actionFlag) => {
      toast.dismiss();
      {
        actionFlag == "error" && toast.error(toastData);
      }
      {
        actionFlag == "info" && toast.info(toastData);
      }
      {
        actionFlag == "success" && toast.success(toastData);
      }
      {
        actionFlag == "warn" && toast.warn(toastData);
      }
    },
    isLoggedIn, setisLoggedIn
  };
  
  // useEffect(() => {
  //   if(window.getItem('menuList')){
  //     window.localStorage.removeItem('menuList')
  //   }

  //   if(window.getItem('userName')){
  //     window.localStorage.removeItem('userName')
  //   }

  //   if(window.getItem('roles')){
  //     window.localStorage.removeItem('roles')
  //   }

  //   if(window.getItem('token')){
  //     window.localStorage.removeItem('token')
  //   }

  //   if(window.getItem('isLoggedIn')){
  //     window.localStorage.removeItem('isLoggedIn')
  //   }

  //   (window.localStorage.getItem('token') == undefined || window.localStorage.getItem('token') == '') && window.location.replace('/mobile')
  // },[]);

  // const handleUnload = () => {
  //   // alert("Are you sure you want to close the app?");
  // };

  // useEffect(() => {
  //   window.addEventListener("unload", handleUnload);

  //   return () => {
  //     window.removeEventListener("unload", handleUnload);
  //   };
  // });

  return (
    <>
      {loader && <CommonLoader />}

      <ToastContainer position="top-center" autoClose={2000} />
 

      <contextVar.Provider value={contextData}>
        <BrowserRouter basename="/mobile">
        
          <Routes>
            <Route index element={<Login />} />
          </Routes>

            {(localStorage?.getItem('isLoggedIn') == 'true' && localStorage?.getItem('token') != '' || localStorage?.getItem('isLoggedIn') == undefined && localStorage?.getItem('token') != undefined) && <TopBar /> }
            
            <Routes>

              <Route element={<ProtectedRoutes />} >
                
                  <Route path='/dashboard' element={<LandingDashboardNew />} />

                  <Route path='/track-water' element={<LandingDashboardNew/>} />
                  <Route path='/view-water' element={<LandingDashboardNew/>} />

                  <Route path="/track-trade" element={<LandingDashboardNew/>} />
                  <Route path="/view-trade" element={<LandingDashboardNew/>} />

                  <Route path="/search/:type" element={<SearchApplications />} />

                  {/* <Route path="/saf-apply" element={<CitizenPropSafApplicationIndex /> } /> */}

                  <Route path="/propVerify/:id" element={<VerifyForm />} />

                  <Route path="/harvestingVerify/:id" element={<HarvestingVerificationIndex />} />

                  <Route path="/geoTagging/:id" element={<GeoIndex />} />

                  <Route path="/safform/:safType/:safId" element={<CitizenPropSafApplicationFormIndex />} />

                  {/* Water Routes */}

                  <Route path="/water-apply/" element={<WaterApplyIndex />} />
                  <Route path="/water-consumer-search/" element={<WaterConsumerSearch />} />
                  <Route path="/water-application-search/" element={<WaterApplicationSearch />} />
                  <Route path="/water-site-inspection-list/" element={<SiteInspectionLIst />} />
                  <Route path="/water-site-inspection-form/:id" element={<WaterSiteInspectionForm />} />

              </Route>

            </Routes>

            </BrowserRouter>

      </contextVar.Provider>
    </>
  );
};

export default App;
