export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Voucher {
  id?: number;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  max_discount_amount: string;
  times_used?: number;
}

export interface CreateVoucherData {
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  max_discount_amount: string;
} 