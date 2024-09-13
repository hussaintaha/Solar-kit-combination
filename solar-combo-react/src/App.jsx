import React, { useState } from 'react';
import './App.css';


const App = () => {

  console.log(" ========== 88888 =========");

  const [selectedProductId, setSelectedProductId] = useState({
    selectAirConditionerProducts: null,
    selectSolarPanelProducts: null,
    selectChargeControllerproducts: null,
    selectBatteryOptions: null,
  });
  const [productsData, setProductData] = useState([]);
  const [panelCollection, setPanelCollection] = useState([]);
  const [chargeControllerProducts, setChargeControllerProducts] = useState([]);
  const [batteryOption, setBatteryOptions] = useState([]);
  const [spaceAndVolume, setSpaceAndVolume] = useState({
    length: 0,
    width: 0,
    height: 0,
    totalVolume: 0,
  });
  const [recommendedBTU, setRecommendedBTU] = useState(0);
  const [insulationValue, setInsulationValue] = useState(1.3);
  const [dailyRunTime, setDailyRunTime] = useState(24);
  const [neededHarvest, setNeededharvest] = useState(0);
  const [selectedProductPrices, setSelectedProductPrices] = useState({
    selectAirConditionerProducts: 0,
    selectSolarPanelProducts: 0,
    selectChargeControllerproducts: 0,
    selectBatteryOptions: 0
  });

  const [customProductDistance, setCustomProductDistance] = useState({
    paneltoBattery: 0,
    batterytoHVAC: 0
  })

  const insulationOptions = [
    { label: 'Not Insulated', value: 3.0 },
    { label: 'Minimum', value: 1.6 },
    { label: 'Good', value: 1.3 },
    { label: 'Paranoid', value: 0.67 },
  ];

  const runTimeOptions = [
    { label: 'Overhead Sun Only', value: 1 },
    { label: '6 Hours a day', value: 6 },
    { label: '12 Hours a day', value: 12 },
    { label: 'Full Blast 24/7', value: 24 },
  ];


  const handleQuestions1_options = (e) => {
    const { name, value } = e.target;

    setSpaceAndVolume((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTotalVolume = () => {
    const { length, width, height } = spaceAndVolume;

    if (length && width && height) {
      const totalVolume = length * width * height;
      setSpaceAndVolume(prev => ({ ...prev, totalVolume }));

      let BTU = 0;
      if (height < 6) {
        BTU = length * width * 10;
      } else if (height >= 6 && height <= 10) {
        BTU = length * width * 20;
      } else if (height > 10) {
        BTU = length * width * 27;
      }
      setRecommendedBTU(BTU);

      if (BTU > 100) {
        getCollectionProductsAPI(BTU);
      } else {
        console.log("BTU is less than or equal to 100.");
      }
    } else {
      alert("Please enter valid dimensions.");
    }
  };


  const handleInsulationChange = (e) => {
    setInsulationValue(parseFloat(e.target.value));
  };


  const getCollectionProductsAPI = async (BTU) => {
    try {
      const fetchproducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getCollectionProducts/?recommendedBTU=${BTU}`);
      const collectionProducts = await fetchproducts.json()
      console.log("collectionProducts ====== ", collectionProducts);
      setProductData(collectionProducts.data.products);
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getpanelCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getpanelCollections/?neededHarvestkWh=${neededHarvestkWh}`);
      const panelCollectionProducts = await fetchProducts.json()
      console.log("panelCollectionProducts ====== ", panelCollectionProducts);
      setPanelCollection(panelCollectionProducts.data.products)

    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getchargeControllerCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/chargeControllerCollection/?neededHarvestkWh=${neededHarvestkWh}`);
      const chargeControllerProducts = await fetchProducts.json()
      console.log("chargeControllerProducts ====== ", chargeControllerProducts);
      setChargeControllerProducts(chargeControllerProducts.data.products)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }

  const getBettryCollectionAPI = async (neededHarvestkWh) => {
    try {
      const fetchProducts = await fetch(`https://${Shopify.shop}/apps/proxy/api/getBatteryOption/?neededHarvestkWh=${neededHarvestkWh}`);
      const batteryOptionProducts = await fetchProducts.json()
      console.log("batteryOptionProducts ====== ", batteryOptionProducts);
      setBatteryOptions(batteryOptionProducts.data.products)
    } catch (error) {
      console.log("error ========= ", error);
    }
  }


  const handleSelectProduct = async (productType, productId) => {

    setSelectedProductId((prevState) => ({
      ...prevState,
      [productType]: productId
    }));

    const neededHarvestkWh = (recommendedBTU / 16) * dailyRunTime * insulationValue;
    setNeededharvest(neededHarvestkWh);

    getpanelCollectionAPI(neededHarvestkWh);
    getchargeControllerCollectionAPI(neededHarvestkWh);
    getBettryCollectionAPI(neededHarvestkWh);

    if (productId) {
      const fetchProductsDetails = await fetch(`https://${Shopify.shop}/apps/proxy/api/getproductsDetail`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ productId })
      });

      const productDetails = await fetchProductsDetails.json();
      const productPrice = parseFloat(productDetails.productData.product.variants[0].price);

      setSelectedProductPrices((prevState) => ({
        ...prevState,
        [productType]: productPrice
      }));
    }
  };

  const handleAddToCart = async () => {
    console.log("selectedProductId ================ ", selectedProductId);

    // if (customProductDistance.batterytoHVAC && customProductDistance.paneltoBattery) {
    //   const { batterytoHVAC, paneltoBattery } = customProductDistance
    //   console.log("fmhgfjghjdfghggdjg");

    //   const createProductAPI = await fetch(`https://${Shopify.shop}/apps/proxy/api/createCustomProduct`, {
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json"
    //     },
    //     body: JSON.stringify({ batterytoHVAC, paneltoBattery })
    //   });

    //   const createProductResponse = await createProductAPI.json();
    //   console.log("createProductResponse ========= ", createProductResponse);


    // }

    const sendProductIDAPI = await fetch(`https://${Shopify.shop}/apps/proxy/api/addtoCart`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ selectedProductId })
    });

    const productIdArray = await sendProductIDAPI.json()
    console.log("productIdArray ======== ", productIdArray);

    let formData = {
      'items': productIdArray?.fetchProductsData?.map(productid => ({
        id: productid?.variants[0]?.id,
        quantity: 1
      }))
    };
    console.log("formData ===== ", formData);



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

      if (getItmes.items.length) {
        window.location.href = "/cart"
      }
    } catch (error) {
      console.log("error  ====", error);
    }

  }
  const handleDistanceValue = (e) => {
    const { name, value } = e.target;
    setCustomProductDistance((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const totalPrice = Object.values(selectedProductPrices).reduce((acc, price) => acc + price, 0).toFixed(2);


  return (
    <>
      <div className='question-container'>
        <div className='ques-1-container'>
          <div className='ques-1'>
            <span>1. How big is the space you are heating?</span>
            <div className='ques-1-answer'>
              <div className='length'>
                <input type='number' name='length' value={spaceAndVolume.length} onChange={handleQuestions1_options} /> <span>Length</span>
              </div>
              <div className='width'>
                <input type='number' name='width' value={spaceAndVolume.width} onChange={handleQuestions1_options} /> <span>Width</span>
              </div>
              <div className='height'>
                <input type='number' name='height' value={spaceAndVolume.height} onChange={handleQuestions1_options} /> <span>Feet</span>
              </div>
            </div>

            <div className='calculate-volume'>
              <div>
                <button className='volumeButton' onClick={calculateTotalVolume}> Calculate Volume </button>
              </div>
              <div className='totalvolumeValue' style={{ display: spaceAndVolume.totalVolume !== "" ? 'block' : 'none' }}>
                <span> {spaceAndVolume.totalVolume} </span>
              </div>
            </div>
          </div>
        </div>

        <div className='ques-2-container'>
          <div className='ques-2'>
            <h1> 2. How well is it insulated? </h1>
          </div>
          <div className='ques-2-answer'>
            <div className='insulation-options'>
              {insulationOptions.map((option) => (
                <label key={option.label}>
                  <input
                    type='radio'
                    name='insulation'
                    value={option.value}
                    checked={insulationValue === option.value}
                    onChange={handleInsulationChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className='ques-3-container'>
          <div className='ques-3'>
            <h1>3. Select Air Conditioner</h1>
          </div>
          <div className='collection-container'>
            <div className='collection-products'>
              {productsData.map((ele, index) => {
                const isSelected = selectedProductId.selectAirConditionerProducts === ele.id;
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectAirConditionerProducts', ele.id)}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.src ? (
                        <img src={ele.image.src} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>
                    <div>
                      <h1> {ele.p} </h1>
                    </div>
                    <div>

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
          <div className='runtime-option'>
            {runTimeOptions.map((option) => (
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
            ))}
          </div>

          <div className='needed-harvest'>
            <div className='harvest-result'>
              Your needed Harvest: {neededHarvest.toFixed(2)} kWh each 24 hours
            </div>
          </div>
        </div>

        <div className='ques-5-container'>
          <div className='ques-5' >
            <h1> 5. Calculate the watts of solar panels the customer needs and display an offer. </h1>
          </div>

          <div className='collection-container' >
            <div className='collection-products'>
              {panelCollection.map((ele, index) => {
                const isSelected = selectedProductId.selectSolarPanelProducts === ele.id
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectSolarPanelProducts', ele.id)}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.src ? (
                        <img src={ele.image.src} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>
                    <div>
                      <h1> {ele.p} </h1>
                    </div>
                    <div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='ques-6-container'>
          <div className='ques-6'>
            <h1>6. suitable charge controller </h1>
          </div>
          <div className='collection-container'>
            <div className='collection-products'>
              {chargeControllerProducts.map((ele, index) => {
                const isSelected = selectedProductId.selectChargeControllerproducts === ele.id
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectChargeControllerproducts', ele.id)}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.src ? (
                        <img src={ele.image.src} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>
                    <div>
                      <h1> {ele.p} </h1>
                    </div>
                    <div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='ques-7-container'>
          <div className='ques-7'>
            <h1>7. battery options </h1>
          </div>
          <div className='collection-container' >
            <div className='collection-products'>
              {batteryOption.map((ele, index) => {
                const isSelected = selectedProductId.selectBatteryOptions === ele.id;
                return (
                  <div
                    className='products' key={ele.id}
                    onClick={() => handleSelectProduct('selectBatteryOptions', ele.id)}
                    style={{
                      border: isSelected ? '2px solid blue' : '1px solid grey',
                      cursor: 'pointer'
                    }}
                  >
                    <div className='productsImage'>
                      {ele && ele.image && ele.image.src ? (
                        <img src={ele.image.src} style={{ width: "100px", height: "100px" }} alt="Product" />
                      ) : (
                        <p>No image available</p>
                      )}

                    </div>
                    <div className='title'>
                      <h1> {ele.title} </h1>
                    </div>
                    <div>
                      <h1> {ele.p} </h1>
                    </div>
                    <div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>


        <div className='ques-8-container'>
          <div className='ques-8'>
            <h1> Custom Wiring Kit </h1>
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
