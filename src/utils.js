export const totalQuantity = (cartResponse) => {
    return cartResponse?.cart?.lines?.edges?.reduce(
       (accumulator, cartItem) => accumulator + cartItem?.node?.quantity,
       0
     );
   }
 

   export const totalQuantityInDraftOrder = (draftOrderResponse) => {
    return draftOrderResponse?.draftOrder?.lineItems?.edges?.reduce(
       (accumulator, draftOrderItem) => accumulator + draftOrderItem?.node?.quantity,
       0
     );
   }