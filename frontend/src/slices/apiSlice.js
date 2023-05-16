import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
	reducerPath: 'apiSlice',
	baseQuery,
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => '/users',
		}),
		createUser: builder.mutation({
			query: (user) => ({
				url: '/users',
				method: 'POST',
				body: user,
			}),
		}),
	}),
});
