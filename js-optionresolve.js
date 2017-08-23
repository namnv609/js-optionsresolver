window.OptionResolver = function() {
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
};
