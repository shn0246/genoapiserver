import { GET_DATA_LIST, GET_DATA_TREND, GET_TAG_DEFINATION, HTTP_POST, TAG_REFRESH } from '../../constant/api';
import { baseApi } from '../baseApi';
import type { DataListResponse, TagDefinitionsResponse, TrendRequest, TrendResponse } from './type';

export const dataApi = baseApi.enhanceEndpoints({ addTagTypes: [TAG_REFRESH] }).injectEndpoints({
    endpoints: (builder) => ({
        getDataList: builder.query<DataListResponse, void>({
            query: () => GET_DATA_LIST,
            providesTags: [TAG_REFRESH]
        }),
        getTrend: builder.mutation<TrendResponse, TrendRequest>({
            query: (trendParams) => ({
                url: GET_DATA_TREND,
                method: HTTP_POST,
                body: trendParams,
            }),
        }),
        getTagDefinitions: builder.query<TagDefinitionsResponse, void>({
            query: () => GET_TAG_DEFINATION,
        }),
    }),
    overrideExisting: false,
});

export const { useGetDataListQuery, useGetTrendMutation, useGetTagDefinitionsQuery } = dataApi;