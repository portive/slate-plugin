/**
 * Unfortunately, Jest can't automatically handle `esm` modules. Part of
 * supporting them is to explicitly identify the `esm` modules and add them
 * here.
 *
 * https://github.com/kulshekhar/ts-jest/issues/970
 */
module.exports = ["p-defer"]
