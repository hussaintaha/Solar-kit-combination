import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Modal from "./component/Modal";

const App = () => {
  const [redirectURL, setRedirectURL] = useState("")
  const [loading, setLoading] = useState(false);
  const [activecartButton, setActiveCartButton] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState({
    selectAirConditionerProducts: "",
    selectSolarPanelProducts: "",
    selectChargeControllerproducts: "",
    selectBatteryOptions: "",
    selectCustomOptions: "",
  });
  const [productsData, setProductData] = useState([]);
  const [panelCollection, setPanelCollection] = useState([]);
  const [chargeControllerProducts, setChargeControllerProducts] = useState([]);
  const [batteryOption, setBatteryOptions] = useState([]);
  const [spaceAndVolume, setSpaceAndVolume] = useState({
    length: "",
    width: "",
    height: 8,
    totalVolume: "",
  });
  const [squareFoot, setSquareFoot] = useState("");
  const [recommendedBTU, setRecommendedBTU] = useState(0);
  const [insulationValue, setInsulationValue] = useState(0);
  const [dailyRunTime, setDailyRunTime] = useState(0);
  const [neededHarvest, setNeededharvest] = useState(0);
  const [selectedProductPrices, setSelectedProductPrices] = useState({
    selectAirConditionerProducts: 0,
    selectSolarPanelProducts: 0,
    selectChargeControllerproducts: 0,
    selectBatteryOptions: 0,
  });
  const [customProductDistance, setCustomProductDistance] = useState({
    paneltoBattery: 0,
    batterytoHVAC: 0,
  });

  const floatContainerRef = useRef(null);

  console.log(" ========== 44444444444444 =========");
  const local_base_url = 'https://steady-gt-treat-fluid.trycloudflare.com/api';
  const production_base_url = `https://${location.host}/apps/proxy/api`


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

  // =========================== step 1 to 3 =========================== //  
  const calculateBTU = (length, width, height, insulationFactor) => {
    let BTU = 0;
    const area = length * width; // Calculate square footage

    if (height < 6) {
      BTU = area * 10 * insulationFactor;
    } else if (height >= 6 && height <= 10) {
      BTU = area * 20 * insulationFactor;
    } else if (height > 10) {
      BTU = area * 27 * insulationFactor;
    }

    setSquareFoot(area);
    return BTU;
  };

  const handleQuestions1_options = (e) => {
    const { name, value } = e.target;

    setSpaceAndVolume((prev) => {
      const updatedValues = { ...prev, [name]: parseFloat(value) || null };
      const { length, width, height } = updatedValues;

      const totalVolume = length && width && height ? length * width * height : 0;
      setSquareFoot(length * width);

      if (length && width && height && insulationValue) {
        const newBTU = calculateBTU(length, width, height, insulationValue);
        setRecommendedBTU(newBTU);
        // Fetch products based on the new BTU
        getCollectionProductsAPI(newBTU);
      }

      return { ...updatedValues, totalVolume };
    });
  };

  const handleInsulationChange = (e) => {
    const insulationFactor = parseFloat(e.target.value);
    setInsulationValue(insulationFactor);

    const { length, width, height } = spaceAndVolume;
    if (length && width && insulationFactor) {
      const newBTU = calculateBTU(length, width, height, insulationFactor);
      setRecommendedBTU(newBTU);
      getCollectionProductsAPI(newBTU);
    }
  };

  const getCollectionProductsAPI = async (BTU) => {
    try {
      const fetchproducts = await fetch(`${production_base_url}/getCollectionProducts/?recommendedBTU=${BTU}`,);
      const collectionProducts = await fetchproducts.json();
      // console.log("collectionProducts ====== ", collectionProducts);
      setProductData(collectionProducts.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  };

  // =========================== step 4 to 8 =========================== //  
  const handleRunEachDay = (value) => {
    setDailyRunTime(value);
  };

  const getpanelCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`${production_base_url}/getpanelCollections/?neededHarvestkWh=${neededHarvestkWh}`);
      const panelCollectionProducts = await fetchProducts.json();
      // console.log("panelCollectionProducts ====== ", panelCollectionProducts.products);
      setPanelCollection(panelCollectionProducts.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  };

  const getchargeControllerCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`${production_base_url}/chargeControllerCollection/?neededHarvestkWh=${neededHarvestkWh}`);
      const chargeControllerProducts = await fetchProducts.json();
      // console.log("chargeControllerProducts ====== ", chargeControllerProducts.products);
      setChargeControllerProducts(chargeControllerProducts.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  };

  const getBettryCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`${production_base_url}/getBatteryOption/?neededHarvestkWh=${neededHarvestkWh}`);
      const batteryOptionProducts = await fetchProducts.json();
      // console.log("batteryOptionProducts ====== ", batteryOptionProducts.products);
      setBatteryOptions(batteryOptionProducts.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  };

  const handleSelectProduct = async (productType, productId) => {
    const isDeselecting = selectedProductId[productType] === productId;
    setSelectedProductId((prevSelected) => ({
      ...prevSelected,
      [productType]: isDeselecting ? null : productId,
    }));

    if (isDeselecting) {
      setSelectedProductPrices((prevState) => ({
        ...prevState,
        [productType]: 0,
      }));
    } else if (productId) {
      try {
        const fetchProductsDetails = await fetch(`${production_base_url}/getproductsDetail`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ productId }),
          },
        );

        const productDetails = await fetchProductsDetails.json();
        // console.log("productDetails ================= ", productDetails);

        const productPrice = parseFloat(productDetails.varientData.price);
        setSelectedProductPrices((prevState) => ({
          ...prevState,
          [productType]: productPrice,
        }));
      } catch (error) {
        console.log("error in selectproduct ==== ", error);
      }
    }
  };

  // ============================= ADD TO CART ============================= //
  const handleAddToCart = async () => {
    setLoading(true);
    let productsId = selectedProductId;

    if (customProductDistance.batterytoHVAC || customProductDistance.paneltoBattery) {
      const { batterytoHVAC, paneltoBattery } = customProductDistance;
      const createProductAPI = await fetch(`${production_base_url}/createCustomProduct`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ batterytoHVAC, paneltoBattery }),
        },
      );

      const createProductResponse = await createProductAPI.json();
      // console.log("createProductResponse ============ ", createProductResponse);

      if (createProductResponse) {
        productsId = {
          ...selectedProductId,
          selectCustomOptions: createProductResponse,
        };
      }
    }
    // console.log("productsIDs ========= ", productsId);

    const sendProductIDAPI = await fetch(`${production_base_url}/addtoCart`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ selectedProductId: productsId }),
      },
    );

    const productIdresponse = await sendProductIDAPI.json();
    const productIdArray = productIdresponse.varientIdArray;
    if (productIdresponse.success) {
      let formData = {
        items: productIdArray.map((productID) => ({
          id: productID,
          quantity: 1,
        })),
      };

      try {
        const additmesAPI = await fetch(`${window.Shopify.routes.root}cart/add.js`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const getItmes = await additmesAPI.json();
        // console.log("getItmes ======= ", getItmes);

        if (getItmes.items.length) {
          window.location.href = "/cart";
        }
        setLoading(false);
      } catch (error) {
        console.log("error  ====", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDistanceValue = (e) => {
    const { name, value } = e.target;

    if (value >= 0) {
      setCustomProductDistance((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // useEffect to check if both values are filled or not
  useEffect(() => {
    const { paneltoBattery, batterytoHVAC } = customProductDistance;
    if (paneltoBattery > 0 || batterytoHVAC > 0) {
      setActiveCartButton(false);
    } else {
      setActiveCartButton(true);
    }
  }, [customProductDistance]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (recommendedBTU > 0 && insulationValue > 0 && dailyRunTime > 0) {

        const neededHarvestkWh = (recommendedBTU / 16000) * dailyRunTime;
        setNeededharvest(neededHarvestkWh);

        // Calling the APIs with the new needed harvest
        await getpanelCollectionAPI(neededHarvestkWh);
        await getchargeControllerCollectionAPI(neededHarvestkWh);
        await getBettryCollectionAPI(neededHarvestkWh);
      }
    };
    fetchData();
  }, [recommendedBTU, insulationValue, dailyRunTime]);

  const calculateCustomePrice = () => {
    const { paneltoBattery, batterytoHVAC } = customProductDistance;
    let wiringCost = 0;

    if (paneltoBattery > 0) {
      wiringCost = paneltoBattery * 4;
    }
    if (batterytoHVAC > 0) {
      wiringCost = batterytoHVAC * 6 + 33;
    }
    if (paneltoBattery > 0 && batterytoHVAC > 0) {
      wiringCost = (paneltoBattery * 4) + (batterytoHVAC * 6) + 33
    }
    return wiringCost;
  };


  const totalPrice = (Object.values(selectedProductPrices).reduce((acc, price) => acc + price, 0) + Number(calculateCustomePrice())).toFixed(2);
  const formattedTotalprice = Number(totalPrice);
  const newPrice = (formattedTotalprice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });


  useEffect(() => {
    if (totalPrice > 0) {
      setActiveCartButton(false);
    } else {
      setActiveCartButton(true);
    }
  }, [totalPrice]);

  const handleInfo = async (variantdata) => {
    const splitId = variantdata.id.split("/")[4]
    const productUrl = `https://${location.host}/products/${variantdata.handle}?variant=${splitId}`;
    setRedirectURL(productUrl)
    return productUrl
  }

  // handle float container
  useEffect(() => {

    const rteDiv = document.querySelector(".rte");
    if (rteDiv && floatContainerRef.current) {
      floatContainerRef.current.after(rteDiv);
    }

    // const updateBannerImage = () => {
    //   const bannerImage = document.querySelector(".banner-image");
    //   if (bannerImage) {
    //     if (window.innerWidth <= 480) {
    //       bannerImage.src = "https://app.fullbattery.com/background-images/small-screen-bg-img.webp";
    //     } else if (window.innerWidth <= 1024) {
    //       bannerImage.src = "https://app.fullbattery.com/background-images/medium-screen-bg-img.jpg";
    //     } else {
    //       bannerImage.src = "https://app.fullbattery.com/background-images/large-screen-bg-img.webp";
    //     }
    //   }
    // };

    // updateBannerImage();
    // window.addEventListener("resize", updateBannerImage);


    document.querySelector(".float-container-body").style.display = "none";
    window.onscroll = () => {

      const float_container = document.querySelector('.float-container')
      const floatContainerRect = float_container.getBoundingClientRect();
      if (floatContainerRect.bottom < 0) {
        document.querySelector(".float-container-body").style.display = "none";
      } else if (floatContainerRect.bottom < 0 || floatContainerRect.top > window.innerHeight) {
        document.querySelector(".float-container-body").style.display = "flex";
      } else {
        document.querySelector(".float-container-body").style.display = "none";
      }
    }
  }, []);

  return (
    <>
      <div>
        <Modal show={isModalOpen} onClose={closeModal}>
          <h2>Warning</h2>
          <p>This is a warning message!</p>
        </Modal>
      </div>


      <div class="banner-image-container">
        <img
          class="banner-image"
          width="100%"
          height="auto"
          alt=""
          data-mce-fragment="1"
          data-mce-style="float: none;"
          data-mce-src="https://cdn.shopify.com/s/files/1/1307/6829/files/main-med.webp?v=1733014704"
        />
      </div>


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
                    inputMode="numeric"
                    value={spaceAndVolume.length}
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
                    inputMode="numeric"
                    value={spaceAndVolume.width}
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
                    inputMode="numeric"
                    value={spaceAndVolume.height}
                    onChange={handleQuestions1_options}
                  />
                  <span className="unit">Feet</span>
                </div>
              </div>
            </div>

            <div className="calculate-volume">
              {spaceAndVolume.totalVolume > 0 && (
                <div className="totalvolumeValue">
                  <div className="cubic-feet">
                    <span>Total Volume: </span>
                    <span className="total-areaVolume-value">
                      {spaceAndVolume.totalVolume.toLocaleString()} <span className="areaVolume-unit"> cubic feet </span>
                    </span>
                  </div>

                  <div className="square-feet">
                    <span> Total Area: </span>
                    <span className="total-areaVolume-value">
                      {squareFoot.toLocaleString()} <span className="areaVolume-unit"> square feet </span>
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
                  className={`insulation-option ${insulationValue === option.value ? "selected" : ""}`}
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
                        checked={insulationValue === option.value}
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
                  Your recommended BTU: {recommendedBTU.toLocaleString()} BTU/h
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
              {productsData?.map((ele, index) => {
                const isSelected = selectedProductId.selectAirConditionerProducts === ele.id.split("/")[4];
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
                      <a href={redirectURL ? redirectURL : ""} target="_blank">
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
                        <p className="img-not-available">No image available</p>
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
                  dailyRunTime === option.value ? "runtime-selected" : "insulation-option"
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
                      checked={dailyRunTime === option.value}
                      onChange={(e) => setDailyRunTime(parseInt(e.target.value))}
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

        <div className="ques-5-container">
          <div className="ques-5">
            <h1>5. How many solar panels are needed for this?</h1>
            <p className="ques-5-description">
              Solar panels do not produce 100% of their rated power. In many lighting conditions you'll be lucky to get 30% output, and during overcast or rainy days, panel production can drop to only 10% rated power. We keep this in mind to recommend a realistic Watts of Solar Power you need. More never hurts! Click an option to add it to your order.
            </p>
          </div>

          <div className="collection-container">
            <div className="collection-products">
              {panelCollection?.map((ele, index) => {
                const isSelected = selectedProductId.selectSolarPanelProducts === ele.id.split("/")[4];
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
                        handleSelectProduct("selectSolarPanelProducts", ele.id.split("/")[4],)
                      }
                    }}
                    style={{
                      border: isSelected ? "2px solid blue" : "1px solid grey",
                      cursor: "pointer",
                      position: "relative"
                    }}
                  >
                    <div className="info-icon"
                      onClick={(e) => {
                        handleInfo(ele);
                      }}
                    >
                      <a href={redirectURL ? redirectURL : ""} target="_blank">
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
                        <p className="img-not-available">No image available</p>
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
            <div className="recommendedWatts">
              <span className="recommendedWatts-value"> Your recommended watts of Solar Capacity: {Math.floor((neededHarvest * 1000) / 3).toLocaleString()} watts </span>
            </div>
          </div>
        </div>

        <div className="ques-6-container ">
          <div className="ques-6">
            <h1>6. Choose a suitable Charge Controller </h1>
            <p className="ques-6-description">
              Your solar panels output varying voltages and watts throughout the
              day. Wire the panels into a quality charge controller, which
              harvests the most power out of your panels and maintains your
              battery charge.
            </p>
          </div>
          <div className="collection-container">
            <div className="collection-products">
              {chargeControllerProducts?.map((ele, index) => {
                const isSelected = selectedProductId.selectChargeControllerproducts === ele.id.split("/")[4];
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
                        handleSelectProduct("selectChargeControllerproducts", ele.id.split("/")[4])
                      }
                    }}
                    style={{
                      border: isSelected ? "2px solid blue" : "1px solid grey",
                      cursor: "pointer",
                    }}
                  >

                    <div className="info-icon"
                      onClick={(e) => {
                        handleInfo(ele);
                      }}
                    >
                      <a href={redirectURL ? redirectURL : ""} target="_blank">
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
                        <p className="img-not-available">No image available</p>
                      )}
                    </div>
                    <div className="product-price"> <h1> ${ele.price} </h1> </div>
                    <div className="title"> <h1> {ele.displayName} </h1></div>
                  </div>
                );
              })}
            </div>
            <div className="build-kit-message">
              <p>Click an option to build your kit; click again to remove</p>
            </div>
          </div>
        </div>

        <div className="ques-7-container ">
          <div className="ques-7">
            <h1>7. Choose a battery </h1>
            <p className="ques-7-description">
              Your battery capacity is measured in kilowatt hours (kWh). We
              calculated your needed daily harvest in Step 4. Your battery
              capacity should be at least as big as the daily harvest, but
              getting a larger battery will significantly increase its lifespan
              from the typical 5-10 years to 30-50 years because it will not
              cycle as hard each day. Ordering a battery with double, triple or
              even more total kWh than your daily harvest will also allow you to
              have a healthy reserve to get through days of no sun.
            </p>
          </div>
          <div className="collection-container">
            <div className="collection-products">
              {batteryOption?.map((ele, index) => {
                const isSelected = selectedProductId.selectBatteryOptions === ele.id.split("/")[4];
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
                        handleSelectProduct("selectBatteryOptions", ele.id.split("/")[4])
                      }
                    }}
                    style={{
                      border: isSelected ? "2px solid blue" : "1px solid grey",
                      cursor: "pointer",
                    }}
                  >

                    <div className="info-icon"
                      onClick={(e) => { handleInfo(ele) }}
                    >

                      <a href={redirectURL ? redirectURL : ""} target="_blank">
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
                        <p className="img-not-available">No image available</p>
                      )}
                    </div>
                    <div className="product-price"> <h1> ${ele.price} </h1> </div>
                    <div className="title"> <h1> {ele.displayName} </h1> </div>
                  </div>
                );
              })}
            </div>
            <div className="build-kit-message">
              <p>Click an option to build your kit; click again to remove</p>
            </div>
          </div>
        </div>

        <div className="ques-8-container">
          <div className="ques-8">
            <h1> 8. Add a PV cable / Battery cable hookup kit with breaker box. </h1>
            <p className="ques-8-description">
              We can include a simple kit with appropriate gauge wires for the
              run between your solar panels and the charge controller/battery,
              and the battery cables connecting the air conditioner to the
              battery. Just enter the distances between your solar array and
              your battery/controller, and the distance between your battery and
              the HVAC unit, and we will cut a set of red and black cables,
              attach the terminals, and include a simple inline breaker box to
              get you started.
            </p>
          </div>
          <div className="collection-container">
            <div className="custome-product">
              <div className="pannel-battery-distance">
                <div className="distance-answer">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={customProductDistance.paneltoBattery === 0 ? "" : customProductDistance.paneltoBattery}
                    name="paneltoBattery"
                    onChange={handleDistanceValue}
                  />
                </div>
                <div className="distance-question">
                  <p>
                    feet PV cable between solar panels and charge
                    controller/battery
                  </p>
                </div>
              </div>

              <div className="battery-HVAC-distance">
                <div className="distance-answer">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={customProductDistance.batterytoHVAC === 0 ? "" : customProductDistance.batterytoHVAC}
                    name="batterytoHVAC"
                    onChange={handleDistanceValue}
                  />
                </div>
                <div className="distance-question">
                  <p> feet distance between the battery and AC outdoor unit </p>
                </div>
              </div>

              <div className="custom-variant-price">
                Wiring Kit Cost: ${calculateCustomePrice().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={floatContainerRef} className="float-container">
        <div className="total-price">
          <p style={{ margin: '0px' }}> Your Total:</p>
          <span className="real-price"> {newPrice} </span>
        </div>
        <div className="cart-button-container">
          <button
            className="cartButton"
            disabled={activecartButton}
            onClick={handleAddToCart}
          >
            {loading ? <span className="loader"></span> : <> Add To Cart </>}
          </button>
        </div>
      </div>

      {createPortal(
        <div className="float-container-body custom-cart_btn page-width">
          <div className="cart-btn">
            <div className="total-price">
              <p style={{ margin: '0px', }}> Your Total:</p>
              <span className="custom-price"> {newPrice} </span>
            </div>
            <div className="cart-button-container">
              <button
                className="cartButton custom-cart-button"
                disabled={activecartButton}
                onClick={handleAddToCart}
              >
                {loading ? <span className="loader"></span> : 'Add To Cart'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default App;
