import React, { useEffect, useState } from "react";
import FloorDetails from "./FloorDetails";
import FloorRow from "./FloorRow";
import FloorRow2 from "./FloorRow2";

const FloorIndex = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [floorIndex, setfloorIndex] = useState(0);
  const [floorIndex2, setfloorIndex2] = useState(0);

  const [addFloorStatus, setaddFloorStatus] = useState(false);

  const [floorList, setfloorList] = useState([]);
  const [floorList2, setfloorList2] = useState([]);
  const [prevFloor, setprevFloor] = useState([]);
  const [prevFloor2, setprevFloor2] = useState([])
  const [prevAddFloor, setprevAddFloor] = useState([]);

  console.log("floor length => ", props?.applicationData?.length);

  const nextFun = () => {
    console.log("floor indexx => ", floorIndex);

    if (floorIndex < props?.applicationData?.length) {
      setfloorIndex(floorIndex + 1);
      setaddFloorStatus(false);
    }

    if (floorIndex == props?.applicationData?.length - 1) {
      setaddFloorStatus(true);
    }
  };

  const backFun = () => {
    if (floorIndex != 0) {
      setfloorIndex(floorIndex - 1);
      setaddFloorStatus(false);
    }
    if (floorIndex == 0) {
      props?.back();
      setaddFloorStatus(false);
    }
  };

  const nextFun2 = () => {
    console.log("floor2 indexx => ", floorIndex);

    if (floorIndex2 < props?.tcNewData?.length) {
      setfloorIndex2(floorIndex2 + 1);
      setaddFloorStatus(false);
    }

    if (floorIndex2 == props?.tcNewData?.length - 1) {
      props?.next();
    }
  };

  const backFun2 = () => {
    if (floorIndex2 != 0) {
      setfloorIndex2(floorIndex2 - 1);
      // setaddFloorStatus(false)
    }
    if (floorIndex2 == 0) {
      setfloorIndex(props?.applicationData?.length-1);
      setaddFloorStatus(false);
    }
  };

  //   const collectData = (values) => {
  //     let tempFloorList = [...floorList, values]
  //     setfloorList([...floorList, values])
  //     console.log('tempfloor list before add.....', tempFloorList)
  // }

  const collectData = (values) => {
    const index = floorList.findIndex((item) => item.id === values.id);
    if (index !== -1) {
      const updatedFloorList = [...floorList];
      updatedFloorList[index] = values;
      setfloorList(updatedFloorList);
      console.log("updated floor list.....", updatedFloorList);
    } else {
      const updatedFloorList = [...floorList, values];
      setfloorList(updatedFloorList);
      console.log("updated floor list.....", updatedFloorList);
    }
  };

  const collectData2 = (values) => {
    const index = floorList2.findIndex((item) => item.id === values.id);
    if (index !== -1) {
      const updatedFloorList = [...floorList2];
      updatedFloorList[index] = values;
      setfloorList2(updatedFloorList);
      console.log("updated floor list.....", updatedFloorList);
    } else {
      const updatedFloorList = [...floorList2, values];
      setfloorList2(updatedFloorList);
      console.log("updated floor list.....", updatedFloorList);
    }
  };

  useEffect(() => {
    {
      floorIndex == props?.applicationData?.length &&
        props?.collectData("floor", floorList);
    }
    {
      floorIndex2 == (props?.tcExistingData?.length) &&
        props?.collectData("floor2", floorList2);
    }
  }, [floorIndex, floorIndex2]);

  useEffect(() => {
    props?.preData?.floor != undefined &&
      props?.preData?.floor?.length > 0 &&
      setprevFloor(props?.preData?.floor);
      setprevFloor2(props?.preData?.floor2)
    props?.preData?.addFloor != undefined &&
      props?.preData?.addFloor?.length > 0 &&
      setprevAddFloor(props?.preData?.addFloor);
  }, [props?.preData]);

  console.log("tc data => ", props?.tcExistingData);

  const role = localStorage.getItem("roles");

  return (
    <>
      {addFloorStatus && role != '["ULB Tax Collector"]' && (
        <FloorDetails
          usageList={props?.usageType}
          occupancyList={props?.occupancyType}
          constructionList={props?.constructionList}
          floorList={props?.floorList}
          next={() => props.next()}
          back={() => backFun()}
          preData={prevAddFloor}
          collectData={(type, data) => {
            props?.collectData(type, data);
          }}
        />
      )}

      {addFloorStatus && role == '["ULB Tax Collector"]' && (
        <>{(props?.tcNewData != undefined && props?.tcNewData?.length > 0) ? <>
        <div className="text-sm font-semibold text-center">
                This Floor Added By Agency TC
              </div>
              {props?.tcNewData?.map((data, index) => (
            <>
              
              {index == floorIndex2 && (
                <FloorRow2
                  data={data}
                  preData={prevFloor2 != undefined && prevFloor2[index]}
                  index={index}
                  next={nextFun2}
                  back={backFun2}
                  usageList={props?.usageType}
                  occupancyList={props?.occupancyType}
                  constructionList={props?.constructionList}
                  floorList={props?.floorList}
                  collectData={collectData2}
                />
              )}
            </>
          ))}
        </> : <>
        <div className="text-sm font-semibold text-center text-red-600">No new floor added by agency tc</div>
        <div className='w-full flex justify-between m-2'>
                <div onClick={() => backFun2()} className='px-4 py-1.5 text-sm text-white rounded-sm shadow-md bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 cursor-pointer'>
                    Back
                </div>
            <button onClick={() => props?.next()} className="px-4 py-1.5 mr-4 text-sm text-white rounded-sm shadow-md bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600">Save & Next</button>
            </div>
        </>}
          
        </>
      )}

      {!addFloorStatus && props?.applicationData?.length > 0 && 
        props?.applicationData?.map((data, index) => (
          <>
            {index == floorIndex && (
              <FloorRow
                utc={props?.utc}
                tcData={props?.tcExistingData != undefined && props?.tcExistingData[index]}
                data={data}
                preData={prevFloor}
                index={index}
                next={nextFun}
                back={backFun}
                usageList={props?.usageType}
                occupancyList={props?.occupancyType}
                constructionList={props?.constructionList}
                floorList={props?.floorList}
                collectData={collectData}
              />
            )}
          </>
        ))}
    </>
  );
};

export default FloorIndex;
