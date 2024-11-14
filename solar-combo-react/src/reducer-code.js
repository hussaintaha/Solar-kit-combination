import { createPortal } from "react-dom";
import React, { useEffect, useReducer, useRef, useState } from "react";
import "./App.css";
import Modal from "./component/Modal";

const initialState = {
  spaceAndVolume: {
    length: "",
    width: "",
    height: "",
    totalVolume: "",
    squareFoot: ""
  },
  insulationValue: "",
  recommendedBTU: "",
  airConditionerProductsData: [],
  selectedProductId: {
    selectAirConditionerProducts: "",
    selectSolarPanelProducts: "",
    selectChargeControllerproducts: "",
    selectBatteryOptions: "",
    selectCustomOptions: "",
  },
  selectedProductPrices: {
    selectAirConditionerProducts: 0,
    selectSolarPanelProducts: 0,
    selectChargeControllerproducts: 0,
    selectBatteryOptions: 0,
    selectCustomOptions: 0,
  },
  redirectURL: "",
  dailyRunTime: 0,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SPACE_AND_VOLUME":
      return { ...state, spaceAndVolume: { ...state.spaceAndVolume, ...action.payload } }
    case "SET_INSULATION_VALUE":
      return { ...state, insulationValue: action.payload }
    case "SET_RECOMMENDED_BTU":
      return { ...state, recommendedBTU: action.payload }
    case "SET_AIR_CONSDITIONER_PRODUCTS":
      return { ...state, airConditionerProductsData: action.payload }
    case "SET_SELECTED_PRODUCT_ID":
      return {
        ...state, selectedProductId: { ...state.selectedProductId, ...action.payload }
      }
    case "SET_SELECTED_PRODUCT_PRICE":
      console.log(action.payload);

      return {
        ...state, selectedProductPrices: { ...state.selectedProductPrices, ...action.payload }
      }
    case "SET_REDIRECT_URL":
      return { ...state, redirectURL: action.payload }
    case "SET_DAILY_RUN_TIME":
      return { ...state, dailyRunTime: action.payload }
  }
}

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("state == ", state);

  const local_base_url = " https://apollo-hb-grab-fr.trycloudflare.com/api"

  const { length, width, height } = state.spaceAndVolume

  const insulationOptions = [
    {
      label: "Not Insulated",
      value: 3.0,
      src: "https://app.fullbattery.com/insulation-images/not-insulated-image.webp",
      desc: "A bare metal shed, RV, boat, a fabric tent, or plastic cover. The basics.",
    },
    {
      label: "Minimum",
      value: 1.6,
      src: "https://app.fullbattery.com/insulation-images/minimum-insulated.webp",
      desc: "Metallic bubble wrap or light timber shed with some natural insulation.",
    },
    {
      label: "Good",
      value: 0.8,
      src: "https://app.fullbattery.com/insulation-images/good-insulated.jpeg",
      desc: "Insulation on all sides of a solid frame. Spray foam, rockwool or fiberglass.",
    },
    {
      label: "Paranoid",
      value: 0.6,
      src: "https://app.fullbattery.com/insulation-images/paranoid-insulated.webp",
      desc: "You know your R-Values and you used them all. R 40-60. And it's SEALED.",
    },
  ];

  const runTimeOptions = [
    {
      label: "Overhead Sun Only",
      value: 4,
      src: "https://app.fullbattery.com/runEachday-images/overhead-sun-only.jpg",
      desc: "I only need it to work when the sun is right over the panels during peak solar production.",
    },
    {
      label: "6 Hours a day",
      value: 6,
      src: "https://app.fullbattery.com/runEachday-images/six-hours-day.jpeg",
      desc: "I want to run the AC during dawn or dusk for some time, but will turn it off by bedtime.",
    },
    {
      label: "12 Hours a day",
      value: 12,
      src: "https://app.fullbattery.com/runEachday-images/12-hours-day.jpeg",
      desc: "The AC will be running most of the time during the day and into the late evening.",
    },
    {
      label: "Full Blast 24/7",
      value: 24,
      src: "https://app.fullbattery.com/runEachday-images/full-blast.jpeg",
      desc: "I want enough solar and battery capacity to run it on full blast without turning it off, 24/7.",
    },
  ];

  const calculateBTU = (length, width, height, insulationFactor) => {
    let BTU = 0;
    const area = length * width;
    console.log("area === ", area);


    if (height < 6) {
      BTU = area * 10 * insulationFactor;
    } else if (height >= 6 && height <= 10) {
      BTU = area * 20 * insulationFactor;
    } else if (height > 10) {
      BTU = area * 27 * insulationFactor;
    }

    dispatch({ type: "SET_SPACE_AND_VOLUME", payload: { squareFoot: area } })

    // setSquareFoot(area);
    return BTU;
  };

  const handleQuestions1_options = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : parseFloat(value) || 0;
    console.log("name ===== ", name);

    const updatedValues = { ...state.spaceAndVolume, [name]: numericValue };
    const { length, width, height } = updatedValues;
    const { insulationValue } = state.insulationValue

    const totalVolume = length && width && height ? length * width * height : 0;
    const squareFoot = length * width;

    dispatch({
      type: "SET_SPACE_AND_VOLUME",
      payload: { [name]: numericValue, totalVolume, squareFoot }
    });

    if (length && width && height && insulationValue) {
      const newBTU = calculateBTU(length, width, height, insulationValue);
      dispatch({ type: "SET_RECOMMENDED_BTU", payload: newBTU })
      // Fetch products based on the new BTU
      getCollectionProductsAPI(newBTU);
    }
  };

  const handleInsulationChange = (e) => {
    const insulationFactor = parseFloat(e.target.value);
    console.log("insulationFactor ==== ", insulationFactor);

    dispatch({ type: "SET_INSULATION_VALUE", payload: insulationFactor });

    const { length, width, height } = state.spaceAndVolume;

    if (length && width && insulationFactor) {
      const newBTU = calculateBTU(length, width, height, insulationFactor);
      dispatch({ type: "SET_RECOMMENDED_BTU", payload: newBTU })
      // setRecommendedBTU(newBTU);
      getCollectionProductsAPI(newBTU);
    }
  };

  const getCollectionProductsAPI = async (BTU) => {
    try {
      const fetchproducts = await fetch(`${local_base_url}/getCollectionProducts/?recommendedBTU=${BTU}`,);
      const collectionProducts = await fetchproducts.json();
      console.log("collectionProducts ==== ", collectionProducts);
      dispatch({ type: "SET_AIR_CONSDITIONER_PRODUCTS", payload: collectionProducts.products })
    } catch (error) {
      console.log("error ========= ", error);
    }
  };

  const handleSelectProduct = async (productType, productId) => {
    const isDeselecting = state.selectedProductId[productType] === productId;
    console.log("isDeselecting ====== ", isDeselecting);

    dispatch({
      type: "SET_SELECTED_PRODUCT_ID",
      payload: { [productType]: isDeselecting ? null : productId }
    })

    if (isDeselecting) {
      // setSelectedProductPrices((prevState) => ({
      //   ...prevState,
      //   [productType]: 0,
      // }));

      dispatch({
        type: "SET_SELECTED_PRODUCT_ID",
        payload: { [productType]: 0 }
      })

    } else if (productId) {
      try {
        const fetchProductsDetails = await fetch(`${local_base_url}/getproductsDetail`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ productId }),
          },
        );

        const productDetails = await fetchProductsDetails.json();
        console.log("productDetails ================= ", productDetails);
        const productPrice = parseFloat(productDetails.varientData.price);

        dispatch({
          type: "SET_SELECTED_PRODUCT_PRICE",
          payload: { [productType]: productPrice }
        })

        // const productPrice = parseFloat(productDetails.varientData.price);
        // setSelectedProductPrices((prevState) => ({
        //   ...prevState,
        //   [productType]: productPrice,
        // }));
      } catch (error) {
        console.log("error in selectproduct ==== ", error);
      }
    }
  };

  const handleInfo = async (variantdata) => {
    const splitId = variantdata.id.split("/")[4]
    const productUrl = `https://quickstart-629da44c.myshopify.com/products/${variantdata.handle}?variant=${splitId}`;
    dispatch({ type: "SET_REDIRECT_URL", payload: productUrl })
    // setRedirectURL(productUrl)
    return productUrl
  }

  const handleRunEachDay = (value) => {
    dispatch({ type: "SET_DAILY_RUN_TIME", payload: action.payload })
    // setDailyRunTime(value);
  };

  useEffect(() => {
    const { length, width, height, squareFoot } = state.spaceAndVolume;
    const { insulationValue } = state;

    if (length && width && height && insulationValue) {
      const newBTU = calculateBTU(length, width, height, insulationValue);
      // Only update BTU if it's different from the current state to prevent infinite loop
      if (newBTU !== state.recommendedBTU) {
        dispatch({ type: "SET_RECOMMENDED_BTU", payload: newBTU });
      }
    }
  }, [length, width, height, state.insulationValue]);




  return (
    <>
      <div className="question-container">


        <div className="ques-1-container">
          <div className="ques-1">
            <h1>1. How big is the space you are heating / cooling?</h1>
            <p className="ques-1-description">
              Let's figure out the size of air conditioner you need in BTU/h or
              tons. 1 ton is the same as 12,000 BTU/h.
            </p>

            <div className="ques-1-answer">
              <div className="length">
                <span>Length</span>
                <div className="show-input-values">
                  <input
                    type="number"
                    name="length"
                    value={state.spaceAndVolume.length}
                    onChange={handleQuestions1_options}
                  />
                  <span className="unit">Feet</span>
                </div>
              </div>

              <div className="width">
                <span>Width</span>
                <div className="show-input-values">
                  <input
                    type="number"
                    name="width"
                    value={state.spaceAndVolume.width}
                    onChange={handleQuestions1_options}
                  />
                  <span className="unit">Feet</span>
                </div>
              </div>

              <div className="height">
                <span> Ceiling Height </span>
                <div className="show-input-values">
                  <input
                    type="number"
                    name="height"
                    value={state.spaceAndVolume.height}
                    onChange={handleQuestions1_options}
                  />
                  <span className="unit">Feet</span>
                </div>
              </div>
            </div>

            <div className="calculate-volume">
              {state.spaceAndVolume.totalVolume > 0 && (
                <div className="totalvolumeValue">
                  <div className="cubic-feet">
                    <span>Total Volume:</span>
                    <span className="total-areaVolume-value">
                      {state.spaceAndVolume.totalVolume.toLocaleString()} cubic feet
                    </span>
                  </div>

                  <div className="square-feet">
                    <span> Total Area: </span>
                    <span className="total-areaVolume-value">
                      {state.spaceAndVolume.squareFoot.toLocaleString()} square feet
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ques-2-container">
          <div className="ques-2">
            <h1>2. How well is it insulated?</h1>
            <p className="ques-2-description">
              The level of insulation makes a huge impact on the actual number
              of BTU's you have to move every hour to keep your place air
              conditioned. Vans and RV's usually select 'Minimum' or 'Not
              Insulated' for realistic numbers. Click an option to see your
              suggested cooling/heating capacity expressed in BTU-hours.
            </p>
          </div>

          <div className="ques-2-answer">
            <div className="insulation-options">
              {insulationOptions?.map((option) => (
                <div
                  key={option.label}
                  style={{ cursor: "pointer" }}
                  className={`insulation-option ${state.insulationValue === option.value ? "selected" : ""}`}
                  onClick={() => handleInsulationChange({ target: { value: option.value } })}
                >
                  <div className="option-details">
                    <img
                      src={option.src}
                      alt={option.label}
                      className="option-image"
                    />
                    <label>
                      <input
                        type="radio"
                        name="insulation"
                        value={option.value}
                        onChange={handleInsulationChange}
                        checked={state.insulationValue === option.value}
                      />
                      {option.label}
                    </label>
                    <p className="option-desc">{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="displayBTU">
                <span>
                  Your recommended BTU: {state.recommendedBTU.toLocaleString()} BTU/h
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ques-3-container">
          <div className="ques-3">
            <h1>3. Select Air Conditioner</h1>
          </div>
          <div className="collection-container">
            <div className="collection-products">
              {state.airConditionerProductsData?.map((ele, index) => {
                const isSelected = state.selectedProductId.selectAirConditionerProducts === ele.id.split("/")[4];
                return (
                  <div
                    className="products"
                    key={ele.id}
                    onClick={(event) => {
                      if (
                        (event.nativeEvent.target.localName === 'svg') ||
                        (event.nativeEvent.target.localName === 'path') ||
                        (event.nativeEvent.target.localName === 'div' && event.nativeEvent.target.className === 'info-icon')
                      ) {
                      } else {
                        handleSelectProduct("selectAirConditionerProducts", ele.id.split("/")[4],)
                      }
                    }}
                    style={{
                      border: isSelected ? "2px solid blue" : "1px solid grey",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div
                      className="info-icon"
                      onClick={(event) => { handleInfo(ele) }}
                    >
                      <a href={state.redirectURL ? state.redirectURL : ""} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" aria-hidden="true">
                          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                        </svg>
                      </a>
                    </div>

                    <div className="productsImage">
                      {ele && ele.image && ele.image.originalSrc ? (
                        <img
                          src={ele.image.originalSrc}
                          style={{ width: "100px", height: "100px" }}
                          alt="Product"
                        />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div className="product-price">
                      <h1> ${ele.price} </h1>
                    </div>
                    <div className="title">
                      <h1> {ele.displayName} </h1>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="build-kit-message">
              <p>Click an option to build your kit; click again to remove</p>
            </div>
          </div>
        </div>

        <div className="ques-4-container">
          <div className="ques-4">
            <h1> 4. How long do you want to run it each day? </h1>
            <p className="ques-4-description">
              Usage patterns impact how much battery storage and solar power you
              need dramatically. If you only need the unit to work during peak
              daylight hours (1-3 hours before and after solar noon, assuming
              your panels are pointed properly), you do not need many panels or
              batteries. To air condition for more hours each day, you need
              increasingly more panels and batteries to capture the sun during
              peak production times and spread out the energy across the 24 hour
              cycle. Most people choose an option between 6 and 12 hours per day
              which allows you to run the air conditioner into the evening or
              night with zero reliance on grid power. Click an option to see
              your suggested daily harvest in kilowatt-hours. This is how much
              solar energy you need to produce each day.
            </p>
          </div>
          <div className="runtime-options">
            {runTimeOptions.map((option) => (
              <div
                key={option.label}
                onClick={() => handleRunEachDay(option.value)}
                className={
                  state.dailyRunTime === option.value ? "runtime-selected" : "insulation-option"
                }
              >
                <img
                  src={option.src}
                  alt={option.label}
                  className="option-image"
                />
                <div className="runtimeOption-details">
                  <label key={option.label}>
                    <input
                      type="radio"
                      name="runTime"
                      value={option.value}
                      checked={state.dailyRunTime === option.value}
                      onChange={(e) => handleRunEachDay(parseInt(e.target.value))}
                    />
                    {option.label}
                  </label>
                  <p className="option-desc">{option.desc} </p>
                </div>
              </div>
            ))}
          </div>

          <div className="needed-harvest">
            <div className="harvest-result">
              <span> Your needed Harvest: {Number(neededHarvest.toFixed(2)).toLocaleString()} kWh </span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
};

export default App;
