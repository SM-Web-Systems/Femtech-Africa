import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Partner, PartnerProduct, Voucher, RedeemResponse } from '../types';

export const usePartners = () => {
  return useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const res = await apiClient.get('/redemptions/partners');
      return res.data;
    },
  });
};

export const usePartnerProducts = (partnerId: string | null) => {
  return useQuery<PartnerProduct[]>({
    queryKey: ['partnerProducts', partnerId],
    queryFn: async () => {
      const res = await apiClient.get(`/redemptions/partners/${partnerId}/products`);
      return res.data;
    },
    enabled: !!partnerId,
  });
};

export const useRedeem = () => {
  const queryClient = useQueryClient();
  return useMutation<RedeemResponse, Error, { partnerId: string; productId?: string; tokenAmount: number }>({
    mutationFn: async (data) => {
      const res = await apiClient.post('/redemptions/redeem', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
};

export const useVouchers = (status?: string) => {
  return useQuery<Voucher[]>({
    queryKey: ['vouchers', status],
    queryFn: async () => {
      const url = status ? `/redemptions/my/vouchers?status=${status}` : '/redemptions/my/vouchers';
      const res = await apiClient.get(url);
      return res.data;
    },
  });
};

export const useVoucherDetail = (id: string | null) => {
  return useQuery<Voucher>({
    queryKey: ['voucher', id],
    queryFn: async () => {
      const res = await apiClient.get(`/redemptions/my/vouchers/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
