(function() {
var Once = function(func) {
  var status = true;
  return function() {
    if (status) {
      status = false;
      func();
    }
  };
};

var Go = Once;

var Ajax = function(method, url, data, success, failed) {
  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var callbackNotExecuted = true;
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && callbackNotExecuted) {
      callbackNotExecuted = false;
      if (["200", "201"].indexOf(xmlhttp.status + "") > -1 && success) {
        success(JSON.parse(xmlhttp.responseText));
      } else if (failed) {
        try {
          failed(JSON.parse(xmlhttp.responseText));
        }
        catch (e) {
          failed({});
        }
      };
    }
  };
  xmlhttp.open(method, url, true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  if (data) {
    xmlhttp.send(JSON.stringify(data));
  } else {
    xmlhttp.send();
  }
};

var Template = function(template_name, data, mother_wrapper) {
  //alert("wrapper->"+mother_wrapper + "template_name:" + template_name);
  var node = document.createElement(mother_wrapper || "div");
  node.innerHTML = TEMPLATES[template_name](data);
  node.firstChild.data = data;
  return node.firstChild;
};

var Select = function(selector, context) {
  var sizzleExist = (typeof Sizzle != "undefined");
  if (context) {
    return sizzleExist ? Sizzle(selector, context) : context.querySelectorAll(selector);
  } else {
    return sizzleExist ? Sizzle(selector, document) : document.querySelectorAll(selector);
  }
};

var Bind = function(nodes, event_name, func) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].tagName) {
      nodes[i]["on" + event_name] = func;
    } 
  };
};

var Loop = function(arr, func) {
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    temp.push(func(arr[i], i));
  }
  return temp;
};

var AttrsTo = function(arr, pairs) {
  Loop(Object.keys(pairs), function(attr) {
    Loop(arr, function(item) { item ? item[attr] = pairs[attr] : ""});
  });
};

var StopBubble = function(event) {
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    window.event.cancelBubble = true
  }
  return false;
};

var RemoveClass = function(nodes, class_name) {
  Loop(nodes, function(node) {
	  if (class_name.length > 0) {
	  	  node.className = node.className.split(class_name).join(" ");
	  }
    //For Windows 8 IE10 Desktop Version hack
    // node.style.textIndent = 0;
  });
};

var AddClass = function(nodes, class_name) {
  Loop(nodes, function(node) {
    if (node.className.indexOf(class_name) == -1) {
      node.className = [node.className, class_name].join(" ");
    }
  });
};

var ArrayRemove = function(arr, atom) {
  var position = arr.indexOf(atom);
  if (position > -1) {
    var new_arr = [];
    Loop(arr, function(el) {
      if (el != atom) {
        new_arr.push(el);
      }
    });
    return new_arr;
  } else {
    return arr;
  }
};

var ShuffleArray = function(arr) {
  var m = arr.length, t, i;
  while (m) {
    i = Math.random() * m-- | 0;
    t = arr[m], arr[m] = arr[i], arr[i] = t;
  }
  return arr;
};

var Cookie = function(new_cookie_key, new_cookie_value) {
  var cookie = {};
  Loop(document.cookie.replace(/\s/g, "").split(";"), function(el) {
    var a = el.split("=");
    cookie[a.shift()] = a.join("=");
  });
  document.cookie = [new_cookie_key, new_cookie_value].join("=") + ";";
  return cookie;
};

var EncodeParams = function(message) {
  var params = [];
  Loop(Object.keys(message), function(key) {
	  if (key.length > 0) {
	  	  params.push(key + "=" +message[key]);
	  }
  });
  return params.join("&");
};

var DecodeParams = function(string) {
  var params = {};
  Loop(string.split("&"), function(el) {
    var param_arr = el.split("=");
	if (param_arr[0].length > 0) {
		params[param_arr[0]] = param_arr[1];
	}
  });
  return params;
};
var AnimateInSequel = function(loop_array) {
	var time = 0;
	Loop(loop_array, function(obj) {
		time += obj["time"];
		setTimeout(function() {
			var items = Select(obj["selector"]);
			if (obj["class_to_remove"] != undefined) {
				Loop(obj["class_to_remove"].split(" "), function(class_name) {
					RemoveClass(items, class_name);	
				});
			}
			if (obj["class_to_add"] != undefined) {
				Loop(obj["class_to_add"].split(" "), function(class_name) {
					AddClass(items, class_name);	
				});
			}
			if (obj["callback"] != undefined) {
				var callback = obj["callback"];
				callback(items);
			}
		}, time);
	});
}

document.onreadystatechange = Go(function() {
    var is_wechat = navigator.userAgent.toLowerCase().match(/(micromessenger)/i);
	
	var linkDownload = 'https://itunes.apple.com/cn/app/id994908085?mt=8';
	
	Bind(Select('.app-download-triger'), "click", function() {
		if (is_wechat) {
			AddClass(Select('.app-qrcode-wrapper'), 'weixin-visible');
		} else {
			document.location.href = linkDownload;
		}
	});
	
	Bind(Select('.app-qrcode-wrapper'), "click",  function() {
		RemoveClass(Select('.app-qrcode-wrapper'), 'weixin-visible');
	});
	
});})();