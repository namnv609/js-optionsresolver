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
   * @return {array} Defined option keys
   */
  this.getDefinedOptions = function() {
    return _definedOptions;
  };
};
