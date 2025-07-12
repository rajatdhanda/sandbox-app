"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api-node_lib_supabase__generated_clients_parent_child_relationships_ts";
exports.ids = ["_api-node_lib_supabase__generated_clients_parent_child_relationships_ts"];
exports.modules = {

/***/ "(api-node)/./lib/supabase/_generated/clients/parent_child_relationships.ts":
/*!***********************************************************************!*\
  !*** ./lib/supabase/_generated/clients/parent_child_relationships.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parent_child_relationshipsClient: () => (/* binding */ parent_child_relationshipsClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n// AUTO-GENERATED — DO NOT EDIT\n\nfunction getSupabaseClient() {\n    const url = process.env.SUPABASE_URL;\n    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;\n    if (!url || !key) {\n        throw new Error('supabaseKey is required.');\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, key);\n}\nconst parent_child_relationshipsClient = ()=>getSupabaseClient().from('parent_child_relationships');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zdXBhYmFzZS9fZ2VuZXJhdGVkL2NsaWVudHMvcGFyZW50X2NoaWxkX3JlbGF0aW9uc2hpcHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQStCO0FBQ3NCO0FBR3JELFNBQVNDO0lBQ1AsTUFBTUMsTUFBTUMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZO0lBQ3BDLE1BQU1DLE1BQU1ILFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCO0lBQ2pELElBQUksQ0FBQ0wsT0FBTyxDQUFDSSxLQUFLO1FBQ2hCLE1BQU0sSUFBSUUsTUFBTTtJQUNsQjtJQUNBLE9BQU9SLG1FQUFZQSxDQUFXRSxLQUFLSTtBQUNyQztBQUVPLE1BQU1HLG1DQUFtQyxJQUM5Q1Isb0JBQW9CUyxJQUFJLENBQW9FLDhCQUE4QiIsInNvdXJjZXMiOlsiL1VzZXJzL3JhamF0ZGhhbmRhL3NhbmRib3gvc2FuZGJveC1hcHAvc2FuZGJveC1hcHAtMS9saWIvc3VwYWJhc2UvX2dlbmVyYXRlZC9jbGllbnRzL3BhcmVudF9jaGlsZF9yZWxhdGlvbnNoaXBzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEFVVE8tR0VORVJBVEVEIOKAlCBETyBOT1QgRURJVFxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB0eXBlIHsgRGF0YWJhc2UgfSBmcm9tICcuLi9kYXRhYmFzZS50eXBlcyc7XG5cbmZ1bmN0aW9uIGdldFN1cGFiYXNlQ2xpZW50KCkge1xuICBjb25zdCB1cmwgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9VUkwhO1xuICBjb25zdCBrZXkgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZITtcbiAgaWYgKCF1cmwgfHwgIWtleSkge1xuICAgIHRocm93IG5ldyBFcnJvcignc3VwYWJhc2VLZXkgaXMgcmVxdWlyZWQuJyk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNsaWVudDxEYXRhYmFzZT4odXJsLCBrZXkpO1xufVxuXG5leHBvcnQgY29uc3QgcGFyZW50X2NoaWxkX3JlbGF0aW9uc2hpcHNDbGllbnQgPSAoKSA9PlxuICBnZXRTdXBhYmFzZUNsaWVudCgpLmZyb208RGF0YWJhc2VbJ3B1YmxpYyddWydUYWJsZXMnXVsncGFyZW50X2NoaWxkX3JlbGF0aW9uc2hpcHMnXVsnUm93J10+KCdwYXJlbnRfY2hpbGRfcmVsYXRpb25zaGlwcycpO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsImdldFN1cGFiYXNlQ2xpZW50IiwidXJsIiwicHJvY2VzcyIsImVudiIsIlNVUEFCQVNFX1VSTCIsImtleSIsIlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkiLCJFcnJvciIsInBhcmVudF9jaGlsZF9yZWxhdGlvbnNoaXBzQ2xpZW50IiwiZnJvbSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./lib/supabase/_generated/clients/parent_child_relationships.ts\n");

/***/ })

};
;