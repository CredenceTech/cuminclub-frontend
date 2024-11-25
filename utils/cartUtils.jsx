
import { createCartMutation, graphQLClient, updateCartItemMutation, updateCartMutation } from '../src/api/graphql';

export const handleAddToCart = async ({
    productId,
    sellingPlanId,
    cartResponse,
    cartDatas,
    dispatch,
    addCartData,
    setCartResponse,
    setIsShaking,
}) => {
    setIsShaking(productId);

    if (!cartDatas) {
        const newCartItem = sellingPlanId
            ? { merchandiseId: productId, sellingPlanId, quantity: 1 }
            : { merchandiseId: productId, quantity: 1 };
        await addToCart(newCartItem, dispatch, addCartData, setIsShaking);
        return;
    }

    const productInCart = cartResponse?.cart?.lines?.edges.find(
        (cartItem) => cartItem.node.merchandise.id === productId
    );

    const cartId = cartDatas?.cartCreate?.cart?.id;

    if (productInCart) {
        const quantityInCart = productInCart.node.quantity;
        const id = productInCart.node.id;
        const updatedCartItem = sellingPlanId
            ? { id, sellingPlanId, quantity: quantityInCart + 1 }
            : { id, quantity: quantityInCart + 1 };

        await updateCartItem(productId, cartId, updatedCartItem, dispatch, setCartResponse, setIsShaking);
    } else {
        const newCartItem = sellingPlanId
            ? { merchandiseId: productId, sellingPlanId, quantity: 1 }
            : { merchandiseId: productId, quantity: 1 };

        await updateCart(cartId, newCartItem, dispatch, setCartResponse, setIsShaking);
    }
};

export const handleRemoveFromCart = async ({
    productId,
    sellingPlanId,
    cartResponse,
    cartDatas,
    dispatch,
    setCartResponse,
    setLoading,
}) => {
    setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));

    const productInCart = cartResponse.cart.lines.edges.find(
        (cartItem) => cartItem.node.merchandise.id === productId
    );

    if (productInCart) {
        const quantityInCart = productInCart.node.quantity;
        const cartId = cartDatas?.cartCreate?.cart?.id;
        const id = productInCart.node.id;

        const updatedCartItem = sellingPlanId
            ? { id, sellingPlanId, quantity: quantityInCart === 1 ? 0 : quantityInCart - 1 }
            : { id, quantity: quantityInCart === 1 ? 0 : quantityInCart - 1 };

        await updateCartItem(productId, cartId, updatedCartItem, dispatch, setCartResponse, () => {
            setLoading((prevLoading) => ({ ...prevLoading, [productId]: false }));
        });
    }
};

export const addToCart = async (cartItem, dispatch, addCartData, setIsShaking) => {
    const params = {
        cartInput: { lines: [cartItem] },
    };
    const response = await graphQLClient.request(createCartMutation, params);
    dispatch(addCartData(response));
    setIsShaking(null);
};

export const updateCartItem = async (productId, cartId, cartItem, dispatch, setCartResponse, callback) => {
    const params = {
        cartId,
        lines: cartItem,
    };
    const response = await graphQLClient.request(updateCartItemMutation, params);
    dispatch(setCartResponse(response.cartLinesUpdate));
    if (callback) callback();
};

export const updateCart = async (cartId, cartItem, dispatch, setCartResponse, callback) => {
    const params = {
        cartId,
        lines: [cartItem],
    };
    const response = await graphQLClient.request(updateCartMutation, params);
    dispatch(setCartResponse(response.cartLinesAdd));
    if (callback) callback();
};
