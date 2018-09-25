<div class="bootstrap-banner">
	According to Bootstrap SASS, the screen size is:<br />
	<span class="bs_xs"> xs</span>
	<span class="bs_sm"> sm</span>
	<span class="bs_md"> md</span>
	<span class="bs_lg"> lg</span>
	<span class="bs_xl"> xl</span>
	<br />(vary the window size to see the effect)
</div>
<div class="typescript-banner">
	And here a zero alternates with a magic number defined in a TypeScript file:<br />
	<span>{magicnumber}</span>
	<br />(edit the value of someMagicNumber in SomeTsStuff.ts to see the effect)
</div>

<style type="text/scss">

  // NOTE: Only .svelte files will get their SASS and TypeScript preprocessed.

  @import "base.scss";

  div {
    font-size: $DU;
    padding: 1em;
    color: $GRAY_CONCRETE;
    text-align: center;
  }

  .bootstrap-banner {
    background-color: $BOOTSTRAP_BRAND;
  }

  .typescript-banner {
    background-color: $TYPESCRIPT_BRAND;
  }

  span {
    font-weight: bold;
    font-size: 1.5*$DU;
  }

  .bs_sm,
  .bs_md,
  .bs_lg,
  .bs_xl {
    display: none;
  }

  @include media-breakpoint-up(sm) {
    .bs_xs,
    .bs_md,
    .bs_lg,
    .bs_xl {
      display: none;
    }
    .bs_sm {
      display: inline;
    }
  }

  @include media-breakpoint-up(md) {
    .bs_xs,
    .bs_sm,
    .bs_lg,
    .bs_xl {
      display: none;
    }
    .bs_md {
      display: inline;
    }
  }

  @include media-breakpoint-up(lg) {
    .bs_xs,
    .bs_sm,
    .bs_md,
    .bs_xl {
      display: none;
    }
    .bs_lg {
      display: inline;
    }
  }

  @include media-breakpoint-up(xl) {
    .bs_xs,
    .bs_sm,
    .bs_md,
    .bs_lg {
      display: none;
    }
    .bs_xl {
      display: inline;
    }
  }
</style>

<script type="text/typescript" src="./Banner.ts">
  // NOTE: Only .svelte files will get their SASS and TypeScript preprocessed.
  // You need to provide the _relative_ path to the desired TypeScript file
</script>
