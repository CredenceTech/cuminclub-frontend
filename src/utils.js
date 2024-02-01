export const totalQuantity = (cartResponse) => {
    return cartResponse.cart.lines.edges.reduce(
       (accumulator, cartItem) => accumulator + cartItem.node.quantity,
       0
     );
   }
 