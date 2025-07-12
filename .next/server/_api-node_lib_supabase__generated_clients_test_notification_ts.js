"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api-node_lib_supabase__generated_clients_test_notification_ts";
exports.ids = ["_api-node_lib_supabase__generated_clients_test_notification_ts"];
exports.modules = {

/***/ "(api-node)/./lib/supabase/_generated/clients/test_notification.ts":
/*!**************************************************************!*\
  !*** ./lib/supabase/_generated/clients/test_notification.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   testNotificationsClient: () => (/* binding */ testNotificationsClient)\n/* harmony export */ });\n/* harmony import */ var _lib_supabase_clients__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/supabase/clients */ \"(api-node)/./lib/supabase/clients.ts\");\n// AUTO-GENERATED — DO NOT EDIT\n\nconst testNotificationsClient = ()=>_lib_supabase_clients__WEBPACK_IMPORTED_MODULE_0__.supabase.from('notifications');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvdGVzdF9ub3RpZmljYXRpb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBK0I7QUFDbUI7QUFHM0MsTUFBTUMsMEJBQTBCLElBQ3JDRCwyREFBUUEsQ0FBQ0UsSUFBSSxDQUF1RCxpQkFBaUIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yYWphdGRoYW5kYS9zYW5kYm94L3NhbmRib3gtYXBwL3NhbmRib3gtYXBwLTEvbGliL3N1cGFiYXNlL19nZW5lcmF0ZWQvY2xpZW50cy90ZXN0X25vdGlmaWNhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBVVRPLUdFTkVSQVRFRCDigJQgRE8gTk9UIEVESVRcbmltcG9ydCB7IHN1cGFiYXNlIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvY2xpZW50cyc7XG5pbXBvcnQgeyBEYXRhYmFzZSB9IGZyb20gJ0AvbGliL3N1cGFiYXNlL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHRlc3ROb3RpZmljYXRpb25zQ2xpZW50ID0gKCkgPT5cbiAgc3VwYWJhc2UuZnJvbTxEYXRhYmFzZVsncHVibGljJ11bJ1RhYmxlcyddWydub3RpZmljYXRpb25zJ11bJ1JvdyddPignbm90aWZpY2F0aW9ucycpOyJdLCJuYW1lcyI6WyJzdXBhYmFzZSIsInRlc3ROb3RpZmljYXRpb25zQ2xpZW50IiwiZnJvbSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/_generated/clients/test_notification.ts\n");

/***/ }),

/***/ "(api-node)/./lib/supabase/clients.ts":
/*!*********************************!*\
  !*** ./lib/supabase/clients.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var expo_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! expo-constants */ \"expo-constants\");\n/* harmony import */ var expo_constants__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(expo_constants__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_native_url_polyfill_auto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-native-url-polyfill/auto */ \"react-native-url-polyfill/auto\");\n/* harmony import */ var react_native_url_polyfill_auto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_native_url_polyfill_auto__WEBPACK_IMPORTED_MODULE_2__);\n// lib/supabase/client.ts\n\n\n\nconst supabaseUrl = (expo_constants__WEBPACK_IMPORTED_MODULE_1___default().expoConfig)?.extra?.supabaseUrl;\nconst supabaseAnonKey = (expo_constants__WEBPACK_IMPORTED_MODULE_1___default().expoConfig)?.extra?.supabaseAnonKey;\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error('Missing Supabase configuration in app.json');\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9jbGllbnRzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5QkFBeUI7QUFDNEI7QUFDZDtBQUNDO0FBRXhDLE1BQU1FLGNBQWNELGtFQUFvQixFQUFFRyxPQUFPRjtBQUNqRCxNQUFNRyxrQkFBa0JKLGtFQUFvQixFQUFFRyxPQUFPQztBQUVyRCxJQUFJLENBQUNILGVBQWUsQ0FBQ0csaUJBQWlCO0lBQ3BDLE1BQU0sSUFBSUMsTUFBTTtBQUNsQjtBQUVPLE1BQU1DLFdBQVdQLG1FQUFZQSxDQUFDRSxhQUFhRyxpQkFBaUIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yYWphdGRoYW5kYS9zYW5kYm94L3NhbmRib3gtYXBwL3NhbmRib3gtYXBwLTEvbGliL3N1cGFiYXNlL2NsaWVudHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3N1cGFiYXNlL2NsaWVudC50c1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCBDb25zdGFudHMgZnJvbSAnZXhwby1jb25zdGFudHMnO1xuaW1wb3J0ICdyZWFjdC1uYXRpdmUtdXJsLXBvbHlmaWxsL2F1dG8nO1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IENvbnN0YW50cy5leHBvQ29uZmlnPy5leHRyYT8uc3VwYWJhc2VVcmw7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBDb25zdGFudHMuZXhwb0NvbmZpZz8uZXh0cmE/LnN1cGFiYXNlQW5vbktleTtcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBTdXBhYmFzZSBjb25maWd1cmF0aW9uIGluIGFwcC5qc29uJyk7XG59XG5cbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTsiXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiQ29uc3RhbnRzIiwic3VwYWJhc2VVcmwiLCJleHBvQ29uZmlnIiwiZXh0cmEiLCJzdXBhYmFzZUFub25LZXkiLCJFcnJvciIsInN1cGFiYXNlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/clients.ts\n");

/***/ })

};
;