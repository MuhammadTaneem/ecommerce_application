import { Voucher, CreateVoucherData } from '../../types/voucher';

// Sample data
const sampleVouchers: Voucher[] = [
  {
    id: 1,
    code: "WELCOME20",
    discount_type: "PERCENTAGE",
    discount_value: "20.00",
    valid_from: "2024-02-26T00:00:00+06:00",
    valid_to: "2024-03-26T00:00:00+06:00",
    usage_limit: 100,
    max_discount_amount: "500.00",
    times_used: 45
  },
  {
    id: 2,
    code: "Save10%",
    discount_type: "PERCENTAGE",
    discount_value: "10.00",
    valid_from: "2025-02-26T00:00:00+06:00",
    valid_to: "2025-03-26T00:00:00+06:00",
    usage_limit: 300,
    max_discount_amount: "1000.00",
    times_used: 0
  },
  {
    id: 3,
    code: "FLAT50",
    discount_type: "FIXED_AMOUNT",
    discount_value: "50.00",
    valid_from: "2024-02-26T00:00:00+06:00",
    valid_to: "2024-03-26T00:00:00+06:00",
    usage_limit: 200,
    max_discount_amount: "50.00",
    times_used: 78
  }
];

export const voucherApi = {
  async getAllVouchers(): Promise<Voucher[]> {
    return sampleVouchers;
  },

  async createVoucher(data: CreateVoucherData): Promise<Voucher> {
    const newVoucher: Voucher = {
      id: Math.max(...sampleVouchers.map(v => v.id || 0)) + 1,
      ...data,
      times_used: 0
    };
    
    sampleVouchers.push(newVoucher);
    return newVoucher;
  },

  async updateVoucher(id: number, data: Partial<CreateVoucherData>): Promise<Voucher> {
    const voucher = sampleVouchers.find(v => v.id === id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }

    Object.assign(voucher, data);
    return voucher;
  },

  async deleteVoucher(id: number): Promise<void> {
    const index = sampleVouchers.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Voucher not found');
    }
    sampleVouchers.splice(index, 1);
  }
}; 