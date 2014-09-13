# bixby-sd

This suite of components provides service discovery functionality to
applications using Bixby.js.  Service discovery is the cornerstone of an
effective microservices architecture.  Each service advertises its
capabilities, allowing other services to utilize that functionality when
needed.

## Install

    $ npm install bixby-sd

## Usage

To utilize service discovery components, register them with the IoC container.
The standard namespace for these components is `sd`.

```javascript
IoC.loader('sd', require('bixby-sd'));
```

## Tests

    $ make test

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 NodePrime, Inc. <[http://www.nodeprime.com/](http://www.nodeprime.com/)>  
Copyright (c) 2014 Jared Hanson <[http://www.jaredhanson.net/](http://www.jaredhanson.net/)>
