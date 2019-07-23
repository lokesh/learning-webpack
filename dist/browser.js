/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/color-thief.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/quantize/dist/index.mjs":
/*!**********************************************!*\
  !*** ./node_modules/quantize/dist/index.mjs ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/*\n * quantize.js Copyright 2008 Nick Rabinowitz\n * Ported to node.js by Olivier Lesnicki\n * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php\n */\n// fill out a couple protovis dependencies\n\n/*\n * Block below copied from Protovis: http://mbostock.github.com/protovis/\n * Copyright 2010 Stanford Visualization Group\n * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php\n */\nif (!pv) {\n  var pv = {\n    map: function (array, f) {\n      var o = {};\n      return f ? array.map(function (d, i) {\n        o.index = i;\n        return f.call(o, d);\n      }) : array.slice();\n    },\n    naturalOrder: function (a, b) {\n      return a < b ? -1 : a > b ? 1 : 0;\n    },\n    sum: function (array, f) {\n      var o = {};\n      return array.reduce(f ? function (p, d, i) {\n        o.index = i;\n        return p + f.call(o, d);\n      } : function (p, d) {\n        return p + d;\n      }, 0);\n    },\n    max: function (array, f) {\n      return Math.max.apply(null, f ? pv.map(array, f) : array);\n    }\n  };\n}\n/**\n * Basic Javascript port of the MMCQ (modified median cut quantization)\n * algorithm from the Leptonica library (http://www.leptonica.com/).\n * Returns a color map you can use to map original pixels to the reduced\n * palette. Still a work in progress.\n * \n * @author Nick Rabinowitz\n * @example\n \n// array of pixels as [R,G,B] arrays\nvar myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]\n                // etc\n                ];\nvar maxColors = 4;\n \nvar cmap = MMCQ.quantize(myPixels, maxColors);\nvar newPalette = cmap.palette();\nvar newPixels = myPixels.map(function(p) { \n    return cmap.map(p); \n});\n \n */\n\n\nvar MMCQ = function () {\n  // private constants\n  var sigbits = 5,\n      rshift = 8 - sigbits,\n      maxIterations = 1000,\n      fractByPopulations = 0.75; // get reduced-space color index for a pixel\n\n  function getColorIndex(r, g, b) {\n    return (r << 2 * sigbits) + (g << sigbits) + b;\n  } // Simple priority queue\n\n\n  function PQueue(comparator) {\n    var contents = [],\n        sorted = false;\n\n    function sort() {\n      contents.sort(comparator);\n      sorted = true;\n    }\n\n    return {\n      push: function (o) {\n        contents.push(o);\n        sorted = false;\n      },\n      peek: function (index) {\n        if (!sorted) { sort(); }\n        if (index === undefined) { index = contents.length - 1; }\n        return contents[index];\n      },\n      pop: function () {\n        if (!sorted) { sort(); }\n        return contents.pop();\n      },\n      size: function () {\n        return contents.length;\n      },\n      map: function (f) {\n        return contents.map(f);\n      },\n      debug: function () {\n        if (!sorted) { sort(); }\n        return contents;\n      }\n    };\n  } // 3d color space box\n\n\n  function VBox(r1, r2, g1, g2, b1, b2, histo) {\n    var vbox = this;\n    vbox.r1 = r1;\n    vbox.r2 = r2;\n    vbox.g1 = g1;\n    vbox.g2 = g2;\n    vbox.b1 = b1;\n    vbox.b2 = b2;\n    vbox.histo = histo;\n  }\n\n  VBox.prototype = {\n    volume: function (force) {\n      var vbox = this;\n\n      if (!vbox._volume || force) {\n        vbox._volume = (vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1);\n      }\n\n      return vbox._volume;\n    },\n    count: function (force) {\n      var vbox = this,\n          histo = vbox.histo;\n\n      if (!vbox._count_set || force) {\n        var npix = 0,\n            i,\n            j,\n            k,\n            index;\n\n        for (i = vbox.r1; i <= vbox.r2; i++) {\n          for (j = vbox.g1; j <= vbox.g2; j++) {\n            for (k = vbox.b1; k <= vbox.b2; k++) {\n              index = getColorIndex(i, j, k);\n              npix += histo[index] || 0;\n            }\n          }\n        }\n\n        vbox._count = npix;\n        vbox._count_set = true;\n      }\n\n      return vbox._count;\n    },\n    copy: function () {\n      var vbox = this;\n      return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);\n    },\n    avg: function (force) {\n      var vbox = this,\n          histo = vbox.histo;\n\n      if (!vbox._avg || force) {\n        var ntot = 0,\n            mult = 1 << 8 - sigbits,\n            rsum = 0,\n            gsum = 0,\n            bsum = 0,\n            hval,\n            i,\n            j,\n            k,\n            histoindex;\n\n        for (i = vbox.r1; i <= vbox.r2; i++) {\n          for (j = vbox.g1; j <= vbox.g2; j++) {\n            for (k = vbox.b1; k <= vbox.b2; k++) {\n              histoindex = getColorIndex(i, j, k);\n              hval = histo[histoindex] || 0;\n              ntot += hval;\n              rsum += hval * (i + 0.5) * mult;\n              gsum += hval * (j + 0.5) * mult;\n              bsum += hval * (k + 0.5) * mult;\n            }\n          }\n        }\n\n        if (ntot) {\n          vbox._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];\n        } else {\n          //console.log('empty box');\n          vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)];\n        }\n      }\n\n      return vbox._avg;\n    },\n    contains: function (pixel) {\n      var vbox = this,\n          rval = pixel[0] >> rshift;\n      gval = pixel[1] >> rshift;\n      bval = pixel[2] >> rshift;\n      return rval >= vbox.r1 && rval <= vbox.r2 && gval >= vbox.g1 && gval <= vbox.g2 && bval >= vbox.b1 && bval <= vbox.b2;\n    }\n  }; // Color map\n\n  function CMap() {\n    this.vboxes = new PQueue(function (a, b) {\n      return pv.naturalOrder(a.vbox.count() * a.vbox.volume(), b.vbox.count() * b.vbox.volume());\n    });\n  }\n\n  CMap.prototype = {\n    push: function (vbox) {\n      this.vboxes.push({\n        vbox: vbox,\n        color: vbox.avg()\n      });\n    },\n    palette: function () {\n      return this.vboxes.map(function (vb) {\n        return vb.color;\n      });\n    },\n    size: function () {\n      return this.vboxes.size();\n    },\n    map: function (color) {\n      var vboxes = this.vboxes;\n\n      for (var i = 0; i < vboxes.size(); i++) {\n        if (vboxes.peek(i).vbox.contains(color)) {\n          return vboxes.peek(i).color;\n        }\n      }\n\n      return this.nearest(color);\n    },\n    nearest: function (color) {\n      var vboxes = this.vboxes,\n          d1,\n          d2,\n          pColor;\n\n      for (var i = 0; i < vboxes.size(); i++) {\n        d2 = Math.sqrt(Math.pow(color[0] - vboxes.peek(i).color[0], 2) + Math.pow(color[1] - vboxes.peek(i).color[1], 2) + Math.pow(color[2] - vboxes.peek(i).color[2], 2));\n\n        if (d2 < d1 || d1 === undefined) {\n          d1 = d2;\n          pColor = vboxes.peek(i).color;\n        }\n      }\n\n      return pColor;\n    },\n    forcebw: function () {\n      // XXX: won't  work yet\n      var vboxes = this.vboxes;\n      vboxes.sort(function (a, b) {\n        return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));\n      }); // force darkest color to black if everything < 5\n\n      var lowest = vboxes[0].color;\n      if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5) { vboxes[0].color = [0, 0, 0]; } // force lightest color to white if everything > 251\n\n      var idx = vboxes.length - 1,\n          highest = vboxes[idx].color;\n      if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251) { vboxes[idx].color = [255, 255, 255]; }\n    }\n  }; // histo (1-d array, giving the number of pixels in\n  // each quantized region of color space), or null on error\n\n  function getHisto(pixels) {\n    var histosize = 1 << 3 * sigbits,\n        histo = new Array(histosize),\n        index,\n        rval,\n        gval,\n        bval;\n    pixels.forEach(function (pixel) {\n      rval = pixel[0] >> rshift;\n      gval = pixel[1] >> rshift;\n      bval = pixel[2] >> rshift;\n      index = getColorIndex(rval, gval, bval);\n      histo[index] = (histo[index] || 0) + 1;\n    });\n    return histo;\n  }\n\n  function vboxFromPixels(pixels, histo) {\n    var rmin = 1000000,\n        rmax = 0,\n        gmin = 1000000,\n        gmax = 0,\n        bmin = 1000000,\n        bmax = 0,\n        rval,\n        gval,\n        bval; // find min/max\n\n    pixels.forEach(function (pixel) {\n      rval = pixel[0] >> rshift;\n      gval = pixel[1] >> rshift;\n      bval = pixel[2] >> rshift;\n      if (rval < rmin) { rmin = rval; }else if (rval > rmax) { rmax = rval; }\n      if (gval < gmin) { gmin = gval; }else if (gval > gmax) { gmax = gval; }\n      if (bval < bmin) { bmin = bval; }else if (bval > bmax) { bmax = bval; }\n    });\n    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);\n  }\n\n  function medianCutApply(histo, vbox) {\n    if (!vbox.count()) { return; }\n    var rw = vbox.r2 - vbox.r1 + 1,\n        gw = vbox.g2 - vbox.g1 + 1,\n        bw = vbox.b2 - vbox.b1 + 1,\n        maxw = pv.max([rw, gw, bw]); // only one pixel, no split\n\n    if (vbox.count() == 1) {\n      return [vbox.copy()];\n    }\n    /* Find the partial sum arrays along the selected axis. */\n\n\n    var total = 0,\n        partialsum = [],\n        lookaheadsum = [],\n        i,\n        j,\n        k,\n        sum,\n        index;\n\n    if (maxw == rw) {\n      for (i = vbox.r1; i <= vbox.r2; i++) {\n        sum = 0;\n\n        for (j = vbox.g1; j <= vbox.g2; j++) {\n          for (k = vbox.b1; k <= vbox.b2; k++) {\n            index = getColorIndex(i, j, k);\n            sum += histo[index] || 0;\n          }\n        }\n\n        total += sum;\n        partialsum[i] = total;\n      }\n    } else if (maxw == gw) {\n      for (i = vbox.g1; i <= vbox.g2; i++) {\n        sum = 0;\n\n        for (j = vbox.r1; j <= vbox.r2; j++) {\n          for (k = vbox.b1; k <= vbox.b2; k++) {\n            index = getColorIndex(j, i, k);\n            sum += histo[index] || 0;\n          }\n        }\n\n        total += sum;\n        partialsum[i] = total;\n      }\n    } else {\n      /* maxw == bw */\n      for (i = vbox.b1; i <= vbox.b2; i++) {\n        sum = 0;\n\n        for (j = vbox.r1; j <= vbox.r2; j++) {\n          for (k = vbox.g1; k <= vbox.g2; k++) {\n            index = getColorIndex(j, k, i);\n            sum += histo[index] || 0;\n          }\n        }\n\n        total += sum;\n        partialsum[i] = total;\n      }\n    }\n\n    partialsum.forEach(function (d, i) {\n      lookaheadsum[i] = total - d;\n    });\n\n    function doCut(color) {\n      var dim1 = color + '1',\n          dim2 = color + '2',\n          left,\n          right,\n          vbox1,\n          vbox2,\n          d2,\n          count2 = 0;\n\n      for (i = vbox[dim1]; i <= vbox[dim2]; i++) {\n        if (partialsum[i] > total / 2) {\n          vbox1 = vbox.copy();\n          vbox2 = vbox.copy();\n          left = i - vbox[dim1];\n          right = vbox[dim2] - i;\n          if (left <= right) { d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2)); }else { d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2)); } // avoid 0-count boxes\n\n          while (!partialsum[d2]) { d2++; }\n\n          count2 = lookaheadsum[d2];\n\n          while (!count2 && partialsum[d2 - 1]) { count2 = lookaheadsum[--d2]; } // set dimensions\n\n\n          vbox1[dim2] = d2;\n          vbox2[dim1] = vbox1[dim2] + 1; // console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());\n\n          return [vbox1, vbox2];\n        }\n      }\n    } // determine the cut planes\n\n\n    return maxw == rw ? doCut('r') : maxw == gw ? doCut('g') : doCut('b');\n  }\n\n  function quantize(pixels, maxcolors) {\n    // short-circuit\n    if (!pixels.length || maxcolors < 2 || maxcolors > 256) {\n      // console.log('wrong number of maxcolors');\n      return false;\n    } // XXX: check color content and convert to grayscale if insufficient\n\n\n    var histo = getHisto(pixels);\n // check that we aren't below maxcolors already\n    histo.forEach(function () {\n    });\n    // get the beginning vbox from the colors\n\n\n    var vbox = vboxFromPixels(pixels, histo),\n        pq = new PQueue(function (a, b) {\n      return pv.naturalOrder(a.count(), b.count());\n    });\n    pq.push(vbox); // inner function to do the iteration\n\n    function iter(lh, target) {\n      var ncolors = lh.size(),\n          niters = 0,\n          vbox;\n\n      while (niters < maxIterations) {\n        if (ncolors >= target) { return; }\n\n        if (niters++ > maxIterations) {\n          // console.log(\"infinite loop; perhaps too few pixels!\");\n          return;\n        }\n\n        vbox = lh.pop();\n\n        if (!vbox.count()) {\n          /* just put it back */\n          lh.push(vbox);\n          niters++;\n          continue;\n        } // do the cut\n\n\n        var vboxes = medianCutApply(histo, vbox),\n            vbox1 = vboxes[0],\n            vbox2 = vboxes[1];\n\n        if (!vbox1) {\n          // console.log(\"vbox1 not defined; shouldn't happen!\");\n          return;\n        }\n\n        lh.push(vbox1);\n\n        if (vbox2) {\n          /* vbox2 can be null */\n          lh.push(vbox2);\n          ncolors++;\n        }\n      }\n    } // first set of colors, sorted by population\n\n\n    iter(pq, fractByPopulations * maxcolors); // console.log(pq.size(), pq.debug().length, pq.debug().slice());\n    // Re-sort by the product of pixel occupancy times the size in color space.\n\n    var pq2 = new PQueue(function (a, b) {\n      return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume());\n    });\n\n    while (pq.size()) {\n      pq2.push(pq.pop());\n    } // next set - generate the median cuts using the (npix * vol) sorting.\n\n\n    iter(pq2, maxcolors); // calculate the actual colors\n\n    var cmap = new CMap();\n\n    while (pq2.size()) {\n      cmap.push(pq2.pop());\n    }\n\n    return cmap;\n  }\n\n  return {\n    quantize: quantize\n  };\n}();\n\nvar quantize = MMCQ.quantize;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (quantize);\n\n\n//# sourceURL=webpack:///./node_modules/quantize/dist/index.mjs?");

/***/ }),

/***/ "./src/color-thief.js":
/*!****************************!*\
  !*** ./src/color-thief.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var quantize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! quantize */ \"./node_modules/quantize/dist/index.mjs\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ \"./src/core.js\");\n\n\n\nObject(_core__WEBPACK_IMPORTED_MODULE_1__[\"foo\"])();\n\nconst ColorThief = \"Color Thief in Browser\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ColorThief);\n\n//# sourceURL=webpack:///./src/color-thief.js?");

/***/ }),

/***/ "./src/core.js":
/*!*********************!*\
  !*** ./src/core.js ***!
  \*********************/
/*! exports provided: foo, bar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"foo\", function() { return foo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bar\", function() { return bar; });\nfunction foo() {\n\tconsole.log('foo');\n}\n\nfunction bar() {\n\tconsole.log('bar');\n}\n\n\n//# sourceURL=webpack:///./src/core.js?");

/***/ })

/******/ });