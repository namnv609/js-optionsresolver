# JS OptionsResolver - Symfony OptionsResolver for JS

> The JS OptionsResolver library is Symfony OptionsResolver for JS. It allows you to create an options system with required options, defaults, validation (type, value), normalization and more.

## Installation

### Browser setup

* [Download full](https://raw.githubusercontent.com/namnv609/js-optionsresolver/add-documentation/js-optionsresolver.js)
* [Download minified](https://raw.githubusercontent.com/namnv609/js-optionsresolver/add-documentation/js-optionsresolver.min.js)

Just include OptionsResolver in a script tag. Now you can use it.

```HTML
<script src="js-optionsresolver.js"></script>
```

### Node

> TODO

## Usage

Imagine you have a `Mailer` class which has four options: `host`, `username`, `password` and `port`:

```JavaScript
Mailer = function(options) {
  this.options = options;
};
```

When accessing the `options`, you need to add a lot of boilerplate code to check which options are set:

```JavaScript
Mailer = function(options) {
  // ...
  this.sendMail = function(from, to) {
    var mail = ...;
    mail.setHost(this.options.host ? this.options.host : "smtp.example.com");
    mail.setUsername(this.options.username ? this.options.username : "user");
    mail.setPassword(this.options.password ? this.options.password : "pa$$word");
    mail.setPort(this.options.port ? this.options.port : 25);

    // ...
  }
}
```

This boilerplate is hard to read and repetitive. Also, the default values of the options are buried in the business logic of your code. Use the [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) to fix that:

```JavaScript
Mailer = function(options) {
  this.options = Object.assign({
    host: "smtp.example.com",
    username: "user",
    password: "pa$$word",
    port: 25
  }, options);
}
```

Now all four options are guaranteed to be set. But what happens if the user of the Mailer class makes a mistake?

```JavaScript
var mailer = new Mailer({
  usernme: "johndoe", // usernme misspelled (instead of username)
});
```

No error will be shown. In the best case, the bug will appear during testing, but the developer will spend time looking for the problem. In the worst case, the bug might not appear until it's deployed to the live system.

Fortunately, the [`OptionsResolver`](https://github.com/namnv609/js-optionsresolver) class helps you to fix this problem:

```JavaScript
Mailer = function(options) {
  var resolver = new OptionsResolver();
  resolver
    .setDefaults({
      host: "smtp.example.com",
      username: "user",
      password: "pa$$word",
      port: 25
    });

  this.options = resolver.resolve(options);
}
```

Like before, all options will be guaranteed to be set. Additionally, an `UndefinedOptionsException` is thrown if an unknown option is passed:

```JavaScript
var mailer = new Mailer({
  usernme: "johndoe"
});

// Uncaught UndefinedOptionsException: The option "usernme" does not exist.
// Know options are: "host", "username", "password", "port"
```

The rest of your code can access the values of the options without boilerplate code:

```JavaScript
Mailer = function(options) {
  this.sendMail = function(from, to) {
    var mail = ...;

    mail.setHost(this.options.host);
    mail.setUsername(this.options.username);
    mail.setPassword(this.options.password);
    mail.setPort(this.options.port);

    // ...
  }
}
```

### Required Options

If an option must be set by the caller, pass that option to `setRequired()`. For example, to make the `host` option required, you can do:

```JavaScript
Mailer = function(options) {
  var resolver = new OptionsResolver();

  resolver.setRequired("host");
  this.options = resolver.resolve(options);
}
```

If you omit a required option, a `MissingOptionsException` will be thrown:

```JavaScript
var mailer = new Mailer();

// Uncaught MissingOptionsException: The required options "host" is missing
```

The `setRequired()` method accepts a single name or an array of option names if you have more than one required option:

```JavaScript
Mailer = function(options) {
  // ...
  resolver.setRequire(["host", "username", "password"]);
}
```

Use `isRequired()` to find out if an option is required. You can use `getRequiredOptions()` to retrieve the names of all required options:

```JavaScript
// ...
var requiredOptions = resolver->getRequiredOptions();
```

If you want to check whether a required option is still missing from the default options, you can use `isMissing()`. The difference between this and `isRequired()` is that this method will return false if a required option has already been set:

```JavaScript
// ...
resolver.isRequired("host"); // true
resolver.isMissing("host"); // true
resolver.setDefault("host", "smtp.google.com");
resolver.isRequired("host"); // true
resolver.isMissing("host"); // false
```

The method `getMissingOptions()` lets you access the names of all missing options.

### Type Validation

You can run additional checks on the options to make sure they were passed correctly. To validate the types of the options, call `setAllowedTypes()`:

```JavaScript
// ...
// specify one allowed type
resolver.setAllowedTypes("port", "int");
```

> **TODO**: Specify multiple allowed types and can pass fully qualified class names.

You can pass any type for which an:

* `integer` (`int`)
* `string` (`str`)
* `array` (`arr`)
* `boolean` (`bool`)
* `float`
* `object` (`obj`)
* `regexp`
* `function` (`fn`, `func`)

If you pass an invalid option now, an `InvalidOptionsException` is thrown:

```JavaScript
var mailer = new Mailer({
  port: "465"
});

// Uncaught InvalidOptionsException: The option "port" with "465" is
// expected to be of type "int"
```

> **TODO**: In sub-classes, you can use addAllowedTypes() to add additional allowed types without erasing the ones already set.

### Value Validation

Some options can only take one of a fixed list of predefined values. For example, suppose the `Mailer` class has a `transport` option which can be one of `sendmail`, `mail` and `smtp`. Use the method `setAllowedValues()` to verify that the passed option contains one of these values:

```JavaScript
Mailer = function(options) {
  // ...
  resolver
    .setDefault("transport", "sendmail")
    .setAllowedValues("transport", ["sendmail", "mail", "smtp"]);
}
```

If you pass an invalid transport, an `InvalidOptionsException` is thrown:

```JavaScript
var mailer = new Mailer({
  transport: "send-mail"
});

// Uncaught The option "transport" with value "send-mail" is invalid.
// Accepted values are: "sendmail", "mail", "smtp"
```

For options with more complicated validation schemes, pass a closure which returns `true` for acceptable values and `false` for invalid values:

```JavaScript
// ...
resolver.setAllowedValues("transport", function(transport) {
  // return true or false
});
```

> **TODO**: In sub-classes, you can use `addAllowedValues()` to add additional allowed values without erasing the ones already set.

### Option Normalization

Sometimes, option values need to be normalized before you can use them. For instance, assume that the `host` should always start with `http://`. To do that, you can write normalizers. Normalizers are executed after validating an option. You can configure a normalizer by calling `setNormalizer()`:

```JavaScript
// ...
resolver.setNormalizer("host", function(options, host) {
  if (!/^https?\:\/\//.test(host)) {
    host = "http://" + host;
  }

  return host;
});
```

The normalizer receives the actual `host` and returns the normalized form. You see that the closure also takes an `options` parameter. This is useful if you need to use other options during normalization:

```JavaScript
// ...
resolver.setNormalizer("host", function(options, host) {
  if (!/^https?\:\/\//.test(host)) {
    if (options["encryption"] === "ssl") {
      host = "https://" + host;
    } else {
      host = "http://" + host;
    }
  }

  return host;
});
```

### Default Values that Depend on another Option

Suppose you want to set the default value of the `port` option based on the encryption chosen by the user of the `Mailer` class. More precisely, you want to set the port to `465` if SSL is used and to `25` otherwise.

You can implement this feature by passing a closure as the default value of the `port` option. The closure receives the options as argument. Based on these options, you can return the desired default value:

```JavaScript
// ...
resolver.setDefault("encryption", null);
  .setDefault("port", function(options) {
    if (options["encryption"] === "ssl") {
      return 465;
    }

    return 25;
  })
```

> The argument of the callable must be type hinted as `options`. Otherwise, the callable itself is considered as the default value of the option.

> The closure is only executed if the `port` option isn't set by the user or overwritten in a sub-class.

A previously set default value can be accessed by adding a second argument to the closure:

```JavaScript
// ...
resolver.setDefaults({
  encryption: null,
  host: "example.org"
}).setDefault("host", function(options, previousHostValue) {
  if (options["encryption"] === "ssl") {
    return "secure.example.org";
  }

  // Take default value configured in the base class
  return previousHostValue;
});

```

As seen in the example, this feature is mostly useful if you want to reuse the default values set in parent classes in sub-classes.

### Options without Default Values

In some cases, it is useful to define an option without setting a default value. This is useful if you need to know whether or not the user _actually_ set an option or not. For example, if you set the default value for an option, it's not possible to know whether the user passed this value or if it simply comes from the default:

```JavaScript
// ...
Mailer = function(options) {
  var resolver = new OptionsResolver();
  resolver.setDefault("port", 25);
  this.options = resolver.resolve(options);

  this.sendMail = function(from, to) {
    // Is this the default value or did the caller of the class really
    // set the port to 25?
    if (this.options["port"] === 25) {
      // ...
    }
  };
}
```

You can use `setDefined()` to define an option without setting a default value. Then the option will only be included in the resolved options if it was actually passed to `resolve()`:

```JavaScript
// ...
Mailer = function(options) {
  // ...
  resolver.setDefined("port");
  // ...
  this.sendMail = function(from, to) {
    if (this.options["port"]) {
      console.log("Set!");
    } else {
      console.log("Not set");
    }
  }
}

var mailer = new Mailer();
mailer.sendMail();
// => Not set!

var mailer = new Mailer({port: 25});
mailer.sendMail(from, to);
// => Set!
```

You can also pass an array of option names if you want to define multiple options in one go:

```JavaScript
// ...
resolver.setDefined(["port", "encryption"]);
```

The methods `isDefined()` and `getDefinedOptions()` let you find out which options are defined:

```JavaScript
// ...
if (resolver.isDefined("host")) {
  // One of the following was called:

  // resolver.setDefault("host", ...);
  // resolver.setRequired("host");
  // resolver.setDefined("host");
}

var definedOptions = resolver.getDefinedOptions();
```

That's it! You now have all the tools and knowledge needed to easily process options in your code.

# Credits

Original documentation for PHP: [https://symfony.com/doc/3.4/components/options_resolver.html](https://symfony.com/doc/3.4/components/options_resolver.html)
