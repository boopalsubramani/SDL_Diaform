// import { api } from "../../util/API";
// import { CONFIG } from "../../util/URL";

// export const AppSettingService = api.injectEndpoints({
//   endpoints: build => ({
//     RefAppSetting: build.mutation<any, any>({
//       query: credentials => ({
//         url: CONFIG,
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//   }),
//   overrideExisting: true,
// });

// export const { useRefAppSettingMutation } =
//   AppSettingService;



import { api } from "../../util/API";
import { CONFIG } from "../../util/URL";

export const AppSettingService = api.injectEndpoints({
  endpoints: build => ({
    RefAppSetting: build.mutation<any, any>({
      query: credentials => ({
        url: CONFIG,
        method: 'POST',
        body: credentials,
      }),
    }),
    changeLanguage: build.mutation<any, { language: string }>({
      query: ({ language }) => ({
        url: CONFIG,
        method: 'POST',
        body: { language },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useRefAppSettingMutation, useChangeLanguageMutation } = AppSettingService;
