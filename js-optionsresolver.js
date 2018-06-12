window.OptionsResolver = function() {
  // Defined options
  var _definedOptions = [];
  // Required options
  var _requiredOptions = [];
  // Default value for options object
  var _defaultValues = {};
  // Allowed type for options object
  var _allowedTypes = {};
  // Allowed value for options object
  var _allowedValues = {};
  // Normalizer closures
  var _normalizers = {};

  /**
   * Defined option keys
   *
   * @param {mixed} definedKeys Single option key or array option keys
   * @return {this}
   */
  this.setDefined = function(definedKeys) {
    if (definedKeys && definedKeys.constructor === Array) {
      _definedOptions = _definedOptions.concat(definedKeys);
    } else {
      _definedOptions.push(definedKeys);
    }

    return this;
  };

  /**
   * Get defined option keys
   *
   * @return {Array} Defined option keys
   */
  this.getDefinedOptions = function() {
    return _definedOptions;
  };

  /**
   * Define option required keys
   *
   * @param {mixed} requiredKeys Single or array required keys
   * @return {this}
   */
  this.setRequired = function(requiredKeys) {
    if (requiredKeys && requiredKeys.constructor === Array) {
      _requiredOptions = _requiredOptions.concat(requiredKeys);
      _definedOptions = _definedOptions.concat(requiredKeys);
    } else {
      _requiredOptions.push(requiredKeys);
      _definedOptions.push(requiredKeys);
    }

    return this;
  };

  /**
   * Get required option keys
   *
   * @return {Array} Required option keys
   */
  this.getRequiredOptions = function() {
    return _requiredOptions;
  };

  /**
   * Check key is required option
   *
   * @param  {String}  optionKey Option key
   * @return {Boolean} Key is required option?
   */
  this.isRequired = function(optionKey) {
    return _requiredOptions.indexOf(optionKey) >= 0 ? true : false;
  };

  /**
   * Check required key is still missing from default options
   *
   * @param  {String}  optionKey Required option key
   * @return {Boolean} Required option key is missing?
   */
  this.isMissing = function(optionKey) {
    return !_defaultValues[optionKey];
  };

  /**
   * Get all missing options
   *
   * @return {Array} All missing options
   */
  this.getMissingOptions = function() {
    var missingOptions = [];

    _requiredOptions.forEach(function(requiredKey) {
      if (!_defaultValues[requiredKey]) {
        missingOptions.push(requiredKey);
      }
    });

    return missingOptions;
  }

  /**
   * Set default value for option key
   *
   * @param {String} optionKey    Option key
   * @param {mixed} defaultValue  Default value for option key
   * @return {this}
   */
  this.setDefault = function(optionKey, defaultValue) {
    _defaultValues[optionKey] = defaultValue;
    this.setDefined(optionKey);

    return this;
  };

  /**
   * Set default value for multiple option keys
   *
   * @param {Object} optionDefaultValues Object contains option key and default value
   * @return {this}
   */
  this.setDefaults = function(optionDefaultValues) {
    if (optionDefaultValues && optionDefaultValues.constructor === Object) {
      for (var optionKey in optionDefaultValues) {
        _defaultValues[optionKey] = optionDefaultValues[optionKey];
        this.setDefined(optionKey);
      }

      return this;
    }

    throw "InvalidParameter: Default values is invalid object";
  };

  /**
   * Get default value for option keys
   *
   * @param {mixed} optionKey Option key or null to get all
   * @return {mixed} Option default values
   */
  this.getDefaultValues = function(optionKey) {
    if (optionKey) {
      return _defaultValues[optionKey];
    }

    return _defaultValues;
  };

  /**
   * Set allowed data type for option key
   *
   * @param {String} optionKey        Option key
   * @param {mixed} optionValueTypes  String or array allowed type(s)
   * @return {this}
   */
  this.setAllowedTypes = function(optionKey, optionValueTypes) {
    _allowedTypes[optionKey] = optionValueTypes;

    return this;
  };

  /**
   * Get allowed types for option keys
   *
   * @param  {mixed} optionKey Option key or null to get all
   * @return {mixed} Option allowed type(s)
   */
  this.getAllowedTypes = function(optionKey) {
    if (optionKey) {
      return _allowedTypes[optionKey];
    }

    return _allowedTypes;
  };

  /**
   * Set allowed value for option key
   *
   * @param {String} optionKey          Option key
   * @param {mixed} optionAllowedValue  Allowed values for option key
   * @return {this}
   */
  this.setAllowedValues = function(optionKey, optionAllowedValue) {
    _allowedValues[optionKey] = optionAllowedValue;

    return this;
  };

  /**
   * Get allowed value for option key
   *
   * @param  {mixed} optionKey Option key or null to get all
   * @return {mixed} Option allowed value(s)
   */
  this.getAllowedValues = function(optionKey) {
    if (optionKey) {
      return _allowedValues[optionKey];
    }

    return _allowedValues;
  };

  /**
   * Set normalizer for an option
   *
   * @param {String} optionKey     Option key
   * @param {Function} allowedValues The normalizer
   * @return {this}
   */
  this.setNormalizer = function(optionKey, allowedValues) {
    _normalizers[optionKey] = allowedValues;

    return this;
  };

  /**
   * Merge options with the default values stored in the container and validates them
   *
   * @param  {Object} dataObj Data object
   * @return {Object} The merged and validated options
   */
  this.resolve = function(dataObj) {
    dataObj = dataObj || {};
    _definedOptions = _arrayUnique(_definedOptions);
    _checkUndefinedOptions(Object.keys(dataObj));
    dataObj = _setOptionsDefault(dataObj);
    _checkMissingRequiredOptions(dataObj);
    _checkInvalidOptionsType(dataObj);
    _checkInvalidOptionsValue(dataObj);
    dataObj = _normalizerOptionsValue(dataObj);

    return dataObj;
  };

  /**
   * Private functions area
   */

  /**
   * Check defined options
   *
   * @param  {Array} optionKeys Options
   * @return {mixed} Void or exception
   */
  _checkUndefinedOptions = function(optionKeys) {
    var knowOptionsStr = "\"" + _definedOptions.join("\", \"") + "\"";

    for (var idx in optionKeys) {
      var objKey = optionKeys[idx];

      if (_definedOptions.indexOf(objKey) === -1) {
        throw "UndefinedOptionsException: The option \"" + objKey + "\" does not exist. Know options are: " + knowOptionsStr;
      }
    }
  };

  /**
   * Check missing required options
   *
   * @param  {Object} dataObj Data object
   * @return {mixed} Void or exception
   */
  _checkMissingRequiredOptions = function(dataObj) {
    for (var idx in _requiredOptions) {
      var requiredKey = _requiredOptions[idx];
      var requiredValue = dataObj[requiredKey];

      if (!requiredValue) {
        throw "MissingOptionsException: The required options \"" + requiredKey + "\" is missing";
      }
    }
  };

  /**
   * Set default value for options
   *
   * @param {Object} dataObj Data object
   * @return {Object} Data object with default values
   */
  _setOptionsDefault = function(dataObj) {
    Object.keys(_defaultValues).forEach(function(key, idx) {
      if (!dataObj[key]) {
        dataObj[key] = _defaultValues[key];
      }
    });

    return dataObj;
  };

  /**
   * Check value for options is valid type
   *
   * @param  {Object} dataObj Data object
   * @return {mixed} Void or exeception
   */
  _checkInvalidOptionsType = function(dataObj) {
    for (var key in _allowedTypes) {
      var optionValue = dataObj[key];
      switch(_allowedTypes[key].toLowerCase()) {
        case "int":
          if (typeof optionValue !== "number" || !/^\-?\d+$/.test(optionValue)) {
            _throwInvalidOptionsTypeException(key, optionValue, "int");
          }
          break;
        case "string":
          if (typeof optionValue !== "string") {
            _throwInvalidOptionsTypeException(key, optionValue, "string");
          }
          break;
        case "array":
          if (!optionValue || optionValue.constructor !== Array) {
            _throwInvalidOptionsTypeException(key, optionValue, "array");
          }
          break;
        case "bool":
        case "boolean":
          if (typeof optionValue !== "boolean") {
            _throwInvalidOptionsTypeException(key, optionValue, "boolean")
          }
          break;
        case "float":
          if (typeof optionValue !== "number" || !/^\-?\d+\.\d+$/.test(optionValue)) {
            _throwInvalidOptionsTypeException(key, optionValue, "float");
          }
          break;
        case "object":
          if (typeof optionValue !== "object" || optionValue.constructor !== Object) {
            _throwInvalidOptionsTypeException(key, optionValue, "object");
          }
          break;
        case "regexp":
          if (typeof optionValue !== "object" || optionValue.constructor !== RegExp) {
            _throwInvalidOptionsTypeException(key, optionValue, "regexp");
          }
          break;
        case "fn":
        case "func":
        case "function":
          if (typeof optionValue !== "function" || optionValue.constructor !== Function) {
            _throwInvalidOptionsTypeException(key, optionValue, "function");
          }
          break;
      }
    }
  };

  /**
   * Check value is valid allowed data
   *
   * @param  {Object} dataObj Data object
   * @return {mixed} Void or exeception
   */
  _checkInvalidOptionsValue = function(dataObj) {
    for (var key in _allowedValues) {
      var optionValue = dataObj[key];
      var optionAllowedValues = _allowedValues[key];
      var isValidValue = true;
      var acceptedValueMessage = "";

      if (optionAllowedValues && optionAllowedValues.constructor === Array) {
        isValidValue = (optionAllowedValues.indexOf(optionValue) >= 0);
        acceptedValueMessage = " Accepted values are: \"" + optionAllowedValues.join("\", \"") + "\"";
      } else if (optionAllowedValues && optionAllowedValues.constructor === Function) {
        isValidValue = optionAllowedValues(optionValue);
      } else {
        isValidValue = (optionValue === optionAllowedValues);
        acceptedValueMessage = " Accepted value are \"" + optionAllowedValues + "\""
      }

      if (!isValidValue) {
        throw "The option \"" + key + "\" with value \"" + optionValue + "\" is invalid." + acceptedValueMessage;
      }
    }
  };

  /**
   * Normalizer data for options
   *
   * @param  {Object} dataObj Data object
   * @return {Object} Data object with normalized data
   */
  _normalizerOptionsValue = function(dataObj) {
    for (var key in _normalizers) {
      dataObj[key] = _normalizers[key](dataObj, dataObj[key]);
    }

    return dataObj;
  }

  /**
   * Throw exeception for check valid option type
   *
   * @param  {String} key          Option key
   * @param  {mixed} value         Option value
   * @param  {String} expectedType Expected data type
   * @return {throw} Exception
   */
  _throwInvalidOptionsTypeException = function(key, value, expectedType) {
    throw "InvalidOptionsException: The option \"" + key + "\" with \"" + value + "\" is expected to be of type \"" + expectedType + "\"";
  };

  /**
   * Remove duplicate values in array
   *
   * @param  {Array} array Array data
   * @return {Array}       Array data without duplicated
   */
  _arrayUnique = function(array) {
    return array.filter(function(value, index, self) {
      return self.indexOf(value) == index;
    });
  };
};
