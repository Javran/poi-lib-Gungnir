# poi-lib-gungnir

[![Build Status](https://travis-ci.org/Javran/poi-lib-gungnir.svg?branch=master)](https://travis-ci.org/Javran/poi-lib-gungnir)

[![forthebadge](https://forthebadge.com/images/badges/ages-12.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com)

Under construction.

An attempt of implementing poi's prophet in TypeScript.

Draft of current design:

- a module that contains all the definitions intended to
  closely match in-game data structures. (kcsapi.ts)

- another module that contains definitions that make sense.
  This separation allows us to contain the stupidity baked in original in-game data structure.

- some converting logic to turn in-game structure to one we are using.
  this could simply be an identity function and even some types can be alias of the underlying
  in-game type, given that it makes sense to do so.

# Compatibility with in-game API

Regarding the issue that in-game API changes from time to time:
gungnir's main mission is to match features offered by [lib-battle](https://github.com/poooi/lib-battle).
Towards that end, supporting new in-game API is always the priority.

The API design of gungnir is to be compatible with current versions and all those past versions
that we are aware of, therefore should not be any chains of version-to-version runtime patches required.

However, it is expected that Kcsapi module might change from time to time to match that of in-game representation,
and the current solution is to version kcsapi modules as `kcsapi-${someversion}`, re-export the latest one
through `kcsapi`, but the module responsible for conversion can always refer to a past version when necessary.
