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
