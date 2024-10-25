import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from './component/Modal';


const App = () => {

  console.log(" ========== 333333333333333333333333333333 =========");

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
    { label: 'Not Insulated', value: 3.0, src: "https://app.fullbattery.com/insulation-images/not-insulated-image.webp", desc: "A bare metal shed, RV, boat, a fabric tent, or plastic cover. The basics." },
    { label: 'Minimum', value: 1.6, src: "https://app.fullbattery.com/insulation-images/minimum-insulated.jpeg", desc: "Metallic bubble wrap or light timber shed with some natural insulation." },
    { label: 'Good', value: 0.8, src: "https://app.fullbattery.com/insulation-images/good-insulated.jpeg", desc: "Insulation on all sides of a solid frame. Spray foam, rockwool or fiberglass." },
    { label: 'Paranoid', value: 0.6, src: "https://app.fullbattery.com/insulation-images/paranoid-insulated.webp", desc: "You know your R-Values and you used them all. R 40-60. And it's SEALED." },
  ];

  const runTimeOptions = [
    { label: 'Overhead Sun Only', value: 4, src: "https://app.fullbattery.com/runEachday-images/overhead-sun-only.jpg", desc: "I only need it to work when the sun is right over the panels during peak solar production." },
    { label: '6 Hours a day', value: 6, src: "https://app.fullbattery.com/runEachday-images/six-hours-day.jpeg", desc: "I want to run the AC during dawn or dusk for some time, but will turn it off by bedtime." },
    { label: '12 Hours a day', value: 12, src: "https://app.fullbattery.com/runEachday-images/12-hours-day.jpeg", desc: "The AC will be running most of the time during the day and into the late evening." },
    { label: 'Full Blast 24/7', value: 24, src: "https://app.fullbattery.com/runEachday-images/full-blast.jpeg", desc: "I want enough solar and battery capacity to run it on full blast without turning it off, 24/7." },
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


  console.log("selectedProductId.selectSolarPanelProducts === ", selectedProductId.selectSolarPanelProducts);


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
            <p className='ques-1-description'>
              Let's figure out the size of air conditioner you need in BTU/h or tons. 1 ton is the same as 12,000 BTU/h.
            </p>
            <div className='ques-1-answer'>
              <div className='length'>
                <span>Length</span>
                <div className='show-input-values'>
                  <input type='number' name='length' value={spaceAndVolume.length} onChange={handleQuestions1_options} />
                  <span className='unit'>Feet</span>
                </div>
              </div>

              <div className='width'>
                <span>Width</span>
                <div className='show-input-values' >
                  <input type='number' name='width' value={spaceAndVolume.width} onChange={handleQuestions1_options} />
                  <span className='unit'>Feet</span>
                </div>
              </div>

              <div className='height'>
                <span> Height </span>
                <div className='show-input-values' >
                  <input type='number' name='height' value={spaceAndVolume.height} onChange={handleQuestions1_options} />
                  <span className='unit'>Feet</span>
                </div>
              </div>
            </div>

            <div className='calculate-volume'>
              {spaceAndVolume.totalVolume > 0 && (
                <div className='totalvolumeValue'>
                  <span>Total Volume: {spaceAndVolume.totalVolume.toLocaleString()} cubic feet</span>
                  <span> Total Area: {squareFoot.toLocaleString()} square feet </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='ques-2-container' >
          <div className='ques-2'>
            <h1>2. How well is it insulated?</h1>
            <p className='ques-2-description'>
              The level of insulation makes a huge impact on the actual number of BTU's you have to move every hour to keep your place air conditioned. Vans and RV's usually select 'Minimum' or 'Not Insulated' for realistic numbers. Click an option to see your suggested cooling/heating capacity expressed in BTU-hours.
            </p>
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

        <div className='ques-3-container'>
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
            <div className='build-kit-message'>
              <p>Click an option to build your kit: click again to remove</p>
            </div>
          </div>
        </div>


        <div className='ques-4-container'>
          <div className='ques-4'>
            <h1> 4. How long do you want to run it each day? </h1>
            <p className='ques-4-description'> Usage patterns impact how much battery storage and solar power you need dramatically. If you only need the unit to work during peak daylight hours (1-3 hours before and after solar noon, assuming your panels are pointed properly), you do not need many panels or batteries. To air condition for more hours each day, you need increasingly more panels and batteries to capture the sun during peak production times and spread out the energy across the 24 hour cycle. Most people choose an option between 6 and 12 hours per day which allows you to run the air conditioner into the evening or night with zero reliance on grid power. Click an option to see your suggested daily harvest in kilowatt-hours. This is how much solar energy you need to produce each day. </p>
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

        <div className='ques-5-container '>
          <div className='ques-5' >
            <h1> 5. How many solar panels are needed for this? </h1>
            <p className='ques-5-description'>
              Solar panels do not produce 100% of their rated power. In many lighting conditions you'll be lucky to get 30% output, and during overcast or rainy days, panel production can drop to only 10% rated power. We keep this in mind to recommend a realistic Watts of Solar Power you need. More never hurts! Click an option to add it to your order.
            </p>
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
            <div className='build-kit-message'>
              <p>Click an option to build your kit: click again to remove</p>
            </div>
            <div className='recommendedWatts'>
              <span className='recommendedWatts-value'>Your recommended watts of Solar Capacity: {(Math.floor(neededHarvest * 1000 / 3)).toLocaleString()} watts</span>
            </div>
          </div>
        </div>

        <div className='ques-6-container '>
          <div className='ques-6'>
            <h1>6. Choose a suitable Charge Controller </h1>
            <p className='ques-6-description'>
              Your solar panels output varying voltages and watts throughout the day. Wire the panels into a quality charge controller, which harvests the most power out of your panels and maintains your battery charge.
            </p>
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
            <div className='build-kit-message'>
              <p>Click an option to build your kit: click again to remove</p>
            </div>
          </div>
        </div>

        <div className='ques-7-container '>
          <div className='ques-7'>
            <h1>7. Choose a battery </h1>
            <p className='ques-7-description'>
              Your battery capacity is measured in kilowatt hours (kWh). We calculated your needed daily harvest in Step 4. Your battery capacity should be at least as big as the daily harvest, but getting a larger battery will significantly increase its lifespan from the typical 5-10 years to 30-50 years because it will not cycle as hard each day. Ordering a battery with double, triple or even more total kWh than your daily harvest will also allow you to have a healthy reserve to get through days of no sun.
            </p>
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
            <div className='build-kit-message'>
              <p>Click an option to build your kit: click again to remove</p>
            </div>
          </div>
        </div>

        <div className='ques-8-container'>
          <div className='ques-8'>
            <h1>8. Add a PV cable / Battery cable hookup kit with breaker box.</h1>
            <p className='ques-8-description'>
              We can include a simple kit with appropriate gauge wires for the run between your solar panels and the charge controller/battery, and the battery cables connecting the air conditioner to the battery. Just enter the distances between your solar array and your battery/controller, and the distance between your battery and the HVAC unit, and we will cut a set of red and black cables, attach the terminals, and include a simple inline breaker box to get you started.
            </p>
          </div>
          <div className='collection-container'>
            <div className='custome-product'>
              <div className='pannel-battery-distance'>
                <div className='distance-answer'>
                  <input type='number' value={customProductDistance.paneltoBattery} name='paneltoBattery' onChange={handleDistanceValue} />
                </div>
                <div className='distance-question'>
                  <p> feet PV cable between solar panels and charge controller/battery </p>
                </div>
              </div>

              <div className='battery-HVAC-distance'>
                <div className='distance-answer'>
                  <input type='number' value={customProductDistance.batterytoHVAC} name='batterytoHVAC' onChange={handleDistanceValue} />
                </div>
                <div className='distance-question'>
                  <p> feet distance between the battery and AC outdoor unit </p>
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

        <div className='cart-button-container'>
          <button className='cartButton' disabled={activecartButton} onClick={handleAddToCart}>
            {loading ? <span className="loader"></span> : "Add To Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
