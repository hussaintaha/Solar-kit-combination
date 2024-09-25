Hello, we need a Shopify landing page or a product listing that functions like a calculator and lets the shopper select a kit composed of 5 Groups of products. I need the page to match the existing layout and have large picture buttons for the customer's entries that should update the main picture to display the selected kit.


I would like it to add the calculated/customer chosen products to cart individually. In the cart the customer can then delete a part of the package in pieces. 

Montage screen shot of example attached.

Each group has different sizes and properties but the 5 groups comprise the kit. The 5 groups are:


Select Unit Size -> Solar Panel -> Controller -> Battery -> Wiring -> Add to Cart

---------------------------------------------------------------------

1. How big is the space you are heating?


 __ length  __ width  _8_ height (FEET)


Page calculates: Working volume: __ cubic feet (l*w*h) displays result
---------------------------------------------------------------------

---------------------------------------------------------------------
2. Next question: How well is it insulated?

- Not Insulated (assigned value 3.0)
- Minimum (assigned value 1.6)
- Good (assigned value 1.3)
- Paranoid (assigned value 0.67)


Display Recommended BTU:

if height <6
BTU = ( l * w * 10 ) * insulation factor

if height is between 6 and 10
BTU = ( l * w * 20 ) * insulation factor

if height > 10
BTU = ( l * w * 27 ) * insulation factor
---------------------------------------------------------------------

---------------------------------------------------------------------
3. Select Air Conditioner

if BTU < 10000 show collection A (about 4 items in collection)
if BTU 10000-18000 show collection B
if BTU > 18000 show collection C

customer can add to cart or select one or none of the listed units

---------------------------------------------------------------------

---------------------------------------------------------------------
4. How long do you want to run it each day?

- Overhead Sun Only (assigned value 1)
- 6 Hours a day (assigned value 6)
- 12 Hours a day (assigned value 12)
- Full Blast 24/7 (assigned value 24)


Calculates & displays needed daily harvest in kWh: 
needed daily harvest = BTU/16 *{value from 4 - #of hours each day} * {value from 2 - insulation factor multiplier}

Harvest = the BTU you calculated in step 1, divide by 16, multiply by number of hours you need unit to run that customer indicated in step 4, multiplied by an adjustment value calculated based on the answer to insulation question in step 2


---------------------------------------------------------------------

---------------------------------------------------------------------
5. Calculate the watts of solar panels the customer needs and display an offer.


Your needed "Watts Of Solar": XXXX total Watts of solar array.

We recommend 200 Watt Glass Mono Panels. If using these panels, 
the quantity needed is (Harvest / 3) Watts - Round up to whole # of panels - can
this be clicked to add to cart and it adds the appropriate #?


Alternatively, we can show range just like we do with selecting air conditioner. 

if Harvest: < 4 kWh, show Collection A (about 4 items in collection)
if Harvest: 4 - 10 kWh, show Collection B (about 4 items in collection)
if Harvest: 10 - 20 kWh, show Collection C (about 4 items in collection)
if Harvest: > 20 kWh, show Collection D (about 4 items in collection)
---------------------------------------------------------------------

---------------------------------------------------------------------
6. Offer customer suitable charge controller

if Harvest: < 4 kWh, show Collection A (about 4 items in collection)
if Harvest: 4 - 10 kWh, show Collection B (about 4 items in collection)
if Harvest: 10 - 20 kWh, show Collection C (about 4 items in collection)
if Harvest: > 20 kWh, show Collection D (about 4 items in collection) 
---------------------------------------------------------------------

---------------------------------------------------------------------
7. Offer battery options:

if Harvest: < 4 kWh, show batteries power range Collection A
if Harvest: 4 - 10 kWh, show batteries power range Collection B
if Harvest: 10 - 20 kWh, show batteries power range Collection C
if Harvest: > 20 kWh, show batteries power range Collection D
---------------------------------------------------------------------

---------------------------------------------------------------------
8. Create a custom option item with simple price formula.

Distance from Panels to Battery ___ ft ($a)
Distance from Battery to HVAC ___ ft ($b)


"Custom Wiring Kit (includes everything you need to get started)"

Price = $a*4+$b*6+33   [ +add ] (pass on $a and $b to Shopify receipt)
---------------------------------------------------------------------

---------------------------------------------------------------------
Show live total of selected items. It would be fantastic if Adding to Cart added the INDIVIDUAL variants/items that were selected from our products catalog.

Your Total: $12345.67

[ Add to Cart ]
---------------------------------------------------------------------
/ project



38.39.182.71 sudo userid taha, password: https://privnote.com/3wN5Wu99#J2W7jgBsq
i pointed app.fullbattery.com to that ip with a record, tell me if i did correctly or need to do so something else





================================================================================================================================
POA:

You will need a custom Shopify app with a theme app extension block.

A. Backend (24 hours):
On the backend, meaning in the Shopify admin, there will be a Shopify app running that will handle the process of dynamic product creation since in the last step you want to "Create a custom option item with simple price formula.". The tasks will involve:
  1. Creation of the Custom Shopify app,
  2. Creation of necessary APIs to communicate with the theme app extension block,
  3. Creation of dynamic product creation logic with the custom price. Also need to work on hiding this product in the storefront. After the order is completed, we need to delete this product automatically as well.

B. Storefront (24 hours):
The theme app extension will be needed on the front end to display the questions and answers. which will involve the following tasks (24 hours):
  1. Creation of the theme app extension block with the React.js app build files,
  2. Displaying the questions and answers using technologies like HTML, CSS, and javascript in the theme app extension block,
  3. Make the questions and answers dynamic based upon the previous answer values and then display the subsequent options to the further questions. As an option, we also need to display the collection's names for the specific questions,
  4. Variant's add-to-cart functionality based on the user's selected options.

C. Deployment (2 hours)
  1. We will need a server on which our custom Shopify app will be hosted, I will recommend Digitalocean cloud service for that.
  2. A subdomain will be needed which will be pointed to the server.
  3. A Shopify partner account will be needed to set up the custom app, which will contain API keys

================================================================================================================================







