import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { contextVar } from "./Components/services/contextVar";
import Login from "./Components/pages/Login";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

  return (
    <>
      {loader && <CommonLoader />}

      <ToastContainer position="top-center" autoClose={2000} />
 

      <contextVar.Provider value={contextData}>
        <BrowserRouter>
        
          <Routes>
            <Route index element={<Login />} />
          </Routes>

            {(localStorage?.getItem('isLoggedIn') == 'true' && localStorage?.getItem('token') != '') && <TopBar /> }
            
            <Routes>

              <Route element={<ProtectedRoutes />} >
                
                  <Route path='/dashboard' element={<LandingDashboardNew />} />

                  <Route path='/track-water' element={<LandingDashboardNew/>} />
                  <Route path='/view-water' element={<LandingDashboardNew/>} />

                  <Route path="/track-trade" element={<LandingDashboardNew/>} />
                  <Route path="/view-trade" element={<LandingDashboardNew/>} />

                  <Route path="/search/:type" element={<SearchApplications />} />

                  <Route path="/propVerify/:id" element={<VerifyForm />} />

                  <Route path="/harvestingVerify/:id" element={<HarvestingVerificationIndex />} />

                  <Route path="/geoTagging/:id" element={<GeoIndex />} />

                  <Route path="/safform/:safType/:safId" element={<CitizenPropSafApplicationFormIndex />} />

                  {/* Water Routes */}

                  <Route path="/water-apply/" element={<WaterApplyIndex />} />
                  <Route path="/water-consumer-search/" element={<WaterConsumerSearch />} />

              </Route>

            </Routes>

            </BrowserRouter>

      </contextVar.Provider>
    </>
  );
};

export default App;
