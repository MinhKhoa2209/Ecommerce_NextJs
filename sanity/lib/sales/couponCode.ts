export const COUPON_CODE = {
    BFRIDAY : "BFRIDAY",
    XMAS: "XMAS",
    NEWYEAR: "NEWYEAR",
} as const;
export type CouponCode = keyof typeof COUPON_CODE;