import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from './component/Modal';


const App = () => {

  console.log(" ========== 6666666666666666666666666 =========");



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
    paneltoBattery: null,
    batterytoHVAC: null
  });

  const insulationOptions = [
    { label: 'Not Insulated', value: 3.0, src: "https://www.bobvila.com/wp-content/uploads/2022/09/The-Best-Insulation-Contractor-Options.jpg", desc: "abc" },
    { label: 'Minimum', value: 1.6, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4ZWDYaAEtTs2K1ZSgeF6us5P6l8IkvqQyw&s", desc: "abc" },
    { label: 'Good', value: 0.8, src: "https://havelockwool.com/wp-content/uploads/2022/04/r-19-insulation-2-1024x683.jpeg", desc: "abc" },
    { label: 'Paranoid', value: 0.6, src: "https://thumbs.dreamstime.com/b/thinking-others-opinion-concept-paranoid-man-head-funny-scary-faces-his-mind-brain-thinks-inside-his-brain-mind-218192654.jpg", desc: "abc" },
  ];
  const runTimeOptions = [
    { label: 'Overhead Sun Only', value: 1, src: "https://media.istockphoto.com/id/525206743/photo/solar-panel-on-a-red-roof.jpg?s=612x612&w=0&k=20&c=xcAkdNj8dFDhu8734FpRDAZDtN2bjr48RKEd9j2FL0U=", desc: "abc" },
    { label: '6 Hours a day', value: 6, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbsmHfXt8frbLN3689skTjxEGvrXrEhNxSUQ&s", desc: "abc" },
    { label: '12 Hours a day', value: 12, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQELDJIrxavYXnytK9YW_Z0dBLlye8YIPTHJpN4c1pbGDeR2kwHZW6pob27iTAFxYFWbKk&usqp=CAU", desc: "abc" },
    { label: 'Full Blast 24/7', value: 24, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0VUPQK6FhzefYLE_fKjDzO86_jIdZXc5cg&s", desc: "abc" },
  ];


  const calculateBTU = (length, width, height, insulationFactor) => {
    let BTU = 0;

    if (height < 6) {
      BTU = (length * width * 10) * insulationFactor;
      setSquareFoot(length * width)
    } else if (height >= 6 && height <= 10) {
      BTU = (length * width * 20) * insulationFactor;
      setSquareFoot(length * width)
    } else if (height > 10) {
      BTU = (length * width * 27) * insulationFactor;
      setSquareFoot(length * width)
    }

    return BTU;
  };

  const handleQuestions1_options = (e) => {
    const { name, value } = e.target;

    setSpaceAndVolume((prev) => {
      const updatedValues = { ...prev, [name]: parseFloat(value) || null };
      const { length, width, height } = updatedValues;

      const totalVolume = length && width && height ? length * width * height : 0;

      if (length && width && height && insulationValue) {
        const newBTU = calculateBTU(length, width, height, insulationValue);
        setRecommendedBTU(newBTU);
        setSquareFoot(squareFoot);

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
      const fetchproducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getCollectionProducts/?recommendedBTU=${BTU}`);
      const collectionProducts = await fetchproducts.json()
      // console.log("collectionProducts ====== ", collectionProducts);
      setProductData(collectionProducts);
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getpanelCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getpanelCollections/?neededHarvestkWh=${neededHarvestkWh}`);
      const panelCollectionProducts = await fetchProducts.json()
      console.log("panelCollectionProducts ====== ", panelCollectionProducts);
      setPanelCollection(panelCollectionProducts)

    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getchargeControllerCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/chargeControllerCollection/?neededHarvestkWh=${neededHarvestkWh}`);
      const chargeControllerProducts = await fetchProducts.json()
      console.log("chargeControllerProducts ====== ", chargeControllerProducts);
      setChargeControllerProducts(chargeControllerProducts)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getBettryCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getBatteryOption/?neededHarvestkWh=${neededHarvestkWh}`);
      const batteryOptionProducts = await fetchProducts.json()
      console.log("batteryOptionProducts ====== ", batteryOptionProducts);
      setBatteryOptions(batteryOptionProducts)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const handleSelectProduct = async (productType, productId) => {
    console.log("productId ====== ", productId);

    setSelectedProductId((prevState) => ({
      ...prevState,
      [productType]: productId
    }));

    if (productId) {
      const fetchProductsDetails = await fetch(`https://${Shopify.shop}/apps/proxy/api/getproductsDetail`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ productId })
      });

      const productDetails = await fetchProductsDetails.json();
      // console.log("productDetails ======== ", productDetails);

      const productPrice = parseFloat(productDetails.varientData.price);

      setSelectedProductPrices((prevState) => ({
        ...prevState,
        [productType]: productPrice
      }));
    }
  };


  // ============================= ADD TO CART ============================= //
  const handleAddToCart = async () => {
    let productsId = selectedProductId

    if (customProductDistance.batterytoHVAC && customProductDistance.paneltoBattery) {
      const { batterytoHVAC, paneltoBattery } = customProductDistance
      const createProductAPI = await fetch(`https://${Shopify.shop}/apps/proxy/api/createCustomProduct`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ batterytoHVAC, paneltoBattery, })
      });

      const createProductResponse = await createProductAPI.json();
      console.log("createProductResponse ============ ", createProductResponse);

      if (createProductResponse) {
        productsId = {
          ...selectedProductId,
          selectCustomOptions: createProductResponse
        }
      }
    }

    // console.log("productsIDs ========= ", productsId);


    const sendProductIDAPI = await fetch(`https://${Shopify.shop}/apps/proxy/api/addtoCart`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ selectedProductId: productsId })
    });

    const productIdresponse = await sendProductIDAPI.json()
    const productIdArray = productIdresponse.varientIdArray
    console.log("productIdresponse ======== ", productIdArray);


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
        console.log("getItmes ======= ", getItmes);

        // if (getItmes.items.length) {
        //   window.location.href = "/cart"
        // }

      } catch (error) {
        console.log("error  ====", error);
      } finally {
      }
    }
  }


  const handleDistanceValue = (e) => {
    const { name, value } = e.target;
    setCustomProductDistance((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }


  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleRunEachDay = (value) => {
    console.log("value ============= ", value);
    setDailyRunTime(value);
  }

  useEffect(() => {
    if (recommendedBTU > 0 && insulationValue > 0 && dailyRunTime > 0) {
      // Calculates needed daily harvest in kWh:
      const neededHarvestkWh = (recommendedBTU / 16) * dailyRunTime * insulationValue;
      console.log("neededHarvestkWh ===================== ", neededHarvestkWh);
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
      return wiringCost;
    }
    return 0;
  }

  const totalPrice = Object.values(selectedProductPrices).reduce((acc, price) => acc + price, 0 + calculateCustomePrice()).toFixed(2);


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
                  <span> Square Footage : {squareFoot} square feet </span>
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
                <div key={option.label} onClick={() => handleInsulationChange({ target: { value: option.value } })} style={{ cursor: "pointer" }} className='insulation-option'>
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
                <span> Recommended BTU :  {recommendedBTU.toLocaleString()} </span>
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
              {productsData.map((ele, index) => {
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
                      {ele && ele.image && ele.image.url ? (
                        <img src={ele.image.url} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

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
              <div ey={option.label} onClick={() => handleRunEachDay(option.value)} className='insulation-option'>
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
              Your needed Harvest: {Math.floor(neededHarvest).toLocaleString()} kWh
            </div>
          </div>
        </div>

        <div className='ques-5-container ques-wrapper'>
          <div className='ques-5' >
            <h1> 5. How many solar panels is needed for this? </h1>
          </div>

          <div className='collection-container' >
            <div className='collection-products'>
              {panelCollection.map((ele, index) => {
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
                      {ele && ele.image && ele.image.url ? (
                        <img src={ele.image.url} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>

                  </div>
                )
              })}
            </div>
            <br />
            <div className='recommendedWatts'>
              <div>
                Your recommended watts of Solar Capacity: {(Math.floor(neededHarvest / 3)).toLocaleString()} watts
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
              {chargeControllerProducts.map((ele, index) => {
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
                      {ele && ele.image && ele.image.url ? (
                        <img src={ele.image.url} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
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
              {batteryOption.map((ele, index) => {
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
                      {ele && ele.image && ele.image.url ? (
                        <img src={ele.image.url} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>


        <div className='ques-8-container'>
          <div className='ques-8'>
            <h1> {customProductDistance.paneltoBattery} Feet from Panels to Batter / {customProductDistance.batterytoHVAC} Feet from Battery to HVAC </h1>
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
            </div>
          </div>

        </div>

        <div className='total-price'>
          <p style={{ margin: "0px" }}> Total price of selected products:</p>
          <span className='price'> ${totalPrice} </span>
        </div>

        <button className='cartButton' onClick={handleAddToCart}> Add To Cart </button>
      </div>
    </>
  );
};

export default App;
