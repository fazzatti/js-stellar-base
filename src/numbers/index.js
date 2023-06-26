import { XdrLargeInt } from './xdr_large_int';

import { Uint128 } from './uint128';
import { Uint256 } from './uint256';
import { Int128 } from './int128';
import { Int256 } from './int256';

export { Uint256, Int256, Uint128, Int128 };

export { ScInt } from './sc_int';
export { XdrLargeInt };

/**
 * Transforms an opaque {@link xdr.ScVal} into a native bigint, if possible.
 *
 * If you then want to use this in the abstractions provided by this module,
 * you can pass it to the constructor of {@link XdrLargeInt}.
 *
 * @example
 * ```js
 * let scv = contract.call("add", x, y); // assume it returns an xdr.ScVal
 * let bigi = scValToBigInt(scv);
 *
 * new ScInt(bigi);           // if you don't care about types, and
 * new XdrLargeInt('i128', bigi);  // if you do
 * ```
 *
 * @param {xdr.ScVal} scv - the raw XDR value to parse into an integer
 * @returns {bigint} the native value of this input value
 *
 * @throws {TypeError} if the `scv` input value doesn't represent an integer
 */
export function scValToBigInt(scv) {
  const type = scv.switch().name.slice(3).toLowerCase();

  switch (scv.switch().name) {
    case 'scvU32':
    case 'scvI32':
      return BigInt(scv.value());

    case 'scvU64':
    case 'scvI64':
      return new XdrLargeInt(type, scv.value()).toBigInt();

    case 'scvU128':
    case 'scvI128':
      return new XdrLargeInt(type, [
        scv.value().lo(),
        scv.value().hi()
      ]).toBigInt();

    case 'scvU256':
    case 'scvI256':
      return new XdrLargeInt(type, [
        scv.value().loLo(),
        scv.value().loHi(),
        scv.value().hiLo(),
        scv.value().hiHi()
      ]).toBigInt();

    default:
      throw TypeError(`expected integer type, got ${scv.switch()}`);
  }
}