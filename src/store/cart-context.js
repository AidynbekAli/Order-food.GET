import { createContext, useEffect, useReducer } from "react";
import { fetchRequest } from "../lib/fetchAPI";

export const cartContext = createContext({
  items: [],
  totalAmount: 0,
  amount: 0,
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: (state.items = action.payload),
      };

    case "GET_ITEM":
      return {
        ...state,
        items: (state.items = action.payload),
      };
    case "ADD_QUANTITY":
      return {
        ...state,
        items: (state.items = action.payload),
      };

    case "MINUS_QUANTITY":
      return {
        ...state,
        items: (state.items = action.payload),
      };

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    amount: 1,
  });

  const addItem = async (id, amount) => {
    try {
      const response = await fetchRequest(`/foods/${id}/addToBasket`, {
        method: "POST",
        body: { amount: amount },
      });

      dispatch({ type: "ADD_ITEM", payload: response.items });
    } catch (error) {
      console.log(error);
    }
  };

  async function getBasket() {
    try {
      const response = await fetchRequest("/basket");
      dispatch({ type: "GET_ITEM", payload: response.items });
    } catch (error) {
      new Error(error);
    }
  }

  const addQuantity = async (id, amount) => {
    const responce = await fetchRequest(`/basketItem/${id}/update`, {
      method: "PUT",
      body: { amount: amount + 1 },
    });
    dispatch({ type: "ADD_QUANTITY", payload: responce.items });
    getBasket();
  };

  const minusQuantity = async (id, amount) => {
    if (amount !== 0) {
      const responce = await fetchRequest(`/basketItem/${id}/update`, {
        method: "PUT",
        body: { amount: amount - 1 },
      });

      dispatch({ type: "MINUS_QUANTITY", payload: responce.items });
      getBasket();
    } else {
      const responce = await fetchRequest(`/basketItem/${id}/delete`, {
        method: "DELETE",
      });

      dispatch({ type: "MINUS_QUANTITY", payload: responce.items });
    }
  };

  const totalPrice = cartState.items?.reduce(
    (prev, current) => prev + current.amount * current.price,
    0
  );

  const orderAmount = cartState.items?.reduce(
    (prev, current) => prev + current.amount,
    0
  );

  useEffect(() => {
    getBasket();
  }, []);

  const cartValue = {
    items: cartState.items,
    addItem,
    totalAmount: orderAmount,
    amount: cartState.amount,
    totalPrice: totalPrice,
    addQuantity,
    minusQuantity,
  };

  return (
    <cartContext.Provider value={cartValue}>{children}</cartContext.Provider>
  );
};

export default CartProvider;
