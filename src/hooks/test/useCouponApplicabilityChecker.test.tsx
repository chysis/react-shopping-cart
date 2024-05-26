import { renderHook, waitFor } from "@testing-library/react";
import { useCouponApplicabilityChecker } from "../useCouponApplicabilityChecker";
import { couponsState } from "../../store/atom/atoms";
import { mockCoupons } from "../../mocks/coupons";
import { RecoilRoot } from "recoil";
import { mockCartItems } from "../../mocks/cartItems";

jest.mock("../../store/api", () => ({
  fetchProducts: jest.fn().mockImplementation(async () => mockCartItems),
}));

jest.mock("../../store/api", () => ({
  fetchCoupons: jest.fn().mockImplementation(async () => mockCoupons),
}));

describe("useCouponApplicabilityChecker", () => {
  it("주문 금액이 최소 주문 금액 미만이면 쿠폰 적용 불가하다.", async () => {
    const { result } = renderHook(() => useCouponApplicabilityChecker(), {
      wrapper: ({ children }) => (
        <RecoilRoot initializeState={({ set }) => set(couponsState, mockCoupons)}>{children}</RecoilRoot>
      ),
    });

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    expect(result.current.isCouponApplicable(mockCoupons[0], 50000)).toBe(false);
  });

  it("주문 금액이 최소 주문 금액 이상이면 쿠폰 적용 가능하다.", () => {
    const { result } = renderHook(() => useCouponApplicabilityChecker(), {
      wrapper: ({ children }) => (
        <RecoilRoot initializeState={({ set }) => set(couponsState, mockCoupons)}>{children}</RecoilRoot>
      ),
    });
    expect(result.current.isCouponApplicable(mockCoupons[2], 60000)).toBe(true);
  });
});
