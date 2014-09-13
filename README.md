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

#### Registry

```javascript
exports['@require'] = [ 'sd/registry' ];
```

The registry component provides a service registry where a service can announce
its capabilities as well as resolve other services.

Support for service registries is pluggable, allowing engineering teams to
choose the registry that best meets their requirements.  The type of registry to
use is determined via configuration settings.

###### ZooKeeper

[Apache ZooKeeper](http://zookeeper.apache.org/) can be used as a service
registry by specifying a `zk://` URL in the `[sd]` block:

```
[sd]
url = "zk://127.0.0.1:2181"
```

[etcd](http://zookeeper.apache.org/) can be used as a service registry by
specifying an `etcd://` URL in the `[sd]` block:

```
[sd]
url = "etcd://127.0.0.1:4001"
```

## Tests

    $ make test

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 NodePrime, Inc. <[http://www.nodeprime.com/](http://www.nodeprime.com/)>  
Copyright (c) 2014 Jared Hanson <[http://www.jaredhanson.net/](http://www.jaredhanson.net/)>
