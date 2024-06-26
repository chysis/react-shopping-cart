/** @jsxImportSource @emotion/react */

import {
  CartItemContainerStyle,
  CartItemDetailControlsStyle,
  CartItemImageStyle,
  CartItemInfoStyle,
  CartItemNameStyle,
  CartItemPriceStyle,
  CartItemQuantityContainerStyle,
  CartItemQuantityStyle,
} from "./CartItem.style";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCallback } from "react";
import {
  cartState,
  CartItemCheckedState,
  CartItemIdListState,
  itemQuantityState,
} from "../../../../../store/atom/atoms";
import { changeProductAmount, deleteProduct } from "../../../../../store/api";
import Divider from "../../../../Divider/Divider";
import Checkbox from "../../../../Button/Checkbox/Checkbox";
import DeleteButton from "../../../../Button/DeleteButton/DeleteButton";
import QuantityButton from "../../../../Button/QuantityButton/QuantityButton";
import { deleteCartItemCheckedStateInStorage } from "../../../../../store/utils";

interface CartItemProps {
  CartItemInfo: CartItemInfo;
}

const CartItem = ({ CartItemInfo }: CartItemProps) => {
  const { id } = CartItemInfo;
  const [quantity, setQuantity] = useRecoilState(itemQuantityState);
  const [isCheck, setIsCheck] = useRecoilState(CartItemCheckedState(id));
  const setItemIdList = useSetRecoilState(CartItemIdListState);
  const setCartState = useSetRecoilState(cartState);

  const handleCheckBoxClick = () => {
    setIsCheck(!isCheck);
  };

  const deleteCartItemIdFromState = useCallback(() => {
    setItemIdList((prev) => {
      const index = prev.findIndex((value) => value === id);
      const arr = [...prev];
      return [...arr.slice(0, index), ...arr.slice(index + 1)];
    });
  }, [id, setItemIdList]);

  const executeDeleteProduct = () => {
    deleteCartItemIdFromState();
    deleteProduct(id);
    deleteCartItemCheckedStateInStorage(id);
    setCartState((prev) => {
      const temp = JSON.parse(JSON.stringify(prev));
      return temp.filter((item: CartItemInfo) => item.id !== id);
    });
  };

  const handleDeleteButtonClick = () => {
    executeDeleteProduct();
  };

  const handleMinusButtonClick = () => {
    if (quantity[id] === 1) {
      if (confirm("정말 삭제하시겠습니까?")) {
        executeDeleteProduct();
      } else {
        return;
      }
      return;
    }

    changeProductAmount({ quantity: quantity[id] - 1, id });
    setQuantity((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const handlePlusButtonClick = () => {
    changeProductAmount({ quantity: quantity[id] + 1, id });
    setQuantity((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <div css={CartItemContainerStyle}>
      <Divider />
      <div css={CartItemDetailControlsStyle}>
        <Checkbox isCheck={isCheck} onClick={handleCheckBoxClick} />
        <DeleteButton onClick={handleDeleteButtonClick} />
      </div>
      <div css={CartItemInfoStyle}>
        <div>
          <img src={CartItemInfo.product.imageUrl} css={CartItemImageStyle} />
        </div>
        <div>
          <div css={CartItemNameStyle}>{CartItemInfo.product.name}</div>
          <div css={CartItemPriceStyle}>{CartItemInfo.product.price.toLocaleString() + "원"}</div>
          <div css={CartItemQuantityContainerStyle}>
            <QuantityButton onClick={handleMinusButtonClick} type={quantity[id] === 1 ? "canDelete" : "minus"} />
            <div css={CartItemQuantityStyle}>{quantity[id]}</div>
            <QuantityButton onClick={handlePlusButtonClick} type={"plus"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
