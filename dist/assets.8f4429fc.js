// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/exam-data/question.json":[function(require,module,exports) {
module.exports = [{
  "question": "How much is 3 x 1?",
  "answer": "3",
  "choices": [3, 9, 12]
}, {
  "question": "How much is 3 x 2?",
  "answer": "6",
  "choices": [6, 15, 3]
}, {
  "question": "How much is 3 x 3?",
  "answer": "9",
  "choices": [6, 9, 12]
}, {
  "question": "How much is 3 x 4?",
  "answer": "12",
  "choices": [3, 9, 12]
}, {
  "question": "How much is 3 x 5?",
  "answer": "15",
  "choices": [3, 15, 12]
}];
},{}],"assets/index.js":[function(require,module,exports) {
(function () {
  var examData = require('./exam-data/question.json');

  var starttBtn = document.querySelector('button.start');
  var submitBtn = document.querySelector('form > button');
  starttBtn.addEventListener('click', function (e) {
    generateQuestions();
    startCountDown(120);
    hideInstructions();
  });
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    if (validate()) {
      var score = getScore();
      updateScoreboard(score);
      clearFields();
      hideQuestions();
    }

    ;
  });

  function generateQuestions() {
    for (var i = 0; i < examData.length; i++) {
      var questionList = document.querySelector('.question-list');
      var questionBox = document.createElement('div');
      questionBox.classList.add('question');
      questionBox.innerHTML = "\n                <h2 class=\"question__question\"></h2>\n                <fieldset class=\"question__options\">\n                    <legend>Choose one answer</legend>\n                    <input type=\"radio\" name=\"\"/>\n                    <label for=\"\"></label>\n                    <input type=\"radio\" name=\"\"/>\n                    <label for=\"\"></label>\n                    <input type=\"radio\" name=\"\"/>\n                    <label for=\"\"></label>\n                </div>\n            ";
      questionList.append(questionBox);
      document.querySelectorAll('.question__question')[i].innerText = examData[i].question;
      var fieldsets = document.querySelectorAll('fieldset')[i];
      var inputElems = fieldsets.querySelectorAll('input');
      var labelElems = fieldsets.querySelectorAll('label');
      var choices = examData[i].choices;

      for (var j = 0; j < choices.length; j++) {
        inputElems[j].value = choices[j];
        inputElems[j].setAttribute('name', "question".concat(i + 1)); //  i not j

        labelElems[j].setAttribute('for', "question".concat(i + 1));
        labelElems[j].innerHTML = choices[j];
      }
    }
  }

  ; //display first target first, interval will start after one second has elapsed
  //interval: check every second how much time left

  function startCountDown(time) {
    var now = Date.now(); //ms

    var target = now + time * 1000; //  seconds to ms, timestamp

    var targetFormatted = Math.round((target - now) / 1000); //  ms to s 

    displayCountdown(targetFormatted);
    var interval = setInterval(function () {
      var timeLeft = target - Date.now();
      var timeLeftFormatted = Math.abs(Math.round(timeLeft / 1000));
      displayCountdown(timeLeftFormatted);

      if (timeLeft < 0) {
        clearInterval(interval);
        var score = getScore();
        updateScoreboard(score);
        clearFields();
        hideQuestions();
      }
    }, 1000);
  }

  function displayCountdown(time) {
    var minutesLeft = Math.floor(time / 60);
    var secondsLeft = time % 60;
    var display = "".concat(minutesLeft, ":").concat(secondsLeft.toString().padStart(2, 0));
    var displayCountdown = document.querySelector('.countdown');
    displayCountdown.textContent = display;
    displayCountdown.style.position = 'fixed';
    displayCountdown.style.left = '50%';
    displayCountdown.style.top = '10%';
  }

  function hideInstructions() {
    document.querySelector('.instructions').style.display = 'none'; //show submit btn

    submitBtn.style.display = 'block';
  }

  function validate() {
    var options = Array.from(document.querySelectorAll('input'));
    var answers = options.filter(function (el) {
      return el.checked;
    });

    if (answers.length !== examData.length) {
      return confirm('You did not answer all questions. Are you sure you want to submit your exam?');
    } else return true;
  }

  function getScore() {
    var score = 0;
    var options = Array.from(document.querySelectorAll('input'));
    var answer = options.filter(function (el) {
      return el.checked;
    });

    for (var i = 0; i < answer.length; i++) {
      if (answer[i].value === examData[i].answer) score++;
    }

    return score;
  }

  function updateScoreboard(score) {
    document.querySelector('.score__title').innerText = "Your score is: ".concat(score, " / ").concat(examData.length);
    score >= Math.ceil(examData.length / 2) ? document.querySelector('.score__evaluation').innerText = "You passed the exam." : document.querySelector('.score__evaluation').innerText = "You failed the exam.";
  }

  function clearFields() {
    var inputs = Array.from(document.querySelectorAll('input'));
    inputs.filter(function (input) {
      return input.checked;
    }).forEach(function (input) {
      return input.checked = false;
    });
  }

  function hideQuestions() {
    document.querySelector('form').style.display = 'none';
    document.querySelector('.countdown').style.display = 'none';
  }
})();
},{"./exam-data/question.json":"assets/exam-data/question.json"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54963" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/index.js"], null)
//# sourceMappingURL=/assets.8f4429fc.js.map