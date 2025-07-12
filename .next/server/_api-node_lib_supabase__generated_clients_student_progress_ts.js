"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api-node_lib_supabase__generated_clients_student_progress_ts";
exports.ids = ["_api-node_lib_supabase__generated_clients_student_progress_ts"];
exports.modules = {

/***/ "(api-node)/./lib/supabase/_generated/clients/student_progress.ts":
/*!*************************************************************!*\
  !*** ./lib/supabase/_generated/clients/student_progress.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   student_progressClient: () => (/* binding */ student_progressClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n// AUTO-GENERATED — DO NOT EDIT\n\nfunction getSupabaseClient() {\n    const url = process.env.SUPABASE_URL;\n    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;\n    if (!url || !key) {\n        throw new Error('supabaseKey is required.');\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, key);\n}\nconst student_progressClient = ()=>getSupabaseClient().from('student_progress');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvc3R1ZGVudF9wcm9ncmVzcy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBK0I7QUFDc0I7QUFHckQsU0FBU0M7SUFDUCxNQUFNQyxNQUFNQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7SUFDcEMsTUFBTUMsTUFBTUgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7SUFDakQsSUFBSSxDQUFDTCxPQUFPLENBQUNJLEtBQUs7UUFDaEIsTUFBTSxJQUFJRSxNQUFNO0lBQ2xCO0lBQ0EsT0FBT1IsbUVBQVlBLENBQVdFLEtBQUtJO0FBQ3JDO0FBRU8sTUFBTUcseUJBQXlCLElBQ3BDUixvQkFBb0JTLElBQUksQ0FBMEQsb0JBQW9CIiwic291cmNlcyI6WyIvVXNlcnMvcmFqYXRkaGFuZGEvc2FuZGJveC9zYW5kYm94LWFwcC9zYW5kYm94LWFwcC0xL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvc3R1ZGVudF9wcm9ncmVzcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBVVRPLUdFTkVSQVRFRCDigJQgRE8gTk9UIEVESVRcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlIH0gZnJvbSAnLi4vZGF0YWJhc2UudHlwZXMnO1xuXG5mdW5jdGlvbiBnZXRTdXBhYmFzZUNsaWVudCgpIHtcbiAgY29uc3QgdXJsID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfVVJMITtcbiAgY29uc3Qga2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSE7XG4gIGlmICghdXJsIHx8ICFrZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N1cGFiYXNlS2V5IGlzIHJlcXVpcmVkLicpO1xuICB9XG4gIHJldHVybiBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KHVybCwga2V5KTtcbn1cblxuZXhwb3J0IGNvbnN0IHN0dWRlbnRfcHJvZ3Jlc3NDbGllbnQgPSAoKSA9PlxuICBnZXRTdXBhYmFzZUNsaWVudCgpLmZyb208RGF0YWJhc2VbJ3B1YmxpYyddWydUYWJsZXMnXVsnc3R1ZGVudF9wcm9ncmVzcyddWydSb3cnXT4oJ3N0dWRlbnRfcHJvZ3Jlc3MnKTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJnZXRTdXBhYmFzZUNsaWVudCIsInVybCIsInByb2Nlc3MiLCJlbnYiLCJTVVBBQkFTRV9VUkwiLCJrZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiRXJyb3IiLCJzdHVkZW50X3Byb2dyZXNzQ2xpZW50IiwiZnJvbSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/_generated/clients/student_progress.ts\n");

/***/ })

};
;