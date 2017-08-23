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
    } else {
      _requiredOptions.push(requiredKeys);
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
   * Set default value for option key
   *
   * @param {String} optionKey    Option key
   * @param {mixed} defaultValue  Default value for option key
   * @return {this}
   */
  this.setDefault = function(optionKey, defaultValue) {
    _defaultValues[optionKey] = defaultValue;

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
  }
};
