There are various TODOs scattered around this codebase for things that needs improvement,
this document keeps track of the majority of them and other higher-level or more structured plans that I otherwise
cannot find a good place to put them.

# code style concerns regarding interface

A linter option to enforce that we don't put unnecessary `;` or `,` in interfaces would be ideal.

# whether to use generic types?

`Kouku<KoukuType.Injection>` vs `KoukuForInjection` ?

# unit test automation

Need to have some mechanism to "run the function, record the result, and use that as unit test."
Note that this is never intented to be done blindly. We should examine the output while
formatting them to make sure things are indeed what we expect them to be.

# support for `_combined` fields?

I currently does not have a satisfying solution to include combined fields.

Listing fields that could have a "_combined" counterpart:

- api_ship_ke_combined
- api_ship_lv_combined
- api_nowhps_combined
- api_maxhps_combined
- api_eSlot_combined
- api_eParam_combined
- api_fParam_combined
- api_air_base_attack.api_stage3_combined
- api_kouku.api_stage3_combined
- api_escape_idx_combined
- api_combat_ration_combined
- note that api_support_info does not use `api_stage3_combined` but instead `api_stage3` is extended.

Night battle:

- api_f_nowhps_combined
- api_f_maxhps_combined
- api_fParam_combined
- api_ship_ke_combined
- api_ship_lv_combined
- api_e_nowhps_combined
- api_e_maxhps_combined
- api_escape_idx_combined

For all these cases, we want to be able to convert them correctly given our fleet type (single / STF / CTF) and their fleet type (single / combined).

# Use interface for property existency?

For example, having some interfaces like:

```typescript
interface HasHourai {
    api_hourai_flag: XXX
    api_hougeki1: A | null
    api_hougeki2: A | null
    api_hougeki3: A | null
    api_raigeki: B | null
}
```

will allow us to compose `Battle` type by extending multiple interfaces,
and hopefully share the same convert function in some ways.
(This could also be part of the answer to find a better way of dealing with `_combined`)

# Checking flag consistency?

Should we verify that a flag is consistent with its corresponding field?
Namely what should be the source of truth for things like `api_stage_flag` and `api_hourai_flag`.

Current answer: we should get rid of those flags and just use the data field itself as
the source of truth. This is the conclusion after finding out that the game client does not
use `api_hourai_flag` for anything at all - perhaps this is a sign of deprecating all those IntFlags.
