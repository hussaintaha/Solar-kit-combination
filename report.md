I have worked on the UI part, allowing users to input space dimensions, select insulation quality, and choose daily run times. The UI dynamically calculates and displays the total volume and recommended BTUs based on user inputs.

Could you please clarify which collection will be shown based on the BTU value? This is important because there are multiple collections available.



11/9/24
Today, I worked on the following points:

Calculated the watts of solar panels and displayed the products of the collection according to their harvest value.
Worked on displaying suitable charge controllers.
Worked on offering battery options.
Implemented the "Add to Cart" functionality; when a customer selects products and clicks the "Add to Cart" button, the product will be added to the cart.
Currently, I am working on displaying the total values of the selected products.


12/9/24
Today, I worked on the following tasks:

Improved the UI for the custom page.
Implemented functionality to display the total price of selected products before adding them to the cart.
Worked on creating custom products based on the values for the distance from panels to the battery and from the battery to HVAC. These products are only for adding to the cart and won't be visible in the store.

If you want any changes in UI, please let me know.



13/09/24
I have worked on creating a custom product based on the distance from the panels to the battery and the distance from the battery to the HVAC. I have also created a variant for this product and ensured it does not appear in the storefront. Currently, I am working on enabling customers to add this product to the cart.


14/09/24
I have updated the formula to calculate total harvest value using this formula: 
    harvest = BTU/16 *{value from 4} * {value from 2}
I have update the UI and dispaly the image and description in step 2 and step 4 points.
I am working on resolving an issue while i create a varient for custome product.
I am adding an screenshots of step 2 and step 4, if you want any changes, please let me know.


16/09/24

Today, I worked on the following tasks:

Updated the formula to calculate the "recommended BTU" and removed the "Calculate BTU" button. Now, the Total BTU is displayed automatically when all values (length, width, and height) are provided.
Displayed the recommended BTU value based on the insulation value change.
Updated step 2 and step 4 by making the entire box clickable.
Worked on updating the available quantities of the custom-created product and enabling it to be added to the cart.


17/09/24
Today,
 I worked on conditionally rendering the collections, creating a custom draft product, and developing an API to create variants of custom products. I also set the inventory quantity. However, when I added the product to the cart, I encountered an error related to the variant, so I am currently working on fixing it.


 21/09/24
Today, I worked on 
Creating a custom product called "Custom Wiring Kit" and set up variants for it, including dynamic pricing based on distance. I implemented functionality so that when the custom product is created, it does not appear on the storefront if a customer searches for it; customers can only purchase this product directly. I created functionality to automatically delete the custom product from Shopify once the order is fulfilled.




25/09/24

Report:

1. In the very first step, we calculate the space by obtaining the length, width, and height.

2. Once the first step is completed, we provide options to select the type of insulation you want: "Not Insulated, Minimum, Good, Paranoid."

3. In the third step, we display the air conditioner options based on the BTU value. If the first two steps are not completed, the collection will not be displayed.

4. In the fourth step, we show options for how long you want to run the air conditioner each day. We present four options: "Overhead Sun Only, 6 Hours a Day, 12 Hours a Day, Full Blast 24/7." Based on this selection, we calculate the daily energy harvest in KWH using the formula you provided.

5. In step five, we display collections based on the harvest value calculated in the fourth step. We follow the same process for the sixth and seventh points.

6. In the last step, we provide fields for customers to enter:

Distance from Panels to Battery in feet
Distance from Battery to HVAC in feet
We create a product in Shopify with a dynamic price and name it "Custom Wiring Kit," which is then added to the cart. This created product does not display on the storefront when users search for it. If the order is fulfilled, the custom product is automatically deleted.


Note:
I have currently used dummy collections for the demo. You will need to create collections on your Shopify store and add the products you want to display in those collections.


Remaining work: Hosting the app using the provided credentials: ssh taha@38.39.182.71.




28/9/24
 I have update the UI and display the product variant belonging to each products which present in collection.
 I have set title product title / variant title and if some case variant title is default title then i just show the product title.
 i have set the image in variant if variant doest how any image then i show the product image.
 if variant is more than 5 then we show the scrollbar to slide the variants. 
