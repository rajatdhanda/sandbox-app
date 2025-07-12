"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api-node_lib_supabase__generated_clients_messages_ts";
exports.ids = ["_api-node_lib_supabase__generated_clients_messages_ts"];
exports.modules = {

/***/ "(api-node)/./lib/supabase/_generated/clients/messages.ts":
/*!*****************************************************!*\
  !*** ./lib/supabase/_generated/clients/messages.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   messagesClient: () => (/* binding */ messagesClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n// AUTO-GENERATED — DO NOT EDIT\n\nfunction getSupabaseClient() {\n    const url = process.env.SUPABASE_URL;\n    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;\n    if (!url || !key) {\n        throw new Error('supabaseKey is required.');\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, key);\n}\nconst messagesClient = ()=>getSupabaseClient().from('messages');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvbWVzc2FnZXMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQStCO0FBQ3NCO0FBR3JELFNBQVNDO0lBQ1AsTUFBTUMsTUFBTUMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZO0lBQ3BDLE1BQU1DLE1BQU1ILFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCO0lBQ2pELElBQUksQ0FBQ0wsT0FBTyxDQUFDSSxLQUFLO1FBQ2hCLE1BQU0sSUFBSUUsTUFBTTtJQUNsQjtJQUNBLE9BQU9SLG1FQUFZQSxDQUFXRSxLQUFLSTtBQUNyQztBQUVPLE1BQU1HLGlCQUFpQixJQUM1QlIsb0JBQW9CUyxJQUFJLENBQWtELFlBQVkiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yYWphdGRoYW5kYS9zYW5kYm94L3NhbmRib3gtYXBwL3NhbmRib3gtYXBwLTEvbGliL3N1cGFiYXNlL19nZW5lcmF0ZWQvY2xpZW50cy9tZXNzYWdlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBVVRPLUdFTkVSQVRFRCDigJQgRE8gTk9UIEVESVRcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlIH0gZnJvbSAnLi4vZGF0YWJhc2UudHlwZXMnO1xuXG5mdW5jdGlvbiBnZXRTdXBhYmFzZUNsaWVudCgpIHtcbiAgY29uc3QgdXJsID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfVVJMITtcbiAgY29uc3Qga2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSE7XG4gIGlmICghdXJsIHx8ICFrZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N1cGFiYXNlS2V5IGlzIHJlcXVpcmVkLicpO1xuICB9XG4gIHJldHVybiBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KHVybCwga2V5KTtcbn1cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VzQ2xpZW50ID0gKCkgPT5cbiAgZ2V0U3VwYWJhc2VDbGllbnQoKS5mcm9tPERhdGFiYXNlWydwdWJsaWMnXVsnVGFibGVzJ11bJ21lc3NhZ2VzJ11bJ1JvdyddPignbWVzc2FnZXMnKTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJnZXRTdXBhYmFzZUNsaWVudCIsInVybCIsInByb2Nlc3MiLCJlbnYiLCJTVVBBQkFTRV9VUkwiLCJrZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiRXJyb3IiLCJtZXNzYWdlc0NsaWVudCIsImZyb20iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/_generated/clients/messages.ts\n");

/***/ })

};
;