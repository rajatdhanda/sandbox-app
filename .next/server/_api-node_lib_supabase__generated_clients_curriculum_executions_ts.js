"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api-node_lib_supabase__generated_clients_curriculum_executions_ts";
exports.ids = ["_api-node_lib_supabase__generated_clients_curriculum_executions_ts"];
exports.modules = {

/***/ "(api-node)/./lib/supabase/_generated/clients/curriculum_executions.ts":
/*!******************************************************************!*\
  !*** ./lib/supabase/_generated/clients/curriculum_executions.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   curriculum_executionsClient: () => (/* binding */ curriculum_executionsClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n// AUTO-GENERATED — DO NOT EDIT\n\nfunction getSupabaseClient() {\n    const url = process.env.SUPABASE_URL;\n    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;\n    if (!url || !key) {\n        throw new Error('supabaseKey is required.');\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, key);\n}\nconst curriculum_executionsClient = ()=>getSupabaseClient().from('curriculum_executions');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvY3VycmljdWx1bV9leGVjdXRpb25zLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUErQjtBQUNzQjtBQUdyRCxTQUFTQztJQUNQLE1BQU1DLE1BQU1DLFFBQVFDLEdBQUcsQ0FBQ0MsWUFBWTtJQUNwQyxNQUFNQyxNQUFNSCxRQUFRQyxHQUFHLENBQUNHLHlCQUF5QjtJQUNqRCxJQUFJLENBQUNMLE9BQU8sQ0FBQ0ksS0FBSztRQUNoQixNQUFNLElBQUlFLE1BQU07SUFDbEI7SUFDQSxPQUFPUixtRUFBWUEsQ0FBV0UsS0FBS0k7QUFDckM7QUFFTyxNQUFNRyw4QkFBOEIsSUFDekNSLG9CQUFvQlMsSUFBSSxDQUErRCx5QkFBeUIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yYWphdGRoYW5kYS9zYW5kYm94L3NhbmRib3gtYXBwL3NhbmRib3gtYXBwLTEvbGliL3N1cGFiYXNlL19nZW5lcmF0ZWQvY2xpZW50cy9jdXJyaWN1bHVtX2V4ZWN1dGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQVVUTy1HRU5FUkFURUQg4oCUIERPIE5PVCBFRElUXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuaW1wb3J0IHR5cGUgeyBEYXRhYmFzZSB9IGZyb20gJy4uL2RhdGFiYXNlLnR5cGVzJztcblxuZnVuY3Rpb24gZ2V0U3VwYWJhc2VDbGllbnQoKSB7XG4gIGNvbnN0IHVybCA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1VSTCE7XG4gIGNvbnN0IGtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhO1xuICBpZiAoIXVybCB8fCAha2V5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdXBhYmFzZUtleSBpcyByZXF1aXJlZC4nKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2xpZW50PERhdGFiYXNlPih1cmwsIGtleSk7XG59XG5cbmV4cG9ydCBjb25zdCBjdXJyaWN1bHVtX2V4ZWN1dGlvbnNDbGllbnQgPSAoKSA9PlxuICBnZXRTdXBhYmFzZUNsaWVudCgpLmZyb208RGF0YWJhc2VbJ3B1YmxpYyddWydUYWJsZXMnXVsnY3VycmljdWx1bV9leGVjdXRpb25zJ11bJ1JvdyddPignY3VycmljdWx1bV9leGVjdXRpb25zJyk7XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiZ2V0U3VwYWJhc2VDbGllbnQiLCJ1cmwiLCJwcm9jZXNzIiwiZW52IiwiU1VQQUJBU0VfVVJMIiwia2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIkVycm9yIiwiY3VycmljdWx1bV9leGVjdXRpb25zQ2xpZW50IiwiZnJvbSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/_generated/clients/curriculum_executions.ts\n");

/***/ })

};
;