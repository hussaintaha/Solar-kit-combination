import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from './component/Modal';


const App = () => {

  console.log(" ========== 11111 =========");

  const [loading, setLoading] = useState(false);
  const [activecartButton, setActiveCartButton] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState({
    selectAirConditionerProducts: null,
    selectSolarPanelProducts: null,
    selectChargeControllerproducts: null,
    selectBatteryOptions: null,
    selectCustomOptions: null
  });
  const [productsData, setProductData] = useState([]);
  const [panelCollection, setPanelCollection] = useState([]);
  const [chargeControllerProducts, setChargeControllerProducts] = useState([]);
  const [batteryOption, setBatteryOptions] = useState([]);
  const [spaceAndVolume, setSpaceAndVolume] = useState({
    length: null,
    width: null,
    height: 8,
    totalVolume: null,
  });
  const [squareFoot, setSquareFoot] = useState(null)
  const [recommendedBTU, setRecommendedBTU] = useState(0);
  const [insulationValue, setInsulationValue] = useState(0);
  const [dailyRunTime, setDailyRunTime] = useState(0);
  const [neededHarvest, setNeededharvest] = useState(0);
  const [selectedProductPrices, setSelectedProductPrices] = useState({
    selectAirConditionerProducts: 0,
    selectSolarPanelProducts: 0,
    selectChargeControllerproducts: 0,
    selectBatteryOptions: 0
  });
  const [customProductDistance, setCustomProductDistance] = useState({
    paneltoBattery: "",
    batterytoHVAC: ""
  });

  const insulationOptions = [
    { label: 'Not Insulated', value: 3.0, src: "https://app.fullbattery.com/insulation-images/not-insulated-image.webp", desc: "abc" },
    { label: 'Minimum', value: 1.6, src: "https://app.fullbattery.com/insulation-images/minimum-insulated.jpeg", desc: "abc" },
    { label: 'Good', value: 0.8, src: "https://app.fullbattery.com/insulation-images/good-insulated.jpeg", desc: "abc" },
    { label: 'Paranoid', value: 0.6, src: "https://app.fullbattery.com/insulation-images/paranoid-insulated.webp", desc: "abc" },
  ];

  const runTimeOptions = [
    { label: 'Overhead Sun Only', value: 1, src: "https://app.fullbattery.com/runEachday-images/overhead-sun-only.jpg", desc: "abc" },
    { label: '6 Hours a day', value: 6, src: "https://app.fullbattery.com/runEachday-images/six-hours-day.jpeg", desc: "abc" },
    { label: '12 Hours a day', value: 12, src: "https://app.fullbattery.com/runEachday-images/12-hours-day.jpeg", desc: "abc" },
    { label: 'Full Blast 24/7', value: 24, src: "https://app.fullbattery.com/runEachday-images/full-blast.jpeg", desc: "abc" },
  ];


  const calculateBTU = (length, width, height, insulationFactor) => {
    let BTU = 0;
    const area = length * width; // Calculate square footage once

    if (height < 6) {
      BTU = area * 10 * insulationFactor;
    }
    else if (height >= 6 && height <= 10) {
      BTU = area * 20 * insulationFactor;
    }
    else if (height > 10) {
      BTU = area * 27 * insulationFactor;
    }

    setSquareFoot(area); // Set square footage once

    return BTU;
  };

  const handleQuestions1_options = (e) => {
    const { name, value } = e.target;

    setSpaceAndVolume((prev) => {
      const updatedValues = { ...prev, [name]: parseFloat(value) || null };
      const { length, width, height } = updatedValues;

      const totalVolume = length && width && height ? length * width * height : 0;
      setSquareFoot(length * width)

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
      const fetchproducts = await fetch(`https://${location.host}/apps/proxy/api/getCollectionProducts/?recommendedBTU=${BTU}`);
      const collectionProducts = await fetchproducts.json()
      console.log("collectionProducts ====== ", collectionProducts);
      setProductData(collectionProducts.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const handleRunEachDay = (value) => {
    // console.log("value ============= ", value);
    setDailyRunTime(value);
  }

  const getpanelCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${location.host}/apps/proxy/api/getpanelCollections/?neededHarvestkWh=${neededHarvestkWh}`);
      const panelCollectionProducts = await fetchProducts.json()
      console.log("panelCollectionProducts ====== ", panelCollectionProducts.products);
      setPanelCollection(panelCollectionProducts.products)

    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getchargeControllerCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${location.host}/apps/proxy/api/chargeControllerCollection/?neededHarvestkWh=${neededHarvestkWh}`);
      const chargeControllerProducts = await fetchProducts.json()
      // console.log("chargeControllerProducts ====== ", chargeControllerProducts.products);
      setChargeControllerProducts(chargeControllerProducts.products)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getBettryCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${location.host}/apps/proxy/api/getBatteryOption/?neededHarvestkWh=${neededHarvestkWh}`);
      const batteryOptionProducts = await fetchProducts.json()
      // console.log("batteryOptionProducts ====== ", batteryOptionProducts.products);
      setBatteryOptions(batteryOptionProducts.products)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const handleSelectProduct = async (productType, productId) => {
    console.log("productId ====== ", productId);

    const isDeselecting = selectedProductId[productType] === productId;

    setSelectedProductId((prevSelected) => ({
      ...prevSelected,
      [productType]: isDeselecting ? null : productId
    }));

    if (isDeselecting) {
      setSelectedProductPrices((prevState) => ({
        ...prevState,
        [productType]: 0
      }));
    } else if (productId) {
      try {
        const fetchProductsDetails = await fetch(`https://${location.host}/apps/proxy/api/getproductsDetail`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ productId })
        });

        const productDetails = await fetchProductsDetails.json();
        console.log("productDetails ================= ", productDetails);

        const productPrice = parseFloat(productDetails.varientData.price);

        setSelectedProductPrices((prevState) => ({
          ...prevState,
          [productType]: productPrice
        }));
      } catch (error) {
        console.log("error in selectproduct ==== ", error);
      }
    }
  };


  console.log("batteryOption === ", batteryOption);



  // ============================= ADD TO CART ============================= //
  const handleAddToCart = async () => {
    setLoading(true)
    let productsId = selectedProductId

    if (customProductDistance.batterytoHVAC && customProductDistance.paneltoBattery) {
      const { batterytoHVAC, paneltoBattery } = customProductDistance
      const createProductAPI = await fetch(`https://${location.host}/apps/proxy/api/createCustomProduct`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ batterytoHVAC, paneltoBattery, })
      });

      const createProductResponse = await createProductAPI.json();
      // console.log("createProductResponse ============ ", createProductResponse);

      if (createProductResponse) {
        productsId = {
          ...selectedProductId,
          selectCustomOptions: createProductResponse
        }
      }
    }
    // console.log("productsIDs ========= ", productsId);

    const sendProductIDAPI = await fetch(`https://${location.host}/apps/proxy/api/addtoCart`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ selectedProductId: productsId })
    });

    const productIdresponse = await sendProductIDAPI.json()
    const productIdArray = productIdresponse.varientIdArray
    // console.log("productIdresponse ======== ", productIdArray);

    if (productIdresponse.success) {
      let formData = {
        "items": productIdArray.map(productID => ({
          "id": productID,
          "quantity": 1
        }))
      }
      // console.log("forData ======== ", formData);

      try {
        const additmesAPI = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const getItmes = await additmesAPI.json()
        // console.log("getItmes ======= ", getItmes);

        if (getItmes.items.length) {
          window.location.href = "/cart"
        }
        setLoading(false)
      } catch (error) {
        console.log("error  ====", error);
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDistanceValue = (e) => {
    const { name, value } = e.target;
    // console.log("value ======== ", value);

    if (value >= 0) {
      setCustomProductDistance((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  // useEffect to check if both values are filled or not
  useEffect(() => {
    const { paneltoBattery, batterytoHVAC } = customProductDistance;

    if (paneltoBattery > 0 && batterytoHVAC > 0) {
      setActiveCartButton(false);
    } else {
      setActiveCartButton(true);
    }
  }, [customProductDistance]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (recommendedBTU > 0 && insulationValue > 0 && dailyRunTime > 0) {
      // Calculates needed daily harvest in kWh:
      const neededHarvestkWh = (recommendedBTU / 16000) * dailyRunTime;
      // console.log("neededHarvestkWh ===================== ", neededHarvestkWh);
      setNeededharvest(neededHarvestkWh);

      // Call the API with the new needed harvest
      getpanelCollectionAPI(neededHarvestkWh);
      getchargeControllerCollectionAPI(neededHarvestkWh);
      getBettryCollectionAPI(neededHarvestkWh);
    } else {

    }
  }, [recommendedBTU, insulationValue, dailyRunTime]);

  const calculateCustomePrice = () => {
    const { paneltoBattery, batterytoHVAC } = customProductDistance;
    if (paneltoBattery > 0 && batterytoHVAC > 0) {
      const wiringCost = (paneltoBattery * 4) + (batterytoHVAC * 6) + 33; // Example logic
      return wiringCost.toLocaleString();
    }
    return 0;
  }

  const totalPrice = (Object.values(selectedProductPrices).reduce((acc, price) => acc + price, 0) + Number(calculateCustomePrice())).toFixed(2);

  useEffect(() => {
    if (totalPrice > 0) {
      setActiveCartButton(false)
    } else {
      setActiveCartButton(true)
    }
  }, [totalPrice]);

  return (
    <>
      <div>
        <Modal show={isModalOpen} onClose={closeModal}>
          <h2>Warning</h2>
          <p>This is a warning message!</p>
        </Modal>
      </div>

      <div className='question-container'>
        <div className='ques-1-container'>
          <div className='ques-1'>
            <h1>1. How big is the space you are heating / cooling?</h1>
            <p style={{ margin: "-16px 0px 0px 22px" }}> Lets figure out the size of air conditioner you need in BTU/h or tons. 1 tons is same as 12,000 BTU/h. </p>
            <div className='ques-1-answer'>
              <div className='length'>
                <span>Length</span> <input type='number' name='length' value={spaceAndVolume.length} onChange={handleQuestions1_options} />
              </div>
              <div className='width'>
                <span>Width</span> <input type='number' name='width' value={spaceAndVolume.width} onChange={handleQuestions1_options} />
              </div>
              <div className='height'>
                <span> Height </span><input type='number' name='height' value={spaceAndVolume.height} onChange={handleQuestions1_options} />
              </div>
              <div className='unit'>
                <span>Feet</span>
              </div>
            </div>

            <div className='calculate-volume'>
              {spaceAndVolume.totalVolume > 0 && (
                <div className='totalvolumeValue'>
                  <span>Total Volume: {spaceAndVolume.totalVolume.toLocaleString()} cubic feet</span>
                  <span> Square Footage : {squareFoot.toLocaleString()} square feet </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='ques-2-container'>
          <div className='ques-2'>
            <h1>2. How well is it insulated?</h1>
          </div>
          <div className='ques-2-answer'>
            <div className='insulation-options'>
              {insulationOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => handleInsulationChange({ target: { value: option.value } })}
                  style={{ cursor: "pointer" }}
                  className={`insulation-option ${insulationValue === option.value ? 'selected' : ''}`} // Add selected class when this option is selected
                >
                  <div className='option-details'>
                    <img src={option.src} alt={option.label} className='option-image' />
                    <label>
                      <input
                        type='radio'
                        name='insulation'
                        value={option.value}
                        checked={insulationValue === option.value}
                        onChange={handleInsulationChange}
                      />
                      {option.label}
                    </label>
                    <p className='option-desc'>{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div> {insulationValue ?
              <div className='displayBTU'>
                <span> Your recommended BTU: {recommendedBTU.toLocaleString()} </span>
              </div>
              : ""} </div>
          </div>
        </div>

        <div className='ques-3-container ques-wrapper'>
          <div className='ques-3'>
            <h1>3. Select Air Conditioner</h1>
          </div>
          <div className='collection-container'>
            <div className='collection-products'>
              {productsData?.map((ele, index) => {
                const isSelected = selectedProductId.selectAirConditionerProducts === ele.id.split("/")[4];
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectAirConditionerProducts', ele.id.split("/")[4])}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.originalSrc ? (
                        <img src={ele.image.originalSrc} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div className='product-price'>
                      <h1> ${ele.price} </h1>
                    </div>
                    <div className='title'>
                      <h1> {ele.displayName} </h1>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='ques-4-container'>
          <div className='ques-4'>
            <h1> 4. How long do you want to run it each day? </h1>
          </div>
          <div className='runtime-options'>
            {runTimeOptions.map((option) => (
              <div
                key={option.label}
                onClick={() => handleRunEachDay(option.value)}
                className={dailyRunTime === option.value ? 'runtime-selected' : 'insulation-option'} // Conditional className
              >
                <img src={option.src} alt={option.label} className='option-image' />
                <div className='runtimeOption-details'>
                  <label key={option.label}>
                    <input
                      type='radio'
                      name='runTime'
                      value={option.value}
                      checked={dailyRunTime === option.value}
                      onChange={(e) => setDailyRunTime(parseInt(e.target.value))}
                    />
                    {option.label}
                  </label>
                  <p className='option-desc'>{option.desc} </p>
                </div>
              </div>
            ))}
          </div>

          <div className='needed-harvest'>
            <div className='harvest-result'>
              Your needed Harvest: {(Number(neededHarvest.toFixed(2))).toLocaleString()} kWh
            </div>
          </div>
        </div>

        <div className='ques-5-container ques-wrapper'>
          <div className='ques-5' >
            <h1> 5. How many solar panels is needed for this? </h1>
          </div>

          <div className='collection-container' >
            <div className='collection-products'>
              {panelCollection?.map((ele, index) => {
                const isSelected = selectedProductId.selectSolarPanelProducts === ele.id.split("/")[4]
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectSolarPanelProducts', ele.id.split("/")[4])}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.originalSrc ? (
                        <img src={ele.image.originalSrc} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div className='product-price'>
                      <h1> ${ele.price} </h1>
                    </div>
                    <div className='title'>
                      <h1> {ele.displayName} </h1>
                    </div>

                  </div>
                )
              })}
            </div>
            <br />
            <div className='recommendedWatts'>
              <div>
                Your recommended watts of Solar Capacity: {(Math.floor(neededHarvest * 1000 / 3)).toLocaleString()} watts
              </div>
            </div>
          </div>
        </div>

        <div className='ques-6-container ques-wrapper'>
          <div className='ques-6'>
            <h1>6. suitable charge controller </h1>
          </div>
          <div className='collection-container'>
            <div className='collection-products'>
              {chargeControllerProducts?.map((ele, index) => {
                const isSelected = selectedProductId.selectChargeControllerproducts === ele.id.split("/")[4]
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectChargeControllerproducts', ele.id.split("/")[4])}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.originalSrc ? (
                        <img src={ele.image.originalSrc} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div className='product-price'>
                      <h1> ${ele.price} </h1>
                    </div>
                    <div className='title'>
                      <h1> {ele.displayName} </h1>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='ques-7-container ques-wrapper'>
          <div className='ques-7'>
            <h1>7. battery options </h1>
          </div>
          <div className='collection-container' >
            <div className='collection-products'>
              {batteryOption?.map((ele, index) => {
                const isSelected = selectedProductId.selectBatteryOptions === ele.id.split("/")[4];
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectBatteryOptions', ele.id.split("/")[4])}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.originalSrc ? (
                        <img src={ele.image.originalSrc} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div className='product-price'>
                      <h1> ${ele.price} </h1>
                    </div>
                    <div className='title'>
                      <h1> {ele.displayName} </h1>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='ques-8-container'>
          <div className='ques-8'>
            <h1>8. Add a PV cable / Battery cable hookup kit with breaker box.</h1>
            <h1 className='sub-ques'> {customProductDistance.paneltoBattery} Feet from Panels to Batter / {customProductDistance.batterytoHVAC} Feet from Battery to HVAC </h1>
            <div className='custom-variant-description'>
              We can include a simple kit with appropriate gauge wires for the run between your solar panels and the charge controller/battery, and the right gauge battery cables with ring terminals to attach to the air conditioner. Just enter the distances between your solar array and your battery/controller, and the distance between your battery and the HVAC unit, and we will cut a set of red and black cables, attach the terminals, and include a simple inline breaker box to get you started.

            </div>
          </div>
          <div className='collection-container'>
            <div className='custome-product'>
              <div className='pannel-battery-distance'>
                <div className='distance-question'>
                  <p> Distance from Panels to Battery in feet </p>
                </div>
                <div className='distance-answer'>
                  <input type='number' value={customProductDistance.paneltoBattery} name='paneltoBattery' onChange={handleDistanceValue} />
                </div>
              </div>

              <div className='battery-HVAC-distance'>
                <div className='distance-question'>
                  <p> Distance from Battery to HVAC in feet </p>
                </div>
                <div className='distance-answer'>
                  <input type='number' value={customProductDistance.batterytoHVAC} name='batterytoHVAC' onChange={handleDistanceValue} />
                </div>
              </div>

              <div className='custom-variant-price'>
                Wiring Kit Cost :  ${calculateCustomePrice()}
              </div>
            </div>
          </div>

        </div>

        <div className='total-price'>
          <p style={{ margin: "0px" }}> Total price of selected products:</p>
          <span className='price'> ${totalPrice} </span>
        </div>

        <button className='cartButton' disabled={activecartButton} onClick={handleAddToCart}>
          {loading ? <span className="loader"></span> : "Add To Cart"}
        </button>
      </div>
    </>
  );
};

export default App;
